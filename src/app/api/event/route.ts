import { NextResponse } from 'next/server'
import prisma from '@/lib/client'
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
