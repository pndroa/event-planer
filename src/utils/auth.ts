'use server'
import { createClientForServer } from '@/utils/supabase/server'
import { Provider } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'

export const providers = [
  { id: 'google', name: 'Google' },
  { id: 'azure', name: 'Microsoft' },
  { id: 'github', name: 'GitHub' },
]

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
  return signInWith(providers[0].id as Provider)
}

function signInWithAzure() {
  return signInWith(providers[1].id as Provider)
}

function signInWithGitHub() {
  return signInWith(providers[2].id as Provider)
}

async function signOut() {
  const supabase = await createClientForServer()
  await supabase.auth.signOut()
  redirect('/signIn')
}

export { signInWithGoogle, signInWithAzure, signInWithGitHub, signOut }
