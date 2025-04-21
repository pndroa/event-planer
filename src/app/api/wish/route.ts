import { NextResponse } from 'next/server'
import prisma from '@/lib/client'
import { serializeWish } from '@/utils/serializeWish'

export async function GET() {
  try {
    const wishes = await prisma.wishes.findMany({
      include: {
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    const safeWishes = wishes.map(serializeWish)
    /*  const safeWishes = wishes.map((wish) => {
        return serializeWish(wish)})
    */

    return NextResponse.json(safeWishes, { status: 200 })
  } catch (error) {
    console.error('[GET_WISHES_ERROR]', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
