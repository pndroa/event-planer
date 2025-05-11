'use client'

import { useEffect, useState } from 'react'
import {
  Box,
  Stack,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  FormControlLabel,
  Checkbox,
} from '@mui/material'
import { api } from '@/lib/api'
import EventCard from '@/components/EventCard'
import SearchBar from '@/components/SearchBar'
import TopNavigation from '@/components/TopNavigation'
import Link from 'next/link'
import { Events } from '@/lib/types'
import { fetchUser } from '@/lib/user'
export default function EventFeed() {
  const [events, setEvents] = useState<Events[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'date'>('date')
  const [onlyMine, setOnlyMine] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [onlyParticipating, setOnlyParticipating] = useState(false)

  const handleParticipationChange = (eventId: string, joined: boolean) => {
    setEvents((prev) => prev.map((e) => (e.eventId === eventId ? { ...e, joined } : e)))
  }

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const user = await fetchUser()
        setUserId(user?.id ?? null)

        const res = await api.get('/event')
        setEvents(res.data)
      } catch (error) {
        console.error('Error loading events:', error)
      }
    }

    fetchEvents()
  }, [])

  const filteredEvents = events
    .filter((event) => event.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .filter((e) => {
      if (!onlyMine && !onlyParticipating) return true
      if (onlyMine && e.trainerId === userId) return true
      if (onlyParticipating && e.joined) return true
      return false
    })
  return (
    <>
      <Box sx={{ padding: 4, maxWidth: 700, mx: 'auto' }}>
        <Box>
          <TopNavigation />
        </Box>
        <Box
          display='flex'
          flexWrap='wrap'
          alignItems='center'
          justifyContent='space-between'
          gap={1.5}
          mb={3}
        >
          <SearchBar searchTerm={searchTerm} onSearchTermChange={setSearchTerm} />
          <FormControl size='small' sx={{ minWidth: 140 }}>
            <InputLabel id='sort-label'>Sort by</InputLabel>
            <Select
              labelId='sort-label'
              value={sortBy}
              label='Sort by'
              onChange={(e) => setSortBy(e.target.value as 'date')}
            >
              <MenuItem value='date'>Latest</MenuItem>
            </Select>
          </FormControl>
          <Link href='/event/create' style={{ textDecoration: 'none', color: 'inherit' }}>
            <Button variant='contained' size='small' sx={{ height: '40px' }}>
              + CREATE EVENT
            </Button>
          </Link>
        </Box>

        <FormControlLabel
          control={<Checkbox checked={onlyMine} onChange={(e) => setOnlyMine(e.target.checked)} />}
          label='Show created Events only'
          sx={{ marginLeft: 0, marginRight: 0 }}
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={onlyParticipating}
              onChange={(e) => setOnlyParticipating(e.target.checked)}
              disabled={!userId}
            />
          }
          label='Show participating events only'
          sx={{ marginLeft: 0, marginRight: 0 }}
        />

        <Stack spacing={2}>
          {filteredEvents.map((event) => (
            <EventCard
              key={event.eventId}
              eventId={event.eventId}
              username={event.users.name}
              title={event.title}
              createdAt={event.createdAt}
              initialJoined={event.joined}
              onParticipationChange={handleParticipationChange}
            />
          ))}
        </Stack>
      </Box>
    </>
  )
}
