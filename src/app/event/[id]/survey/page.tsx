'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Box, Typography, Paper, Stack, Button, IconButton } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer'
import { api } from '@/lib/api'
import { Survey, SurveyQuestions } from '@/lib/types'

const Page = () => {
  const { id } = useParams() as { id: string }
  const router = useRouter()
  const [surveyQuestions, setSurveyQuestions] = useState<SurveyQuestions[]>([])
  const [surveyTitle, setSurveyTitle] = useState<string>('')
  const [surveyId, setSurveyId] = useState<string>('')

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const surveyRes = await api.get<Survey>(`/survey/${id}`)
        setSurveyQuestions(surveyRes.data.surveyQuestions as SurveyQuestions[])
        setSurveyTitle(surveyRes.data.title)
        setSurveyId(surveyRes.data.surveyId)
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
      setSurveyQuestions((prev) => prev.filter((q) => q.questionId !== questionId))
    } catch (err) {
      console.error('Failed to delete question', err)
    }
  }

  const handleAnswerQuestion = async (questionId: string) => {
    try {
      const answerOptions = await api.get(`/survey/surveyQuestion/${questionId}`, {
        params: {
          answerOptions: true,
        },
      })
    } catch (err) {
      console.error('Failed to delete question', err)
    }

    return window.confirm(`Answer Question ${questionId}`)
  }

  return (
    <Box sx={{ px: 4, py: 4, ml: { md: '200px' } }}>
      <Box sx={{ maxWidth: 800, mx: 'auto' }}>
        <Typography variant='h5' gutterBottom>
          {surveyTitle}
        </Typography>

        <Stack spacing={2} sx={{ mb: 4 }}>
          {surveyQuestions.map((q) => (
            <Paper key={q.questionId} sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography>{q.questionText}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <IconButton color='primary' onClick={() => handleAnswerQuestion(q.questionId)}>
                    <QuestionAnswerIcon />
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
