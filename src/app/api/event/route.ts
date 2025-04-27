import { NextResponse } from 'next/server'
import prisma from '@/lib/client'
import Joi from 'joi'
import { PostEvents } from '@/lib/types'
import { postEventSchema } from '@/lib/validation'

export async function GET() {
  try {
    const events = await prisma.events.findMany({
      include: {
        users: true,
      },
    })

    return NextResponse.json(events, { status: 200 })
  } catch (error) {
    console.error('[GET_WISHES_ERROR]', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const { value, error }: { value: PostEvents; error: Joi.ValidationError | undefined } =
      postEventSchema.validate(body, { abortEarly: false })

    if (error) {
      return NextResponse.json(
        { error: 'Request failed', details: error.details[0].message },
        { status: 400 }
      )
    } else {
      const event = await prisma.events.create({
        data: {
          ...value,
          startDate: new Date(value.startDate),
          endDate: new Date(value.endDate),
        },
      })
      return NextResponse.json({ message: 'created event', event }, { status: 200 })
    }
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 })
  }
}
