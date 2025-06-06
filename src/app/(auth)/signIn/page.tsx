'use client'
import { signInWithGoogle } from '@/utils/authClient'
import { Box, FormControl, TextField, Divider, Button, Alert, Typography } from '@mui/material'
import { useSearchParams } from 'next/navigation'
import { IsMobile } from '@/lib/styles'
import Image from 'next/image'
import { useState } from 'react'
import AuthForm from '@/components/authForm'
import Link from 'next/link'

const Page = () => {
  const params = useSearchParams()
  const isRegistered = params.get('registered') === 'true'
  const [isLoading, setIsLoading] = useState<boolean>(false)

  async function handleLogin() {
    setIsLoading(true)
    await signInWithGoogle()
    setIsLoading(false)
  }

  return (
    <AuthForm title='Sign In'>
      {isRegistered && (
        <Alert severity='success' sx={{ mb: 2 }}>
          Successfully registered. Please sign in!
        </Alert>
      )}
      <FormControl fullWidth>
        <TextField label='E-Mail' placeholder='E-Mail' fullWidth required margin='normal' />
        <TextField
          label='Password'
          placeholder='Password'
          type='password'
          required
          margin='normal'
        />
        <Button type='submit' variant='contained' sx={{ marginY: '1rem' }} fullWidth>
          Sign in
        </Button>
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1 }}>
          <Typography>Don&apos;t have an account?</Typography>
          <Link href='/signUp'>
            <Typography
              sx={{
                color: 'black',
                transition: 'color 0.2s ease',
                '&:hover': {
                  color: '#007bff',
                },
              }}
            >
              Sign Up Now
            </Typography>
          </Link>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Box display='flex' justifyContent={IsMobile() ? 'space-around' : 'center'} gap={2}>
          <Button onClick={handleLogin} disabled={isLoading}>
            <Image src='/icons/googleIcon.svg' alt='Google Icon' width={40} height={40} />
          </Button>
        </Box>
      </FormControl>
    </AuthForm>
  )
}

export default Page
