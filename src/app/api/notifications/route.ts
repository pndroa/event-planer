import { getServerAuth } from '@/lib/auth'
import prisma from '@/lib/client'
import { NextResponse } from 'next/server'

export async function GET() {
  const { user, errorResponse } = await getServerAuth()
  if (errorResponse || !user) return errorResponse!

  const notes = await prisma.notifications.findMany({
    where: { recipientId: user.id },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(notes)
}

export async function DELETE() {
  const { user, errorResponse } = await getServerAuth()
  if (errorResponse || !user) return errorResponse!

  // lösche alle Notifications dieses Users
  await prisma.notifications.deleteMany({
    where: { recipientId: user.id },
  })

  return NextResponse.json({ cleared: true })
}
