'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Box, Typography, Paper, Stack, IconButton, CircularProgress } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer'
import { api } from '@/lib/api'
import { fetchUser } from '@/lib/user'
import { SurveyQuestions } from '@/lib/types'
import SurveyAnswerCard from '@/components/surveyAnswerCard'
import Button from '@/components/button'

const Page = () => {
  const { id } = useParams() as { id: string }
  const router = useRouter()
  const [surveyQuestions, setSurveyQuestions] = useState<SurveyQuestions[]>([])
  const [surveyTitle, setSurveyTitle] = useState<string>('Survey not started')
  const [surveyId, setSurveyId] = useState<string>('')
  const [loading, setLoading] = useState(true)

  const [activeAnswerId, setActiveAnswerId] = useState<string | null>(null)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [userId, setUserId] = useState<string>()
  const [trainerId, setTrainerId] = useState<string | null>(null)

  useEffect(() => {
    const fetchSurveyData = async () => {
      setLoading(true)
      try {
        const user = await fetchUser()
        const res = await api.get(`/survey/${id}`)
        const eventRes = await api.get(`/event/${id}`)
        const eventTrainerId = eventRes.data.event.trainerId

        setUserId(user?.id as string)
        setTrainerId(eventTrainerId)

        setSurveyQuestions(res.data.surveyQuestions)
        setSurveyTitle(res.data.title)
        setSurveyId(res.data.surveyId)

        const answerRes = await api.get(`/survey/surveyAnswer/${res.data.surveyId}`)
        const mappedAnswers = Object.fromEntries(
          answerRes.data.map((a: { questionId: string; answer: string }) => [
            a.questionId,
            a.answer,
          ])
        )
        setAnswers(mappedAnswers)
      } catch (err) {
        console.error('Failed to load questions or answers', err)
      }
      setLoading(false)
    }

    fetchSurveyData()
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

  const handleEditQuestion = (questionId: string) => {
    router.push(`survey/edit?questionId=${questionId}`)
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
          {userId === trainerId && (
            <Button
              startIcon={<AddIcon />}
              onClick={() => router.push(`/event/create/${id}/survey`)}
              sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
            >
              Create Survey
            </Button>
          )}
        </Box>

        <Stack spacing={2} sx={{ mb: 4 }}>
          {surveyQuestions.length === 0 ? (
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
            surveyQuestions.map((q) => (
              <Box key={q.questionId}>
                <Paper sx={{ p: 2 }}>
                  <Box
                    sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                  >
                    <Typography>{q.questionText}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <IconButton
                        onClick={() =>
                          setActiveAnswerId(activeAnswerId === q.questionId ? null : q.questionId)
                        }
                      >
                        <QuestionAnswerIcon />
                      </IconButton>
                      {userId === trainerId && (
                        <>
                          <IconButton onClick={() => handleEditQuestion(q.questionId)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            color='error'
                            onClick={() => handleDeleteQuestion(q.questionId)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </>
                      )}
                    </Box>
                  </Box>
                </Paper>

                {activeAnswerId === q.questionId && (
                  <SurveyAnswerCard
                    question={q}
                    currentAnswer={answers[q.questionId] || ''}
                    setAnswer={(val: string) =>
                      setAnswers((prev) => ({ ...prev, [q.questionId]: val }))
                    }
                  />
                )}
              </Box>
            ))
          )}
        </Stack>

        {userId === trainerId && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button color='red' variant='contained' onClick={handleDeleteSurvey}>
              Delete Survey
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default Page
