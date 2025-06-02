import { NextResponse } from 'next/server'
import prisma from '@/lib/client'
import { getServerAuth } from '@/lib/auth'

export async function GET(_request: Request) {
  const { user, errorResponse } = await getServerAuth()

  if (errorResponse) return errorResponse

  try {
    const participations = await prisma.eventParticipation.findMany({
      where: {
        participantId: user.id,
      },
      include: {
        events: {
          include: {
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
        const survey = participation.events.surveys
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
          eventId: participation.eventId,
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

    // Neue Survey erstellen
    const createSurvey = await prisma.surveys.create({
      data: {
        eventId,
        title: `Survey for Event: ${existingEvent.title}`,
      },
    })

    return NextResponse.json({ message: 'Survey created', data: createSurvey }, { status: 201 })
  } catch (error) {
    console.error('Fehler beim Erstellen der Survey:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
