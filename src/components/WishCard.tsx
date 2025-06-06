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
        p: 2,
        backgroundColor: '#f0f4ff',
        borderRadius: 3,
        boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
        '&:hover': { backgroundColor: '#e0eaff', transform: 'scale(1.01)' },
        transition: '0.2s',
        cursor: 'pointer',
      }}
    >
      <Box display='flex' justifyContent='space-between' alignItems='flex-start'>
        <Box display='flex' alignItems='center' gap={1}>
          <Typography variant='body2' color='text.secondary'>
            @{username}
          </Typography>
        </Box>
        <Typography variant='body2' color='text.secondary' sx={{ whiteSpace: 'nowrap' }}>
          {formatTimeAgo(createdAt)}
        </Typography>
      </Box>
      <Typography
        variant='h6'
        sx={{ mt: 1, fontWeight: 700, color: grey[900], wordBreak: 'break-word' }}
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
      <Box display='flex' justifyContent='flex-end'>
        {deleteButton && (
          <Button
            onClick={(e) => {
              e.stopPropagation()
            }}
          >
            Delete
          </Button>
        )}
      </Box>
      <Box display='flex' justifyContent='flex-end'>
        {actionButton}
      </Box>
    </Card>
  )
}
