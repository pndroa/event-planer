import { useState, useEffect } from 'react'
import { fetchUser } from '@/lib/user'
import { useErrorBoundary } from 'react-error-boundary'
import { User } from '@supabase/supabase-js'

export function useUser() {
  const { showBoundary } = useErrorBoundary()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await fetchUser()
        setUser(user)
      } catch (error) {
        showBoundary(error)
      }
    }
    loadUser()
  }, [showBoundary])

  return user
}
