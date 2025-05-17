'use client'
import { useSearchParams } from 'next/navigation'
import React, { useEffect } from 'react'
import { api } from '@/lib/api'
import { Box } from '@mui/material'
import SurveyForm from '@/components/surveyForm'
import { useState } from 'react'

type QuestionType = 'multiple' | 'text' | 'date'

type Question = {
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

  /** Change question typ*/
  const handleSelectType = (index: number, type: QuestionType) => {
    setQuestion((prev) => prev.map((q, i) => (i === index ? { ...q, type } : q)))
  }

  const handleDeleteQuestion = (index: number) => {
    setQuestion((prev) => prev.filter((_, i) => i !== index))
  }

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!questionId) return

      try {
        console.log('questionId')
        console.log(questionId)
        const res = await api.get(`/survey/surveyQuestion/${questionId}`)

        console.log('res.data')
        console.log(res.data)
        setQuestion([
          {
            type: res.data.question.type,
            question: res.data.question.questionText,
            selectedOptionIndex: 0,
            ...(res.data.question.type === 'multiple'
              ? {
                  options: res.data.question.surveyAnswerOptions.map(
                    (surveyAnswerOption) => surveyAnswerOption.answerText
                  ),
                }
              : {
                  dates: res.data.question.surveyAnswerOptions.map(
                    (surveyAnswerOption) => new Date(surveyAnswerOption.answerText)
                  ),
                }),
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
          onSelectType={handleSelectType}
          onDeleteQuestion={handleDeleteQuestion}
        />
      </Box>
    </div>
  )
}
export default Page
