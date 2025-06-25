'use client'
import { Box, Card, Typography, IconButton } from '@mui/material'
import Button from '@/components/button'
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined'
import { blue, grey } from '@mui/material/colors'
import { formatTimeAgo } from '@/utils/timeUtils'
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt'
import { ReactNode } from 'react'

interface WishCardProps {
  username: string
  title: string
  createdAt: string
  currentUpvotes?: number
  isUpvoted?: boolean
  onUpvote?: () => void
  deleteButton?: boolean
  actionButton?: ReactNode
  onClick?: () => void
  currentUserId?: string | null
  wishCreatorId: string
}

export default function WishCard({
  username,
  title,
  createdAt,
  currentUpvotes,
  isUpvoted,
  onUpvote,
  deleteButton = false,
  actionButton = null,
  onClick,
  currentUserId,
  wishCreatorId,
}: WishCardProps) {
  const isOwnWish = currentUserId === wishCreatorId

  return (
    <Card
      onClick={onClick}
      sx={{
        p: { xs: 1.5, sm: 2 },
        backgroundColor: '#f0f4ff',
        borderRadius: 3,
        boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
        '&:hover': {
          backgroundColor: '#e0eaff',
          transform: { xs: 'none', sm: 'scale(1.01)' },
        },
        transition: '0.2s',
        cursor: 'pointer',
      }}
    >
      <Box
        display='flex'
        justifyContent='space-between'
        alignItems='flex-start'
        flexDirection={{ xs: 'column', sm: 'row' }}
        gap={0.5}
      >
        <Typography variant='body2' color='text.secondary'>
          @{username}
        </Typography>

        <Typography variant='body2' color='text.secondary' sx={{ whiteSpace: 'nowrap' }}>
          {formatTimeAgo(createdAt)}
        </Typography>
      </Box>

      <Typography
        variant='h6'
        sx={{
          mt: 1,
          fontWeight: 700,
          color: grey[900],
          wordBreak: 'break-word',
          fontSize: { xs: '1rem', sm: '1.25rem' },
        }}
      >
        {title}
      </Typography>

      <Box display='flex' alignItems='center' mt={2}>
        <IconButton
          size='small'
          onClick={(e) => {
            e.stopPropagation()
            if (!isOwnWish) {
              onUpvote?.()
            }
          }}
          sx={{ p: 0.5, mr: 0.5 }}
        >
          {isUpvoted ? (
            <ThumbUpAltIcon sx={{ color: isOwnWish ? grey[500] : blue[800], fontSize: 20 }} />
          ) : (
            <ThumbUpAltOutlinedIcon
              sx={{ color: isOwnWish ? grey[500] : blue[500], fontSize: 20 }}
            />
          )}
        </IconButton>

        <Typography variant='body2' color='text.secondary'>
          {currentUpvotes}
        </Typography>
      </Box>

      <Box
        display='flex'
        justifyContent='flex-end'
        mt={1}
        flexDirection={{ xs: 'column', sm: 'row' }}
        gap={1}
      >
        {deleteButton && (
          <Button
            onClick={(e) => {
              e.stopPropagation()
            }}
          >
            Delete
          </Button>
        )}
        {actionButton}
      </Box>
    </Card>
  )
}
