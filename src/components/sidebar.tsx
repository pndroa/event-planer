'use client'
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Drawer,
} from '@mui/material'
import { IsMobile } from '@/lib/styles'
import HomeIcon from '@mui/icons-material/Home'
import StarIcon from '@mui/icons-material/Star'
import PollOutlinedIcon from '@mui/icons-material/PollOutlined'
import Link from 'next/link'
import React from 'react'
import { usePathname } from 'next/navigation'
import MenuIcon from '@mui/icons-material/Menu'
import CloseIcon from '@mui/icons-material/Close'

const drawerWidth = 200

const Sidebar = () => {
  const path = usePathname()
  const navLinks = [
    { label: 'Events', href: '/event', icon: <HomeIcon /> },
    { label: 'Wishes', href: '/wish', icon: <StarIcon /> },
    { label: 'Surveys', href: '/event/mySurvey', icon: <PollOutlinedIcon /> },
  ]
  const [open, setOpen] = React.useState(false)

  const sidebarInnerContent = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <Box>
        <List>
          {navLinks.map((link) => (
            <Link
              href={link.href}
              key={link.href}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <ListItemButton selected={path.startsWith(link.href)}>
                <ListItemIcon>{link.icon}</ListItemIcon>
                <ListItemText primary={link.label} />
              </ListItemButton>
            </Link>
          ))}
        </List>
      </Box>
    </Box>
  )

  if (IsMobile()) {
    return (
      <>
        <IconButton
          onClick={() => setOpen((prev) => !prev)}
          sx={{
            position: 'fixed',
            top: 32,
            transform: 'translateY(-50%)',
            left: 16,
            zIndex: 1300,
          }}
        >
          {open ? <CloseIcon /> : <MenuIcon />}
        </IconButton>
        <Drawer anchor='left' open={open} onClose={() => setOpen(false)}>
          <Box
            sx={{
              width: drawerWidth,
              bgcolor: '#F4F5F7',
              height: '100%',
              marginTop: '64px',
            }}
          >
            {sidebarInnerContent}
          </Box>
        </Drawer>
      </>
    )
  }

  // Desktop-Sidebar
  return (
    <Box
      sx={{
        width: drawerWidth,
        position: 'fixed',
        top: 64,
        left: 0,
        bottom: 0,
        bgcolor: '#F4F5F7',
        borderRight: '1px solid #dcdcdc',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      {sidebarInnerContent}
    </Box>
  )
}

export default Sidebar
