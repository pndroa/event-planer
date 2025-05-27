'use client'

import { Box, Modal, Typography } from '@mui/material'
import Button from '@/components/button'
import { MouseEvent } from 'react'

interface DeleteOverlayProps {
  onDeleteClick: (e: MouseEvent) => void
  onClose: () => void
}

export default function DeleteOverlay({ onDeleteClick, onClose }: DeleteOverlayProps) {
  return (
    <Modal open onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '55%',
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
          Do you really want to delete?
          <br />
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
          <Button color='red' onClick={onDeleteClick}>
            Delete
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}
