//import { getServerAuth } from '@/lib/auth'
import prisma from '@/lib/client'
import { NextResponse } from 'next/server'
import { createClientForServer } from '@/utils/supabase/server'
import { postEventSchema } from '@/lib/validation'
import { PostEventDates } from '@/lib/types'

export async function GET(request: Request, { params }: { params: { id: string } }) {
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

  const { id } = params

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

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { id } = params
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

    const createdEvent = await prisma.events.update({
      where: {
        eventId: id,
      },
      data: {
        trainerId: body.trainerId,
        title: body.title,
        description: body.description,
        room: body.room,
        eventDates: {
          create: body.eventDates.map((d: PostEventDates) => ({
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
