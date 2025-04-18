import { createClientForServer } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function Home() {
  /*
  const supabase = await createClientForServer()
  //getUser in serverside components and getSession in client components
  const { data, error } = await supabase.auth.getUser()
  if (data.user) {
    redirect('/event')
  } else if (error) {
    redirect('/signIn')
  }
    */
  return <div>Route Page</div>
}
