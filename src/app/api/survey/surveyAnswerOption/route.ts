//import { getServerAuth } from '@/lib/auth'
import prisma from '@/lib/client'
import { NextResponse } from 'next/server'

export async function GET() {
  //const { errorResponse } = await getServerAuth()

  //if (errorResponse) return errorResponse

  try {
    const surveyAnswerOptions = await prisma.surveyAnswerOptions.findMany()
    return NextResponse.json({ surveyAnswerOptions }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error })
  }
}

export async function POST(request: Request) {
  // const { errorResponse } = await getServerAuth()
  // if (errorResponse) return errorResponse

  try {
    const body = await request.json()
    const { questionId, answerText } = body

    if (!questionId || !answerText) {
      return NextResponse.json(
        { error: 'questionId and answerText are required.' },
        { status: 400 }
      )
    }

    const createSurveyAnswerOptions = await prisma.surveyAnswerOptions.create({
      data: {
        questionId,
        answerText,
      },
    })

    return NextResponse.json({
      message: 'created answer options',
      data: createSurveyAnswerOptions,
    })
  } catch (error) {
    console.error('Fehler:', error)
    return NextResponse.json({ error: 'Interner Serverfehler' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const questionId = searchParams.get('questionId')

  if (!questionId) {
    throw new Error('Invalid or missing id parameter')
  }

  try {
    const surveyAnswerOption = await prisma.surveyAnswerOptions.deleteMany({
      where: {
        questionId: questionId,
      },
    })
    return NextResponse.json(
      { message: 'Succesfully deleted answer option', surveyAnswerOption },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json({ error })
  }
}
