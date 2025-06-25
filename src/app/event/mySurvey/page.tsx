'use client'

import { api } from '@/lib/api'
import { useState, useEffect } from 'react'
import { SurveyResponse } from '@/lib/types'
import {
  Box,
  Stack,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider,
  Checkbox,
  FormControlLabel,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Button from '@/components/button'
import SearchBar from '@/components/SearchBar'
import { useUser } from '@/hooks/useUser'
import { useRouter } from 'next/navigation'

const Page = () => {
  const [surveys, setSurveys] = useState<SurveyResponse[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'date'>('date')
  const [showAnswered, setShowAnswered] = useState(false)

  const user = useUser()
  const route = useRouter()

  useEffect(() => {
    const fetchSurveys = async () => {
      if (!user?.id) return
      try {
        const res = await api.get('/survey')
        setSurveys(res.data.surveys)
      } catch (error) {
        console.error('Error loading surveys:', error)
      }
    }
    fetchSurveys()
  }, [user])

  const filteredSurveys = surveys
    .filter((survey) => survey?.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((survey) => survey.answered === showAnswered)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  return (
    <Box sx={{ maxWidth: 700, mx: 'auto' }}>
      <Box
        display='flex'
        flexWrap='wrap'
        alignItems='center'
        justifyContent='space-between'
        gap={1.5}
        mb={1.5}
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

      <FormControlLabel
        control={
          <Checkbox checked={showAnswered} onChange={(e) => setShowAnswered(e.target.checked)} />
        }
        label='Show only answered surveys'
        sx={{ mb: 3 }}
      />

      <Stack spacing={3}>
        {filteredSurveys.map((survey) => (
          <Accordion key={survey.surveyId}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography sx={{ flexGrow: 1 }}>{survey.title}</Typography>
              <Chip
                label={survey.answered ? 'Answered' : 'Not Answered'}
                color={survey.answered ? 'success' : 'error'}
                size='small'
              />
            </AccordionSummary>
            <Divider />
            <AccordionDetails>
              <List dense>
                {survey.surveyQuestions.map((question, index) => (
                  <ListItem key={index} disablePadding sx={{ mb: 1 }}>
                    <ListItemText primary={question.questionText} />
                    <Chip
                      label={question.answered ? 'Answered' : 'Not Answered'}
                      color={question.answered ? 'success' : 'error'}
                      size='small'
                    />
                  </ListItem>
                ))}
              </List>
              <Box display='flex' justifyContent='flex-end' mt={2}>
                <Button onClick={() => route.push(`/event/${survey.eventId}/survey`)}>
                  To Survey
                </Button>
              </Box>
            </AccordionDetails>
          </Accordion>
        ))}
      </Stack>
    </Box>
  )
}

export default Page
