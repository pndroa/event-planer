'use client'
import { Box } from '@mui/material'
import { IsMobile } from '@/lib/styles'
import React from 'react'

const ContentWrapper = ({
  children,
  showNavigation,
}: {
  children: React.ReactNode
  showNavigation: boolean
}) => {
  return (
    <Box
      sx={{
        minHeight: showNavigation ? 'calc(100vh - 64px)' : '100vh',
        marginLeft: showNavigation && !IsMobile() ? 'auto' : -2,
        marginTop: showNavigation ? '80px' : 0,
        px: IsMobile() ? 2 : 4,
        py: 2,
        flexGrow: 1,
        width: '100%',
        overflowX: 'hidden',
      }}
    >
      {children}
    </Box>
  )
}

export default ContentWrapper
