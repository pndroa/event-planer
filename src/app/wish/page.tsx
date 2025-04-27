'use client'

import { useEffect, useState } from 'react'
import {
  Box,
  Card,
  Typography,
  IconButton,
  Stack,
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Avatar,
} from '@mui/material'
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined'
import { blue, grey } from '@mui/material/colors'
import { api } from '@/lib/api'

interface Wish {
  wishId: number
  userId: number
  title: string
  description: string
  currentUpvotes: number
  createdAt: string
  isConvertedToEvent: boolean
  users: {
    userId: number
    email: string
    name?: string
  }
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  const diffHrs = Math.floor(diffMin / 60)
  const diffDays = Math.floor(diffHrs / 24)

  if (diffMin < 60) return `${diffMin} min ago`
  if (diffHrs < 24) return `${diffHrs} hrs ago`
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
}

export default function WishFeed() {
  const [wishes, setWishes] = useState<Wish[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'date' | 'likes'>('date')

  useEffect(() => {
    const fetchWishes = async () => {
      try {
        const res = await api.get('/wish')
        console.log(res.data)
        setWishes(res.data)
      } catch (error) {
        console.error('Error loading wishes:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchWishes()
  }, [])

  const filteredWishes = wishes
    .filter((wish) => wish.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) =>
      sortBy === 'likes'
        ? b.currentUpvotes - a.currentUpvotes
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

  if (loading) return <p>Loading wishes...</p>

  return (
    <Box sx={{ padding: 4, maxWidth: 700, mx: 'auto' }}>
      {/* Top Controls */}
      <Box
        display='flex'
        flexWrap='wrap'
        alignItems='center'
        justifyContent='space-between'
        gap={1.5}
        mb={3}
      >
        <TextField
          label='Search by title'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size='small'
          sx={{ flex: 1, minWidth: 220 }}
        />
        <FormControl size='small' sx={{ minWidth: 140 }}>
          <InputLabel id='sort-label'>Sort by</InputLabel>
          <Select
            labelId='sort-label'
            value={sortBy}
            label='Sort by'
            onChange={(e) => setSortBy(e.target.value as 'date' | 'likes')}
          >
            <MenuItem value='date'>Newest</MenuItem>
            <MenuItem value='likes'>Most liked</MenuItem>
          </Select>
        </FormControl>
        <Button
          variant='contained'
          size='small'
          sx={{ height: '40px' }}
          onClick={() => alert('Create wish')}
        >
          + CREATE WISH
        </Button>
      </Box>

      {/* Feed */}
      <Stack spacing={2}>
        {filteredWishes.map((wish) => (
          <Card
            key={wish.wishId}
            sx={{
              minHeight: 140,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: 2,
              backgroundColor: '#f0f4ff',
              borderRadius: 3,
              boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
              transition: '0.2s ease',
              '&:hover': {
                backgroundColor: '#e0eaff',
                transform: 'scale(1.01)',
              },
            }}
          >
            {/* Top Row: Avatar, Name, Timestamp */}
            <Box display='flex' justifyContent='space-between' alignItems='flex-start'>
              <Box display='flex' alignItems='center' gap={1}>
                <Avatar
                  sx={{
                    bgcolor: blue[500],
                    width: 28,
                    height: 28,
                    fontSize: 14,
                  }}
                >
                  {wish.users.email[0].toUpperCase()}
                </Avatar>
                <Typography variant='body2' color='text.secondary'>
                  @{wish.users.email}
                </Typography>
              </Box>

              <Typography
                variant='body2'
                color='text.secondary'
                sx={{ ml: 2, whiteSpace: 'nowrap' }}
              >
                {formatTimeAgo(wish.createdAt)}
              </Typography>
            </Box>

            {/* Title */}
            <Typography
              variant='h6'
              sx={{
                mt: 1,
                fontWeight: 700,
                color: grey[900],
                wordBreak: 'break-word',
              }}
            >
              {wish.title}
            </Typography>

            {/* Like Button Bottom Left */}
            <Box display='flex' alignItems='center' mt={2}>
              <IconButton size='small' disabled sx={{ p: 0.5, mr: 0.5 }}>
                <ThumbUpAltOutlinedIcon sx={{ color: blue[500], fontSize: 20 }} />
              </IconButton>
              <Typography variant='body2' color='text.secondary'>
                {wish.currentUpvotes}
              </Typography>
            </Box>
          </Card>
        ))}
      </Stack>
    </Box>
  )
}
