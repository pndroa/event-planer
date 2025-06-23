'use client'
import { handleSignUp } from '@/utils/authClient'
import { Box, FormControl, TextField, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import AuthForm from '@/components/authForm'
import Button from '@/components/button'
import Link from 'next/link'

const Page = () => {
  const [isLoading, setIsLoading] = useState(false)

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordVerification, setPasswordVerification] = useState('')

  const [doMatch, setDoMatch] = useState(true)

  const [firstNameTouched, setFirstNameTouched] = useState(false)
  const [lastNameTouched, setLastNameTouched] = useState(false)
  const [emailTouched, setEmailTouched] = useState(false)
  const [passwordTouched, setPasswordTouched] = useState(false)
  const [passwordVerificationTouched, setPasswordVerificationTouched] = useState(false)

  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')

  useEffect(() => {
    if (!password || !passwordVerification) {
      setDoMatch(true)
      return
    }
    setDoMatch(password === passwordVerification)
  }, [password, passwordVerification])

  const handleSubmit = async () => {
    if (doMatch) {
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
            console.error(error)
          }
        }
      } catch (error) {
        console.error(error)
      }

      setIsLoading(false)
    } else {
      setPasswordError('The passwords do not match.')
    }
  }

  const isSignUpDisabled =
    !firstName.trim() ||
    !lastName.trim() ||
    !email.trim() ||
    !password.trim() ||
    !passwordVerification.trim() ||
    !doMatch ||
    isLoading

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
            value={firstName}
            onChange={(e) => {
              setFirstName(e.target.value)
              setFirstNameTouched(true)
            }}
            onBlur={() => setFirstNameTouched(true)}
            error={firstNameTouched && !firstName.trim()}
            helperText={firstNameTouched && !firstName.trim() ? 'First name is required' : ''}
          />
          <TextField
            label='Last Name'
            placeholder='Last Name'
            fullWidth
            required
            margin='normal'
            value={lastName}
            onChange={(e) => {
              setLastName(e.target.value)
              setLastNameTouched(true)
            }}
            onBlur={() => setLastNameTouched(true)}
            error={lastNameTouched && !lastName.trim()}
            helperText={lastNameTouched && !lastName.trim() ? 'Last name is required' : ''}
          />
        </Box>
        <TextField
          label='E-Mail'
          placeholder='E-Mail'
          type='email'
          fullWidth
          required
          margin='normal'
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            setEmailTouched(true)
          }}
          onBlur={() => setEmailTouched(true)}
          error={(emailTouched && !email.trim()) || !!emailError}
          helperText={!email.trim() && emailTouched ? 'Email is required' : emailError}
        />
        <TextField
          label='Password'
          placeholder='Password'
          type='password'
          required
          margin='normal'
          value={password}
          onChange={(e) => {
            setPassword(e.target.value)
            setPasswordTouched(true)
          }}
          onBlur={() => setPasswordTouched(true)}
          error={(passwordTouched && !password.trim()) || !!passwordError}
          helperText={!password.trim() && passwordTouched ? 'Password is required' : passwordError}
        />
        <TextField
          label='Verify Password'
          placeholder='Password'
          type='password'
          required
          margin='normal'
          value={passwordVerification}
          onChange={(e) => {
            setPasswordVerification(e.target.value)
            setPasswordVerificationTouched(true)
          }}
          onBlur={() => setPasswordVerificationTouched(true)}
          error={(passwordVerificationTouched && !passwordVerification.trim()) || !doMatch}
          helperText={
            !passwordVerification.trim() && passwordVerificationTouched
              ? 'Please verify your password'
              : !doMatch
                ? 'The passwords do not match.'
                : ''
          }
        />
        <Button
          onClick={handleSubmit}
          sx={{ marginY: '1rem' }}
          disabled={isSignUpDisabled}
          fullWidth
        >
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
