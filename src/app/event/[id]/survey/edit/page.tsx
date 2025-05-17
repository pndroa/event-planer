'use client'
import { useSearchParams } from 'next/navigation'
import React, { useEffect } from 'react'
import { api } from '@/lib/api'
import { Box } from '@mui/material'
import SurveyForm from '@/components/surveyForm'
import { useState } from 'react'

type QuestionType = 'multiple' | 'text' | 'date'

type Question = {
  questionId: string
  type: QuestionType | null
  question: string
  options?: string[]
  dates?: (Date | null)[]
  selectedDateIndex?: number
  selectedOptionIndex?: number
  answerQuestionObjects?: any[]
}

const Page = () => {
  const searchParams = useSearchParams()
  const questionId = searchParams.get('questionId')
  const [question, setQuestion] = useState<Question[]>([])
  const [oldAnswerOptions, setOldAnswerOptions] = useState<string[]>([])

  const handleEditQuestion = async (editedQuestion: Question) => {
    const payload = {
      questionText: editedQuestion.question,
      options: editedQuestion.options,
      dates: editedQuestion.dates,
    }
    console.log('editedQuestion')
    console.log(editedQuestion)
    try {
      await api
        .patch(`/survey/surveyQuestion/${editedQuestion.questionId}`, payload)
        .then(async (res) => {
          console.log('res')
          console.log(res)
          if (res.status === 200) {
            console.log(res)
            console.log('res.data.questionId')
            console.log(editedQuestion.questionId)
            await api
              .delete(`/survey/surveyAnswers/${editedQuestion.questionId}`)
              .then(async (res) => {
                await api
                  .delete('/survey/surveyAnswerOption', {
                    params: { id: editedQuestion.questionId },
                  })
                  .then((res) => {
                    console.log('res')

                    if (editedQuestion.type === 'multiple') {
                      editedQuestion.options?.map((option) => {
                        const answerPayload = {
                          questionId: editedQuestion.questionId,
                          answerText: option,
                        }
                        return api.post('/survey/surveyAnswerOption', answerPayload)
                      })
                    } else if (editedQuestion.type === 'date') {
                      editedQuestion.options?.map((option) => {
                        const datePayload = {
                          questionId: editedQuestion.questionId,
                          answerText: option?.toString().split('T')[0],
                        }
                        return api.post('/survey/surveyAnswerOption', datePayload)
                      })
                    }
                  })
              })
          }
        })

      console.log(oldAnswerOptions)
    } catch (err) {
      console.error('Failed to edit question', err)
    }
  }

  const arrayToCompareOldQuestionOptions = (res: any) => {
    setOldAnswerOptions(...[res.data.question.surveyAnswerOptions])
  }

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!questionId) return

      try {
        console.log('questionId')
        console.log(questionId)
        const res = await api.get(`/survey/surveyQuestion/${questionId}`)
        arrayToCompareOldQuestionOptions(res)

        console.log('res.data')
        console.log(res.data)
        setQuestion([
          {
            questionId: res.data.question.questionId,
            type: res.data.question.type,
            question: res.data.question.questionText,
            selectedOptionIndex: 0,
            answerQuestionObjects: res.data.question.surveyAnswerOptions,
            ...(res.data.question.type === 'multiple'
              ? {
                  options: getAnswerOptions(res),
                }
              : res.data.question.type === 'date'
                ? {
                    dates: getAnswerOptions(res),
                  }
                : {}),
          },
        ])
        console.log('aaaaaaaaaaaaaaaaa')
        console.log(question)
      } catch (err) {
        console.error('Failed to load questions', err)
      }
    }

    fetchQuestions()
  }, [questionId])

  const getAnswerOptions = (res: any) => {
    return res.data.question.surveyAnswerOptions.map(
      (surveyAnswerOption: { answerText: string }) => surveyAnswerOption.answerText
    )
  }

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
