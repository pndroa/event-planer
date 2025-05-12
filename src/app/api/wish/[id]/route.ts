import { NextResponse, NextRequest } from 'next/server'
import prisma from '@/lib/client'

export async function GET(_req: NextRequest, context: { params: { id: string } }) {
  const { id } = context.params

  try {
    const wish = await prisma.wishes.findUnique({
      where: { wishId: id },
      include: {
        users: true,
      },
    })

    if (!wish) {
      return NextResponse.json({ error: 'Wish not found' }, { status: 404 })
    }

    return NextResponse.json(wish, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 })
  }
}
