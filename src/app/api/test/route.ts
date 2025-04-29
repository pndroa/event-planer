import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ message: 'test api' }, { status: 200 })
}
