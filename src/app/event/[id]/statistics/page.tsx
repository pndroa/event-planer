'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { api } from '@/lib/api'
import type { SurveyStatistics } from '@/lib/types'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Divider from '@mui/material/Divider'
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart'
import BarChartIcon from '@mui/icons-material/BarChart'
import { useRouter } from 'next/navigation'
import { useUser } from '@/hooks/useUser'

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
  }, [])

  if (loading) {
    return (
      <Box display='flex' justifyContent='center' mt={6}>
        <CircularProgress />
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
    <Box display='flex' flexDirection='column' alignItems='center' px={2} py={4}>
      <Typography variant='h3' align='center' fontWeight='bold' gutterBottom>
        📊 Statistics for: {data.title}
      </Typography>

      <Box
        mt={1}
        mb={4}
        px={3}
        py={1}
        borderRadius={3}
        bgcolor='#555'
        color='white'
        fontSize='1.1rem'
        fontWeight={500}
      >
        Total Participants: {data.eventParticipation.length}
      </Box>

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
          <Paper
            key={question.questionId}
            elevation={2}
            style={{ padding: '1.5rem', margin: '1rem 0', width: '100%', maxWidth: '600px' }}
          >
            <Typography
              variant='subtitle1'
              gutterBottom
              style={{ fontWeight: 600, fontSize: '1.1rem' }}
            >
              📝 Q{index + 1}: <span style={{ color: '#333' }}>{questionText}</span>
            </Typography>
            <Divider style={{ marginBottom: '1rem' }} />

            {(type === 'multiple' || type === 'date') && (
              <Box display='flex' flexDirection='column' alignItems='center'>
                {answerCount === 0 ? (
                  <Box width='100%' textAlign='left'>
                    <Typography variant='body2' color='textSecondary'>
                      No responses yet.
                    </Typography>
                  </Box>
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
                    sx={{ [`& .${pieArcLabelClasses.root}`]: { fontSize: 14, fontWeight: 'bold' } }}
                  />
                )}
                <Box mt={2} textAlign='center'>
                  <Typography variant='body2'>Total answers: {answerCount}</Typography>
                </Box>
              </Box>
            )}

            {type === 'text' && (
              <Box mt={1}>
                {freeTextAnswers.length > 0 ? (
                  <Box component='ul' style={{ paddingLeft: '1.2rem', margin: 0 }}>
                    {freeTextAnswers.map((answer, i) => (
                      <li key={i}>
                        <Typography variant='body2'>{answer}</Typography>
                      </li>
                    ))}
                  </Box>
                ) : (
                  <Typography variant='body2' color='textSecondary'>
                    No responses yet.
                  </Typography>
                )}
                <Box mt={2} textAlign='center'>
                  <Typography variant='body2'>Total answers: {answerCount}</Typography>
                </Box>
              </Box>
            )}
          </Paper>
        )
      })}
    </Box>
  )
}
