'use client'
import { signInWithGoogle } from '@/utils/authClient'
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  TextField,
  Typography,
  Divider,
} from '@mui/material'
import Image from 'next/image'
import { useState } from 'react'

const SignIn = () => {
  console.log('NEXT_PUBLIC_SITE_URL:', process.env.NEXT_PUBLIC_SITE_URL)

  const [checkState, setCheckState] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

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
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '80vh',
      }}
    >
      <Box sx={{ width: '50%', height: '75%' }}>
        <Grid
          container
          flexDirection='column'
          alignItems='center'
          justifyContent='center'
          height='65vh'
        >
          <Grid>
            <Typography variant='h3'>Sign In</Typography>
          </Grid>
          <FormControl>
            <TextField label='E-Mail' placeholder='E-Mail' fullWidth required margin='normal' />
            <TextField
              label='Password'
              placeholder='Password'
              type='Password'
              required
              margin='normal'
            />
            <FormControlLabel
              control={<Checkbox checked={checkState} onChange={handleCheckbox} />}
              label='Remember me'
            />
            <Button type='submit' color='primary' variant='contained' sx={{ marginY: '1rem' }}>
              sign in
            </Button>
            <Divider />
            <Grid display='flex' gap='4.5rem'>
              <Button sx={{ marginTop: '1rem' }} onClick={handleLogin} disabled={isLoading}>
                <Image src='/icons/googleIcon.svg' alt='Google Icon' width={40} height={40} />
              </Button>
              <Button sx={{ marginTop: '1rem' }}>
                <Image
                  src='/icons/microsoftIcon.svg'
                  alt='Microsoft Icon'
                  width={40}
                  height={40}
                  //onClick={signInWithAzure}
                />
              </Button>
              <Button sx={{ marginTop: '1rem' }}>
                <Image
                  src='/icons/githubIcon.svg'
                  alt='Github Icon'
                  width={40}
                  height={40}
                  //onClick={signInWithGitHub}
                />
              </Button>
            </Grid>
          </FormControl>
        </Grid>
      </Box>
    </Box>
  )
}

export default SignIn
