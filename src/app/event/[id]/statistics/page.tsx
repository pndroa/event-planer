'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { api } from '@/lib/api'
import type { SurveyStatistics } from '@/lib/types'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart'
import BarChartIcon from '@mui/icons-material/BarChart'
import { useRouter } from 'next/navigation'
import { useUser } from '@/hooks/useUser'
import { Stack } from '@mui/material'

export default function StatisticsPage() {
  const { id } = useParams()
  const [data, setData] = useState<SurveyStatistics | null>(null)
  const [loading, setLoading] = useState(true)

  const user = useUser()
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/event/${id}/statistics`)
        setData(response.data.event)
      } catch (error) {
        console.error('Error fetching statistics:', error)
        setData(null)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (loading) {
    return (
      <Box display='flex' justifyContent='center' mt={6}>
        <Box display='flex' justifyContent='center' mt={6}>
          <CircularProgress />
        </Box>
      </Box>
    )
  }

  const noSurvey =
    !data?.surveys ||
    !Array.isArray(data.surveys.surveyQuestions) ||
    data.surveys.surveyQuestions.length === 0

  if (data && user && data.trainerId !== user.id) {
    router.back()
    return null
  }
  if (noSurvey) {
    return (
      <Box
        mt={6}
        textAlign='center'
        display='flex'
        flexDirection='column'
        alignItems='center'
        gap={2}
      >
        <BarChartIcon color='action' sx={{ fontSize: 50 }} />
        <Typography variant='h5' fontWeight='bold'>
          No survey data yet.
        </Typography>
        <Typography variant='body1' color='textSecondary'>
          Please create questions to begin collecting responses.
        </Typography>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 800,
        mx: 'auto',
        mt: 6,
        mb: 6,
        p: 4,
        backgroundColor: '#fff',
        borderRadius: 3,
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
      }}
    >
      <Typography variant='h3' fontWeight={700} color='#2176d2' textAlign='center' mb={4}>
        Statistics for: {data.title}
      </Typography>

      <Box display='flex' justifyContent='center' mt={2} mb={4}>
        <Box px={2} py={1} sx={{ backgroundColor: '#f5f8ff', borderRadius: 2 }}>
          <Typography variant='subtitle1' color='black' fontWeight={500}>
            Participants: {data.eventParticipation.length}
          </Typography>
        </Box>
      </Box>

      <Stack spacing={4}>
        {(data.surveys?.surveyQuestions ?? []).map((question, index) => {
          const { questionText, type, surveyAnswerOptions, surveyAnswers } = question
          const answerCount = surveyAnswers.length

          const total = surveyAnswerOptions.reduce((sum, option) => {
            return sum + surveyAnswers.filter((ans) => ans.answer === option.answerText).length
          }, 0)

          const answerStats = surveyAnswerOptions.map((option) => {
            const count = surveyAnswers.filter((ans) => ans.answer === option.answerText).length
            const percent = total > 0 ? (count / total) * 100 : 0
            return {
              id: option.answerOptionsId,
              value: percent,
              label: option.answerText,
            }
          })

          const freeTextAnswers = type === 'text' ? surveyAnswers.map((ans) => ans.answer) : []

          return (
            <Box
              key={question.questionId}
              sx={{
                backgroundColor: '#f5f8ff',
                borderRadius: 3,
                p: 3,
                boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
              }}
            >
              <Typography fontSize={17} fontWeight={700} mb={1}>
                Q{index + 1}: <span style={{ fontWeight: 500, color: '#333' }}>{questionText}</span>
              </Typography>
              <Divider sx={{ mb: 2 }} />

              {(type === 'multiple' || type === 'date') && (
                <Box display='flex' flexDirection='column' alignItems='center'>
                  {answerCount === 0 ? (
                    <Typography fontSize={15} color='text.secondary'>
                      No responses yet.
                    </Typography>
                  ) : (
                    <PieChart
                      series={[
                        {
                          arcLabel: (item) => `${item.value.toFixed(1)}%`,
                          arcLabelMinAngle: 10,
                          arcLabelRadius: '60%',
                          data: answerStats,
                        },
                      ]}
                      width={300}
                      height={220}
                      sx={{ [`& .${pieArcLabelClasses.root}`]: { fontSize: 14, fontWeight: 700 } }}
                    />
                  )}
                  <Typography fontSize={15} mt={2}>
                    Total answers: {answerCount}
                  </Typography>
                </Box>
              )}

              {type === 'text' && (
                <Box>
                  {freeTextAnswers.length > 0 ? (
                    <Box component='ul' sx={{ pl: 2, m: 0 }}>
                      {freeTextAnswers.map((answer, i) => (
                        <li key={i}>
                          <Typography fontSize={15}>{answer}</Typography>
                        </li>
                      ))}
                    </Box>
                  ) : (
                    <Typography fontSize={15} color='text.secondary'>
                      No responses yet.
                    </Typography>
                  )}
                  <Typography fontSize={15} mt={2} textAlign='center'>
                    Total answers: {answerCount}
                  </Typography>
                </Box>
              )}
            </Box>
          )
        })}
      </Stack>
    </Box>
  )
}
