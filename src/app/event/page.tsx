'use client'

import { useEffect, useState } from 'react'
import { Box, Stack, Button, MenuItem, Select, InputLabel, FormControl } from '@mui/material'
import { api } from '@/lib/api'
import EventCard from '@/components/EventCard'
import SearchBar from '@/components/SearchBar'
import TopNavigation from '@/components/TopNavigation'
import { Events } from '@/lib/types'
import Link from 'next/link'

export default function EventFeed() {
  const [events, setEvents] = useState<Events[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'date'>('date')

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get('/event')
        console.log(res.data)
        setEvents(res.data)
      } catch (error) {
        console.error('Error loading events:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  const filteredEvents = events
    .filter((event) => event.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  if (loading) return <p>Loading events...</p>

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
              <MenuItem value='date'>Newest</MenuItem>
            </Select>
          </FormControl>
          <Link href='/event/create' style={{ textDecoration: 'none', color: 'inherit' }}>
            <Button variant='contained' size='small' sx={{ height: '40px' }}>
              + CREATE EVENT
            </Button>{' '}
          </Link>
        </Box>

        {/* Feed */}
        <Stack spacing={2}>
          {filteredEvents.map((event) => (
            <EventCard
              key={event.eventId}
              eventId={event.eventId}
              username={event.users.name}
              title={event.title}
              createdAt={event.createdAt}
            />
          ))}
        </Stack>
      </Box>
    </>
  )
}
