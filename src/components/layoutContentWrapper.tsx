'use client'
import { Box } from '@mui/material'
import { IsMobile } from '@/lib/styles'
import React from 'react'

const drawerWidth = 200
const headerHeight = 64

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
        marginLeft: showNavigation && !IsMobile() ? `${drawerWidth}px` : 0,
        height: showNavigation ? `calc(100vh - ${headerHeight}px)` : '100vh',
        overflowY: 'auto',
        px: IsMobile() ? 2 : 4,
        scrollbarGutter: 'stable',
        py: 2,
        flexGrow: 1,
        paddingTop: 2,
        mt: `${headerHeight}px`,
      }}
    >
      {children}
    </Box>
  )
}

export default ContentWrapper
