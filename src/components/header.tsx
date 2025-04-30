import { handleSignOut } from '@/utils/authClient'
import { AppBar, Box, IconButton, Link, Toolbar, Typography } from '@mui/material'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import NotificationsIcon from '@mui/icons-material/Notifications'
import LogoutIcon from '@mui/icons-material/Logout'

const Header = () => {
  return (
    <Box>
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
            <IconButton onClick={handleSignOut} sx={{ color: 'white' }}>
              <LogoutIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  )
}

export default Header
