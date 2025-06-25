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
  title: 'Event-Planer',
  description: 'pep.digital - Event-Planer',
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
    <html lang='en' style={{ height: '100%', overflow: 'hidden' }}>
      <body style={{ margin: 0, height: '100%', overflow: 'hidden' }}>
        <MuiThemeProvider>
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {showNavigation && (
              <Box sx={{ height: '64px', flexShrink: 0 }}>
                <Header />
              </Box>
            )}
            <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
              {showNavigation && <Sidebar />}
              <ContentWrapper showNavigation={showNavigation}>
                <ErrorBoundaryWrapper>
                  <NuqsAdapter>{children}</NuqsAdapter>
                </ErrorBoundaryWrapper>
              </ContentWrapper>
            </Box>
          </Box>
        </MuiThemeProvider>
      </body>
    </html>
  )
}
