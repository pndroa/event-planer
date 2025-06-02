//import { getServerAuth } from '@/lib/auth'
import prisma from '@/lib/client'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const answerOptionsParam = searchParams.get('answerOptions')
  const includeAnswerOptions = answerOptionsParam === 'true'

  const surveyId = searchParams.get('surveyId')

  try {
    const surveyQuestions = await prisma.surveyQuestions.findMany({
      where: surveyId ? { surveyId } : undefined,
      include: {
        surveyAnswerOptions: includeAnswerOptions,
      },
    })

    return NextResponse.json({ data: surveyQuestions }, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Error loading questions' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  // const { errorResponse } = await getServerAuth()
  // if (errorResponse) return errorResponse

  try {
    const body = await request.json()
    const { surveyId, questionText, type } = body

    if (!surveyId || !questionText) {
      return NextResponse.json({ error: 'surveyId and questionText are required' }, { status: 400 })
    }

    const createSurveyQuestion = await prisma.surveyQuestions.create({
      data: {
        questionText,
        surveyId,
        type,
      },
    })

    // ----- BEGIN: Neue Benachrichtigungs-Logik -----

    // Hole das Survey samt Event und Trainer
    const surveyWithEvent = await prisma.surveys.findUnique({
      where: { surveyId },
      include: {
        Events: {
          select: {
            title: true,
            eventId: true,
            trainerId: true,
          },
        },
      },
    })

    if (surveyWithEvent?.Events) {
      const { eventId, title, trainerId } = surveyWithEvent.Events

      // Finde alle Teilnehmer dieses Events
      const participants = await prisma.eventParticipation.findMany({
        where: { eventId },
        select: { participantId: true },
      })

      // Erstelle Benachrichtigungen für jeden Teilnehmer
      const notifications = participants.map(({ participantId }) =>
        prisma.notifications.create({
          data: {
            recipientId: participantId,
            eventId,
            senderId: trainerId,
            message: `A new question has been added to the survey for the event "${title}".`,
          },
        })
      )

      await Promise.all(notifications)
    }

    // ----- ENDE: Neue Benachrichtigungs-Logik -----

    return NextResponse.json(
      {
        message: 'Question created',
        data: createSurveyQuestion,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Fehler beim Erstellen der Frage:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
