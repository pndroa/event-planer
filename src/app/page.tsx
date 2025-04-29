'use client'
import { Box, Typography } from '@mui/material'

export default function Home() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: 'auto' }}>
      <Typography variant='h1'>Welcome to the Event-planner</Typography>
    </Box>
  )
}
