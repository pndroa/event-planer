// api/wish/[wishid]/upvote/route.ts
import { NextResponse } from 'next/server'
import prisma from '@/lib/client'
import { createClientForServer } from '@/utils/supabase/server'

interface RouteContext {
  params: Promise<{ id: string }>
}

export async function POST(_req: Request, { params }: RouteContext) {
  const { id } = await params
  const supabase = await createClientForServer()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }
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
    console.error('[POST_UPVOTE_ERROR]', error)
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}
