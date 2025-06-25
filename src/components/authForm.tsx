'use client'
import { Box, Typography } from '@mui/material'
import { ReactNode } from 'react'

interface AuthFormProps {
  title: string
  children: ReactNode
}

const AuthForm = ({ title, children }: AuthFormProps) => {
  return (
    <Box
      sx={{
        width: '100%',
        minHeight: { xs: '75vh', sm: '85vh' },
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
          {title}
        </Typography>
        {children}
      </Box>
    </Box>
  )
}

export default AuthForm
