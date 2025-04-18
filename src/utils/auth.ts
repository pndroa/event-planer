'use server'
import { createClientForServer } from '@/utils/supabase/server'
import { Provider } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'

async function signInWith(provider: Provider) {
  const supabase = await createClientForServer()
  const authCallbackUrl = `${process.env.SITE_URL}/auth/callback`

  const { data } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: authCallbackUrl,
    },
  })

  redirect(data.url as string)
}

function signInWithGoogle() {
  return signInWith('google')
}

async function signOut() {
  const supabase = await createClientForServer()
  await supabase.auth.signOut()
  redirect('/signIn')
}

export { signInWithGoogle, signOut }
