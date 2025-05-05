import { NextResponse } from 'next/server'
import prisma from '@/lib/client'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')

  if (userId) {
    try {
      const participatedEventsWithouSurveyAnswers = await prisma.events.findMany({
        include: {
          surveys: {
            include: {
              surveyQuestions: {
                include: {
                  surveyAnswers: {
                    where: {
                      userId: userId,
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
              participantId: userId,
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
