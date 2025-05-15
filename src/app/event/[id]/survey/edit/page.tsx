'use client'
import { useParams } from 'next/navigation'

const Page = () => {
  const { id } = useParams()

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <h1>Survey</h1>
      <p>Survey ID: {id}</p>
    </div>
  )
}
export default Page
