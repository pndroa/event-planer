import { getServerAuth } from '@/lib/auth'
import prisma from '@/lib/client'
import { NextResponse } from 'next/server'

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { user, errorResponse } = await getServerAuth()
  if (errorResponse || !user) return errorResponse!

  const note = await prisma.notifications.update({
    where: { id: params.id },
    data: { read: true },
  })

  return NextResponse.json(note)
}

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const { user, errorResponse } = await getServerAuth()
  if (errorResponse || !user) return errorResponse!

  const note = await prisma.notifications.findUnique({
    where: { id: params.id },
  })

  return NextResponse.json(note)
}
