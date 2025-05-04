import { NextResponse } from 'next/server'
import prisma from '@/lib/client'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')

  if (userId) {
    try {
      const surveys = await prisma.events.findMany({
        include: {
          surveys: {
            include: {
              surveyQuestions: {
                include: {
                  surveyAnswers: true,
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
          surveys: {
            surveyQuestions: {
              some: {
                surveyAnswers: {
                  every: {
                    userId: {
                      not: userId,
                    },
                  },
                },
              },
            },
          },
        },
      })

      return NextResponse.json({ surveys }, { status: 200 })
    } catch (error) {
      return NextResponse.json({ error }, { status: 500 })
    }
  }
}
