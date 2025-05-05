import React from 'react'
import type { Metadata } from 'next'
import { createClientForServer } from '@/utils/supabase/server'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import ErrorBoundaryWrapper from '@/components/errorBoundaryWrapper'
import Header from '@/components/header'
import Sidebar from '@/components/sidebar'
import ContentWrapper from '@/components/layoutContentWrapper'

export const metadata: Metadata = {
  title: 'Event Planer',
  description: 'Pep Digital - Event Planer',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const isProd = process.env.NODE_ENV === 'production'
  const client = await createClientForServer()
  const {
    data: { session },
  } = await client.auth.getSession()

  const showNavigation = !isProd || !!session

  return (
    <html lang='en'>
      <body>
        {showNavigation && <Header />}
        <div>
          {showNavigation && <Sidebar />}
          <ContentWrapper showNavigation={showNavigation}>
            <ErrorBoundaryWrapper>
              <NuqsAdapter>{children}</NuqsAdapter>
            </ErrorBoundaryWrapper>
          </ContentWrapper>
        </div>
      </body>
    </html>
  )
}
