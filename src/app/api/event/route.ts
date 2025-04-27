import { NextResponse } from 'next/server'
import prisma from '@/lib/client'

export async function GET() {
  try {
    const events = await prisma.events.findMany({
      include: {
        users: true,
      },
    })

    return NextResponse.json(events, { status: 200 })
  } catch (error) {
    console.error('[GET_WISHES_ERROR]', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
