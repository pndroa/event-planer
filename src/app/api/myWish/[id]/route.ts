import { NextResponse } from 'next/server'
import prisma from '@/lib/client'


export async function GET(request: Request, { params }: { params: { id: string }}) {
  const { id } = params

  if (!id) {
    throw new Error('Invalid or missing id parameter')
  }

  //Get wishes by userId
  try {
    const myWishes = await prisma.wishes.findMany({
      include: {
        users: true,
      },
      where: {
        users: {
          userId: id,
        },
      },
    })
    return NextResponse.json(myWishes, { status: 200 })
  } catch (error) {
    console.error('Error loading myWishes:', error)
    return NextResponse.json({ error: 'Error loading wishes' }, { status: 500 })
  }
}
