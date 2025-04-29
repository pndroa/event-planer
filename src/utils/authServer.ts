'use server'
import { getURL } from '@/lib/url'
import { createClientForServer } from '@/utils/supabase/server'
import { Provider } from '@supabase/supabase-js'

export async function getOAuthSignInUrl(provider: Provider) {
  const supabase = await createClientForServer()
  const authCallbackUrl = `${getURL()}/auth/callback`

  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: authCallbackUrl,
      },
    })

    if (error) {
      return { error: error.message }
    }

    return { url: data.url }
  } catch (error) {
    return { error, message: 'Authentication failed' }
  }
}

export async function signOut() {
  const supabase = await createClientForServer()
  await supabase.auth.signOut()
  return { success: true }
}
