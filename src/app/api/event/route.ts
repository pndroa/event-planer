import { NextResponse } from 'next/server'
import prisma from '@/lib/client'
import { postEventSchema } from '@/lib/validation'
import { PostEventDates } from '@/lib/types'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const events = await prisma.events.findMany({
      include: {
        users: true,
        eventDates: true,
      },
    })

    return NextResponse.json(events, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const { value, error } = postEventSchema.validate(body, { abortEarly: false })

    if (error) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.details.map((e) => e.message) },
        { status: 400 }
      )
    }

    const { trainerId, title, description, room, eventDates } = value

    const createdEvent = await prisma.events.create({
      data: {
        trainerId,
        title,
        description,
        room,
        eventDates: {
          create: eventDates.map((d: PostEventDates) => ({
            date: new Date(d.date as Date),
            startTime: d.startTime,
            endTime: d.endTime,
          })),
        },
      },
      include: {
        eventDates: true,
      },
    })

    return NextResponse.json({ message: 'Event created', data: createdEvent }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 })
  }
}
