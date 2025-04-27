'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import NotificationsIcon from '@mui/icons-material/Notifications'
import LogoutIcon from '@mui/icons-material/Logout'
import HomeIcon from '@mui/icons-material/Home'
import StarIcon from '@mui/icons-material/Star'
import SettingsIcon from '@mui/icons-material/Settings'
import { usePathname } from 'next/navigation'
import { signOut } from '@/utils/auth'

const navLinks = [
  { label: 'Events', href: '/event', icon: <HomeIcon /> },
  { label: 'Wishes', href: '/wish', icon: <StarIcon /> },
]

const Navbar = () => {
  const [isMounted, setIsMounted] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  return (
    <>
      {/* AppBar */}
      <AppBar position='fixed' sx={{ zIndex: 1300, paddingLeft: 20 }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant='h6' sx={{ flexGrow: 1, textAlign: 'center', color: 'white' }}>
            Event Planner
          </Typography>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton component={Link} href='/notification' sx={{ color: 'white' }}>
              <NotificationsIcon />
            </IconButton>
            <IconButton component={Link} href='/profile' sx={{ color: 'white' }}>
              <AccountCircleIcon />
            </IconButton>
            <IconButton onClick={signOut} sx={{ color: 'white' }}>
              <LogoutIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Box
        sx={{
          width: 200,
          position: 'fixed',
          top: 64, // AppBar height
          left: 0,
          bottom: 0,
          bgcolor: '#F4F5F7',
          borderRight: '1px solid #dcdcdc',
          pt: 2,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Navigationsbereich */}
        <Box sx={{ flexGrow: 1 }}>
          <List>
            {navLinks.map((link) => (
              <Link href={link.href} style={{ textDecoration: 'none', color: 'inherit' }}>
                <ListItemButton key={link.label} selected={pathname.startsWith(link.href)}>
                  <ListItemIcon>{link.icon}</ListItemIcon>
                  <ListItemText primary={link.label} />
                </ListItemButton>
              </Link>
            ))}
          </List>
        </Box>

        {/* Settings ganz unten */}
        <Box>
          <List>
            <ListItemButton component={Link} href='/settings'>
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary='Settings' />
            </ListItemButton>
          </List>
        </Box>
      </Box>
    </>
  )
}

export default Navbar
