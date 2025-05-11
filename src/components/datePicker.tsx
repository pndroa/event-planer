'use client'
import { Box } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { DatePicker as MuiDatePicker, DatePickerProps } from '@mui/x-date-pickers/DatePicker'
import { de } from 'date-fns/locale/de'

const DatePicker = (props: DatePickerProps) => {
  return (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={de}>
        <MuiDatePicker
          slotProps={{
            field: { clearable: true },
            textField: {
              required: false,
              inputProps: {
                autoCapitalize: 'none',
              },
            },
          }}
          {...props}
          sx={{ maxWidth: '250px' }}
        />
      </LocalizationProvider>
    </Box>
  )
}

export default DatePicker
