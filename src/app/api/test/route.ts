import { NextResponse } from 'next/server'
import prisma from '@/lib/client'

export const dynamic = 'force-dynamic' // oder 'auto'

export async function GET() {
  const user = await prisma.auth_users.findMany()
  return NextResponse.json({ user, message: 'test api' }, { status: 200 })
}
