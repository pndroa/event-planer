'use client'
import { useParams } from 'next/navigation'
import DeleteOverlay from '@/components/deleteOverlay'
import { Box, Button } from '@mui/material'
import { useState } from 'react'

const Page = () => {
  const { id } = useParams()
  const [deleteEvent, setDeleteEvent] = useState(false)

  console.log('Event ID:', id)

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column', // damit Text und Overlay untereinander sind
        alignItems: 'center', // horizontal zentriert
        justifyContent: 'center', // vertikal zentriert
        height: '100vh', // volle Seitenhöhe
        textAlign: 'center', // optional, zentriert Text
      }}
    >
      Edit Page for Event {id}
      <Button variant='contained' color='error' onClick={() => setDeleteEvent(true)}>
        Delete Event
      </Button>
      {deleteEvent && <DeleteOverlay eventId={id as string | undefined} onClose={() => setDeleteEvent(false)} />}
    </Box>
  )
}

export default Page
