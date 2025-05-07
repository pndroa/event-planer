import prisma from '@/lib/client'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const surveyQuestions = await prisma.surveyQuestions.findMany()
    return NextResponse.json({ surveyQuestions }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const createSurveyQuestions = await prisma.surveyQuestions.create({
      data: body,
    })

    return NextResponse.json({ message: 'survey question created', data: createSurveyQuestions })
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 })
  }
}
