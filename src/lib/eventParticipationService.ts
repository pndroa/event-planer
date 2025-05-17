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
