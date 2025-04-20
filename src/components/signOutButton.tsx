import { signOut } from '@/utils/auth'
import { Box, Button } from '@mui/material'

const SignOutButton = () => {
  return (
    <Box>
      <Button variant='contained' color='primary' onClick={signOut}>
        sign out
      </Button>
    </Box>
  )
}

export default SignOutButton
