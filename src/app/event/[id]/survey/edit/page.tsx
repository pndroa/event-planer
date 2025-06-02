'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Box, Typography } from '@mui/material'
import { api } from '@/lib/api'
import SurveyForm from '@/components/surveyForm'
import { Question, multipleChoiceOption, multipleDateOption } from '@/lib/types'

const Page = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const questionId = searchParams.get('questionId')

  const [question, setQuestion] = useState<Question[]>([])
  const [oldAnswerOptions, setOldAnswerOptions] = useState<
    multipleChoiceOption[] | multipleDateOption[]
  >([])

  // Lade Frage-Daten für Bearbeitung
  useEffect(() => {
    const fetchQuestion = async () => {
      if (!questionId) return

      try {
        const res = await api.get(`/survey/surveyQuestion/${questionId}`, {
          params: { answerOptions: true },
        })

        if (res.status !== 200) {
          console.error('Failed to load question:', res)
          return
        }

        const { question: q } = res.data
        setOldAnswerOptions(q.surveyAnswerOptions)

        setQuestion([
          {
            questionId: q.questionId,
            type: q.type,
            question: q.questionText,
            ...(q.type === 'multiple'
              ? {
                  options:
                    q.surveyAnswerOptions.length >= 2
                      ? q.surveyAnswerOptions
                      : [{ answerText: '' }, { answerText: '' }],
                }
              : q.type === 'date'
                ? {
                    dates:
                      q.surveyAnswerOptions.length >= 2
                        ? q.surveyAnswerOptions
                        : [{ answerText: null }, { answerText: null }],
                  }
                : {}),
          },
        ])
      } catch (err) {
        console.error('Failed to load question:', err)
      }
    }

    fetchQuestion()
  }, [questionId])

  // Speichern der Änderungen
  const handleEditQuestion = async (editedQuestion: Question) => {
    try {
      const payload = {
        questionText: editedQuestion.question,
        options: editedQuestion.options,
        dates: editedQuestion.dates,
      }

      const res = await api.patch(`/survey/surveyQuestion/${editedQuestion.questionId}`, payload)
      if (res.status !== 200) throw new Error('Failed to update question')

      // Alle Antworten zu dieser Frage löschen
      await api.delete('/survey/surveyAnswer', {
        params: { questionId: editedQuestion.questionId },
      })

      if (editedQuestion.type === 'multiple' && editedQuestion.options) {
        const deletedOptions = oldAnswerOptions.filter(
          (oldOpt) =>
            !editedQuestion.options?.some(
              (newOpt) => newOpt.answerOptionsId === oldOpt.answerOptionsId
            )
        )

        const updatePromises = editedQuestion.options.map((option) => {
          const answerPayload = {
            questionId: editedQuestion.questionId,
            answerText: option.answerText,
          }

          if (!option.answerOptionsId) {
            return api.post('/survey/surveyAnswerOption', answerPayload)
          } else if (option.delete) {
            return api.delete(`/survey/surveyAnswerOption/${option.answerOptionsId}`)
          } else {
            return api.patch(`/survey/surveyAnswerOption/${option.answerOptionsId}`, answerPayload)
          }
        })

        await Promise.all(updatePromises)

        // Gelöschte Optionen in DB löschen
        await Promise.all(
          deletedOptions.map((opt) =>
            api.delete(`/survey/surveyAnswerOption/${opt.answerOptionsId}`)
          )
        )
      }

      if (editedQuestion.type === 'date' && editedQuestion.dates) {
        const deletedDates = oldAnswerOptions.filter(
          (oldDate) =>
            !editedQuestion.dates?.some(
              (newDate) => newDate.answerOptionsId === oldDate.answerOptionsId
            )
        )

        const updatePromises = editedQuestion.dates.map((date) => {
          const datePayload = {
            questionId: editedQuestion.questionId,
            answerText: date.answerText
              ? new Date(date.answerText).toISOString().split('T')[0]
              : null,
          }

          if (!date.answerOptionsId) {
            return api.post('/survey/surveyAnswerOption', datePayload)
          } else if (date.delete) {
            return api.delete(`/survey/surveyAnswerOption/${date.answerOptionsId}`)
          } else {
            return api.patch(`/survey/surveyAnswerOption/${date.answerOptionsId}`, datePayload)
          }
        })

        await Promise.all(updatePromises)

        // Gelöschte Dates in DB löschen
        await Promise.all(
          deletedDates.map((date) =>
            api.delete(`/survey/surveyAnswerOption/${date.answerOptionsId}`)
          )
        )
      }

      router.back()
    } catch (err) {
      console.error('Failed to edit question:', err)
    }
  }

  return (
    <Box sx={{ px: 2, py: 4, maxWidth: '800px', mx: 'auto' }}>
      <Typography variant='h5' gutterBottom>
        Edit Question
      </Typography>
      <SurveyForm
        questions={question}
        setQuestions={setQuestion}
        onEditQuestion={handleEditQuestion}
        editButton={true}
      />
    </Box>
  )
}

export default Page
