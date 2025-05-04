'use client'

import { Box, Typography } from '@mui/material'
import Link from 'next/link'

export default function TopNavigation() {
  return (
    <Box display='flex' gap={4} alignItems='center' sx={{ mb: 2 }}>
      <Link href='/wish/myWish' style={{ textDecoration: 'none', color: 'inherit' }}>
        <Typography sx={{ color: 'primary.main', fontWeight: 600, cursor: 'pointer' }}>
          MyWishes
        </Typography>
      </Link>
      <Link href='/event/mySurvey' style={{ textDecoration: 'none', color: 'inherit' }}>
        <Typography sx={{ color: 'primary.main', fontWeight: 600, cursor: 'pointer' }}>
          MySurveys
        </Typography>
      </Link>
    </Box>
  )
}
