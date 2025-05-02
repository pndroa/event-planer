'use client'
import { api } from '@/lib/api'
import { useState, useEffect } from 'react'
import { Survey } from '@/lib/types'
import { Box, Stack, Button, MenuItem, Select, InputLabel, FormControl } from '@mui/material'
import SearchBar from '@/components/SearchBar'
import TopNavigation from '@/components/TopNavigation'
import { useErrorBoundary } from 'react-error-boundary'
import Link from 'next/link'
import WishCard from '@/components/WishCard'
import { Typography } from '@mui/material'

const dummySurveys: Survey[] = [
  {
    surveyId: '1a2b3c4d-1234-5678-9012-abcdefabcdef',
    eventId: 'abc12345-def6-7890-abcd-1234567890ef',
    title: 'Kundenzufriedenheit April 2025',
    created_at: '2025-04-25T10:00:00Z',
    surveyQuestions: [],
    Events: {
      eventId: 'abc12345-def6-7890-abcd-1234567890ef',
      title: 'April Umfrage Event',
      description: 'Feedback zur Dienstleistungsqualität im April',
      room: 'Konferenzraum A',
      startDate: new Date('2025-04-20T09:00:00Z'),
      endDate: new Date('2025-04-20T11:00:00Z'),
      createdAt: '2025-04-01T08:00:00Z',
      trainerId: 'trainer123',
      eventParticipation: [],
      users: {
        userId: 'user001',
        name: 'Max Mustermann',
        email: 'max@example.com',
      },
    },
  },
  {
    surveyId: '9f8e7d6c-4321-8765-4321-fedcbafedcba',
    eventId: 'def67890-1234-5678-90ab-fedcba987654',
    title: 'Produktfeedback Mai 2025',
    created_at: '2025-05-01T14:30:00Z',
    surveyQuestions: [],
    Events: {
      eventId: 'def67890-1234-5678-90ab-fedcba987654',
      title: 'Mai Produktumfrage',
      description: 'Rückmeldung zur neuen Produktlinie',
      room: 'Online',
      startDate: new Date('2025-05-01T13:00:00Z'),
      endDate: new Date('2025-05-01T14:00:00Z'),
      createdAt: '2025-04-10T10:00:00Z',
      trainerId: 'trainer456',
      eventParticipation: [],
      users: {
        userId: 'user002',
        name: 'Erika Musterfrau',
        email: 'erika@example.com',
      },
    },
  },
]

const Page = () => {
  const [surveys, setSurveys] = useState<Survey[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'date'>('date')

  useEffect(() => {
    setSurveys(dummySurveys)
    console.log(surveys)
  }, [])

  const filteredSurveys = surveys
    .filter((survey) => survey.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  return (
    <Box sx={{ padding: 4, maxWidth: 700, mx: 'auto' }}>
      <Typography variant='h4' component='h1' gutterBottom>
        My Surveys
      </Typography>
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
      </Box>

      {/* Feed */}
      <Stack spacing={2}>
        {filteredSurveys.map((survey) => (
          <WishCard
            key={survey.surveyId}
            username={survey.Events.users.name}
            title={survey.title}
            createdAt={survey.created_at}
            actionButton={
              <Button variant='contained' size='small' sx={{ height: '40px' }}>
                Participate
              </Button>
            }
          />
        ))}
      </Stack>
    </Box>
  )
}

export default Page
