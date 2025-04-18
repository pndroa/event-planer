import { createClientForServer } from '@/utils/supabase/server'
import { createClient } from '@/utils/supabase/client'

export async function serverClient() {
  return await createClientForServer()
}

export async function client() {
  return createClient()
}
