'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { Events } from '@/lib/types'
import { fetchUser } from '@/lib/user'
import React from 'react'
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Stack,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
} from '@mui/material'
import RoomIcon from '@mui/icons-material/Room'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import EventNoteIcon from '@mui/icons-material/EventNote'
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import ShowChartIcon from '@mui/icons-material/ShowChart'
import DeleteOverlay from '@/components/deleteOverlay'
import Button from '@/components/button'

export default function EventDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { id } = params as { id: string }

  const [event, setEvent] = useState<Events | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [joined, setJoined] = useState<boolean>(false)

  // Drei-Punkte-Menü State
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const openMenu = Boolean(anchorEl)
  const [deleteEvent, setDeleteEvent] = useState(false)

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true)
      try {
        const res = await api.get(`/event/${id}`)
        setEvent(res.data.event)
        setJoined(res.data.event.joined)
      } catch (err) {
        setError('Fehler beim Laden des Events.')
        console.error(err)
      }
      setLoading(false)
    }
    fetchEvent()
  }, [id])

  const createParticipation = async () => {
    try {
      const res = await api.post('/event/participation', { eventId: id })
      setJoined(res.data.joined)
    } catch (err) {
      console.error('Error joining event:', err)
    }
  }

  const deleteParticipation = async () => {
    try {
      const res = await api.delete(`/event/participation?eventId=${id}`)
      setJoined(res.data.joined)
    } catch (err) {
      console.error('Error leaving event:', err)
    }
  }

  useEffect(() => {
    const getUser = async () => {
      try {
        const user = await fetchUser()
        setUserId(user?.id ?? null)
      } catch (err) {
        console.error(err)
        setUserId(null)
      }
    }
    getUser()
  }, [])

  const sectionLabelColor = '#233047'
  const eventDatesBg = '#e9f6fd'
  const roomBg = '#fffbe7'
  const roomIconColor = '#ffd02a'
  const dateColor = '#2186eb'

  // Menu-Handler
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  // Button-Actions
  const handleEdit = () => {
    setAnchorEl(null)
    router.push(`/event/myEvent/${event?.eventId}/edit`)
  }
  const handleDelete = () => {
    setAnchorEl(null)
    setDeleteEvent(true)
  }
  const handleView = () => {
    setAnchorEl(null)
    router.push(`/event/${id}/statistics`)
  }

  if (loading)
    return (
      <Box display='flex' justifyContent='center' mt={8}>
        <CircularProgress />
      </Box>
    )
  if (error) return <Alert severity='error'>{error}</Alert>
  if (!event) return <Alert severity='info'>Event not found!</Alert>

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 800,
        mx: 'auto',
        mt: 6,
        mb: 6,
        p: 4,
        backgroundColor: '#fff',
        borderRadius: 3,
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
      }}
    >
      {/* Organizer left, Menu right  */}
      <Box display='flex' alignItems='center' justifyContent='space-between' width='100%' mb={2}>
        <Typography fontSize={15} fontWeight={700} color='#666' mb={2}>
          Event by: <span style={{ fontWeight: 500 }}>@{event.users?.name || 'Unknown'}</span>
        </Typography>

        {userId === event.trainerId && (
          <>
            <IconButton
              aria-label='more'
              id='more-menu-button'
              aria-controls={openMenu ? 'more-menu' : undefined}
              aria-haspopup='true'
              onClick={handleMenuOpen}
            >
              <MoreVertIcon />
            </IconButton>
            <Menu
              id='more-menu'
              anchorEl={anchorEl}
              open={openMenu}
              onClose={handleMenuClose}
              PaperProps={{
                style: {
                  boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
                  borderRadius: 12,
                },
              }}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <MenuItem onClick={handleEdit}>
                <ListItemIcon>
                  <EditIcon fontSize='small' />
                </ListItemIcon>
                Edit Event
              </MenuItem>
              <MenuItem onClick={handleDelete}>
                <ListItemIcon>
                  <DeleteIcon fontSize='small' />
                </ListItemIcon>
                Delete Event
              </MenuItem>
              <MenuItem onClick={handleView}>
                <ListItemIcon>
                  <ShowChartIcon fontSize='small' />
                </ListItemIcon>
                View Statistics
              </MenuItem>
            </Menu>
          </>
        )}
      </Box>

      {/* Title */}
      <Typography
        variant='h3'
        fontWeight={700}
        color='#2176d2'
        textAlign='center'
        mb={4}
        sx={{
          whiteSpace: 'normal',
          wordBreak: 'break-word',
          overflowWrap: 'break-word',
        }}
      >
        {event.title}
      </Typography>

      {/* Description */}
      <Box
        sx={{
          backgroundColor: '#f5f8ff',
          borderRadius: 3,
          p: 3,
          mb: 3,
        }}
      >
        <Typography fontWeight={700} fontSize={17} mb={1}>
          Description:
        </Typography>
        <Typography
          fontSize={15.5}
          color='#222'
          textAlign='justify'
          sx={{
            opacity: event.description ? 1 : 0.68,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
          }}
        >
          {event.description ? event.description : <i>No description yet...</i>}
        </Typography>
      </Box>

      {/* EventDates and Room */}
      <Box
        display='flex'
        flexDirection={{ xs: 'column', sm: 'row' }}
        gap={4}
        alignItems={{ xs: 'stretch', sm: 'flex-start' }}
        justifyContent='center'
        width='100%'
      >
        {/* Event Dates */}
        <Box
          sx={{
            background: eventDatesBg,
            borderRadius: 4,
            px: 4,
            py: 3,
            flex: 1,
            minWidth: 240,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            boxShadow: '0 1px 6px rgba(50, 120, 220, 0.05)',
          }}
        >
          <CalendarMonthIcon sx={{ color: dateColor, fontSize: 34, mb: 0.5 }} />
          <Typography fontWeight={700} color='#233047' fontSize={17} mb={1.5}>
            Event Dates
          </Typography>

          {event.eventDates.length > 0 ? (
            <Stack spacing={1} alignItems='center' width='100%'>
              {event.eventDates.map((dateObj) => (
                <Box
                  key={dateObj.dateId}
                  display='flex'
                  alignItems='center'
                  gap={2}
                  fontSize={15.5}
                  width='100%'
                  justifyContent='center'
                >
                  {/* Date */}
                  <Box display='flex' alignItems='center' gap={0.7}>
                    <EventNoteIcon sx={{ color: dateColor, fontSize: 22, mb: '1px' }} />
                    <span style={{ color: '#222', fontSize: 15 }}>
                      {new Date(dateObj.date).toLocaleDateString()}
                    </span>
                  </Box>
                  {/* Time */}
                  <Box display='flex' alignItems='center' gap={0.5}>
                    <AccessTimeFilledIcon sx={{ color: dateColor, fontSize: 20 }} />
                    <span style={{ color: 'black', minWidth: 80 }}>
                      {dateObj.startTime || '–'} – {dateObj.endTime || '–'}
                    </span>
                  </Box>
                </Box>
              ))}
            </Stack>
          ) : (
            <Typography fontSize={15} color='text.disabled' fontStyle='italic'>
              No dates defined yet...
            </Typography>
          )}
        </Box>

        {/* Room */}
        <Box
          sx={{
            background: roomBg,
            borderRadius: 4,
            px: 4,
            py: 3,
            flex: 1,
            minWidth: 240,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            boxShadow: '0 1px 6px rgba(220, 180, 50, 0.07)',
          }}
        >
          <RoomIcon sx={{ color: roomIconColor, fontSize: 34, mb: 0.5 }} />
          <Typography
            fontWeight={700}
            color={sectionLabelColor}
            fontSize={18}
            mb={1}
            letterSpacing={0.5}
          >
            Room
          </Typography>
          <Typography
            fontSize={15}
            color={event.room ? 'text.primary' : '#00000061'}
            textAlign='center'
            fontStyle={event.room ? 'normal' : 'italic'}
          >
            {event.room || 'Not defined yet...'}
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          mt: 5,
          flexWrap: 'wrap',
          gap: 1,
        }}
      >
        <Box>
          {userId !== event.trainerId && (
            <Button
              {...(joined ? { color: 'orange' } : {})}
              onClick={joined ? deleteParticipation : createParticipation}
            >
              {joined ? 'Leave' : 'Participate'}
            </Button>
          )}
        </Box>
        <Box>
          {(joined || userId === event.trainerId) && (
            <Button onClick={() => router.push(`/event/${id}/survey`)}>To Surveys</Button>
          )}
        </Box>
      </Box>

      {deleteEvent && event?.eventId && (
        <DeleteOverlay
          onDeleteClick={async (e) => {
            e.stopPropagation()
            try {
              await api.delete(`/event/${event.eventId}`)
              setDeleteEvent(false)
              router.push('/event')
            } catch (err) {
              console.error('Failed to delete event:', err)
            }
          }}
          onClose={() => setDeleteEvent(false)}
        />
      )}
    </Box>
  )
}
