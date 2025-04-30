'use client'
import { Box, useMediaQuery } from '@mui/material'
import React from 'react'

export default function ContentWrapper({ children }: { children: React.ReactNode }) {
  const isMobile = useMediaQuery('(max-width:600px)')

  return (
    <Box
      sx={{
        marginLeft: isMobile ? 0 : '200px',
        marginTop: '64px',
        padding: 2,
        flexGrow: 1,
        width: '100%',
      }}
    >
      {children}
    </Box>
  )
}
