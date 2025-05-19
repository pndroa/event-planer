import { getServerAuth } from '@/lib/auth'
import prisma from '@/lib/client'
import { NextResponse } from 'next/server'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { errorResponse } = await getServerAuth()
  if (errorResponse) return errorResponse

  const { id } = params

  if (!id) return NextResponse.json({ error: 'Missing survey ID' }, { status: 400 })

  try {
    const survey = await prisma.surveys.findFirst({
      where: {
        OR: [{ eventId: id }, { surveyId: id }],
      },
      include: {
        surveyQuestions: {
          include: {
            surveyAnswerOptions: true,
          },
        },
      },
    })
    return NextResponse.json(survey, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { errorResponse } = await getServerAuth()

  if (errorResponse) return errorResponse

  const { id } = params

  if (!id) {
    throw new Error('Invalid or missi ng id parameter')
  }

  try {
    const survey = await prisma.surveys.delete({
      where: {
        surveyId: id,
      },
    })
    return NextResponse.json({ message: 'succesfully deleted survey', survey }, { status: 204 })
  } catch (error) {
    return NextResponse.json({ error })
  }
}
