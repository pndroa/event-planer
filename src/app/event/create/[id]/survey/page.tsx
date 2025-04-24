'use client'
import { useParams } from 'next/navigation'

const Page = () => {
  const { id } = useParams()

  return <div>Create Survey for Event {id}</div>
}

export default Page
