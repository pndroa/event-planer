'use client'
import { Box } from '@mui/material'
import { IsMobile } from '@/lib/styles'
import React from 'react'

const drawerWidth = 200

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
        overflowY: 'auto',
        overflowX: 'hidden',
        px: IsMobile() ? 2 : 4,
        pt: 2,
        pb: 8,
        flexGrow: 1,
        minHeight: 0,
      }}
    >
      {children}
    </Box>
  )
}

export default ContentWrapper
