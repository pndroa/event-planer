import React from 'react'
import type { Metadata } from 'next'
import { createClientForServer } from '@/utils/supabase/server'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import ErrorBoundaryWrapper from '@/components/errorBoundaryWrapper'
import Header from '@/components/header'
import Sidebar from '@/components/sidebar'
import ContentWrapper from '@/components/layoutContentWrapper'
import MuiThemeProvider from '@/providers/theme-provider'

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

  const showNavigation = !!session

  return (
    <html lang='en'>
      <body style={{ margin: 0, overflow: 'hidden' }}>
        <MuiThemeProvider>
          {showNavigation && <Header />}
          <div style={{ display: 'flex', width: '100%', height: '100vh' }}>
            {showNavigation && <Sidebar />}
            <ContentWrapper showNavigation={showNavigation}>
              <ErrorBoundaryWrapper>
                <NuqsAdapter>{children}</NuqsAdapter>
              </ErrorBoundaryWrapper>
            </ContentWrapper>
          </div>
        </MuiThemeProvider>
      </body>
    </html>
  )
}
