import { NextResponse } from 'next/server'
import prisma from '@/lib/client'
import { PostEventDates } from '@/lib/types'
import { getServerAuth } from '@/lib/auth'
import { addWishUpvotersAsParticipants } from '@/lib/eventParticipationService'

export async function GET() {
  const { user, errorResponse } = await getServerAuth()

  if (errorResponse) return errorResponse

  try {
    // asynchrone Datenabfrage, parallele Ausführung, nicht seriell!
    const [events, participations] = await Promise.all([
      prisma.events.findMany({ include: { users: true, eventDates: true } }),
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
  const { user, errorResponse } = await getServerAuth()

  if (errorResponse) return errorResponse

  try {
    const body = await req.json()

    const { title, description, room, eventDates, wishId } = body

    const createdEvent = await prisma.events.create({
      data: {
        trainerId: user.id,
        title,
        description,
        room,
        wishId,
        ...(eventDates &&
          eventDates.length > 0 && {
            eventDates: {
              create: eventDates.map((d: PostEventDates) => ({
                date: new Date(d.date as Date),
                startTime: d.startTime,
                endTime: d.endTime,
              })),
            },
          }),
      },
      include: {
        eventDates: true,
        surveys: true,
      },
    })

    if (wishId) {
      await prisma.wishes.update({
        where: { wishId },
        data: { isConvertedToEvent: true },
      })

      await addWishUpvotersAsParticipants(wishId, createdEvent.eventId)
    }

    return NextResponse.json({ message: 'Event created', data: createdEvent }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 })
  }
}
