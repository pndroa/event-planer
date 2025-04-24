import prisma from '@/lib/client'
import { NextResponse } from 'next/server'

export async function GET() {
  const users = await prisma.users.findMany({
    include: {
      Events: true,
      Wishes: {
        include: {
          wishUpvote: true,
        },
      },
      wishUpvote: true,
    },
  })
  return NextResponse.json({ users })
}
