import type { Metadata } from 'next'
import React from 'react'
import Navbar from '@/components/Navbar'
import { createClientForServer } from '@/utils/supabase/server'
import { NuqsAdapter } from 'nuqs/adapters/next/app'

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

  if (process.env.NODE_ENV === 'development') {
    return (
      <html lang='en'>
        <body>
          <Navbar />
          <NuqsAdapter>{children}</NuqsAdapter>
        </body>
      </html>
    )
  }

  return (
    <html lang='en'>
      <body>
        {session && <Navbar />}
        <NuqsAdapter>{children}</NuqsAdapter>
      </body>
    </html>
  )
}
