import prisma from '@/lib/client'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const users = await prisma.users.findMany({
      include: {
        events: true,
        wishes: {
          include: {
            wishUpvote: true,
          },
        },
        wishUpvote: true,
      },
    })
    return NextResponse.json({ users })
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 })
  }
}
