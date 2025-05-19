'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  Box,
  Typography,
  Paper,
  Stack,
  Chip,
  Button,
  IconButton,
  CircularProgress,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import { api } from '@/lib/api'
import { fetchUser } from '@/lib/user'
import EditIcon from '@mui/icons-material/Edit'

interface Question {
  questionId: string
  surveyId: string
  questionText: string
}

const Page = () => {
  const { id } = useParams() as { id: string }
  const router = useRouter()
  const [questions, setQuestions] = useState<Question[]>([])
  const [surveyTitle, setSurveyTitle] = useState<string>('')
  const [surveyId, setSurveyId] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchQuestionsAndCheckTrainer = async () => {
      setLoading(true)
      try {
        const user = await fetchUser()
        const res = await api.get(`/survey/${id}`)
        const eventRes = await api.get(`/event/${id}`)
        const trainerId = eventRes.data.event.trainerId

        if (!user || user.id !== trainerId) {
          router.back()
          return
        }

        setQuestions(res.data.survey.surveyQuestions)
        setSurveyTitle(res.data.survey.title)
        setSurveyId(res.data.survey.surveyId)
      } catch (err) {
        console.error('Failed to load questions', err)
      }
      setLoading(false)
    }

    fetchQuestionsAndCheckTrainer()
  }, [id, router])

  const handleDeleteSurvey = async () => {
    const confirm = window.confirm('Are you sure you want to delete this survey?')
    if (!confirm) return

    try {
      await api.delete(`/survey/${surveyId}`)
      router.push('/event')
    } catch (err) {
      console.error('Failed to delete survey', err)
    }
  }

  const handleDeleteQuestion = async (questionId: string) => {
    const confirm = window.confirm('Delete this question?')
    if (!confirm) return

    try {
      await api.delete(`/survey/surveyQuestion/${questionId}`)
      setQuestions((prev) => prev.filter((q) => q.questionId !== questionId))
    } catch (err) {
      console.error('Failed to delete question', err)
    }
  }

  if (loading) {
    return (
      <Box
        sx={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <CircularProgress size={44} />
      </Box>
    )
  }

  return (
    <Box sx={{ px: 4, py: 4, ml: { md: '200px' } }}>
      <Box sx={{ maxWidth: 800, mx: 'auto' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant='h5' gutterBottom>
            {surveyTitle}
          </Typography>
          <Button
            variant='contained'
            startIcon={<AddIcon />}
            onClick={() => router.push(`/event/create/${id}/survey`)}
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
          >
            Create Questions
          </Button>
        </Box>

        <Stack spacing={2} sx={{ mb: 4 }}>
          {questions.length === 0 ? (
            <Box
              sx={{
                p: 4,
                background: '#f7fafd',
                color: '#555',
                borderRadius: 2,
                fontStyle: 'italic',
                textAlign: 'center',
                border: '1px dashed #d3e0ee',
              }}
            >
              No questions yet...
            </Box>
          ) : (
            questions.map((q) => (
              <Paper key={q.questionId} sx={{ p: 2 }}>
                <Box
                  sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <Typography>{q.questionText}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip size='small' variant='outlined' label='Question' />
                    <IconButton color='error' onClick={() => handleDeleteQuestion(q.questionId)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
              </Paper>
            ))
          )}
        </Stack>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button color='error' variant='contained' onClick={handleDeleteSurvey}>
            Delete Survey
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export default Page
