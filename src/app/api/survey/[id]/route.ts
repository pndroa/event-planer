import { NextResponse } from 'next/server'
import prisma from '@/lib/client'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params

  if (!id) {
    throw new Error('Invalid or missing id parameter')
  }

  //Get wishes by userId
  try {

    //get EventParticipation by userId
    const userEventParticipation = await prisma.eventParticipation.findMany({
      where: {
        users: {
          userId: id,
        },
      },
      select: {
        eventId: true,
      },
    })

    //get surveys linked to the user 
    const eventUuids = userEventParticipation.map((event) => event.eventId)
    const myEvents = await prisma.surveys.findMany({
      where: {
        eventId: {
          in: eventUuids,
        },
      },
    })

    return NextResponse.json(myEvents, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 })
  }
}
