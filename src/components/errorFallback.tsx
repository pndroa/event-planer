'use client'
import { Modal, Box, Typography } from '@mui/material'
import Button from '@/components/button'
import { AxiosError, isAxiosError } from 'axios'

interface ErrorFallbackProps {
  error: AxiosError | Error
  resetErrorBoundary: () => void
}

const ErrorFallback = ({ error, resetErrorBoundary }: ErrorFallbackProps) => {
  let errorMessage = ''
  if (isAxiosError(error)) {
    const err = error.response?.data as { details?: string; message?: string }
    errorMessage = err.details as string
  }

  return (
    <Modal open={true} aria-labelledby='error-modal-title'>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          boxShadow: 24,
          borderRadius: 2,
          p: 4,
          width: 400,
          textAlign: 'center',
        }}
      >
        <Typography id='error-modal-title' variant='h6' gutterBottom>
          Error
        </Typography>
        <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
          {error?.message || 'unkown error'}
        </Typography>
        <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
          {errorMessage}
        </Typography>
        <Button onClick={resetErrorBoundary}>new try</Button>
      </Box>
    </Modal>
  )
}

export default ErrorFallback
