'use client'
import { handleSignIn, signInWithGoogle } from '@/utils/authClient'
import { Box, FormControl, TextField, Divider, Alert, Typography } from '@mui/material'
import Button from '@/components/button'
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
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [emailError, setEmailError] = useState<string>('')
  const [passwordError, setPasswordError] = useState<string>('')
  const [error, setError] = useState<string>('')

  async function handleGoogleLogin() {
    setIsLoading(true)
    await signInWithGoogle()
    setIsLoading(false)
  }

  const handleSubmit = async () => {
    const url = new URL(window.location.href)
    url.search = ''
    window.history.replaceState({}, document.title, url.toString())

    setIsLoading(true)
    setEmailError('')
    setPasswordError('')
    setError('')

    try {
      const result = await handleSignIn(email, password)
      const error = result?.error

      if (!result?.success) {
        if (typeof error === 'string') {
          const lowerError = error.toLowerCase()

          if (lowerError.includes('password')) {
            setPasswordError(error)
          } else if (
            lowerError.includes('email') &&
            (lowerError.includes('invalid') || lowerError.includes('format'))
          ) {
            setEmailError(error)
          } else {
            setError(error)
            console.error(error)
          }
        } else if (error) {
          setError('An unknown error occurred')
          console.error(error)
        }
      }
    } catch (error) {
      console.error(error)
    }

    setIsLoading(false)
  }

  const isSignInDisabled = !email.trim() || !password.trim() || isLoading

  return (
    <AuthForm title='Sign In'>
      {isRegistered && (
        <Alert severity='success' sx={{ mb: 2 }}>
          Successfully registered. Please sign in!
        </Alert>
      )}
      {error && (
        <Alert severity='error' sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <FormControl fullWidth>
        <TextField
          label='E-Mail'
          placeholder='E-Mail'
          fullWidth
          required
          margin='normal'
          onChange={(e) => setEmail(e.target.value)}
          error={!!emailError}
          helperText={emailError}
        />
        <TextField
          label='Password'
          placeholder='Password'
          type='password'
          required
          margin='normal'
          onChange={(e) => setPassword(e.target.value)}
          error={!!passwordError}
          helperText={passwordError}
        />
        <Button
          onClick={handleSubmit}
          sx={{ marginY: '1rem' }}
          fullWidth
          disabled={isSignInDisabled}
        >
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
          <Button variant='text' onClick={handleGoogleLogin} disabled={isLoading}>
            <Image src='/icons/googleIcon.svg' alt='Google Icon' width={40} height={40} />
          </Button>
        </Box>
      </FormControl>
    </AuthForm>
  )
}

export default Page
