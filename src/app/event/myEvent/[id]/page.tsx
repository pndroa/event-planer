'use client'
import { useParams } from 'next/navigation'

const Page = () => {
  const { id } = useParams()

  return <div>My Event Page for Event:{id}</div>
}

export default Page
