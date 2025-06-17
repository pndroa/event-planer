import { Box, TextFieldProps } from '@mui/material'
import { DateValidationError, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { DatePicker as MuiDatePicker, DatePickerProps } from '@mui/x-date-pickers/DatePicker'
import { de, enGB } from 'date-fns/locale'
import { useMemo, useState } from 'react'

const DatePicker = (props: DatePickerProps) => {
  const language = useMemo(() => {
    const browserLanguage = typeof window !== 'undefined' ? navigator.language : 'en-GB'
    return browserLanguage.startsWith('de') ? de : enGB
  }, [])

  const [error, setError] = useState(false)

  const handleError = (reason: DateValidationError) => {
    setError(!!reason)
  }

  return (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={language}>
        <MuiDatePicker
          minDate={new Date(2000, 0, 1)}
          maxDate={new Date(2099, 11, 31)}
          onError={handleError}
          slotProps={{
            field: { clearable: true },
            textField: {
              required: false,
              error: error,
              helperText: error ? 'Invalid date' : '',
            } as TextFieldProps,
          }}
          {...props}
          sx={{ maxWidth: '250px' }}
        />
      </LocalizationProvider>
    </Box>
  )
}

export default DatePicker
