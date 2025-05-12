'use client'

import SurveyForm from '@/components/surveyForm'
import { api } from '@/lib/api'
import { Box, Button, Typography } from '@mui/material'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

type QuestionType = 'multiple' | 'text' | 'date'

type Question = {
  type: QuestionType | null
  question: string
  options?: string[]
  dates?: (Date | null)[]
  selectedDateIndex?: number
}

const Page = () => {
  const { id } = useParams() as { id: string }
  const router = useRouter()
  const [surveyTitle, setSurveyTitle] = useState<string>('')
  const [surveyId, setSurveyId] = useState<string>('')
  const [questions, setQuestions] = useState<Question[]>([])
  const [isSaving, setIsSaving] = useState<boolean>(false)

  useEffect(() => {
    const fetchSurvey = async () => {
      const res = await api.get(`/survey/${id}`)
      setSurveyTitle(res.data.survey.title)
      setSurveyId(res.data.survey.surveyId)
    }
    fetchSurvey()
  }, [id])

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
              ...(type === 'multiple' ? { options: [''] } : {}),
              ...(type === 'date' ? { dates: [null], selectedDateIndex: undefined } : {}),
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

    const validQuestions = questions.filter((q) => q.type !== null && q.question.trim() !== '')

    try {
      await Promise.all(
        validQuestions.map((q) =>
          api.post('/survey/surveyQuestion', {
            surveyId,
            questionText: q.question.trim(),
          })
        )
      )
      alert('All questions saved successfully.')
      router.push(`/event/${id}/survey`)
    } catch (err) {
      console.error(err)
      alert('An error occurred while saving.')
    } finally {
      setIsSaving(false)
    }
  }

  const hasValidQuestions = questions.some((q) => q.type !== null && q.question.trim() !== '')

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
              {surveyTitle}
            </Typography>
            <Button variant='contained' onClick={handleAddQuestion}>
              Add Question
            </Button>
          </Box>
          <Button
            variant='outlined'
            color='success'
            onClick={handleSaveSurvey}
            disabled={isSaving || !hasValidQuestions}
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
