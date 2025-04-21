import type { Metadata } from 'next'
import React from 'react'
import Navbar from '@/components/Navbar'
import { createClientForServer } from '@/utils/supabase/server'

export const metadata: Metadata = {
  title: 'Event Planer',
  description: 'Pep Digital - Event Planer',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const client = await createClientForServer()
  const {
    data: { session },
  } = await client.auth.getSession()

  return (
    <html lang='en'>
      <body>
        {session && <Navbar />}
        {children}
      </body>
    </html>
  )
}
