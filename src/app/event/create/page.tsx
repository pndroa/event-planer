'use client'
import { FormEvent, useLayoutEffect, useState, useEffect } from 'react'
import { Box, Divider, IconButton } from '@mui/material'
import Button from '@/components/button'
import TextField from '@/components/textfield'
import AddIcon from '@mui/icons-material/Add'
import ClearIcon from '@mui/icons-material/Clear'
import FormCard from '@/components/formCard'
import DatePicker from '@/components/datePicker'
import TimePicker from '@/components/timePicker'
import { PostEventDates } from '@/lib/types'
import { format, isValid } from 'date-fns'
import { useRouter, useSearchParams } from 'next/navigation'
import { api } from '@/lib/api'

const Page = () => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [isClient, setIsClient] = useState(false)
  const [date, setDate] = useState<Date | null>(null)
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [endTime, setEndTime] = useState<Date | null>(null)
  const [eventDates, setEventDates] = useState<PostEventDates[]>([])

  const [prefilledTitle, setPrefilledTitle] = useState('')
  const [prefilledDescription, setPrefilledDescription] = useState('')

  const [error, setError] = useState(false)
  const [disabled, setDisabled] = useState(true)
  const [titleTouched, setTitleTouched] = useState(false)

  useLayoutEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    const wishId = searchParams.get('wishId')
    if (wishId) {
      const fetchWish = async () => {
        try {
          const res = await api.get(`/wish/${wishId}`)
          const wish = res.data
          const title = wish.title || ''
          const description = wish.description || ''

          setPrefilledTitle(title)
          setPrefilledDescription(description)
        } catch (error) {
          console.error('Fehler beim Laden des Wishes:', error)
        }
      }
      fetchWish()
    }
  }, [searchParams])

  useEffect(() => {
    if (prefilledTitle.trim() === '') {
      setError(true)
      setDisabled(true)
    } else {
      setError(false)
      setDisabled(false)
    }
  }, [prefilledTitle])

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
      <>
        <Divider />
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, mt: 3 }} key={index}>
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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const title = formData.get('title')
    const description = formData.get('description') || null
    const room = formData.get('room') || null
    const dates = [...eventDates]

    const finalEventDates = [
      {
        date,
        startTime,
        endTime,
      },
      ...dates,
    ]

    const payload = {
      title,
      description,
      room,
      wishId: searchParams.get('wishId') || null,
      ...(finalEventDates &&
        finalEventDates.length > 0 && {
          eventDates: finalEventDates
            .filter((entry) => entry.date !== null && isValid(entry.date))
            .map((entry) => ({
              date: format(entry.date as Date, 'yyyy-MM-dd'),
              startTime:
                entry.startTime !== null && isValid(entry.startTime)
                  ? format(entry.startTime, 'kk:mm')
                  : null,
              endTime:
                entry.endTime !== null && isValid(entry.endTime)
                  ? format(entry.endTime, 'kk:mm')
                  : null,
            })),
        }),
    }

    try {
      const response = await api.post('/event', payload)

      if (response.status === 201) {
        router.push(`/event`)
      }
    } catch (error) {
      console.error('Error creating Event:', error)
    }
  }

  return (
    <Box
      sx={{
        height: '80vh',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Box sx={{ maxWidth: 900, width: '100%', px: 3, pt: 2, pb: 3 }}>
        <FormCard title='Create Event'>
          <Box component='form' onSubmit={handleSubmit}>
            <TextField
              label='Title'
              variant='outlined'
              margin='normal'
              name='title'
              required
              error={titleTouched && error}
              value={prefilledTitle}
              onChange={(e) => {
                setPrefilledTitle(e.target.value)
                setTitleTouched(true)
              }}
            />

            <TextField
              label='Description'
              variant='outlined'
              margin='normal'
              name='description'
              minRows={3}
              multiline
              fullWidth
              value={prefilledDescription}
              onChange={(e) => setPrefilledDescription(e.target.value)}
            />
            <TextField
              label='Room'
              variant='outlined'
              margin='normal'
              name='room'
              fullWidth
              sx={{ marginBottom: '1.5rem' }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box
                sx={{
                  display: 'flex',
                  gap: { xs: 3.5, sm: 2 },
                  flexGrow: 1,
                  flexWrap: 'wrap',
                  flexDirection: { xs: 'column', sm: 'row' },
                }}
              >
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
                <AddIcon />
              </IconButton>
            </Box>
            {eventDates.map((eventDate: PostEventDates, index) =>
              dateElements(eventDate.date, eventDate.startTime, eventDate.endTime, index)
            )}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <Button type='submit' disabled={disabled}>
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
