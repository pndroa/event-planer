'use client'
import { handleSignUp } from '@/utils/authClient'
import { Box, FormControl, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import AuthForm from '@/components/authForm'
import Button from '@/components/button'
import Link from 'next/link'

const Page = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [firstName, setFirstName] = useState<string>('')
  const [lastName, setLastName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  const [emailError, setEmailError] = useState<string>('')
  const [passwordError, setPasswordError] = useState<string>('')

  const handleSubmit = async () => {
    setIsLoading(true)
    setEmailError('')
    setPasswordError('')

    const name = firstName + ' ' + lastName

    try {
      const result = await handleSignUp(name, email, password)
      if (!result.success) {
        const error = result.error as string

        if (error.toLowerCase().includes('password')) {
          setPasswordError(error)
        } else if (error.toLowerCase().includes('email')) {
          setEmailError(error)
        } else {
          // fallback: optional globaler Fehler
          console.error(error)
        }
      }
    } catch (error) {
      console.error(error)
    }

    setIsLoading(false)
  }

  return (
    <AuthForm title='Sign Up'>
      <FormControl fullWidth>
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
          <TextField
            label='First Name'
            placeholder='First Name'
            fullWidth
            required
            margin='normal'
            onChange={(e) => setFirstName(e.target.value)}
          />
          <TextField
            label='Last Name'
            placeholder='Last Name'
            fullWidth
            required
            margin='normal'
            onChange={(e) => setLastName(e.target.value)}
          />
        </Box>
        <TextField
          label='E-Mail'
          placeholder='E-Mail'
          type='email'
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
        <Button onClick={handleSubmit} sx={{ marginY: '1rem' }} disabled={isLoading} fullWidth>
          Sign Up
        </Button>
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1 }}>
          <Typography>Have an account?</Typography>
          <Link href='/signIn'>
            <Typography
              sx={{
                color: 'black',
                transition: 'color 0.2s ease',
                '&:hover': {
                  color: '#007bff',
                },
              }}
            >
              Sign In Now
            </Typography>
          </Link>
        </Box>
      </FormControl>
    </AuthForm>
  )
}

export default Page
