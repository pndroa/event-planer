'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect } from 'react'
import { api } from '@/lib/api'
import { Box } from '@mui/material'
import SurveyForm from '@/components/surveyForm'
import { useState } from 'react'
import { Question } from '@/lib/types'
import { multipleChoiceOption } from '@/lib/types'
import { multipleDateOption } from '@/lib/types'

const Page = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const questionId = searchParams.get('questionId')
  const [question, setQuestion] = useState<Question[]>([])
  const [oldMultipkeChoiceOptions, setOldMultipleChoiceOptions] = useState<multipleChoiceOption[]>(
    []
  )

  const handleEditQuestion = async (editedQuestion: Question) => {
    const payload = {
      questionText: editedQuestion.question,
      options: editedQuestion.options,
      dates: editedQuestion.dates,
    }

    try {
      await api
        .patch(`/survey/surveyQuestion/${editedQuestion.questionId}`, payload)
        .then(async (res) => {
          if (res.status === 200) {
            /**Delete all answers given to aquestion */
            await api
              .delete(`/survey/surveyAnswer`, {
                params: { questionId: editedQuestion.questionId },
              })
              .then(async () => {
                if (Array.isArray(editedQuestion.options) || Array.isArray(editedQuestion.dates)) {
                  if (editedQuestion.type === 'multiple') {
                    const deletedOptions: multipleChoiceOption[] = oldMultipkeChoiceOptions.filter(
                      (oldOption) =>
                        !editedQuestion.options?.some(
                          (newOption) => newOption.answerOptionsId === oldOption.answerOptionsId
                        )
                    )

                    const updatePromises =
                      editedQuestion.options?.map((option) => {
                        const answerPayload = {
                          questionId: editedQuestion.questionId,
                          answerText: option.answerText,
                        }

                        if (option.answerOptionsId === undefined) {
                          return api.post('/survey/surveyAnswerOption', answerPayload)
                        } else if (option.delete) {
                          return api.delete(`/survey/surveyAnswerOption/${option.answerOptionsId}`)
                        } else {
                          return api.patch(
                            `/survey/surveyAnswerOption/${option.answerOptionsId}`,
                            answerPayload
                          )
                        }
                      }) ?? []

                    await Promise.all(updatePromises)
                    if (deletedOptions !== undefined) {
                      deletedOptions.forEach((option) => {
                        return api.delete(`/survey/surveyAnswerOption/${option.answerOptionsId}`)
                      })
                    }
                  } else if (editedQuestion.type === 'date') {
                    const deletedDates: multipleDateOption[] = oldMultipkeChoiceOptions.filter(
                      (oldDate) =>
                        !editedQuestion.dates?.some(
                          (newDate) => newDate.answerOptionsId === oldDate.answerOptionsId
                        )
                    )

                    const updatePromises =
                      editedQuestion.dates?.map((date) => {
                        const datePayload = {
                          questionId: editedQuestion.questionId,
                          answerText: new Date(date.answerText as string)
                            .toISOString()
                            .split('T')[0],
                        }
                        if (date.answerOptionsId === undefined) {
                          return api.post('/survey/surveyAnswerOption', datePayload)
                        } else {
                          return api.patch(
                            `/survey/surveyAnswerOption/${date.answerOptionsId}`,
                            datePayload
                          )
                        }
                      }) ?? []

                    await Promise.all(updatePromises)
                    if (deletedDates !== undefined) {
                      deletedDates.forEach((date) => {
                        return api.delete(`/survey/surveyAnswerOption/${date.answerOptionsId}`)
                      })
                    }
                  }
                }
              })
          }
        })

      router.back()
    } catch (err) {
      console.error('Failed to edit question', err)
    }
  }

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!questionId) return

      try {
        const res = await api.get(`/survey/surveyQuestion/${questionId}`, {
          params: { answerOptions: true },
        })

        if (res.status !== 200) {
          console.error('Failed to load question', res)
          return
        }

        console.log('res')
        console.log(res.data)
        setOldMultipleChoiceOptions(res.data.question.surveyAnswerOptions)

        setQuestion([
          {
            questionId: res.data.question.questionId,
            type: res.data.question.type,
            question: res.data.question.questionText,
            ...(res.data.question.type === 'multiple'
              ? {
                  options: res.data.question.surveyAnswerOptions,
                }
              : res.data.question.type === 'date'
                ? {
                    dates: res.data.question.surveyAnswerOptions,
                  }
                : {}),
          },
        ])
      } catch (err) {
        console.error('Failed to load questions', err)
      }
    }

    fetchQuestions()
  }, [questionId])

  return (
    <div>
      <Box sx={{ px: 2, py: 4, maxWidth: '800px', mx: 'auto' }}>
        <SurveyForm
          questions={question}
          setQuestions={setQuestion}
          onEditQuestion={handleEditQuestion}
          editButton={true}
        />
      </Box>
    </div>
  )
}
export default Page
