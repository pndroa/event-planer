import { getServerAuth } from '@/lib/auth'
import prisma from '@/lib/client'
import { NextResponse } from 'next/server'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { user, errorResponse } = await getServerAuth()
  if (errorResponse) return errorResponse

  const { id } = params

  if (!id) return NextResponse.json({ error: 'Missing answer ID' }, { status: 400 })

  try {
    const surveyAnswers = await prisma.surveyAnswers.findMany({
      where: {
        surveyQuestions: {
          surveyId: id,
        },
        userId: user.id,
      },
      select: {
        questionId: true,
        answer: true,
      },
    })

    return NextResponse.json(surveyAnswers, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { user, errorResponse } = await getServerAuth()
  if (errorResponse) return errorResponse

  const { id } = params

  if (!id) {
    return NextResponse.json({ error: 'Missing question ID' }, { status: 400 })
  }

  try {
    await prisma.surveyAnswers.deleteMany({
      where: {
        questionId: id,
        userId: user.id,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error })
  }
}
