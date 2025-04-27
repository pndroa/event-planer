import { createClient } from '@/utils/supabase/client'

export async function fetchUser() {
  const supabase = createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error) {
    console.error(error)
    throw error
  }

  return user
}
