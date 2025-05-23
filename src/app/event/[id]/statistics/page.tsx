'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { api } from '@/lib/api'
import type { SurveyStatistics } from '@/lib/types'
import CircularProgress from '@mui/material/CircularProgress'

export default function StatisticsPage() {
  const { id } = useParams()
  const [data, setData] = useState<SurveyStatistics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/event/${id}/statistics`)
        setData(response.data.event)
        console.dir(response.data.event) // hier, kann weg!
      } catch (error) {
        console.error('Error fetching statistics:', error)
        setData(null)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '4rem' }}>
        <CircularProgress />
      </div>
    )
  }

  const noSurvey = !data?.surveys || data.surveys.surveyQuestions.length === 0

  if (noSurvey) {
    return (
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        Please provide questions for survey statistics!
      </div>
    )
  }

  return (
    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
      <pre style={{ textAlign: 'left', display: 'inline-block' }}>
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  )
}
