//import { getServerAuth } from '@/lib/auth'
import prisma from '@/lib/client'
import { NextResponse } from 'next/server'

export async function GET() {
  //const { errorResponse } = await getServerAuth()

  //if (errorResponse) return errorResponse

  try {
    const surveyQuestions = await prisma.surveyQuestions.findMany()
    return NextResponse.json({ surveyQuestions }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error })
  }
}

export async function POST(request: Request) {
  // const { errorResponse } = await getServerAuth()
  // if (errorResponse) return errorResponse

  try {
    const body = await request.json()
    const { surveyId, questionText, type } = body

    if (!surveyId || !questionText) {
      return NextResponse.json({ error: 'surveyId and questionText are required' }, { status: 400 })
    }

    const createSurveyQuestion = await prisma.surveyQuestions.create({
      data: {
        questionText,
        surveyId,
        type,
      },
    })

    return NextResponse.json(
      {
        message: 'Question created',
        data: createSurveyQuestion,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Fehler beim Erstellen der Frage:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
