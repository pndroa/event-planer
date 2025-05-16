'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Box, Typography, Paper, Stack, Chip, Button, IconButton } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { api } from '@/lib/api'
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

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await api.get(`/survey/${id}`)
        setQuestions(res.data.survey.surveyQuestions)
        setSurveyTitle(res.data.survey.title)
        setSurveyId(res.data.survey.surveyId)
      } catch (err) {
        console.error('Failed to load questions', err)
      }
    }

    fetchQuestions()
  }, [id])

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

  const handleEditQuestion = async (questionId: string) => {
    router.push(`survey/edit?questionId=${questionId}`)
  }

  return (
    <Box sx={{ px: 4, py: 4, ml: { md: '200px' } }}>
      <Box sx={{ maxWidth: 800, mx: 'auto' }}>
        <Typography variant='h5' gutterBottom>
          Questions for {surveyTitle}
        </Typography>

        <Stack spacing={2} sx={{ mb: 4 }}>
          {questions.map((q) => (
            <Paper key={q.questionId} sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography>{q.questionText}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip size='small' variant='outlined' label='Question' />
                  <IconButton onClick={() => handleEditQuestion(q.questionId)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color='error' onClick={() => handleDeleteQuestion(q.questionId)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
            </Paper>
          ))}
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
