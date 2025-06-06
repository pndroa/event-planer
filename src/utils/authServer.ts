'use server'
import { getURL } from '@/lib/url'
import { createAdminClientForServer, createClientForServer } from '@/utils/supabase/server'
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

export async function signUp(name: string, email: string, password: string) {
  const supabaseAdmin = createAdminClientForServer()
  try {
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      // eslint-disable-next-line camelcase
      user_metadata: {
        name,
      },
      // eslint-disable-next-line camelcase
      email_confirm: false,
    })

    if (error) return { success: false, error: error.message }

    return { success: true, data }
  } catch (error) {
    return { success: false, error, message: 'Admin user creation failed' }
  }
}

export async function signOut() {
  const supabase = await createClientForServer()
  await supabase.auth.signOut()
  return { success: true }
}
