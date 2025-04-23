'use client'
import { useParams } from 'next/navigation'
import { api } from '@/lib/api'
import { useEffect } from 'react'

const Page = () => {
  const { id } = useParams()

  useEffect(() => {
    const fetchWishes = async () => {
      try {
        const res = await api.get(`/myWish?id=${id}`)
        console.log(res.data)
      } catch (error) {
        console.error('Error loading wishes:', error)
      }
    }

    fetchWishes()
  }, [])

  return <div>My Wishes Page for Wish: {id}</div>
}

export default Page
