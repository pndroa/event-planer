import { getServerAuth } from '@/lib/auth'
import prisma from '@/lib/client'
import { NextResponse } from 'next/server'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { errorResponse } = await getServerAuth()

  if (errorResponse) return errorResponse

  const { id } = params

  if (!id) {
    throw new Error('Invalid or missing id parameter')
  }

  try {
    const question = await prisma.surveyAnswerOptions.findMany({
      where: {
        questionId: id,
      },
    })
    return NextResponse.json({ question }, { status: 204 })
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
    const { answerText } = body

    console.log('bodyxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
    console.log(id)
    console.log(body)
    if (!answerText) {
      return NextResponse.json({ error: 'answerText is required.' }, { status: 400 })
    }

    const updatedAnswerOption = await prisma.surveyAnswerOptions.update({
      where: {
        answerOptionsId: id,
      },
      data: {
        answerText,
      },
    })

    return NextResponse.json(
      { message: 'successfully updated answer option', updatedAnswerOption },
      { status: 200 }
    )
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

  console.log('delete api')
  console.log(id)

  try {
    await prisma.surveyAnswerOptions.delete({
      where: {
        answerOptionsId: id,
      },
    })
    return NextResponse.json({ message: 'successfully deleted answer option' }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 })
  }
}
