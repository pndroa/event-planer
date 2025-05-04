import { NextResponse } from 'next/server'
import prisma from '@/lib/client'
import Joi from 'joi'
import { PostEvents } from '@/lib/types'
import { postEventSchema } from '@/lib/validation'
import { createClientForServer } from '@/utils/supabase/server'

export async function GET() {
  const supabase = await createClientForServer()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  try {
    // asynchrone Datenabfrage, parallele Ausführung, nicht seriell!
    const [events, participations] = await Promise.all([
      prisma.events.findMany({ include: { users: true } }),
      prisma.eventParticipation.findMany({
        where: { participantId: user.id },
        select: { eventId: true },
      }),
    ])

    const joinedSet = new Set(participations.map((p) => p.eventId)) // Set.has(id) ist schneller als Array.includes(id)

    const eventsWithJoined = events.map((event) => ({
      ...event,
      joined: joinedSet.has(event.eventId),
    }))

    return NextResponse.json(eventsWithJoined, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 })
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
