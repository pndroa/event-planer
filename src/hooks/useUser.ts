import { useState, useEffect } from 'react'
import { fetchUser } from '@/lib/user'
import { User } from '@supabase/supabase-js'

export function useUser() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await fetchUser()
        setUser(user)
      } catch (error) {
        console.error(error)
      }
    }
    loadUser()
  }, [])

  return user
}
