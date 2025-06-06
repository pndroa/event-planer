'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { fetchUser } from '@/lib/user'
import { Box, Typography, CircularProgress, Alert, Stack, IconButton } from '@mui/material'
import { blue, grey } from '@mui/material/colors'
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt'
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpOutlined'
import Button from '@/components/button'
import { Wishes } from '@/lib/types'
import DeleteOverlay from '@/components/deleteOverlay'

export default function WishDetailPage() {
  const { id } = useParams() as { id: string }
  const router = useRouter()

  const [wish, setWish] = useState<Wishes | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [isUpvoted, setIsUpvoted] = useState(false)
  const [upvoteCount, setUpvoteCount] = useState(0)
  const [confirmOpen, setConfirmOpen] = useState(false)

  // 1) Fetch wish data
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
        console.error(err)
      }
      setLoading(false)
    }
    fetchWish()
  }, [id])

  // 2) Fetch current user
  useEffect(() => {
    const getUser = async () => {
      try {
        const user = await fetchUser()
        setUserId(user?.id ?? null)
      } catch {
        setUserId(null)
      }
    }
    getUser()
  }, [])

  // 3) Upvote handler
  const handleUpvote = async () => {
    try {
      const res = await api.post<{ upvoted: boolean; count: number }>(`/wish/${id}/upvote`)
      setIsUpvoted(res.data.upvoted)
      setUpvoteCount(res.data.count)
    } catch (err) {
      console.error('Upvote failed:', err)
    }
  }

  // 4) Only show delete for the creator
  const isCreator = userId === wish?.users?.userId

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
    <>
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
            mb: 3,
          }}
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

        {/* Buttons */}
        <Stack direction='row' spacing={1} alignItems='center'>
          {/* Upvote */}
          <IconButton
            size='small'
            onClick={(e) => {
              e.stopPropagation()
              if (!isCreator) {
                handleUpvote()
              }
            }}
            sx={{
              p: 0.5,
              transition: 'transform 150ms ease-in-out',
              '&:hover': !isCreator ? { transform: 'scale(1.1)' } : undefined,
            }}
          >
            {isUpvoted ? (
              <ThumbUpAltIcon sx={{ color: isCreator ? grey[500] : blue[800], fontSize: 20 }} />
            ) : (
              <ThumbUpAltOutlinedIcon
                sx={{ color: isCreator ? grey[500] : blue[500], fontSize: 20 }}
              />
            )}
          </IconButton>
          <Typography variant='body2' color='text.secondary'>
            {upvoteCount}
          </Typography>

          <Box sx={{ flexGrow: 1 }} />

          {/* Organize */}
          <Button onClick={() => router.push(`/event/create?wishId=${id}`)}>ORGANIZE EVENT</Button>

          {/* Delete only for creator */}
          {isCreator && (
            <Button color='red' onClick={() => setConfirmOpen(true)}>
              DELETE
            </Button>
          )}
        </Stack>
      </Box>

      {/* DeleteOverlay statt Dialog */}
      {confirmOpen && (
        <DeleteOverlay
          onClose={() => setConfirmOpen(false)}
          onDeleteClick={async (e) => {
            e.stopPropagation()
            try {
              await api.delete(`/wish/${id}`)
              setConfirmOpen(false)
              setTimeout(() => {
                window.location.href = '/wish'
              }, 100)
            } catch (err) {
              console.error('Delete failed:', err)
              alert('Delete failed.')
            }
          }}
        />
      )}
    </>
  )
}
