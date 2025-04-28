import { FC } from 'react'
import { Box, Card, Typography, IconButton, Stack, Avatar } from '@mui/material'
import { blue, grey } from '@mui/material/colors'
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined'

const dummyData = [
  {
    wishId: 1,
    userId: 101,
    title: 'Learn TypeScript',
    description: 'I want to master TypeScript for better coding practices.',
    currentUpvotes: 15,
    createdAt: '2025-04-20T10:30:00Z',
    isConvertedToEvent: false,
    user: {
      userId: 101,
      username: 'john_doe',
      email: 'john.doe@example.com',
    },
  },
  {
    wishId: 2,
    userId: 102,
    title: 'Build a React App',
    description: 'Planning to build a React app for personal portfolio.',
    currentUpvotes: 25,
    createdAt: '2025-04-21T14:45:00Z',
    isConvertedToEvent: true,
    user: {
      userId: 102,
      username: 'jane_smith',
      email: 'jane.smith@example.com',
    },
  },
  {
    wishId: 3,
    userId: 103,
    title: 'Contribute to Open Source',
    description: 'Looking for opportunities to contribute to open-source projects.',
    currentUpvotes: 10,
    createdAt: '2025-04-22T08:15:00Z',
    isConvertedToEvent: false,
    user: {
      userId: 103,
      username: 'alice_wonder',
      email: 'alice.wonder@example.com',
    },
  },
]

interface FeedForCardsProps {
  filteredWishes?: []
}

const FeedForCards: FC<FeedForCardsProps> = ({ filteredWishes = dummyData }) => {
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

  return (
    <Box>
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
                  {wish.user.username[0].toUpperCase()}
                </Avatar>
                <Typography variant='body2' color='text.secondary'>
                  @{wish.user.username}
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

export default FeedForCards
