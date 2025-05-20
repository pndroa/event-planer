import { getServerAuth } from '@/lib/auth'
import prisma from '@/lib/client'
import { NextResponse } from 'next/server'

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const questionId = searchParams.get('questionId')

  if (!questionId) {
    throw new Error('Invalid or missing id parameter')
  }

  try {
    const surveyAnswers = await prisma.surveyAnswers.deleteMany({
      where: {
        questionId: questionId,
      },
    })
    return NextResponse.json(
      { message: 'succesfully deleted answer option', surveyAnswers },
      { status: 204 }
    )
  } catch (error) {
    return NextResponse.json({ error })
  }
}

export async function POST(request: Request) {
  const { user, errorResponse } = await getServerAuth()
  if (errorResponse) return errorResponse

  const body = await request.json()
  const { questionId, answer } = body

  try {
    const surveyAnswers = await prisma.surveyAnswers.create({
      data: {
        questionId,
        answer,
        userId: user.id,
      },
    })
    return NextResponse.json(
      { message: 'successfully created answer option', surveyAnswers },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json({ error })
  }
}
