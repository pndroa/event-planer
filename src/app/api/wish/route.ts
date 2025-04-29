import { NextResponse } from 'next/server'
import prisma from '@/lib/client'
import { createClientForServer } from '@/utils/supabase/server'
import { PostWishes } from '@/lib/types'
import Joi from 'joi'
import { postWishSchema } from '@/lib/validation'

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
