import { getServerAuth } from '@/lib/auth'
import prisma from '@/lib/client'
import { NextResponse } from 'next/server'

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { errorResponse } = await getServerAuth()

  if (errorResponse) return errorResponse

  const { id } = params

  if (!id) {
    throw new Error('Invalid or missing id parameter')
  }

  try {
    const question = await prisma.surveyQuestions.delete({
      where: {
        questionId: id,
      },
    })
    return NextResponse.json({ message: 'succesfully deleted question', question }, { status: 204 })
  } catch (error) {
    return NextResponse.json({ error })
  }
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { errorResponse } = await getServerAuth()

  if (errorResponse) return errorResponse

  const { id } = params

  if (!id) {
    throw new Error('Invalid or missing id parameter')
  }

  try {
    const question = await prisma.surveyQuestions.findFirst({
      where: {
        questionId: id,
      },
      include: {
        surveyAnswerOptions: {
          select: {
            answerOptionsid: true,
            answerText: true,
          },
        },
      },
    })
    return NextResponse.json({ question }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error })
  }
}


export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const { errorResponse } = await getServerAuth()

  if (errorResponse) return errorResponse

  const { id } = params

  if (!id) {
    throw new Error('Invalid or missing id parameter')
  }

  try {
    const body = await request.json()
    const { questionText, type } = body

    if (!questionText) {
      return NextResponse.json({ error: 'questionText is required' }, { status: 400 })
    }

    const updateSurveyQuestion = await prisma.surveyQuestions.update({
      where: {
        questionId: id,
      },
      data: {
        questionText,
        type,
      },
    })

    return NextResponse.json(
      {
        message: 'Question updated',
        data: updateSurveyQuestion,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error updating question:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}