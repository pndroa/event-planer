'use client'
import FormCard from '@/components/formCard'
import { TextField, Grid, Button, Box } from '@mui/material'
import DatePicker from '@/components/datePicker'
import { useLayoutEffect, useState /*FormEvent*/ } from 'react'
/*
import { AxiosError } from 'axios'
import { api } from '@/lib/api'
import { format } from 'date-fns'

import { useRouter } from 'next/navigation'
import { PostEvents } from '@/lib/types'
import { useErrorBoundary } from 'react-error-boundary'
import { useUser } from '@/hooks/useUser'

interface PostResponseEvent extends PostEvents {
  event: PostEvents & { eventId: string }
}
*/
const Page = () => {
  //Constants
  //const router = useRouter()
  //const user = useUser()
  //const { showBoundary } = useErrorBoundary()

  //States
  const [date, setDate] = useState<Date | null>(null)
  const [isClient, setIsClient] = useState(false)

  /*
  //Functions
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)

    const event = {
      trainerId: user?.id as string,
      title: formData.get('title') as string,
      description: (formData.get('description') as string) || null,
      room: (formData.get('room') as string) || null,
      date: format(date as Date, 'yyyy-MM-dd'),
    }

    try {
      const res = await api.post<PostResponseEvent>('/event', event)
      if (res.status === 200) {
        //const { eventId } = res.data.event
        router.push('/event')
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        showBoundary(error)
      }
      console.error(error)
    }
  }
  */
  useLayoutEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return <Box>Loading...</Box>
  }

  console.log('Hier ist des datum = ', date)

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
          <Box component='form' /*onSubmit={handleSubmit}*/>
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
                <DatePicker value={date} onChange={(newDate) => setDate(newDate)} disablePast />
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
    </Grid>
  )
}

export default Page
