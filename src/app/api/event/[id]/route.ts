import prisma from '@/lib/client'
import { NextResponse } from 'next/server'
import { createClientForServer } from '@/utils/supabase/server'
import { NextRequest } from 'next/server'

export async function GET(req: NextRequest, context: { params: { id: string } }) {
  async function getServerAuth() {
    const supabase = await createClientForServer()
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error || !user) {
      return {
        user: null,
        errorResponse: NextResponse.json({ error: 'Not authenticated' }, { status: 401 }),
      }
    }

    return { user, errorResponse: null }
  }

  const { errorResponse } = await getServerAuth()

  if (errorResponse) return errorResponse

  const { id } = context.params

  if (!id) {
    throw new Error('Invalid or missing id parameter')
  }

  try {
    const event = await prisma.events.findUnique({
      where: {
        eventId: id,
      },
      include: {
        eventDates: true,
      },
    })

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
  console.log('Event ID:', id)

  try {
    const event = await prisma.events.delete({
      where: {
        eventId: id,
      },
    })

    
    console.log('Event deleted successfully:', event)
    console.log('Event ID:', id)
    return NextResponse.json({ event }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error })
  }
}
