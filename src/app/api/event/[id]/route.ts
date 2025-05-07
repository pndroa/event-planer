//import { getServerAuth } from '@/lib/auth'
import prisma from '@/lib/client'
import { NextResponse } from 'next/server'
import { createClientForServer } from '@/utils/supabase/server'

export async function GET(request: Request, { params }: { params: { id: string } }) {
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

  const { id } = params

  if (!id) {
    throw new Error('Invalid or missing id parameter')
  }

  try {
    const event = await prisma.events.findUnique({
      where: {
        eventId: id,
      },
    })
    return NextResponse.json({ event }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error })
  }
}
