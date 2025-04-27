'use client'
import { Box } from '@mui/material'
import Homepage from '@/components/Home/home'

export default function Home() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: 'auto' }}>
      <Homepage />
    </Box>
  )
}
