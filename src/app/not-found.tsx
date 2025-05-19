import { Box, Typography } from '@mui/material'

export default function NotFound() {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Typography variant='h2'>Page Not Found</Typography>
    </Box>
  )
}
