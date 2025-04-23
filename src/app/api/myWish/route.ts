import { NextResponse } from 'next/server'
import prisma from '@/lib/client'
import { serializeWish } from '@/utils/serializeWish'

export async function GET(request: Request) {
  //Get query param
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id || isNaN(Number(id))) {
    throw new Error('Invalid or missing id parameter')
  }
  const numericId = Number(id)

  //Get wishes by userId
  try {
    const myWishes = await prisma.wishes.findMany({
      include: {
        user: true,
      },
      where: {
        userId: BigInt(numericId),
      },
    })

    const safeWishes = myWishes.map(serializeWish)
    return NextResponse.json(safeWishes, { status: 200 })
  } catch (error) {
    console.error('Error loading myWishes:', error)
    return NextResponse.json({ error: 'Error loading wishes' }, { status: 500 })
  }
}
