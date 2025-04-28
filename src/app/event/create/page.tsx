'use client'
import FormCard from '@/components/formCard'
import { TextField, Grid, Button, Box, Snackbar, Alert } from '@mui/material'
import DatePicker from '@/components/datePicker'
import { useLayoutEffect, useMemo, useState, FormEvent } from 'react'
import { AxiosError } from 'axios'
import { api } from '@/lib/api'
import { format } from 'date-fns'
import { useRouter } from 'next/navigation'
import { PostEvents } from '@/lib/types'
import { useErrorBoundary } from 'react-error-boundary'
import { useQueryState } from 'nuqs'
import { useUser } from '@/hooks/useUser'

interface PostResponseEvent extends PostEvents {
  event: PostEvents & { eventId: string }
}

const Page = () => {
  //Constants
  const router = useRouter()
  const user = useUser()
  const { showBoundary } = useErrorBoundary()

  const dateQueryOptions = useMemo(
    () => ({
      parse: (value: string | null) => (value ? new Date(value) : null),
      serialize: (value: Date | null) => (value ? format(value, 'yyyy-MM-dd') : ''),
    }),
    []
  )

  //States
  const [startDate, setStartDate] = useQueryState<Date | null>('startDate', dateQueryOptions)
  const [endDate, setEndDate] = useQueryState<Date | null>('enddate', dateQueryOptions)
  const [isClient, setIsClient] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false)

  //Functions
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)

    const event = {
      trainerId: user?.id as string,
      title: formData.get('title') as string,
      description: (formData.get('description') as string) || null,
      room: (formData.get('room') as string) || null,
      startDate: format(startDate as Date, 'yyyy-MM-dd'),
      endDate: format(endDate as Date, 'yyyy-MM-dd'),
    }

    try {
      const res = await api.post<PostResponseEvent>('/event', event)
      if (res.status === 200) {
        //setSuccessMessage('Event successfully created! Redirecting to the survey...')
        setSuccessMessage('Event successfully created! Redirecting to the events...')
        setOpenSnackbar(true)

        //const { eventId } = res.data.event

        setTimeout(() => {
          //router.push(`/event/create/${eventId}/survey`)
          router.push('/event')
        }, 2000)
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        showBoundary(error)
      }
      console.error(error)
    }
  }

  useLayoutEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return <Box>Loading...</Box>
  }

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
        <FormCard title='Create Event'>
          <Box component='form' onSubmit={handleSubmit}>
            <TextField
              label='Title'
              variant='outlined'
              margin='normal'
              required
              fullWidth
              name='title'
            />
            <TextField
              label='Description'
              variant='outlined'
              margin='normal'
              fullWidth
              name='description'
            />
            <TextField
              label='Room'
              variant='outlined'
              margin='normal'
              fullWidth
              name='room'
              sx={{ marginBottom: '1.5rem' }}
            />
            <Grid container spacing={2} justifyContent='center'>
              <Grid size={6}>
                <DatePicker
                  label='Start Date'
                  value={startDate}
                  onChange={(newDate) => setStartDate(newDate)}
                  disablePast
                />
              </Grid>
              <Grid size={6}>
                <DatePicker
                  label='End Date'
                  value={endDate}
                  onChange={(newDate) => setEndDate(newDate)}
                  disablePast
                  minDate={startDate as Date}
                />
              </Grid>
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <Button type='submit' color='primary' variant='contained'>
                Create Event
              </Button>
            </Box>
          </Box>
        </FormCard>
      </Grid>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity='success' sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>
    </Grid>
  )
}

export default Page
