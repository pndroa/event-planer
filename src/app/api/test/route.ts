import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  const user = await prisma.users.findMany()
  return NextResponse.json({ user, message: 'test api' }, { status: 200 })
}
