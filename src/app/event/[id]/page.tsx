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
import CreateIcon from '@mui/icons-material/AddCircleOutline'
import DeleteOverlay from '@/components/deleteOverlay'

export default function EventDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { id } = params as { id: string }

  const [event, setEvent] = useState<Events | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)

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
      } catch (err) {
        setError('Fehler beim Laden des Events.')
        console.error(err)
      }
      setLoading(false)
    }
    fetchEvent()
  }, [id])

  useEffect(() => {
    const getUser = async () => {
      try {
        const user = await fetchUser()
        setUserId(user?.id ?? null)
      } catch (err) {
        console.log(err)
        setUserId(null)
      }
    }
    getUser()
  }, [])

  const labelGrey = '#6d7580'
  const sectionLabelColor = '#233047'
  const descBg = '#f5f8ff'
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
  const handleCreateSurvey = () => {
    setAnchorEl(null)
    // second User-Story: in progress!!!
    alert('platzhalter :)')
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
        maxWidth: 950,
        mx: 'auto',
        mt: 6,
        mb: 6,
        pt: 4,
        px: { xs: 2, sm: 3, md: 4 },
        position: 'relative',
        background: '#fff',
        borderTop: '2px solid #e0e4ea',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        overflow: 'hidden',
        '::before': {
          content: '""',
          position: 'absolute',
          left: 0,
          top: 0,
          height: '100%',
          width: '4px',
          borderTopLeftRadius: 24,
          borderBottomLeftRadius: 0,
          background: 'linear-gradient(to bottom, #e0e4ea 80%, transparent 100%)',
          zIndex: 1,
        },
        '::after': {
          content: '""',
          position: 'absolute',
          right: 0,
          top: 0,
          height: '100%',
          width: '4px',
          borderTopRightRadius: 24,
          borderBottomRightRadius: 0,
          background: 'linear-gradient(to bottom, #e0e4ea 80%, transparent 100%)',
          zIndex: 1,
        },
      }}
    >
      {/* Organizer left, Menu right  */}
      <Box display='flex' alignItems='center' justifyContent='space-between' width='100%' mb={2}>
        <Typography fontSize={15} fontWeight={700} color={labelGrey} sx={{ fontStyle: 'italic' }}>
          Organizer:
          <span style={{ fontStyle: 'normal', fontWeight: 500, color: labelGrey }}>
            {' '}
            @{event.users?.name || 'Unknown'}
          </span>
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
              <MenuItem onClick={handleCreateSurvey}>
                <ListItemIcon>
                  <CreateIcon fontSize='small' />
                </ListItemIcon>
                View Survey
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
        sx={{ letterSpacing: 1, mb: 3, mt: 3 }}
      >
        {event.title}
      </Typography>

      {/* Description */}
      <Box
        sx={{
          background: descBg,
          borderRadius: 3,
          px: 3,
          py: 2.3,
          mb: 4,
        }}
      >
        <Typography
          fontWeight={700}
          color={sectionLabelColor}
          fontSize={17}
          letterSpacing={0.4}
          mb={1}
        >
          Description:
        </Typography>
        <Typography
          fontSize={15.5}
          color='#222'
          textAlign='justify'
          sx={{ opacity: event.description ? 1 : 0.68 }}
        >
          {event.description ? (
            event.description
          ) : (
            <Box component='span' fontStyle='italic' color='text.disabled'>
              No description yet... <br /> <br /> <br /> <br />
            </Box>
          )}
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
          <Typography
            fontWeight={700}
            color={sectionLabelColor}
            fontSize={18}
            mb={1.5}
            letterSpacing={0.5}
          >
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
                    <span style={{ color: 'black', minWidth: 90 }}>
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
            <Typography fontSize={15} color='text.disabled' mt={1}>
              No dates defined yet.
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

      {/* Delete Overlay */}
      {deleteEvent && (
        <DeleteOverlay eventId={event.eventId} onClose={() => setDeleteEvent(false)} />
      )}
    </Box>
  )
}
