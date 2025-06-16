import { NextResponse } from 'next/server'
import prisma from '@/lib/client'
import { getServerAuth } from '@/lib/auth'

export async function GET(request: Request) {
  const { user, errorResponse } = await getServerAuth()
  if (errorResponse) return errorResponse

  const { searchParams } = new URL(request.url)
  const eventId = searchParams.get('eventId')

  try {
    if (eventId) {
      const event = await prisma.events.findUnique({
        where: { eventId },
        select: { trainerId: true },
      })

      if (event?.trainerId === user.id) {
        return NextResponse.json({ data: null }, { status: 200 })
      }

      const survey = await prisma.surveys.findFirst({
        where: { eventId },
        include: {
          surveyQuestions: {
            include: {
              surveyAnswers: {
                where: {
                  userId: user.id,
                },
              },
            },
          },
        },
      })

      if (!survey) {
        return NextResponse.json({ data: null }, { status: 200 })
      }

      const questions = survey.surveyQuestions.map((question) => {
        const hasAnswered = question.surveyAnswers.length > 0
        return {
          questionText: question.questionText,
          answered: hasAnswered,
        }
      })

      const answered = questions.every((q) => q.answered)

      const surveyResponse = {
        surveyId: survey.surveyId,
        eventId: survey.eventId,
        title: survey.title,
        createdAt: survey.created_at,
        answered,
        surveyQuestions: questions,
      }

      return NextResponse.json({ data: surveyResponse }, { status: 200 })
    }

    const participations = await prisma.eventParticipation.findMany({
      where: {
        participantId: user.id,
      },
      include: {
        events: {
          select: {
            eventId: true,
            trainerId: true,
            surveys: {
              include: {
                surveyQuestions: {
                  include: {
                    surveyAnswers: {
                      where: {
                        userId: user.id,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    })

    const surveys = participations
      .map((participation) => {
        const event = participation.events

        if (event.trainerId === user.id) return null

        const survey = event.surveys
        if (!survey) return null

        const questions = survey.surveyQuestions.map((question) => {
          const hasAnswered = question.surveyAnswers.length > 0
          return {
            questionText: question.questionText,
            answered: hasAnswered,
          }
        })

        const answered = questions.every((q) => q.answered)

        return {
          surveyId: survey.surveyId,
          eventId: event.eventId,
          title: survey.title,
          createdAt: survey.created_at,
          answered,
          surveyQuestions: questions,
        }
      })
      .filter((s) => s !== null)

    return NextResponse.json({ surveys }, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { eventId } = body

    if (!eventId) {
      return NextResponse.json({ error: 'eventId is required' }, { status: 400 })
    }

    const existingEvent = await prisma.events.findUnique({
      where: { eventId },
    })

    if (!existingEvent) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    const existingSurvey = await prisma.surveys.findUnique({
      where: { eventId },
    })

    if (existingSurvey) {
      return NextResponse.json(
        { message: 'Survey already exists', data: existingSurvey },
        { status: 200 }
      )
    }

    // Create new survey
    const createSurvey = await prisma.surveys.create({
      data: {
        eventId,
        title: `Survey for Event: ${existingEvent.title}`,
      },
    })

    // Find all participants of the event
    const participants = await prisma.eventParticipation.findMany({
      where: { eventId },
      select: { participantId: true },
    })

    // Notify all participants
    const notifications = participants.map(({ participantId }) =>
      prisma.notifications.create({
        data: {
          recipientId: participantId,
          eventId,
          message: `A new survey has been created for the event "${existingEvent.title}".`,
          senderId: existingEvent.trainerId,
        },
      })
    )

    await Promise.all(notifications)

    return NextResponse.json(
      { message: 'Survey created and notifications sent', data: createSurvey },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating survey:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
