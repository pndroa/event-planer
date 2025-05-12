import { createClientForServer } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function getServerAuth() {
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
