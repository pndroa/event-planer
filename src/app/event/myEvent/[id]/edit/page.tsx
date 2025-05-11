'use client'
import { FormEvent, useLayoutEffect, useState } from 'react'
import { Box, Button, IconButton } from '@mui/material'
import TextField from '@/components/textfield'
import AddIcon from '@mui/icons-material/Add'
import ClearIcon from '@mui/icons-material/Clear'
import FormCard from '@/components/formCard'
import DatePicker from '@/components/datePicker'
import TimePicker from '@/components/timePicker'
import { PostEventDates } from '@/lib/types'
import { format } from 'date-fns'
import { useRouter } from 'next/navigation'
import { useUser } from '@/hooks/useUser'
import { useErrorBoundary } from 'react-error-boundary'
import { api } from '@/lib/api'
import { AxiosError } from 'axios'
import { useEffect } from 'react'
import { useParams } from 'next/navigation'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { PostEventDatesUpdate } from '@/lib/types'

dayjs.extend(customParseFormat)

const Page = () => {
  const router = useRouter()
  const user = useUser()
  const { showBoundary } = useErrorBoundary()
  const [isClient, setIsClient] = useState(false)
  const [date, setDate] = useState<Date | null>(null)
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [endTime, setEndTime] = useState<Date | null>(null)
  const [eventDates, setEventDates] = useState<PostEventDatesUpdate[]>([])
  const [eventDatesToCompare, setEventDatesToCompare] = useState<PostEventDatesUpdate[]>([])
  const { id } = useParams()
  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [room, setRoom] = useState<string>('')

  useLayoutEffect(() => {
    setIsClient(true)
  }, [])

  const handleAddButton = () => {
    setEventDates([
      ...eventDates,
      { date: null, startTime: null, endTime: null } as unknown as PostEventDatesUpdate,
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
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }} key={index}>
        <Box sx={{ display: 'flex', gap: 2, flexGrow: 1, flexWrap: 'wrap' }}>
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
    const title = formData.get('title')
    const description = formData.get('description') || null
    const room = formData.get('room') || null

    const finalEventDates = [
      ...(date && startTime && endTime ? [{ date, startTime, endTime }] : []),
      ...eventDates,
    ]

    const payload = {
      trainerId: user?.id as string,
      title,
      description,
      room,
      eventDates: finalEventDates.map((entry) => ({
        ...(entry.id ? { id: entry.id } : {}),
        date: format(entry.date as Date, 'yyyy-MM-dd'),
        startTime: entry.startTime ? format(entry.startTime, 'kk:mm') : null,
        endTime: entry.endTime ? format(entry.endTime, 'kk:mm') : null,
      })),
      eventDatesToCompare: eventDatesToCompare.map((entry) => ({
        ...(entry.id ? { id: entry.id } : {}),
        date: format(entry.date as Date, 'yyyy-MM-dd'),
        startTime: entry.startTime ? format(entry.startTime, 'kk:mm') : null,
        endTime: entry.endTime ? format(entry.endTime, 'kk:mm') : null,
      })),
    }

    try {
      const response = await api.patch(`/event/${id}`, payload)
      if (response.status === 201) {
        router.push('/event')
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        showBoundary(error)
      }
      console.error('Error creating Event:', error)
    }
  }

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get(`/event/${id}`)

        setTitle(res.data.event.title ?? '')
        setDescription(res.data.event.description ?? '')
        setRoom(res.data.event.room ?? '')

        const convertedDates = res.data.event.eventDates.map((eventDate: any) => ({
          date: new Date(eventDate.date),
          startTime: dayjs(eventDate.startTime, 'HH:mm').toDate(),
          endTime: dayjs(eventDate.endTime, 'HH:mm').toDate(),
          id: eventDate.dateId,
        }))

        setEventDatesToCompare(convertedDates)
        setEventDates(convertedDates)
      } catch (error) {
        console.error('Error loading events:', error)
      }
    }
    fetchEvents()
  }, [])

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
        <FormCard title='Edit Event'>
          <Box component='form' onSubmit={handleSubmit}>
            <TextField
              label='Title'
              variant='outlined'
              margin='normal'
              name='title'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label='Description'
              variant='outlined'
              margin='normal'
              name='description'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              minRows={3}
              multiline
              fullWidth
            />
            <TextField
              label='Room'
              variant='outlined'
              margin='normal'
              name='room'
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              fullWidth
              sx={{ marginBottom: '1.5rem' }}
            />
            {eventDates.map((eventDate: PostEventDates, index) =>
              dateElements(eventDate.date, eventDate.startTime, eventDate.endTime, index)
            )}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box sx={{ display: 'flex', gap: 2, flexGrow: 1, flexWrap: 'wrap' }}>
                <DatePicker value={date} onChange={(newDate) => setDate(newDate)} label='Date' />
                <TimePicker
                  value={startTime}
                  onChange={(newStartTime) => setStartTime(newStartTime)}
                  label='Start'
                />
                <TimePicker
                  value={endTime}
                  onChange={(newEndTime) => setEndTime(newEndTime)}
                  label='End'
                />
              </Box>
              <IconButton onClick={handleAddButton}>
                <AddIcon sx={{ marginRight: '0.2rem' }} />
              </IconButton>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <Button type='submit' color='primary' variant='contained'>
                Save changes
              </Button>
            </Box>
          </Box>
        </FormCard>
      </Box>
    </Box>
  )
}

export default Page
