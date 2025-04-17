'use client'
import { useParams } from 'next/navigation'

const Page = () => {
  const { id } = useParams()
  return <div>Edit my Wishes Page for Wish: {id}</div>
}

export default Page
