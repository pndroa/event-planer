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
    const survey = await prisma.surveys.findUnique({
      where: {
        eventId: id,
      },
    })
    return NextResponse.json({ survey }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error })
  }
}
