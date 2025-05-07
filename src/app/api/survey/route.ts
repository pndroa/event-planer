import { NextResponse } from 'next/server'
import { getServerAuth } from '@/lib/auth'
import prisma from '@/lib/client'

export async function GET(_request: Request) {
  const { user, errorResponse } = await getServerAuth()

  if (errorResponse) return errorResponse

  if (user?.id) {
    try {
      const participatedEventsWithouSurveyAnswers = await prisma.events.findMany({
        include: {
          surveys: {
            include: {
              surveyQuestions: {
                include: {
                  surveyAnswers: {
                    where: {
                      userId: user.id,
                    },
                    include: {
                      users: true,
                    },
                  },
                },
              },
            },
          },
        },
        where: {
          eventParticipation: {
            some: {
              participantId: user.id,
            },
          },
        },
      })

      const notAnsweredSurveys = participatedEventsWithouSurveyAnswers.map((event) => event.surveys)

      return NextResponse.json({ notAnsweredSurveys }, { status: 200 })
    } catch (error) {
      return NextResponse.json({ error }, { status: 500 })
    }
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const existingEvent = await prisma.events.findUnique({
      where: { eventId: body.eventId },
    })

    if (!existingEvent) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    const createSurvey = await prisma.surveys.create({
      data: body,
    })

    return NextResponse.json({ message: 'survey created', data: createSurvey }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 })
  }
}
