'use client'
import FormCard from '@/components/formCard'
import { Grid, Box, TextField, Button, Snackbar, Alert } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers'
import { useParams } from 'next/navigation'

const Page = () => {
  const { id } = useParams()

  return (
    <Grid
      container
      width={1000}
      minHeight='80vh'
      justifyContent='center'
      alignItems='center'
      margin='auto'
    >
      <Grid>
        <FormCard title={`Create Survey for Event ${id}`}></FormCard>
      </Grid>
    </Grid>
  )
}

export default Page
