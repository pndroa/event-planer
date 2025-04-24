import prisma from '@/lib/client'
import { getEventSchema, postEventSchema } from '@/lib/validation'
import Joi from 'joi'
import { NextResponse } from 'next/server'
import { GetEvents, PostEvents } from '@/lib/types'

/*
export async function GET() {
  try {
    const events = await prisma.events.findMany()

    const { value, error }: Joi.ValidationResult<GetEvents[]> = Joi.array()
      .items(getEventSchema)
      .validate(events)

    if (error) {
      return NextResponse.json(
        { error: 'Request failed', message: error.details[0].message },
        { status: 500 }
      )
    }
    return NextResponse.json(value, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 })
  }
}
*/
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
        data: { ...value, startDate: new Date(value.startDate), endDate: new Date(value.endDate) },
      })
      return NextResponse.json({ message: 'created event', event }, { status: 200 })
    }
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 })
  }
}
