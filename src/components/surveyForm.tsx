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
} from '@mui/material'
import Button from '@/components/button'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import DatePicker from './datePicker'
import EditButton from './button'
import { Question } from '@/lib/types'
import { multipleDateOption } from '@/lib/types'

type QuestionType = 'multiple' | 'text' | 'date'

const SurveyForm = ({
  questions,
  setQuestions,
  onSelectType,
  onDeleteQuestion,
  onEditQuestion,
  editButton = false,
}: {
  questions: Question[]
  setQuestions: React.Dispatch<React.SetStateAction<Question[]>>
  onSelectType?: (index: number, type: QuestionType) => void
  onDeleteQuestion?: (index: number) => void
  onEditQuestion?: (editedQuestion: Question) => void
  editButton?: boolean
}) => {
  const updateQuestionText = (index: number, text: string) => {
    setQuestions((prev) => prev.map((q, i) => (i === index ? { ...q, question: text } : q)))
  }

  const updateOption = (qIndex: number, optIndex: number, text: string) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qIndex
          ? {
              ...q,
              options: q.options!.map((opt, j) =>
                j === optIndex ? { ...opt, answerText: text } : opt
              ),
            }
          : q
      )
    )
  }

  const addOption = (index: number) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === index ? { ...q, options: [...(q.options || []), { answerText: '' }] } : q
      )
    )
  }

  const removeOption = (qIndex: number, optIndex: number) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qIndex
          ? {
              ...q,
              options: q.options!.filter((_, j) => j !== optIndex),
              selectedOptionIndex:
                q.selectedOptionIndex === optIndex
                  ? undefined
                  : q.selectedOptionIndex! > optIndex
                    ? q.selectedOptionIndex! - 1
                    : q.selectedOptionIndex,
            }
          : q
      )
    )
  }

  const updateDate = (qIndex: number, dIndex: number, newDate: Date | null) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qIndex
          ? {
              ...q,
              dates: q.dates!.map((d, j) => (j === dIndex ? { ...d, answerText: newDate } : d)),
            }
          : q
      )
    )
  }

  const addDateField = (index: number) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === index ? { ...q, dates: [...(q.dates || []), { answerText: null as Date | null }] } : q
      )
    )
  }

  const removeDateField = (qIndex: number, dIndex: number) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qIndex && q.dates!.length > 1
          ? {
              ...q,
              dates: q.dates!.filter((_, j) => j !== dIndex),
              selectedDateIndex:
                q.selectedDateIndex === dIndex
                  ? undefined
                  : q.selectedDateIndex! > dIndex
                    ? q.selectedDateIndex! - 1
                    : q.selectedDateIndex,
            }
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
              dates: [
                {
                  answerText: null as Date | null,
                  questionId: '',
                  answerOptionsId: '',
                  delete: false,
                },
              ] as multipleDateOption[],
              selectedDateIndex: undefined,
            }
          : q
      )
    )
  }

  return (
    <Stack spacing={4}>
      {questions.map((q, i) => (
        <Box
          key={i}
          sx={{
            border: '1px solid #ccc',
            p: 2,
            borderRadius: 2,
            backgroundColor: '#fafafa',
          }}
        >
          {!q.type ? (
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
              <Typography>Select question type:</Typography>
              <Button onClick={() => onSelectType?.(i, 'multiple')}>Multiple Choice</Button>
              <Button onClick={() => onSelectType?.(i, 'text')}>Text</Button>
              <Button onClick={() => handleDateTypeSelect(i)}>Date</Button>
            </Box>
          ) : (
            <>
              <TextField
                fullWidth
                label='Question'
                value={q.question}
                onChange={(e) => updateQuestionText(i, e.target.value)}
                sx={{ mb: 2 }}
              />

              {q.type === 'multiple' && (
                <FormControl component='fieldset'>
                  <FormLabel>Answer options</FormLabel>
                  <RadioGroup
                    value={q.selectedOptionIndex ?? -1}
                    onChange={(e) => handleSelectOption(i, parseInt(e.target.value))}
                  >
                    {q.options!.map((option, j) => (
                      <Box key={j} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Radio value={j} />
                        <TextField
                          value={option.answerText}
                          onChange={(e) => updateOption(i, j, e.target.value)}
                          placeholder={`Option ${j + 1}`}
                          size='small'
                          sx={{ flex: 1, mr: 1 }}
                        />
                        <IconButton
                          onClick={() => removeOption(i, j)}
                          disabled={q.options!.length <= 1}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    ))}
                  </RadioGroup>
                  <Button
                    startIcon={<AddIcon />}
                    onClick={() => addOption(i)}
                    sx={{ mt: 1, alignSelf: 'flex-start' }}
                  >
                    Add option
                  </Button>
                </FormControl>
              )}

              {q.type === 'date' && (
                <FormControl fullWidth>
                  <FormLabel>Date selection (only one selectable)</FormLabel>
                  <RadioGroup
                    value={q.selectedDateIndex ?? -1}
                    onChange={(e) => handleSelectDate(i, parseInt(e.target.value))}
                  >
                    {q.dates?.map((date, j) => (
                      <Box key={j} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Radio value={j} />
                        <pre>{JSON.stringify(date, null, 2)}</pre>
                        <DatePicker
                          value={
                            date.answerText ? new Date(date.answerText) : (null as Date | null)
                          }
                          onChange={(newDate) => updateDate(i, j, newDate)}
                        />
                        <IconButton
                          onClick={() => removeDateField(i, j)}
                          disabled={q.dates!.length <= 1}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    ))}
                  </RadioGroup>
                  <Button
                    startIcon={<AddIcon />}
                    onClick={() => addDateField(i)}
                    sx={{ mt: 1, alignSelf: 'flex-start' }}
                  >
                    Add another date
                  </Button>
                </FormControl>
              )}
            </>
          )}

          {editButton && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mt: 1 }}>
              <EditButton color='green' onClick={() => onEditQuestion?.(q)}>
                Save
              </EditButton>
            </Box>
          )}

          {!editButton && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mt: 1 }}>
              <Button color='red' onClick={() => onDeleteQuestion?.(i)} startIcon={<DeleteIcon />}>
                Delete
              </Button>
            </Box>
          )}
        </Box>
      ))}
    </Stack>
  )
}

export default SurveyForm
