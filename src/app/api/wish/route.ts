import { NextResponse } from 'next/server'
import prisma from '@/lib/client'

export async function GET() {
  try {
    const wishes = await prisma.wishes.findMany({
      include: {
        wishUpvote: true,
      },
    })

    return NextResponse.json(wishes, { status: 200 })
  } catch (error) {
    console.error('[GET_WISHES_ERROR]', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
