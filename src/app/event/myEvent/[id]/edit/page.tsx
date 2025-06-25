'use client'
import { FormEvent, useLayoutEffect, useState } from 'react'
import { Box, Divider, IconButton } from '@mui/material'
import Button from '@/components/button'
import TextField from '@/components/textfield'
import AddIcon from '@mui/icons-material/Add'
import ClearIcon from '@mui/icons-material/Clear'
import FormCard from '@/components/formCard'
import { PostEventDates } from '@/lib/types'
import { format, isValid } from 'date-fns'
import { useRouter } from 'next/navigation'
import { useUser } from '@/hooks/useUser'
import { api } from '@/lib/api'
import { useEffect } from 'react'
import { useParams } from 'next/navigation'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { PostEventDatesUpdate } from '@/lib/types'
import dynamic from 'next/dynamic'

const DatePicker = dynamic(() => import('@/components/datePicker'), {
  ssr: false,
})

const TimePicker = dynamic(() => import('@/components/timePicker'), {
  ssr: false,
})

dayjs.extend(customParseFormat)

const Page = () => {
  const router = useRouter()
  const user = useUser()
  const [_isClient, setIsClient] = useState(false)
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
      <>
        <Divider />
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, mt: 3 }} key={index}>
          <Divider />
          <Box
            sx={{
              display: 'flex',
              gap: { xs: 3.5, sm: 2 },
              flexGrow: 1,
              flexWrap: 'wrap',
              flexDirection: { xs: 'column', sm: 'row' },
            }}
          >
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
      </>
    )
  }

  const isFormValid = () => {
    if (!title.trim()) return false

    if (eventDates.length === 0) return false

    return eventDates.every(
      (entry) =>
        entry.date &&
        entry.startTime &&
        entry.endTime &&
        isValid(entry.date) &&
        isValid(entry.startTime) &&
        isValid(entry.endTime)
    )
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const title = formData.get('title')
    const description = formData.get('description') || null
    const room = formData.get('room') || null

    const finalEventDates = [...eventDates]

    const payload = {
      trainerId: user?.id as string,
      title,
      description,
      room,
      eventDates: finalEventDates.map((entry) => ({
        ...(entry.id ? { id: entry.id } : {}),
        date: format(entry.date as Date, 'yyyy-MM-dd'),
        startTime:
          entry.startTime != null && isValid(entry.startTime)
            ? format(entry.startTime, 'kk:mm')
            : null,
        endTime:
          entry.endTime != null && isValid(entry.endTime) ? format(entry.endTime, 'kk:mm') : null,
      })),
      eventDatesToCompare: eventDatesToCompare.map((entry) => ({
        ...(entry.id ? { id: entry.id } : {}),
        date: format(entry.date as Date, 'yyyy-MM-dd'),
        startTime:
          entry.startTime != null && isValid(entry.startTime)
            ? format(entry.startTime, 'kk:mm')
            : null,
        endTime:
          entry.endTime != null && isValid(entry.endTime) ? format(entry.endTime, 'kk:mm') : null,
      })),
    }

    try {
      const response = await api.patch(`/event/${id}`, payload)
      if (response.status === 201) {
        router.push(`/event/${id}`)
      }
    } catch (error) {
      console.error('Error updating Event:', error)
    }
  }

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get(`/event/${id}`)

        setTitle(res.data.event.title ?? '')
        setDescription(res.data.event.description ?? '')
        setRoom(res.data.event.room ?? '')

        type RawEventDate = {
          date: string
          startTime: string
          endTime: string
          dateId: string | number
        }
        console.log(res.data.event.eventDates)

        const convertedDates = res.data.event.eventDates.map((eventDate: RawEventDate) => ({
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
  }, [id])

  return (
    <Box
      sx={{
        height: '80vh',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Box sx={{ maxWidth: 900, width: '100%', px: 3, pt: 2, pb: 3 }}>
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

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, mb: 2 }}>
              <IconButton onClick={handleAddButton}>
                <AddIcon />
              </IconButton>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <Button type='submit' disabled={!isFormValid()}>
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
