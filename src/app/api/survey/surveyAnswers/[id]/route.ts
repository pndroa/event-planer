import prisma from '@/lib/client'
import { NextResponse } from 'next/server'

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { id } = params

  if (!id) {
    throw new Error('Invalid or missing id parameter')
  }

  try {
    const surveyAnswers = await prisma.surveyAnswers.deleteMany({
      where: {
        questionId: id,
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
