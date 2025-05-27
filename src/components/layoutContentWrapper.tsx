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
        marginTop: showNavigation ? `${headerHeight}px` : 0,
        px: IsMobile() ? 2 : 4,
        py: 2,
        flexGrow: 1,
        overflowX: 'hidden',
      }}
    >
      {children}
    </Box>
  )
}

export default ContentWrapper
