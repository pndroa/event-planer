// components/WishCard.tsx
'use client'
import { Box, Card, Typography } from '@mui/material'
import { grey } from '@mui/material/colors'
import { formatTimeAgo } from '@/utils/timeUtils'
import { ReactNode } from 'react'

interface SurveyCardProps {
  title: string
  createdAt: string
  actionButton?: ReactNode
}

export default function SurveyCard({ title, createdAt, actionButton = null }: SurveyCardProps) {
  return (
    <Card
      sx={{
        p: 2,
        backgroundColor: '#f0f4ff',
        borderRadius: 3,
        boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
        '&:hover': { backgroundColor: '#e0eaff', transform: 'scale(1.01)' },
        transition: '0.2s',
      }}
    >
      <Box display='flex' justifyContent='flex-end' alignItems='flex-end'>
        <Typography variant='body2' color='text.secondary' sx={{ whiteSpace: 'nowrap' }}>
          {formatTimeAgo(createdAt)}
        </Typography>
      </Box>
      <Typography
        variant='h6'
        sx={{ mt: 1, fontWeight: 700, color: grey[900], wordBreak: 'break-word' }}
      >
        {title}
      </Typography>
      <Box display='flex' justifyContent='flex-end'>
        {actionButton}
      </Box>
    </Card>
  )
}
