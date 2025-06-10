import React from 'react'
import type { Metadata } from 'next'
import { createClientForServer } from '@/utils/supabase/server'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import ErrorBoundaryWrapper from '@/components/errorBoundaryWrapper'
import Header from '@/components/header'
import Sidebar from '@/components/sidebar'
import ContentWrapper from '@/components/layoutContentWrapper'
import MuiThemeProvider from '@/providers/theme-provider'
import { Box } from '@mui/material'

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
      <body style={{ margin: 0 }}>
        <MuiThemeProvider>
          {showNavigation && <Header />}
          <Box sx={{ display: 'flex', width: '100%', height: 'calc(100vh - 64px)', mt: '64px' }}>
            {showNavigation && <Sidebar />}
            <ContentWrapper showNavigation={showNavigation}>
              <ErrorBoundaryWrapper>
                <NuqsAdapter>{children}</NuqsAdapter>
              </ErrorBoundaryWrapper>
            </ContentWrapper>
          </Box>
        </MuiThemeProvider>
      </body>
    </html>
  )
}
