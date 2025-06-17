import { getServerAuth } from '@/lib/auth'
import prisma from '@/lib/client'
import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { getEventWithParticipation, getParticipantsForEvent } from '@/lib/eventParticipationService'
import { mailer } from '@/utils/mailer'
import { getUser } from '@/utils/getUser'
import ejs from 'ejs'
import path from 'path'
import fs from 'fs'
import { getDatesToUpdate } from '@/lib/getDatesToUpdate'
import { dateData } from '@/lib/types'
import { PostEventDates } from '@/lib/types'

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
  const { errorResponse } = await getServerAuth()

  if (errorResponse) return errorResponse

  const { id } = context.params

  try {
    const body = await req.json()

    const nonExistingEventDates = body.eventDates.filter((d: { id?: string }) => !d.id)

    const eventDatesCheckForChanges = body.eventDates.filter((d: { id?: string }) => d.id)
    const updateEventDates: dateData[] = await getDatesToUpdate(eventDatesCheckForChanges, id)

    const eventDatesToDelete = body.eventDatesToCompare.filter(
      (eventDateToCompare: { id?: string }) =>
        eventDateToCompare.id &&
        !eventDatesCheckForChanges.some(
          (eventDateToUpdate: { id?: string }) => eventDateToUpdate.id === eventDateToCompare.id
        )
    )

    const { trainerId, title, description, room } = body

    //update general info in event
    await prisma.events.update({
      where: { eventId: id },
      data: {
        trainerId,
        title,
        description,
        room,
      },
    })

    // create new date
    const createdDates = await prisma.eventDates.createMany({
      data: nonExistingEventDates.map((newDate: PostEventDates) => ({
        eventId: id,
        date: newDate.date != null ? new Date(newDate.date) : null,
        startTime: newDate.startTime,
        endTime: newDate.endTime,
      })),
    })

    // update existing dates
    const updatedDates = await Promise.all(
      updateEventDates.map((updatedDate: dateData) =>
        prisma.eventDates.update({
          where: { dateId: updatedDate.id },
          data: {
            date: new Date(updatedDate.date),
            startTime: updatedDate.startTime,
            endTime: updatedDate.endTime,
          },
        })
      )
    )

    const deltedDates = await Promise.all(
      eventDatesToDelete.map((deletedDate: dateData) =>
        prisma.eventDates.deleteMany({
          where: { dateId: deletedDate.id },
        })
      )
    )

    interface Participant {
      created_at: Date
      participantId: string
      eventId: string
    }

    if (updatedDates.length > 0 || createdDates.count > 0 || deltedDates.length > 0) {
      const participants: Participant[] = await getParticipantsForEvent(id)

      if (participants.length > 0) {
        const eventDates = await prisma.eventDates.findMany({
          where: {
            eventId: id,
          },
        })

        for (const participant of participants) {
          const receiver = await getUser(participant.participantId)
          const templatePath = path.join(
            process.cwd(),
            'public',
            'emailTemplates',
            'eventEmail.ejs'
          )
          const template = fs.readFileSync(templatePath, 'utf-8')
          const view = ejs.render(template, {
            name: receiver?.name ?? '',
            eventTitle: title,
            eventDates: eventDates,
          })
          if (receiver) {
            await mailer(receiver.email, view, 'Event times changed')
          }
        }
      }
    }

    return NextResponse.json({ message: 'Event created' }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 })
  }
}
