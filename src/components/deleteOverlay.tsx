'use client'
import { Box, Modal, Typography, Button } from '@mui/material'
import { api } from '@/lib/api'

interface DeleteOverlayProps {
  eventId?: string
  onClose: () => void
}

export default function DeleteOverlay({ onClose, eventId = '' }: DeleteOverlayProps) {
  const deleteEvent = async () => {
    try {
      if (eventId == '') {
        console.error('Event ID is required to delete an event')
      }
      const res = await api.delete(`/event/${eventId}`)

      if (res.status === 200) {
        window.location.reload()
      }

      console.log('Event deleted successfully:', res)
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
          alignItems: 'flex-start',
          gap: 2,
        }}
      >
        <Typography>
          Do you really want to delete this Event? <br></br>
          This action is irreversible.
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start' }}>
          <Button
            variant='contained'
            sx={{ backgroundColor: 'green', m: 2 }}
            onClick={(e) => {
              e.stopPropagation()
              onClose()
            }}
          >
            Cancel
          </Button>
          <Button
            variant='contained'
            sx={{ backgroundColor: 'red', m: 2 }}
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
