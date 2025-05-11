'use client'
import { useParams } from 'next/navigation'

const Page = () => {
  const { id } = useParams()

  return <div> Edit event page ${id}</div>
}

export default Page
