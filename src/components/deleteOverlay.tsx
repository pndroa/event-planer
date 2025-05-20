'use client'
import { Box, Modal, Typography } from '@mui/material'
import Button from '@/components/button'
import { api } from '@/lib/api'
import { useRouter } from 'next/navigation'

interface DeleteOverlayProps {
  eventId?: string
  onClose: () => void
}

export default function DeleteOverlay({ onClose, eventId = '' }: DeleteOverlayProps) {
  const router = useRouter()
  const deleteEvent = async () => {
    try {
      if (eventId == '') {
        console.error('Event ID is required to delete an event')
      }
      const res = await api.delete(`/event/${eventId}`)

      if (res.status === 200) {
        router.push('/event')
      }
    } catch (error) {
      console.error('Error deleting Events:', error)
    }
  }

  return (
    <Modal open onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <Typography>
          Do you really want to delete this Event? <br></br>
          This action is irreversible.
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 5,
          }}
        >
          <Button
            color='green'
            onClick={(e) => {
              e.stopPropagation()
              onClose()
            }}
          >
            Cancel
          </Button>
          <Button
            color='red'
            onClick={(e) => {
              e.stopPropagation()
              deleteEvent()
            }}
          >
            Delete
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}
