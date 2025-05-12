//import { getServerAuth } from '@/lib/auth'
import prisma from '@/lib/client'
import { NextResponse } from 'next/server'
import { createClientForServer } from '@/utils/supabase/server'
import { postEventSchema } from '@/lib/validation'
import { NextRequest } from 'next/server'

export async function GET(req: NextRequest, context: { params: { id: string } }) {
  async function getServerAuth() {
    const supabase = await createClientForServer()
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error || !user) {
      return {
        user: null,
        errorResponse: NextResponse.json({ error: 'Not authenticated' }, { status: 401 }),
      }
    }

    return { user, errorResponse: null }
  }

  const { errorResponse } = await getServerAuth()

  if (errorResponse) return errorResponse

  const { id } = context.params

  if (!id) {
    throw new Error('Invalid or missing id parameter')
  }

  try {
    const event = await prisma.events.findUnique({
      where: {
        eventId: id,
      },
      include: {
        eventDates: true,
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

    const { value, error } = postEventSchema.validate(body, { abortEarly: false })

    if (error) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.details.map((e) => e.message) },
        { status: 400 }
      )
    }

    const { trainerId, title, description, room } = value

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
