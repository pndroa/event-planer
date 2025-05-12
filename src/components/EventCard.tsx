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
  onParticipationChange?: (eventId: string, joined: boolean) => void
}

export default function EventCard({
  eventId,
  username,
  title,
  createdAt,
  initialJoined,
  onParticipationChange,
}: EventCardProps) {
  const [joined, setJoined] = useState(initialJoined)

  const createParticipation = async () => {
    try {
      const res = await api.post('/event/participation', { eventId })
      onParticipationChange?.(eventId, res.data.joined)
      setJoined(res.data.joined)
    } catch (err) {
      console.error('Error joining event:', err)
    }
  }

  const deleteParticipation = async () => {
    try {
      const res = await api.delete(`/event/participation?eventId=${eventId}`)
      onParticipationChange?.(eventId, res.data.joined)
      setJoined(res.data.joined)
    } catch (err) {
      console.error('Error leaving event:', err)
    }
  }

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
        sx={{
          mt: 1,
          fontWeight: 700,
          color: grey[900],
          wordBreak: 'break-word',
        }}
      >
        {title}
      </Typography>

      <Box display='flex' alignItems='center' mt={2}>
        {joined ? (
          <Button
            variant='contained'
            sx={{
              color: '#fff',
              backgroundColor: '#e57373',
              '&:hover': {
                backgroundColor: '#f44336',
              },
            }}
            onClick={deleteParticipation}
          >
            Leave
          </Button>
        ) : (
          <Button
            variant='contained'
            sx={{
              color: '#fff',
              backgroundColor: '#81c784',
              '&:hover': {
                backgroundColor: '#66bb6a',
              },
            }}
            onClick={createParticipation}
          >
            Participate
          </Button>
        )}
      </Box>
    </Card>
  )
}
