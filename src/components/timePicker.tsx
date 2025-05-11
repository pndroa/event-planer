'use client'
import { Box } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { TimePicker as MuiTimePicker, TimePickerProps } from '@mui/x-date-pickers/TimePicker'
import { de } from 'date-fns/locale/de'

const TimePicker = (props: TimePickerProps) => {
  return (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={de}>
        <MuiTimePicker
          slotProps={{
            field: { clearable: true },
            textField: {
              inputProps: {
                autoCapitalize: 'none',
              },
            },
          }}
          {...props}
          sx={{ maxWidth: '245px' }}
        />
      </LocalizationProvider>
    </Box>
  )
}

export default TimePicker
