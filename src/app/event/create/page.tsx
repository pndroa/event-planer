'use client'
import FormCard from '@/components/formCard'
import { TextField, Grid, Button, Box } from '@mui/material'
import DatePicker from '@/components/datePicker'
import { useEffect, useLayoutEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { createClient } from '@/utils/supabase/client'
import { AxiosError } from 'axios'
import { api } from '@/lib/api'
import { redirect } from 'next/navigation'
import { format } from 'date-fns'

const Page = () => {
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [isClient, setIsClient] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)

    const event = {
      trainerId: user?.id as string,
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      room: formData.get('room') as string,
      startDate: format(startDate as Date, 'yyyy-MM-dd'),
      endDate: format(endDate as Date, 'yyyy-MM-dd'),
    }

    console.log(event)

    try {
      const res = await api.post('/event', event)
      if (res.status == 200) {
        redirect('/event')
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(error)
      }
    }
  }

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const supabase = createClient()
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser()

        if (error) console.error(error)

        setUser(user)
      } catch (error) {
        console.error(error)
      }
    }
    fetchUser()
  }, [])

  useLayoutEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    //return null
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
        <FormCard variant='Event'>
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
                create Event
              </Button>
            </Box>
          </Box>
        </FormCard>
      </Grid>
    </Grid>
  )
}

export default Page
