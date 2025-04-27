'use client'
import { api } from '@/lib/api'
import { createClient } from '@/utils/supabase/client'
import { User } from '@supabase/supabase-js'
import { useState, useEffect } from 'react'
import SearchbarForCards from '@/components/searchbarForCards'
import FeedForCards from '@/components/feedforCards'

interface Wish {
  wishId: number
  userId: number
  title: string
  description: string
  currentUpvotes: number
  createdAt: string
}

const Page = () => {
  const [user, setUser] = useState<User | null>(null)
  const [wishes, setWishes] = useState<Wish[]>([])

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient()
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()
      if (error) {
        console.error('Error fetching user:', error)
      } else {
        setUser(user)
      }
    }
    fetchUser()
  }, [])

  useEffect(() => {
    const fetchWishes = async () => {
      try {
        const res = await api.get(`/myWish/${user?.id}`)
        console.log('myWishes')
        console.log(res.data)
        setWishes(res.data)
      } catch (error) {
        console.error('Error loading wishes:', error)
      }
    }
    fetchWishes()
  }, [user])

  return (
    <div>
      <SearchbarForCards buttonText='Create Wish' />
      <FeedForCards />
    </div>
  )
}

export default Page
