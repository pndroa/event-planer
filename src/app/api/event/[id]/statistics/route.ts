import prisma from '@/lib/client'
import { NextResponse } from 'next/server'

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = await params

  if (!id) {
    return NextResponse.json({ error: 'Missing eventId' }, { status: 400 })
  }

  try {
    const event = await prisma.events.findUnique({
      where: { eventId: id },
      select: {
        eventId: true,
        title: true,
        trainerId: true,
        eventParticipation: {
          select: {
            participantId: true,
          },
        },
        surveys: {
          select: {
            title: true,
            surveyQuestions: {
              select: {
                questionId: true,
                type: true,
                questionText: true,
                surveyAnswerOptions: {
                  select: {
                    answerOptionsId: true,
                    answerText: true,
                  },
                },
                surveyAnswers: {
                  select: {
                    answerId: true,
                    userId: true,
                    answer: true,
                  },
                },
              },
            },
          },
        },
      },
    })

    return NextResponse.json({ event }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 })
  }
}
