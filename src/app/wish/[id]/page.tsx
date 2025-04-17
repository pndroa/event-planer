'use client'
import { useParams } from 'next/navigation'

const Page = () => {
  const { id } = useParams()
  return <div>Wish Page for {id}</div>
}

export default Page
