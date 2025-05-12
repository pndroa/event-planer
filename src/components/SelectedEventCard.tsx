import { Events } from '@/lib/types'
import { Box, Typography, Divider } from '@mui/material'
import RoomIcon from '@mui/icons-material/Room'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'

export default function SelectedEventCard({ event }: { event: Events }) {
  return (
    <Box
      sx={{
        backgroundColor: '#e0f2ff',
        borderRadius: 5,
        p: 2.5,
        color: '#1e1e1e',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      {/* Organizer */}
      <Box display='flex' flexDirection='column'>
        {/* Organizer-part with Event-Id */}
        <Box display='flex' alignItems='center' justifyContent='space-between'>
          {/* Organizer-part and Icon */}
          <Box display='flex' alignItems='center' gap={0.5}>
            <PersonOutlineIcon fontSize='small' sx={{ color: 'black', mt: '2px' }} />
            <Typography textAlign='left' sx={{ maxWidth: 600 }}>
              <Box component='span' fontWeight='bold' color='text.primary' fontSize={13}>
                Organizer:&nbsp;
              </Box>
              <Box component='span' fontStyle='italic' color='text.secondary' fontSize={13}>
                @{event.users.name}
              </Box>
            </Typography>
          </Box>

          {/* Event-ID */}
          <Typography textAlign='right'>
            <Box component='span' fontWeight='bold' color='text.primary' fontSize={13}>
              Event-ID:&nbsp;
            </Box>
            <Box component='span' fontStyle='italic' color='text.secondary' fontSize={13}>
              {event.eventId.slice(0, 10)}…
            </Box>
          </Typography>
        </Box>

        {/* Wish-ID part, if it exists */}
        {event.wishId && (
          <Box display='flex' justifyContent='flex-end'>
            <Typography textAlign='right'>
              <Box component='span' fontWeight='bold' color='green' fontSize={13}>
                Wish-ID:&nbsp;
              </Box>
              <Box component='span' fontStyle='italic' color='text.secondary' fontSize={13}>
                {event.wishId.slice(0, 10)}…
              </Box>
            </Typography>
          </Box>
        )}
      </Box>

      {/* Title */}
      <Typography
        variant='h3'
        fontWeight='bold'
        textAlign='center'
        color='#1e3a8a'
        sx={{ textTransform: 'capitalize' }}
      >
        {event.title}
      </Typography>

      {/* Description */}
      <Box
        sx={{
          maxHeight: 110,
          overflowY: 'auto',
          backgroundColor: '#f7fbff',
          borderRadius: 2.5,
          p: 2,
          boxShadow: '10px 10px 10px rgba(0, 0, 0, 0.08)',
        }}
      >
        <Typography component='div' textAlign='justify'>
          <Box
            fontWeight='bold'
            color='text.primary'
            fontSize={15}
            display='block'
            mb={0.5}
            sx={{ textDecoration: 'underline' }}
          >
            Description:
          </Box>
          <Box fontSize={14} color='black' lineHeight={1.4}>
            {event.description ? (
              event.description
            ) : (
              <Box fontStyle='italic' color='text.secondary'>
                No description yet... <br /> <br /> <br /> <br />
              </Box>
            )}
          </Box>
        </Typography>
      </Box>

      <Divider sx={{ borderColor: '#c3dafe', my: 1 }} />

      {/* Event-Date and Room */}
      <Box display='flex' justifyContent='center' gap={15} flexWrap='wrap' textAlign='center'>
        {/* Event Dates */}
        <Box textAlign='center'>
          <Typography variant='subtitle1' fontWeight='bold' mb={1}>
            📅 Event Dates
          </Typography>
          {event.eventDates.map((dateObj) => (
            <Box
              key={dateObj.dateId}
              display='flex'
              justifyContent='center'
              alignItems='center'
              gap={2}
              fontSize={14}
              mb={1}
            >
              <Box display='flex' alignItems='center' gap={0.5}>
                <CalendarTodayIcon fontSize='small' />
                <span>{new Date(dateObj.date).toLocaleDateString()}</span>
              </Box>
              <Box display='flex' alignItems='center' gap={0.5}>
                <AccessTimeIcon fontSize='small' />
                <span>
                  {dateObj.startTime || '–'} – {dateObj.endTime || '–'}
                </span>
              </Box>
            </Box>
          ))}
        </Box>

        {/* Room */}
        <Box>
          <Typography variant='subtitle1' fontWeight='bold' mb={1}>
            🏛️ Room
          </Typography>
          <Typography variant='body2' fontSize={14} color='text.primary'>
            <RoomIcon fontSize='small' sx={{ mr: 1, verticalAlign: 'middle' }} />
            {event.room || 'Not defined yet'}
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}
