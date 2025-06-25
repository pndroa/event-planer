'use client'
import Link from 'next/link'
import { useState, MouseEvent } from 'react'
import useSWR from 'swr'
import {
  Box,
  IconButton,
  Badge,
  AppBar,
  Toolbar,
  Typography,
  Menu,
  MenuItem,
  ListItemText,
  Divider,
} from '@mui/material'
import NotificationsIcon from '@mui/icons-material/Notifications'
import LogoutIcon from '@mui/icons-material/Logout'
import ClearAllIcon from '@mui/icons-material/ClearAll'
import { handleSignOut } from '@/utils/authClient'
import type { Notification } from '@/lib/types'

const fetcher = (url: string) => fetch(url).then((res) => res.json() as Promise<Notification[]>)

export default function Header() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const { data: notifications = [], mutate } = useSWR<Notification[]>(
    '/api/notifications',
    fetcher,
    {
      refreshInterval: 10000,
    }
  )
  const unreadCount = notifications.filter((n) => !n.read).length

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
    // mark unread as read
    notifications
      .filter((n) => !n.read)
      .forEach((n) =>
        fetch(`/api/notifications/${n.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ read: true }),
        })
      )
  }

  const handleClearAll = async () => {
    await fetch('/api/notifications', { method: 'DELETE' })
    mutate([])
    setAnchorEl(null)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const formatNotificationTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()

    const isToday =
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()

    if (isToday) {
      return date.toLocaleTimeString(navigator.language, {
        hour: '2-digit',
        minute: '2-digit',
      })
    } else {
      return date.toLocaleDateString(navigator.language, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    }
  }
  return (
    <Box>
      <AppBar position='fixed' sx={{ zIndex: 1300, pl: 2 }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography
            variant='h6'
            sx={{
              flexGrow: 1,
              textAlign: {
                xs: 'center',
                sm: 'start',
              },
              color: 'white',
            }}
          >
            Event Planer
          </Typography>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton component={Link} href='/' sx={{ color: 'white' }}>
              {/* Home Icon */}
            </IconButton>

            <IconButton
              sx={{ color: 'white' }}
              onClick={handleClick}
              aria-controls={open ? 'notification-menu' : undefined}
              aria-haspopup='true'
              aria-expanded={open ? 'true' : undefined}
            >
              <Badge badgeContent={unreadCount} color='error'>
                <NotificationsIcon />
              </Badge>
            </IconButton>

            <Menu
              id='notification-menu'
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              slotProps={{
                paper: {
                  sx: {
                    width: 300,
                    maxHeight: 400,
                    overflowY: 'auto',
                  },
                },
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  px: 2,
                  py: 1,
                  justifyContent: 'space-between',
                }}
              >
                <Typography variant='subtitle1'>Notifications</Typography>
                <IconButton size='small' onClick={handleClearAll} title='Clear all'>
                  <ClearAllIcon fontSize='small' />
                </IconButton>
              </Box>
              <Divider />

              {notifications.length === 0 ? (
                <MenuItem disabled>
                  <ListItemText primary='No notifications' />
                </MenuItem>
              ) : (
                notifications.map((n) => (
                  <MenuItem
                    key={n.id}
                    onClick={() => {
                      setAnchorEl(null)
                      if (n.eventId) {
                        window.location.href = `/event/${n.eventId}/survey`
                      }
                    }}
                    sx={{
                      opacity: n.read ? 0.5 : 1,
                      whiteSpace: 'normal',
                      alignItems: 'flex-start',
                    }}
                  >
                    <ListItemText
                      primary={
                        <Typography variant='body2' sx={{ wordBreak: 'break-word' }}>
                          {n.message}
                        </Typography>
                      }
                      secondary={formatNotificationTime(n.createdAt)}
                    />
                  </MenuItem>
                ))
              )}
            </Menu>

            <IconButton onClick={handleSignOut} sx={{ color: 'white' }}>
              <LogoutIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  )
}
