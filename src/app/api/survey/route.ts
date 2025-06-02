import { NextResponse } from 'next/server'
import prisma from '@/lib/client'
import { getServerAuth } from '@/lib/auth'

export async function GET(request: Request) {
  const { user, errorResponse } = await getServerAuth()

  if (errorResponse) return errorResponse

  const { searchParams } = new URL(request.url)
  const eventId = searchParams.get('eventId')
  const field = searchParams.get('field')

  try {
    if (eventId) {
      if (field && field !== 'surveyQuestions') {
        return NextResponse.json(
          { error: `Invalid field: ${field}. Only 'surveyQuestions' is allowed.` },
          { status: 400 }
        )
      }

      const include = field ? { [field]: true } : undefined

      const survey = await prisma.surveys.findMany({
        where: { eventId },
        include,
      })

      return NextResponse.json({ survey }, { status: 200 })
    }

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
