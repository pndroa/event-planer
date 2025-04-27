import { NextResponse } from 'next/server'
import prisma from '@/lib/client'
import { PostWishes } from '@/lib/types'
import Joi from 'joi'
import { postWishSchema } from '@/lib/validation'

export async function GET() {
  try {
    const wishes = await prisma.wishes.findMany({
      include: {
        users: true,
      },
    })

    return NextResponse.json(wishes, { status: 200 })
  } catch (error) {
    return new NextResponse({ error }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { value, error }: { value: PostWishes; error: Joi.ValidationError | undefined } =
      postWishSchema.validate(body, { abortEarly: false })

    if (error) {
      return NextResponse.json(
        { error: 'Request failed', details: error.details[0].message },
        { status: 400 }
      )
    } else {
      const wish = await prisma.wishes.create({
        data: value,
      })
      return NextResponse.json({ message: 'created wish', wish }, { status: 200 })
    }
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 })
  }
}
