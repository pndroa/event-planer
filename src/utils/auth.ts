'use server'
import { createClientForServer } from '@/utils/supabase/server'
import { Provider } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'

async function signInWith(provider: Provider) {
  const supabase = await createClientForServer()
  const authCallbackUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`

  const { data } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: authCallbackUrl,
    },
  })

  redirect(data.url as string)
}

function signInWithGoogle() {
  return signInWith('google' as Provider)
}

//TODO: Setup in Supabase
function signInWithAzure() {
  return signInWith('azure' as Provider)
}

//TODO: Setup in Supabase
function signInWithGitHub() {
  return signInWith('github' as Provider)
}

async function signOut() {
  const supabase = await createClientForServer()
  await supabase.auth.signOut()
  redirect('/signIn')
}

export { signInWithGoogle, signInWithAzure, signInWithGitHub, signOut }
