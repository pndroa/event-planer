'use client'
import { signInWithGoogle } from '@/utils/authClient'
import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  TextField,
  Typography,
  Divider,
  Button,
} from '@mui/material'
import { IsMobile } from '@/lib/styles'
import Image from 'next/image'
import { useState } from 'react'

const SignIn = () => {
  const [checkState, setCheckState] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  function handleCheckbox() {
    setCheckState(!checkState)
  }

  async function handleLogin() {
    setIsLoading(true)
    await signInWithGoogle()
    setIsLoading(false)
  }

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '90vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        p: 2,
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 400,
          padding: 3,
          boxShadow: 3,
          borderRadius: 2,
          backgroundColor: 'background.paper',
        }}
      >
        <Typography variant='h4' align='center' gutterBottom>
          Sign In
        </Typography>

        <FormControl fullWidth>
          <TextField label='E-Mail' placeholder='E-Mail' fullWidth required margin='normal' />
          <TextField
            label='Password'
            placeholder='Password'
            type='password'
            required
            margin='normal'
          />
          <FormControlLabel
            control={<Checkbox checked={checkState} onChange={handleCheckbox} />}
            label='Remember me'
          />
          <Button type='submit' variant='contained' sx={{ marginY: '1rem' }} fullWidth>
            Sign in
          </Button>
          <Divider sx={{ my: 2 }} />
          <Box display='flex' justifyContent={IsMobile() ? 'space-around' : 'center'} gap={2}>
            <Button onClick={handleLogin} disabled={isLoading}>
              <Image src='/icons/googleIcon.svg' alt='Google Icon' width={40} height={40} />
            </Button>
            <Button>
              <Image src='/icons/microsoftIcon.svg' alt='Microsoft Icon' width={40} height={40} />
            </Button>
            <Button>
              <Image src='/icons/githubIcon.svg' alt='Github Icon' width={40} height={40} />
            </Button>
          </Box>
        </FormControl>
      </Box>
    </Box>
  )
}

export default SignIn
