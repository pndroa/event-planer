'use client'

import React from 'react'
import {
  Box,
  FormControl,
  FormLabel,
  IconButton,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
  Paper,
  Divider,
} from '@mui/material'
import Button from '@/components/button'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import DatePicker from './datePicker'
import { Question, multipleDateOption } from '@/lib/types'

type QuestionType = 'multiple' | 'text' | 'date'

const SurveyForm = ({
  questions,
  setQuestions,
  onSelectType,
  onDeleteQuestion,
  onEditQuestion,
  editButton = false,
  existingQuestions = [],
}: {
  questions: Question[]
  setQuestions: React.Dispatch<React.SetStateAction<Question[]>>
  onSelectType?: (index: number, type: QuestionType) => void
  onDeleteQuestion?: (index: number) => void
  onEditQuestion?: (editedQuestion: Question) => void
  editButton?: boolean
  existingQuestions?: string[]
}) => {
  const updateQuestionText = (index: number, text: string) => {
    setQuestions((prev) => prev.map((q, i) => (i === index ? { ...q, question: text } : q)))
  }

  const addOption = (index: number) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === index ? { ...q, options: [...(q.options || []), { answerText: '' }] } : q
      )
    )
  }

  const updateOption = (qIndex: number, optIndex: number, text: string) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i !== qIndex
          ? q
          : {
              ...q,
              options: q.options!.map((opt, j) =>
                j === optIndex ? { ...opt, answerText: text } : opt
              ),
            }
      )
    )
  }

  const updateDate = (qIndex: number, dIndex: number, newDate: Date | null) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i !== qIndex
          ? q
          : {
              ...q,
              dates: q.dates!.map((d, j) => (j === dIndex ? { ...d, answerText: newDate } : d)),
            }
      )
    )
  }

  const addDateField = (index: number) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === index ? { ...q, dates: [...(q.dates || []), { answerText: null }] } : q
      )
    )
  }

  const removeOption = (qIndex: number, optIndex: number) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qIndex && q.options!.length > 2
          ? { ...q, options: q.options!.filter((_, j) => j !== optIndex) }
          : q
      )
    )
  }

  const removeDateField = (qIndex: number, dIndex: number) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qIndex && q.dates!.length > 2
          ? { ...q, dates: q.dates!.filter((_, j) => j !== dIndex) }
          : q
      )
    )
  }

  const handleSelectDate = (qIndex: number, selectedIndex: number) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === qIndex ? { ...q, selectedDateIndex: selectedIndex } : q))
    )
  }

  const handleSelectOption = (qIndex: number, selectedIndex: number) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === qIndex ? { ...q, selectedOptionIndex: selectedIndex } : q))
    )
  }

  const handleDateTypeSelect = (index: number) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === index
          ? {
              ...q,
              type: 'date',
              dates: [{ answerText: null }, { answerText: null }] as multipleDateOption[],
            }
          : q
      )
    )
  }

  const isDuplicateQuestion = (text: string, index: number) => {
    const currentText = text.trim().toLowerCase()
    const localDuplicate = questions.some(
      (q, i) => i !== index && q.question.trim().toLowerCase() === currentText
    )
    const existingDuplicate = existingQuestions.includes(currentText)
    return localDuplicate || existingDuplicate
  }

  return (
    <Stack spacing={3}>
      {questions.map((q, i) => (
        <Paper key={i} elevation={3} sx={{ p: 3, borderRadius: 2, bgcolor: '#f5f5f5' }}>
          {!q.type ? (
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
              <Typography variant='subtitle1'>Select question type:</Typography>
              <Button size='small' onClick={() => onSelectType?.(i, 'multiple')}>
                Multiple
              </Button>
              <Button size='small' onClick={() => onSelectType?.(i, 'text')}>
                Text
              </Button>
              <Button size='small' onClick={() => handleDateTypeSelect(i)}>
                Date
              </Button>
            </Box>
          ) : (
            <>
              <TextField
                fullWidth
                label='Question'
                value={q.question}
                onChange={(e) => updateQuestionText(i, e.target.value)}
                error={isDuplicateQuestion(q.question, i)}
                helperText={isDuplicateQuestion(q.question, i) ? 'Duplicate question!' : ''}
                sx={{ mb: 2 }}
                slotProps={{
                  input: {
                    sx: {
                      backgroundColor: 'white',
                    },
                  },
                }}
              />

              {q.type === 'multiple' && (
                <FormControl>
                  <FormLabel>Answer options (min. 2)</FormLabel>
                  <RadioGroup
                    value={q.selectedOptionIndex ?? -1}
                    onChange={(e) => handleSelectOption(i, parseInt(e.target.value))}
                  >
                    {q.options!.map((option, j) => {
                      const isDuplicate =
                        q.options!.filter(
                          (o, idx) =>
                            o.answerText.trim().toLowerCase() ===
                              option.answerText.trim().toLowerCase() && idx !== j
                        ).length > 0

                      return (
                        <Box
                          key={j}
                          sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'flex-start',
                            gap: 1,
                            mb: 1,
                          }}
                        >
                          <Radio value={j} />
                          <TextField
                            value={option.answerText}
                            onChange={(e) => updateOption(i, j, e.target.value)}
                            error={isDuplicate || !option.answerText.trim()}
                            helperText={
                              !option.answerText.trim()
                                ? 'Required'
                                : isDuplicate
                                  ? 'Duplicate'
                                  : ''
                            }
                            size='small'
                            slotProps={{
                              input: {
                                sx: {
                                  backgroundColor: 'white',
                                },
                              },
                            }}
                          />
                          <IconButton
                            onClick={() => removeOption(i, j)}
                            disabled={q.options!.length <= 2}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      )
                    })}
                  </RadioGroup>
                  <Button
                    startIcon={<AddIcon />}
                    onClick={() => addOption(i)}
                    size='small'
                    sx={{ mt: 1 }}
                  >
                    Add option
                  </Button>
                </FormControl>
              )}

              {q.type === 'date' && (
                <FormControl>
                  <FormLabel>Dates (min. 2)</FormLabel>
                  <RadioGroup
                    value={q.selectedDateIndex ?? -1}
                    onChange={(e) => handleSelectDate(i, parseInt(e.target.value))}
                  >
                    {q.dates!.map((date, j) => {
                      const isDuplicate =
                        q.dates!.filter(
                          (d, idx) =>
                            d.answerText &&
                            date.answerText &&
                            new Date(d.answerText as string | Date).toISOString() ===
                              new Date(date.answerText as string | Date).toISOString() &&
                            idx !== j
                        ).length > 0

                      return (
                        <Box
                          key={j}
                          sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'flex-start',
                            gap: 1,
                            marginY: 1,
                          }}
                        >
                          <Radio value={j} />
                          <DatePicker
                            value={date.answerText ? new Date(date.answerText) : null}
                            onChange={(newDate) => updateDate(i, j, newDate)}
                            slotProps={{
                              textField: {
                                error: !date.answerText || isDuplicate,
                                helperText: !date.answerText
                                  ? 'Required'
                                  : isDuplicate
                                    ? 'Duplicate date'
                                    : '',
                                size: 'small',
                              },
                            }}
                          />
                          <IconButton
                            onClick={() => removeDateField(i, j)}
                            disabled={q.dates!.length <= 2}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      )
                    })}
                  </RadioGroup>
                  <Button
                    startIcon={<AddIcon />}
                    onClick={() => addDateField(i)}
                    size='small'
                    sx={{ mt: 1 }}
                  >
                    Add date
                  </Button>
                </FormControl>
              )}
            </>
          )}
          {editButton ? (
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button
                color='green'
                onClick={() => onEditQuestion?.(q)}
                startIcon={<AddIcon />}
                size='small'
              >
                Save
              </Button>
            </Box>
          ) : (
            <>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  color='red'
                  onClick={() => onDeleteQuestion?.(i)}
                  startIcon={<DeleteIcon />}
                  size='small'
                >
                  Delete question
                </Button>
              </Box>
            </>
          )}
        </Paper>
      ))}
    </Stack>
  )
}

export default SurveyForm
