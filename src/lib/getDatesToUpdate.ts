import prisma from '@/lib/client'
import { dateData } from '@/lib/types'

export async function getDatesToUpdate(datesToUpdate: dateData[], eventId: string) {
  const oldDates = await prisma.eventDates.findMany({
    where: { eventId },
  })

  const updatesThatHaveToBeChanged = []
  for (const dateToUpdate of datesToUpdate) {
    const date = oldDates.find((date) => date.dateId === dateToUpdate.id)

    if (date === undefined || date.date === null) {
      break
    }

    interface oldDate {
      date: string | null
      startTime: string | null
      endTime: string | null
    }

    const dateToCompare: oldDate = {
      date: date.date.toISOString().split('T')[0],
      startTime: date.startTime,
      endTime: date.endTime,
    }

    if (
      dateToCompare.date != dateToUpdate.date ||
      dateToCompare.startTime != dateToUpdate.startTime ||
      dateToCompare.endTime != dateToUpdate.endTime
    ) {
      updatesThatHaveToBeChanged.push(dateToUpdate)
    }
  }

  return updatesThatHaveToBeChanged
}
