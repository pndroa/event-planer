import { getServerAuth } from '@/lib/auth'
import prisma from '@/lib/client'
import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { getEventWithParticipation } from '@/lib/eventParticipationService'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { user, errorResponse } = await getServerAuth()

  if (errorResponse) return errorResponse

  const { id } = params

  if (!id) {
    return NextResponse.json({ error: 'Invalid or missing id parameter' }, { status: 400 })
  }

  try {
    const event = await getEventWithParticipation(user.id, id)

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    return NextResponse.json({ event }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error })
  }
}

export async function DELETE(req: NextRequest, context: { params: { id: string } }) {
  const { id } = context.params

  if (!id) {
    throw new Error('Invalid or missing id parameter')
  }

  try {
    const event = await prisma.events.delete({
      where: {
        eventId: id,
      },
    })

    return NextResponse.json({ event }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error })
  }
}

export async function PATCH(req: NextRequest, context: { params: { id: string } }) {
  const { id } = context.params

  try {
    const body = await req.json()

    const nonExistingEventDates = body.eventDates.filter((d: { id?: string }) => !d.id)
    const eventDatesToUpdate = body.eventDates.filter((d: { id?: string }) => d.id)
    const eventDatesToDelete = body.eventDatesToCompare.filter(
      (eventDateToCompare: { id?: string }) =>
        eventDateToCompare.id &&
        !eventDatesToUpdate.some(
          (eventDateToUpdate: { id?: string }) => eventDateToUpdate.id === eventDateToCompare.id
        )
    )

    const { trainerId, title, description, room } = body

    const createdEvent = await prisma.$transaction([
      prisma.eventDates.deleteMany({
        where: {
          dateId: {
            in: eventDatesToDelete.map((d: { id: string }) => d.id),
          },
        },
      }),
      prisma.events.update({
        where: {
          eventId: id,
        },
        data: {
          trainerId: trainerId,
          title: title,
          description: description,
          room: room,
          eventDates: {
            create: nonExistingEventDates.map(
              (d: { date: string; startTime: string | null; endTime: string | null }) => ({
                date: new Date(d.date),
                startTime: d.startTime,
                endTime: d.endTime,
              })
            ),
            update: eventDatesToUpdate.map(
              (d: {
                id: string
                date: string
                startTime: string | null
                endTime: string | null
              }) => ({
                where: { dateId: d.id },
                data: {
                  date: new Date(d.date),
                  startTime: d.startTime,
                  endTime: d.endTime,
                },
              })
            ),
          },
        },
        include: {
          eventDates: true,
        },
      }),
    ])

    return NextResponse.json({ message: 'Event created', data: createdEvent }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 })
  }
}
