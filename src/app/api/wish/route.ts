import { NextResponse } from 'next/server'
import prisma from '@/lib/client'
import { getServerAuth } from '@/lib/auth'

export async function GET() {
  const { user, errorResponse } = await getServerAuth()

  if (errorResponse) return errorResponse

  try {
    const wishes = await prisma.wishes.findMany({
      where: {
        isConvertedToEvent: false,
      },
      include: {
        users: true,
        _count: { select: { wishUpvote: true } },
        wishUpvote: user.id ? { where: { userId: user.id } } : false,
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
      isUpvotedByMe: user.id ? w.wishUpvote.length > 0 : false,
    }))

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const { user, errorResponse } = await getServerAuth()

  if (errorResponse) return errorResponse

  try {
    const body = await req.json()

    const { title, description } = body

    const wish = await prisma.wishes.create({
      data: {
        wishCreator: user.id,
        title,
        description,
      },
    })

    return NextResponse.json({ message: 'created wish', wish }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 })
  }
}
