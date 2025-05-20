import { Wishes } from '@/lib/types'
import { Box, Typography } from '@mui/material'
import Button from '@/components/button'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import { useRouter } from 'next/navigation'

export default function SelectedWishCard({ wish }: { wish: Wishes }) {
  const router = useRouter()

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
      {/* WishCreator */}
      <Box display='flex' alignItems='center' justifyContent='space-between'>
        {/* WishCreator-part and Icon */}
        <Box display='flex' alignItems='center' gap={0.5}>
          <PersonOutlineIcon fontSize='small' sx={{ color: 'black', mt: '2px' }} />
          <Typography textAlign='left' sx={{ maxWidth: 600 }}>
            <Box component='span' fontWeight='bold' color='text.primary' fontSize={13}>
              WishCreator:&nbsp;
            </Box>
            <Box component='span' fontStyle='italic' color='text.secondary' fontSize={13}>
              @{wish.users.name}
            </Box>
          </Typography>
        </Box>

        {/* Wish-ID */}
        <Typography textAlign='right'>
          <Box component='span' fontWeight='bold' color='text.primary' fontSize={13}>
            Wish-ID:&nbsp;
          </Box>
          <Box component='span' fontStyle='italic' color='text.secondary' fontSize={13}>
            {wish.wishId.slice(0, 10)}…
          </Box>
        </Typography>
      </Box>

      {/* Title */}
      <Typography
        variant='h3'
        fontWeight='bold'
        textAlign='center'
        color='#1e3a8a'
        sx={{ textTransform: 'capitalize' }}
      >
        {wish.title}
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
            {wish.description ? (
              wish.description
            ) : (
              <Box fontStyle='italic' color='text.secondary'>
                No description yet... <br /> <br /> <br /> <br />
              </Box>
            )}
          </Box>
        </Typography>
      </Box>

      <Box display='flex' justifyContent='flex-end' sx={{ mt: 0.2 }}>
        <Button
          onClick={() => {
            router.push(`/event/create?wishId=${wish.wishId}`)
          }}
        >
          ORGANIZE
        </Button>
      </Box>
    </Box>
  )
}
