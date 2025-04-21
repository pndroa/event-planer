'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItemIcon,
  ListItemText,
  Typography,
  ListItemButton,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import HomeIcon from '@mui/icons-material/Home'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import SettingsIcon from '@mui/icons-material/Settings'
import NotificationsIcon from '@mui/icons-material/Notifications'
import LogoutIcon from '@mui/icons-material/Logout'
import { usePathname } from 'next/navigation'
import { signOut } from '@/utils/auth'

const navLinks = [
  { label: 'Events', href: '/event', icon: <HomeIcon /> },
  { label: 'Wishes', href: '/wish', icon: <StarBorderIcon /> },
  { label: 'Settings', href: '/settings', icon: <SettingsIcon /> },
]

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  return (
    <>
      <AppBar position='static'>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          {/* Left Section */}
          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
            {/* Mobile Menu */}
            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
              <IconButton edge='start' onClick={() => setDrawerOpen(true)} sx={{ color: 'white' }}>
                <MenuIcon />
              </IconButton>
            </Box>

            {/* Desktop Nav Links */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
              {navLinks.map((link) => (
                <Button
                  key={link.href}
                  component={Link}
                  href={link.href}
                  startIcon={link.icon}
                  sx={{ color: 'white' }}
                >
                  {link.label}
                </Button>
              ))}
            </Box>
          </Box>

          {/* Center Section */}
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <Typography variant='h6' sx={{ color: 'white', textAlign: 'center' }}>
              Event Planner
            </Typography>
          </Box>

          {/* Right Section */}
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
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

      {/* Mobile Drawer */}
      <Drawer anchor='left' open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 250, height: '100%', display: 'flex', flexDirection: 'column' }}>
          <List>
            {navLinks
              .filter((link) => link.label !== 'Settings')
              .map((link) => (
                <ListItemButton
                  key={link.href}
                  component={Link}
                  href={link.href}
                  onClick={() => setDrawerOpen(false)}
                >
                  <ListItemIcon>{link.icon}</ListItemIcon>
                  <ListItemText primary={link.label} />
                </ListItemButton>
              ))}
          </List>

          {/* Settings */}
          <Box sx={{ mt: 'auto' }}>
            <List>
              {navLinks
                .filter((link) => link.label === 'Settings')
                .map((link) => (
                  <ListItemButton
                    key={link.href}
                    component={Link}
                    href={link.href}
                    onClick={() => setDrawerOpen(false)}
                  >
                    <ListItemIcon>{link.icon}</ListItemIcon>
                    <ListItemText primary={link.label} />
                  </ListItemButton>
                ))}
            </List>
          </Box>
        </Box>
      </Drawer>
    </>
  )
}

export default Navbar
