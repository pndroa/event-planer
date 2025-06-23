'use client'

import React, { useState, useEffect } from 'react'
import {
  Box,
  RadioGroup,
  Radio,
  FormControlLabel,
  TextField,
  Stack,
  Typography,
} from '@mui/material'
import Button from '@/components/button'
import { SurveyQuestions } from '@/lib/types'
import { api } from '@/lib/api'

const SurveyAnswerCard = ({
  question,
  currentAnswer,
  setAnswer,
}: {
  question: SurveyQuestions
  currentAnswer: string
  setAnswer: (val: string) => void
}) => {
  const [localAnswer, setLocalAnswer] = useState<string>(currentAnswer)
  const [loading, setLoading] = useState(false)
  const [isDisabled, setIsDisabled] = useState<boolean>(!!currentAnswer)

  useEffect(() => {
    setLocalAnswer(currentAnswer)
    setIsDisabled(!!currentAnswer)
  }, [currentAnswer])

  const handleSave = async () => {
    if (!localAnswer) return alert('Please enter or select an answer.')

    setLoading(true)
    try {
      if (typeof question.questionId == 'string') {
        await api.delete(`/survey/surveyAnswer/${question.questionId}`)
      }

      await api.post('/survey/surveyAnswer', {
        questionId: question.questionId,
        answer: localAnswer,
      })
      setAnswer(localAnswer)
      setIsDisabled(true)
    } catch (err) {
      console.error('Failed to save answer:', err)
    }
    setLoading(false)
  }

  function manageSaveSurveyQuestionButton(
    loading: boolean,
    isDisabled: boolean,
    questionType: string,
    localAnswer: string
  ): boolean {
    if (
      loading ||
      isDisabled ||
      (questionType === 'text' && localAnswer.trim() === '') ||
      ((questionType === 'multiple' || questionType === 'date') && !localAnswer)
    ) {
      console.log('save survey false')
      return true
    } else {
      console.log('save survey true')
      return false
    }
  }

  function enableSaveSurveyQuestionButton() {
    setIsDisabled(false)
  }

  return (
    <Box
      sx={{
        mt: 2,
        p: 2,
        border: '1px solid #ccc',
        borderRadius: 2,
        backgroundColor: '#f9f9f9',
      }}
    >
      <Stack spacing={2}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant='subtitle1'>Answer the question:</Typography>
        </Box>

        {(question.type === 'multiple' || question.type === 'date') && (
          <RadioGroup
            value={localAnswer}
            onChange={(e) => {
              setLocalAnswer(e.target.value)
              enableSaveSurveyQuestionButton()
            }}
          >
            {question.surveyAnswerOptions?.map((opt) => (
              <FormControlLabel
                key={opt.answerOptionsId}
                value={opt.answerText}
                control={<Radio />}
                label={opt.answerText}
              />
            ))}
          </RadioGroup>
        )}
        {question.type === 'text' && (
          <TextField
            fullWidth
            label='Your answer'
            value={localAnswer}
            onChange={(e) => {
              setLocalAnswer(e.target.value)
              enableSaveSurveyQuestionButton()
            }}
            variant='outlined'
            slotProps={{
              input: {
                sx: {
                  backgroundColor: 'white',
                },
              },
            }}
          />
        )}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            onClick={handleSave}
            disabled={manageSaveSurveyQuestionButton(
              loading,
              isDisabled,
              question.type,
              localAnswer
            )}
          >
            {loading ? 'Saving...' : 'Save answer'}
          </Button>
        </Box>
      </Stack>
    </Box>
  )
}

export default SurveyAnswerCard
