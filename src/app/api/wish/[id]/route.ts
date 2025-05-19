import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/client'
import { getServerAuth } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { user, errorResponse } = await getServerAuth()
  if (errorResponse) return errorResponse

  const { id } = await context.params

  try {
    const w = await prisma.wishes.findUnique({
      where: { wishId: id },
      include: {
        users: true,
        _count: { select: { wishUpvote: true } },
        wishUpvote: user.id ? { where: { userId: user.id } } : false,
      },
    })

    if (!w) {
      return NextResponse.json({ error: 'Wish not found' }, { status: 404 })
    }

    const data = {
      wishId: w.wishId,
      title: w.title,
      description: w.description,
      createdAt: w.createdAt,
      users: {
        userId: w.users.userId,
        email: w.users.email,
        name: w.users.name,
      },
      currentUpvotes: w._count.wishUpvote,
      isUpvotedByMe: user.id ? w.wishUpvote.length > 0 : false,
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
