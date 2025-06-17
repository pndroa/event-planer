import { NextResponse } from 'next/server'
import prisma from '@/lib/client'
import { PostEventDates } from '@/lib/types'
import { getServerAuth } from '@/lib/auth'
import { addWishUpvotersAsParticipants } from '@/lib/eventParticipationService'
import { getEventsWithParticipation } from '@/lib/eventParticipationService'

export async function GET() {
  const { user, errorResponse } = await getServerAuth()

  if (errorResponse) return errorResponse

  try {
    const events = await getEventsWithParticipation(user.id)

    return NextResponse.json(events, { status: 200 })
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
      await addWishUpvotersAsParticipants(wishId, createdEvent.eventId, user.id)
    }

    return NextResponse.json({ message: 'Event created', data: createdEvent }, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error }, { status: 500 })
  }
}
