import { FC, ReactNode } from 'react'
import {
  Box,
  Card,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  CardContent,
} from '@mui/material'
import Button from '@/components/button'

interface FormCardProps {
  title?: string
  children?: ReactNode
  buttonText?: string
}

const SearchbarForCards: FC<FormCardProps> = ({ buttonText = 'default' }) => {
  return (
    <Card sx={{ width: '100%' }}>
      <CardContent>
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
            <TextField label='Search by title' size='small' sx={{ flex: 1, minWidth: 220 }} />
            <FormControl size='small' sx={{ minWidth: 140 }}>
              <InputLabel id='sort-label'>Sort by</InputLabel>
              <Select labelId='sort-label' label='Sort by'>
                <MenuItem value='date'>Newest</MenuItem>
                <MenuItem value='likes'>Most liked</MenuItem>
              </Select>
            </FormControl>
            <Button onClick={() => alert('Create wish')}>+ {buttonText}</Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

export default SearchbarForCards
