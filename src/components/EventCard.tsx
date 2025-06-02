'use client'

import { useState } from 'react'
import { Box, Card, Typography } from '@mui/material'
import Button from '@/components/button'
import { grey } from '@mui/material/colors'
import { formatTimeAgo } from '@/utils/timeUtils'
import { api } from '@/lib/api'
import { useRouter } from 'next/navigation'

interface EventCardProps {
  eventId: string
  username: string
  title: string
  createdAt: string
  initialJoined: boolean
  onParticipationChange?: (eventId: string, joined: boolean) => void
  currentUserId?: string | null
  trainerId: string
}

export default function EventCard({
  eventId,
  username,
  title,
  createdAt,
  initialJoined,
  onParticipationChange,
  currentUserId,
  trainerId,
}: EventCardProps) {
  const [joined, setJoined] = useState(initialJoined)
  const router = useRouter()
  const isOwnEvent = currentUserId === trainerId

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
    <Box onClick={() => router.push(`/event/${eventId}`)}>
      <Card
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
          cursor: 'pointer',
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

        <Box display='flex' justifyContent='space-between' mt={2}>
          {joined ? (
            <Button
              color='orange'
              onClick={(e) => {
                e.stopPropagation()
                deleteParticipation()
              }}
            >
              Leave
            </Button>
          ) : (
            <Button
              onClick={(e) => {
                e.stopPropagation()
                if (!isOwnEvent) createParticipation()
              }}
              sx={{
                backgroundColor: isOwnEvent ? 'lightgrey' : 'primary.main',
                color: isOwnEvent ? 'dimgray' : 'white',
                cursor: 'pointer',
              }}
            >
              Participate
            </Button>
          )}
        </Box>
      </Card>
    </Box>
  )
}
