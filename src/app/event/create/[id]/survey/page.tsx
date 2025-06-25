'use client'

import SurveyForm from '@/components/surveyForm'
import { api } from '@/lib/api'
import { Box, Typography } from '@mui/material'
import Button from '@/components/button'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Question, SurveyQuestions } from '@/lib/types'
import { isValid } from 'date-fns'

type QuestionType = 'multiple' | 'text' | 'date'

const Page = () => {
  const { id: eventId } = useParams<{ id: string }>()
  const router = useRouter()
  const [questions, setQuestions] = useState<Question[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [existingQuestions, setExistingQuestions] = useState<string[]>([])
  const [surveyId, setSurveyId] = useState<string | null>(null)
  const [title, setTitle] = useState('')

  useEffect(() => {
    const fetchEvent = async () => {
      const res = await api.get(`/event/${eventId}`)
      setTitle(res.data.event.title)
    }
    fetchEvent()
  }, [eventId])

  useEffect(() => {
    const fetchExistingQuestions = async () => {
      try {
        const surveyRes = await api.get(`/survey?eventId=${eventId}`)
        const foundSurveyId = surveyRes.data.data?.surveyId

        if (foundSurveyId) {
          setSurveyId(foundSurveyId)
          const questionsRes = await api.get<{ data: SurveyQuestions[] }>(
            `/survey/surveyQuestion?surveyId=${foundSurveyId}`
          )
          const questionsFromDB: string[] = questionsRes.data.data.map((q) =>
            q.questionText.toLowerCase().trim()
          )
          setExistingQuestions(questionsFromDB)
        }
      } catch (err) {
        console.error('Error Loading Questions:', err)
      }
    }

    fetchExistingQuestions()
  }, [eventId])

  const handleAddQuestion = () => {
    setQuestions((prev) => [
      {
        type: null,
        question: '',
      },
      ...prev,
    ])
  }

  const handleSelectType = (index: number, type: QuestionType) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === index
          ? {
              ...q,
              type,
              ...(type === 'multiple' ? { options: [{ answerText: '' }, { answerText: '' }] } : {}),
              ...(type === 'date'
                ? {
                    dates: [{ answerText: null }, { answerText: null }],
                    selectedDateIndex: undefined,
                  }
                : {}),
            }
          : q
      )
    )
  }

  const handleDeleteQuestion = (index: number) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index))
  }

  const hasDuplicateQuestions = () => {
    const questionTexts = questions.map((q) => q.question.trim().toLowerCase())
    return new Set(questionTexts).size !== questionTexts.length
  }

  const hasDuplicateOptions = () => {
    return questions.some(
      (q) =>
        q.type === 'multiple' &&
        q.options!.some(
          (opt, idx, arr) =>
            arr.findIndex(
              (o) => o.answerText.trim().toLowerCase() === opt.answerText.trim().toLowerCase()
            ) !== idx
        )
    )
  }

  const hasDuplicateDates = () => {
    return questions.some((q) => {
      if (q.type !== 'date' || !q.dates) return false

      const seen = new Set<string>()

      for (const d of q.dates) {
        if (!d.answerText) continue

        const dateObj = typeof d.answerText === 'string' ? new Date(d.answerText) : d.answerText
        if (!isValid(dateObj)) continue

        const key = dateObj.toISOString().split('T')[0]

        if (seen.has(key)) return true
        seen.add(key)
      }

      return false
    })
  }

  const hasDuplicateWithExisting = () => {
    return questions.some((q) => existingQuestions.includes(q.question.trim().toLowerCase()))
  }

  const hasEmptyOptionsOrDates = () => {
    return questions.some((q) => {
      if (q.type === 'multiple') {
        return !q.options || q.options.length < 2 || q.options.some((opt) => !opt.answerText.trim())
      }
      if (q.type === 'date') {
        return !q.dates || q.dates.length < 2 || q.dates.some((d) => !d.answerText)
      }
      return false
    })
  }

  const hasDuplicateData = () =>
    hasDuplicateQuestions() ||
    hasDuplicateOptions() ||
    hasDuplicateDates() ||
    hasDuplicateWithExisting()

  const handleSaveSurvey = async () => {
    setIsSaving(true)
    try {
      let finalSurveyId = surveyId

      if (!finalSurveyId) {
        const survey = await api.post('/survey/', { eventId })
        finalSurveyId = survey.data.data.surveyId
        setSurveyId(finalSurveyId)
      }

      await Promise.all(
        questions.map(async (q: Question) => {
          const questionPayload = {
            questionText: q.question,
            surveyId: finalSurveyId,
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
                  answerText: new Date(date.answerText as Date).toISOString().split('T')[0],
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
    <Box sx={{ px: 2, py: 4, mx: 'auto' }}>
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
              Create new Questions for Event: {title}
            </Typography>
            <Button onClick={handleAddQuestion}>Add Question</Button>
          </Box>
          <Button
            color='green'
            onClick={handleSaveSurvey}
            disabled={
              isSaving ||
              questions.length === 0 ||
              questions.some((q) => !q.question.trim()) ||
              hasDuplicateData() ||
              hasEmptyOptionsOrDates()
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
          existingQuestions={existingQuestions}
        />
      </Box>
    </Box>
  )
}

export default Page
