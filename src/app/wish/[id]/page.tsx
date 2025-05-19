'use client'

import { use, useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { fetchUser } from '@/lib/user'
import { Box, Typography, CircularProgress, Alert, Stack, IconButton } from '@mui/material'
import { blue } from '@mui/material/colors'
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt'
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined'
import Button from '@/components/button'

export default function WishDetailPage() {
  const { id } = useParams() as { id: string }
  const [wish, setWish] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [isUpvoted, setIsUpvoted] = useState(false)
  const [upvoteCount, setUpvoteCount] = useState(0)
  const router = useRouter()

  useEffect(() => {
    const fetchWish = async () => {
      setLoading(true)
      try {
        const res = await api.get(`/wish/${id}`)
        setWish(res.data)
        setIsUpvoted(res.data.isUpvotedByMe || false)
        setUpvoteCount(res.data.currentUpvotes || 0)
      } catch (err) {
        setError('Error loading wish.')
        console.error('Failed to fetch wish:', err)
      }
      setLoading(false)
    }
    fetchWish()
  }, [id])

  useEffect(() => {
    const getUser = async () => {
      try {
        const user = await fetchUser()
        setUserId(user?.id ?? null)
      } catch (err) {
        console.log(err)
        setUserId(null)
      }
    }
    getUser()
  }, [])

  const handleUpvote = async () => {
    try {
      const res = await api.post<{ upvoted: boolean; count: number }>(`/wish/${id}/upvote`)
      setIsUpvoted(res.data.upvoted)
      setUpvoteCount(res.data.count)
    } catch (err) {
      console.error('Upvote failed:', err)
    }
  }

  if (loading) {
    return (
      <Box display='flex' justifyContent='center' mt={8}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) return <Alert severity='error'>{error}</Alert>
  if (!wish) return <Alert severity='info'>Wish not found.</Alert>

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
      {/* Creator */}
      <Typography fontSize={15} fontWeight={700} color='#666' mb={2}>
        Wish by: <span style={{ fontWeight: 500 }}>@{wish.users?.name || 'Unknown'}</span>
      </Typography>

      {/* Title */}
      <Typography
        variant='h3'
        fontWeight={700}
        color='#2176d2'
        textAlign='center'
        mb={4}
        sx={{
          whiteSpace: 'normal',
          wordBreak: 'break-word',
          overflowWrap: 'break-word',
        }}
      >
        {wish.title}
      </Typography>
      {/* Description */}
      <Box
        sx={{
          backgroundColor: '#f5f8ff',
          borderRadius: 3,
          p: 3,
        }}
        mb={3}
      >
        <Typography fontWeight={700} fontSize={17} mb={1}>
          Description:
        </Typography>
        <Typography
          fontSize={15.5}
          color='#222'
          textAlign='justify'
          sx={{
            opacity: wish.description ? 1 : 0.68,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
          }}
        >
          {wish.description ?? <i>No description available.</i>}
        </Typography>
      </Box>

      {/* Upvote Button */}
      <Stack direction='row' spacing={2} alignItems='center'>
        <IconButton
          size='small'
          onClick={(e) => {
            e.stopPropagation()
            handleUpvote()
          }}
          sx={{
            p: 0.5,
            transition: 'transform 150ms ease-in-out',
            '&:hover': { transform: 'scale(1.1)' },
          }}
        >
          {isUpvoted ? (
            <ThumbUpAltIcon sx={{ color: blue[800], fontSize: 20 }} />
          ) : (
            <ThumbUpAltOutlinedIcon sx={{ color: blue[500], fontSize: 20 }} />
          )}
        </IconButton>

        <Typography variant='body2' color='text.secondary'>
          {upvoteCount}
        </Typography>

        <Box sx={{ flexGrow: 1 }} />

        {/* ORGANIZE-Button */}
        <Button onClick={() => router.push(`/event/create?wishId=${id}`)}>ORGANIZE</Button>
      </Stack>
    </Box>
  )
}
