import type { Metadata } from 'next'
import React from 'react'
import Navbar from '@/components/Navbar'
import { createClientForServer } from '@/utils/supabase/server'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import ErrorBoundaryWrapper from '@/components/errorBoundaryWrapper'

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
        <div style={{ paddingTop: '64px' }}>
          {process.env.NODE_ENV !== 'production' ? (
            <ErrorBoundaryWrapper>
              <NuqsAdapter>
                <Navbar />
                {children}
              </NuqsAdapter>
            </ErrorBoundaryWrapper>
          ) : (
            <ErrorBoundaryWrapper>
              <NuqsAdapter>
                {session && <Navbar />}
                {children}
              </NuqsAdapter>
            </ErrorBoundaryWrapper>
          )}
        </div>
      </body>
    </html>
  )
}
