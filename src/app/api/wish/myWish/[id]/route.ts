import { NextResponse } from 'next/server'
import prisma from '@/lib/client'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params

  if (!id) {
    throw new Error('Invalid or missing id parameter')
  }

  //Get wishes by userId
  try {
    const myWishes = await prisma.wishes.findMany({
      include: {
        users: {
          select: {
            userId: true,
            name: true,
          },
        },
      },
      where: {
        users: {
          userId: id,
        },
        isConvertedToEvent: false,
      },
    })
    return NextResponse.json(myWishes, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 })
  }
}
