import { prisma } from '@/lib/client'

export async function addWishUpvotersAsParticipants(wishId: string, eventId: string) {
  const upvotes = await prisma.wishUpvote.findMany({
    where: { wishId },
    select: { userId: true },
  })

  for (const upvote of upvotes) {
    await prisma.eventParticipation.create({
      data: {
        eventId,
        participantId: upvote.userId,
      },
    })
  }
}

export async function getEventsWithParticipation(userId: string) {
  const [events, participations] = await Promise.all([
    prisma.events.findMany({
      include: {
        users: {
          select: {
            userId: true,
            name: true,
          },
        },
        eventDates: true,
      },
    }),
    prisma.eventParticipation.findMany({
      where: { participantId: userId },
      select: { eventId: true },
    }),
  ])

  const joinedSet = new Set(participations.map((p) => p.eventId))

  return events.map((event) => ({
    ...event,
    joined: joinedSet.has(event.eventId),
  }))
}

export async function getEventWithParticipation(userId: string, eventId: string) {
  const [event, participation] = await Promise.all([
    prisma.events.findUnique({
      where: { eventId },
      include: {
        users: { select: { userId: true, name: true } },
        eventDates: true,
      },
    }),
    prisma.eventParticipation.findUnique({
      where: {
        // eslint-disable-next-line camelcase
        participantId_eventId: {
          participantId: userId,
          eventId,
        },
      },
    }),
  ])

  if (!event) return null

  return {
    ...event,
    joined: Boolean(participation),
  }
}

export async function getParticipantsForEvent(eventId: string) {
  console.log('getParticipantsForEvent')
  console.log(eventId)

  if (typeof eventId !== 'string') {
    return []
  }

  const participants = await prisma.eventParticipation.findMany({
    where: {
      eventId,
    },
  })

  return participants
}
