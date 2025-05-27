'use client'
import { api } from '@/lib/api'
import { useState, useEffect } from 'react'
import { Survey } from '@/lib/types'
import { Box, Stack, MenuItem, Select, InputLabel, FormControl } from '@mui/material'
import Button from '@/components/button'
import SearchBar from '@/components/SearchBar'
import { useErrorBoundary } from 'react-error-boundary'
import { useUser } from '@/hooks/useUser'
import SurveyCard from '@/components/SurveyCard'
import { useRouter } from 'next/navigation'

const Page = () => {
  const [surveys, setSurveys] = useState<Survey[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'date'>('date')
  const user = useUser()
  const route = useRouter()
  const { showBoundary } = useErrorBoundary()

  useEffect(() => {
    const fetchSurveys = async () => {
      if (!user?.id) return
      try {
        const res = await api.get('/survey')

        setSurveys(res.data.notAnsweredSurveys)
      } catch (error) {
        console.error('Error loading surveys:', error)
        showBoundary(error)
      }
    }
    fetchSurveys()
  }, [showBoundary, user])

  const filteredSurveys = surveys
    .filter((survey) => survey?.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  return (
    <Box sx={{ maxWidth: 700, mx: 'auto' }}>
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
      </Box>

      <Stack spacing={2}>
        {filteredSurveys.map((survey) => (
          <SurveyCard
            key={survey.surveyId}
            title={survey.title}
            createdAt={survey.created_at}
            actionButton={
              <Button onClick={() => route.push(`/event/${survey.eventId}/survey`)}>Answer</Button>
            }
          />
        ))}
      </Stack>
    </Box>
  )
}

export default Page
