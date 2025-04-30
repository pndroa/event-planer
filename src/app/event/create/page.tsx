'use client'

import { FormEvent, useLayoutEffect, useState } from 'react'
import { Box, TextField, Button, IconButton } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import ClearIcon from '@mui/icons-material/Clear'
import FormCard from '@/components/formCard'
import DatePicker from '@/components/datePicker'
import TimePicker from '@/components/timePicker'
import { PostEventDates } from '@/lib/types'
import { useRouter } from 'next/navigation'
import { useUser } from '@/hooks/useUser'
import { useErrorBoundary } from 'react-error-boundary'
import { api } from '@/lib/api'
import { AxiosError } from 'axios'

const Page = () => {
  const router = useRouter()
  const user = useUser()
  const { showBoundary } = useErrorBoundary()

  const [isClient, setIsClient] = useState(false)
  const [date, setDate] = useState<Date | null>(null)
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [endTime, setEndTime] = useState<Date | null>(null)
  const [eventDates, setEventDates] = useState<PostEventDates[]>([])

  useLayoutEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) return <Box>Loading...</Box>

  const handleAddButton = () => {
    setEventDates([
      ...eventDates,
      { date: null, startTime: null, endTime: null } as unknown as PostEventDates,
    ])
  }

  const handleDelete = (index: number) => {
    setEventDates(eventDates.filter((_, i) => i !== index))
  }

  const handleChange = (index: number, key: keyof PostEventDates, value: Date | null) => {
    const updated = [...eventDates]
    updated[index][key] = value
    setEventDates(updated)
  }

  const dateElements = (
    date: Date | null,
    startTime: Date | null,
    endTime: Date | null,
    index: number
  ) => {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, flexGrow: 1 }}>
          <DatePicker
            value={date}
            onChange={(newDate) => handleChange(index, 'date', newDate)}
            label='Date'
          />
          <TimePicker
            value={startTime}
            onChange={(newStartTime) => handleChange(index, 'startTime', newStartTime)}
            label='Start'
          />
          <TimePicker
            value={endTime}
            onChange={(newEndTime) => handleChange(index, 'endTime', newEndTime)}
            label='End'
          />
        </Box>

        <Box>
          <IconButton onClick={() => handleDelete(index)}>
            <ClearIcon />
          </IconButton>
        </Box>
      </Box>
    )
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const title = formData.get('title')?.toString().trim()
    const description = formData.get('description')?.toString().trim() || null
    const room = formData.get('room')?.toString().trim() || null

    const formattedDates = (eventDates || []).map((entry) => ({
      date: entry.date?.toISOString(),
      startTime: entry.startTime ? entry.startTime.toTimeString().slice(0, 5) : null,
      endTime: entry.endTime ? entry.endTime.toTimeString().slice(0, 5) : null,
    }))

    const payload = {
      trainerId: user?.id,
      title,
      description,
      room,
      eventDates: formattedDates,
    }

    try {
      const response = await api.post('/event', payload)
      if (response.status === 200) {
        router.push('/event')
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        showBoundary(error)
      }
      console.error('Fehler beim Speichern des Events:', error)
    }
  }

  return (
    <Box
      sx={{
        height: '75vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box sx={{ maxWidth: 850, width: '100%', p: 2 }}>
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
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box sx={{ display: 'flex', gap: 2, flexGrow: 1 }}>
                <DatePicker value={date} onChange={setDate} label='Date' />
                <TimePicker value={startTime} onChange={setStartTime} label='Start' />
                <TimePicker value={endTime} onChange={setEndTime} label='End' />
              </Box>
              <IconButton onClick={handleAddButton}>
                <AddIcon sx={{ marginRight: '0.2rem' }} />
              </IconButton>
            </Box>
            {eventDates.map((eventDate: PostEventDates, index) =>
              dateElements(eventDate.date, eventDate.startTime, eventDate.endTime, index)
            )}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <Button type='submit' color='primary' variant='contained'>
                Create Event
              </Button>
            </Box>
          </Box>
        </FormCard>
      </Box>
    </Box>
  )
}

export default Page
