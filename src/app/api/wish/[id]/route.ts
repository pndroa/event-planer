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
        users: { select: { userId: true, name: true } },
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

export async function DELETE(req: NextRequest, context: { params: { id: string } }) {
  const { id } = context.params
  if (!id) {
    return NextResponse.json({ error: 'Invalid or missing id parameter' }, { status: 400 })
  }

  // 1) Auth abfragen
  const { user, errorResponse } = await getServerAuth()
  if (errorResponse) return errorResponse // liefert 401, wenn nicht eingeloggt

  // 2) Wish aus der DB holen und Ownership prüfen
  const wish = await prisma.wishes.findUnique({
    where: { wishId: id },
    select: { users: { select: { userId: true } } },
  })
  if (!wish) {
    return NextResponse.json({ error: 'Wish not found' }, { status: 404 })
  }
  if (wish.users.userId !== user.id) {
    return NextResponse.json({ error: 'Not authorized to delete this wish' }, { status: 403 })
  }

  // 3) Löschen
  try {
    await prisma.wishes.delete({ where: { wishId: id } })
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (err) {
    console.error('Delete failed:', err)
    return NextResponse.json({ error: 'Delete failed', details: String(err) }, { status: 500 })
  }
}
