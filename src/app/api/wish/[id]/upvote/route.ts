// api/wish/[wishid]/upvote/route.ts
import { NextResponse } from 'next/server'
import prisma from '@/lib/client'
import { getServerAuth } from '@/lib/auth'

interface RouteContext {
  params: Promise<{ id: string }>
}

export async function POST(_req: Request, { params }: RouteContext) {
  const { id } = await params
  const { user, errorResponse } = await getServerAuth()

  if (errorResponse) return errorResponse
  const userId = user.id

  try {
    const existing = await prisma.wishUpvote.findFirst({
      where: { wishId: id, userId },
    })

    let upvoted: boolean
    if (existing) {
      await prisma.wishUpvote.delete({
        where: { upvoteId: existing.upvoteId },
      })
      upvoted = false
    } else {
      await prisma.wishUpvote.create({
        data: { wishId: id, userId },
      })
      upvoted = true
    }

    // immer den aktuellen Count abfragen und zurückgeben
    const count = await prisma.wishUpvote.count({ where: { wishId: id } })
    return NextResponse.json({ upvoted, count }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 })
  }
}
