'use client'

import { useState } from 'react'
import { Box, Card, Typography, Button } from '@mui/material'
import { grey } from '@mui/material/colors'
import { formatTimeAgo } from '@/utils/timeUtils'
import { api } from '@/lib/api'

interface EventCardProps {
  eventId: string
  username: string
  title: string
  createdAt: string
  initialJoined: boolean
  onClick?: () => void
}

export default function EventCard({
  eventId,
  username,
  title,
  createdAt,
  initialJoined,
  onClick,
}: EventCardProps) {
  const [joined, setJoined] = useState(initialJoined)

  const createParticipation = async () => {
    try {
      const res = await api.post('/event/participation', { eventId })
      setJoined(res.data.joined)
    } catch (err) {
      console.error('Error joining event:', err)
    }
  }

  const deleteParticipation = async () => {
    try {
      const res = await api.delete(`/event/participation?eventId=${eventId}`)
      setJoined(res.data.joined)
    } catch (err) {
      console.error('Error leaving event:', err)
    }
  }

  return (
    <Card
      onClick={onClick}
      sx={{
        position: 'relative',
        minHeight: 140,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 2,
        backgroundColor: '#f0f4ff',
        borderRadius: 3,
        boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
        transition: '0.2s ease',
        cursor: onClick ? 'pointer' : 'default',
        '&:hover': {
          backgroundColor: '#e0eaff',
          transform: 'scale(1.01)',
        },
      }}
    >
      <Box display='flex' justifyContent='space-between'>
        <Typography variant='body2' color='text.secondary'>
          @{username}
        </Typography>
        <Typography variant='body2' color='text.secondary'>
          {formatTimeAgo(createdAt)}
        </Typography>
      </Box>

      <Typography
        variant='h6'
        sx={{ mt: 1, fontWeight: 700, color: grey[900], wordBreak: 'break-word' }}
      >
        {title}
      </Typography>

      <Box display='flex' justifyContent='flex-start' mt={2}>
        {joined ? (
          <Button
            variant='contained'
            sx={{
              color: '#fff',
              backgroundColor: '#e57373',
              '&:hover': { backgroundColor: '#f44336' },
            }}
            onClick={(e) => {
              e.stopPropagation()
              deleteParticipation()
            }}
          >
            Leave
          </Button>
        ) : (
          <Button
            variant='contained'
            sx={{
              color: '#fff',
              backgroundColor: '#81c784',
              '&:hover': { backgroundColor: '#66bb6a' },
            }}
            onClick={(e) => {
              e.stopPropagation()
              createParticipation()
            }}
          >
            Participate
          </Button>
        )}
      </Box>
    </Card>
  )
}
