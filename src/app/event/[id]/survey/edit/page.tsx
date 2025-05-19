'use client'
import { useSearchParams } from 'next/navigation'
import React, { useEffect } from 'react'
import { api } from '@/lib/api'
import { Box } from '@mui/material'
import SurveyForm from '@/components/surveyForm'
import { useState } from 'react'

type QuestionType = 'multiple' | 'text' | 'date'

type Question = {
  questionId?: string
  type: QuestionType | null
  question: string
  options?: string[]
  dates?: (Date | null)[]
  selectedDateIndex?: number
  selectedOptionIndex?: number
}

const Page = () => {
  const searchParams = useSearchParams()
  const questionId = searchParams.get('questionId')
  const [question, setQuestion] = useState<Question[]>([])

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
              .delete(`/survey/surveyAnswers`, {
                params: { questionId: editedQuestion.questionId },
              })
              .then(async () => {
                if (Array.isArray(editedQuestion.options) || Array.isArray(editedQuestion.dates)) {
                  /**Delete all answer options to a question*/
                  await api
                    .delete('/survey/surveyAnswerOption', {
                      params: { questionId: editedQuestion.questionId },
                    })
                    .then(() => {
                      /**Create the questions new*/
                      if (editedQuestion.type === 'multiple') {
                        editedQuestion.options?.map((option) => {
                          const answerPayload = {
                            questionId: editedQuestion.questionId,
                            answerText: option,
                          }
                          return api.post('/survey/surveyAnswerOption', answerPayload)
                        })
                      } else if (editedQuestion.type === 'date') {
                        editedQuestion.dates?.map((date) => {
                          const datePayload = {
                            questionId: editedQuestion.questionId,
                            answerText: date?.toISOString().split('T')[0],
                          }
                          return api.post('/survey/surveyAnswerOption', datePayload)
                        })
                      }
                    })
                }
              })
          }
        })
    } catch (err) {
      console.error('Failed to edit question', err)
    }
  }

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!questionId) return

      try {
        const res = await api.get(`/survey/surveyQuestion/${questionId}`)

        setQuestion([
          {
            questionId: res.data.question.questionId,
            type: res.data.question.type,
            question: res.data.question.questionText,
            selectedOptionIndex: 0,
            ...(res.data.question.type === 'multiple'
              ? {
                  options: res.data.question.surveyAnswerOptions.map(
                    (surveyAnswerOption: { answerText: string }) => surveyAnswerOption.answerText
                  ),
                }
              : res.data.question.type === 'date'
                ? {
                    dates: res.data.question.surveyAnswerOptions.map(
                      (surveyAnswerOption: { answerText: string }) =>
                        new Date(surveyAnswerOption.answerText)
                    ),
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
