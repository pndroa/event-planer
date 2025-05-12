'use client'

import SurveyForm from '@/components/surveyForm'
import { api } from '@/lib/api'
import { Box, Button, Typography } from '@mui/material'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

type QuestionType = 'multiple' | 'text' | 'date'

type Question = {
  type: QuestionType | null
  question: string
  options?: string[]
  dates?: (Date | null)[]
}

const Page = () => {
  const { id } = useParams() as { id: string } // UUID aus URL
  const [surveyTitle, setSurveyTitle] = useState<string>('')
  const [surveyId, setSurveyId] = useState<string>('') // echte DB-ID
  const [questions, setQuestions] = useState<Question[]>([])
  const [isSaving, setIsSaving] = useState<boolean>(false)

  useEffect(() => {
    const fetchSurvey = async () => {
      const res = await api.get(`/survey/${id}`)
      setSurveyTitle(res.data.survey.title)
      setSurveyId(res.data.survey.surveyId) // UUID von der DB
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
              ...(type === 'date' ? { dates: [new Date()] } : {}),
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
      await Promise.all(
        questions.map((q) =>
          api.post('/survey/surveyQuestion', {
            surveyId,
            questionText: q.question,
          })
        )
      )
      alert('Alle Fragen erfolgreich gespeichert!')
    } catch (err) {
      console.error(err)
      alert('Fehler beim Speichern einer oder mehrerer Fragen!')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Box sx={{ px: 2, py: 4 }}>
      <Box
        sx={{
          maxWidth: 800,
          ml: '27rem',
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
        }}
      >
        {/* Header */}
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
            disabled={isSaving || questions.length === 0}
          >
            {isSaving ? 'Speichern...' : 'Speichern'}
          </Button>
        </Box>

        {/* Fragen */}
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
