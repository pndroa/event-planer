'use client'

import SurveyForm from '@/components/surveyForm'
import { api } from '@/lib/api'
import { Box, Typography } from '@mui/material'
import Button from '@/components/button'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { Question } from '@/lib/types'

type QuestionType = 'multiple' | 'text' | 'date'

const Page = () => {
  const { id: eventId } = useParams<{ id: string }>()
  const router = useRouter()
  const [questions, setQuestions] = useState<Question[]>([])
  const [isSaving, setIsSaving] = useState<boolean>(false)

  const handleAddQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        type: null,
        question: '',
      },
    ])
  }

  const handleSelectType = (index: number, type: QuestionType) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === index
          ? {
              ...q,
              type,
              ...(type === 'multiple' ? { options: [] } : {}),
              ...(type === 'date' ? { dates: [], selectedDateIndex: undefined } : {}),
            }
          : q
      )
    )
  }

  const handleDeleteQuestion = (index: number) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSaveSurvey = async () => {
    setIsSaving(true)

    try {
      const survey = await api.post('/survey/', { eventId })
      const surveyId = survey.data.data.surveyId

      await Promise.all(
        questions.map(async (q: Question) => {
          const questionPayload = {
            questionText: q.question,
            surveyId,
            type: q.type,
          }

          const questionsRes = await api.post('/survey/surveyQuestion', questionPayload)
          const { questionId } = questionsRes.data.data

          if (q.type === 'multiple' && Array.isArray(q.options)) {
            await Promise.all(
              q.options.map((option) => {
                const answerPayload = {
                  questionId,
                  answerText: option.answerText,
                }
                return api.post('/survey/surveyAnswerOption', answerPayload)
              })
            )
          }

          if (q.type === 'date' && Array.isArray(q.dates)) {
            await Promise.all(
              q.dates.map((date) => {
                const datePayload = {
                  questionId,
                  answerText: new Date(date.answerText as string).toISOString().split('T')[0],
                }
                return api.post('/survey/surveyAnswerOption', datePayload)
              })
            )
          }

          if (q.type === 'text') {
            const textPayload = {
              questionId,
              answerText: 'add question',
            }
            await api.post('/survey/surveyAnswerOption', textPayload)
          }
        })
      )

      router.push(`/event/${eventId}/survey`)
    } catch (err) {
      console.error('Fehler beim Speichern:', err)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Box sx={{ px: 2, py: 4, ml: { md: '160px' } }}>
      <Box
        sx={{
          maxWidth: 800,
          mx: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box>
            <Typography variant='h5' gutterBottom>
              Create new Survey
            </Typography>
            <Button onClick={handleAddQuestion}>Add Question</Button>
          </Box>
          <Button
            color='green'
            onClick={handleSaveSurvey}
            disabled={
              isSaving || questions.length === 0 || questions.some((q) => !q.question.trim())
            }
          >
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </Box>

        <SurveyForm
          questions={questions}
          setQuestions={setQuestions}
          onSelectType={handleSelectType}
          onDeleteQuestion={handleDeleteQuestion}
        />
      </Box>
    </Box>
  )
}

export default Page
