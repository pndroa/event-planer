import { getServerAuth } from '@/lib/auth'
import prisma from '@/lib/client'
import { NextResponse } from 'next/server'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { errorResponse } = await getServerAuth()
  if (errorResponse) return errorResponse

  const { id } = params

  if (!id) return NextResponse.json({ error: 'Missing question ID' }, { status: 400 })

  const { searchParams } = new URL(request.url)

  const answerOptionsParam = searchParams.get('answerOptions')
  const includeAnswerOptions = answerOptionsParam === 'true'

  try {
    const question = await prisma.surveyQuestions.findUnique({
      where: {
        questionId: id,
      },
      include: {
        surveyAnswerOptions: includeAnswerOptions,
      },
    })

    return NextResponse.json({ question }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 })
  }
}

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
