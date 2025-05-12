'use client'

import { useState } from 'react'
import { Box, Card, Typography, Button, IconButton } from '@mui/material'
import { grey } from '@mui/material/colors'
import { formatTimeAgo } from '@/utils/timeUtils'
import { api } from '@/lib/api'
import DeleteOverlay from '@/components/deleteOverlay'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import { useRouter } from 'next/navigation'

interface EventCardProps {
  eventId: string
  username: string
  title: string
  createdAt: string
  initialJoined: boolean
  onClick?: () => void
  onParticipationChange?: (eventId: string, joined: boolean) => void
}

export default function EventCard({
  eventId,
  username,
  title,
  createdAt,
  initialJoined,
  onClick,
  onParticipationChange,
}: EventCardProps) {
  const [joined, setJoined] = useState(initialJoined)
  const [deleteEvent, setDeleteEvent] = useState(false)
  const router = useRouter()

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
      onClick={(e) => {
        if (e.target === e.currentTarget && onClick) {
          onClick()
        }
      }}
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

      <Box display='flex' justifyContent='space-between' mt={2}>
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

        <Box display='flex' alignItems='center'>
          <IconButton
            onClick={(e) => {
              e.stopPropagation()
              router.push(`/event/myEvent/${eventId}/edit`)
            }}
          >
            <EditIcon />
          </IconButton>

          <IconButton
            sx={{ ml: 1 }}
            onClick={(e) => {
              e.stopPropagation()
              setDeleteEvent(true)
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      </Box>

      {deleteEvent && <DeleteOverlay eventId={eventId} onClose={() => setDeleteEvent(false)} />}
    </Card>
  )
}
