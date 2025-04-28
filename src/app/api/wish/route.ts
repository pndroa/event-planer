import { NextResponse } from 'next/server'
import prisma from '@/lib/client'
import { createClientForServer } from '@/utils/supabase/server'

export async function GET() {
  const supabase = await createClientForServer()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const userId = user?.id

  try {
    const wishes = await prisma.wishes.findMany({
      include: {
        users: true,
        _count: { select: { wishUpvote: true } },
        // lade nur die Upvotes dieses Users
        wishUpvote: userId ? { where: { userId } } : false,
      },
      orderBy: { createdAt: 'desc' },
    })

    const data = wishes.map((w) => ({
      wishId: w.wishId,
      title: w.title,
      description: w.description,
      isConvertedToEvent: w.isConvertedToEvent,
      createdAt: w.createdAt,
      users: {
        userId: w.users.userId,
        email: w.users.email,
        name: w.users.name,
      },
      currentUpvotes: w._count.wishUpvote,
      isUpvotedByMe: userId ? w.wishUpvote.length > 0 : false,
    }))

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 })
  }
}
