'use client'

import { Box, Card, Typography, Button, Avatar } from '@mui/material'
import { blue, grey } from '@mui/material/colors'
import { formatTimeAgo } from '@/utils/timeUtils'

interface EventCardProps {
  eventId: string
  username: string
  title: string
  createdAt: string
}

export default function EventCard({ username, title, createdAt }: EventCardProps) {
  return (
    <Card
      sx={{
        minHeight: 140,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 2,
        backgroundColor: '#f0f4ff',
        borderRadius: 3,
        boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
        transition: '0.2s ease',
        '&:hover': {
          backgroundColor: '#e0eaff',
          transform: 'scale(1.01)',
        },
      }}
    >
      <Box display='flex' justifyContent='space-between' alignItems='flex-start'>
        <Box display='flex' alignItems='center' gap={1}>
          <Avatar sx={{ bgcolor: blue[500], width: 28, height: 28, fontSize: 14 }}>
            {username[0].toUpperCase()}
          </Avatar>
          <Typography variant='body2' color='text.secondary'>
            @{username}
          </Typography>
        </Box>
        <Typography variant='body2' color='text.secondary' sx={{ ml: 2, whiteSpace: 'nowrap' }}>
          {formatTimeAgo(createdAt)}
        </Typography>
      </Box>

      <Typography
        variant='h6'
        sx={{ mt: 1, fontWeight: 700, color: grey[900], wordBreak: 'break-word' }}
      >
        {title}
      </Typography>

      <Box display='flex' alignItems='center' mt={2}>
        <Button variant='outlined' size='small' color='primary'>
          Participate
        </Button>
      </Box>
    </Card>
  )
}
