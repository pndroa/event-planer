'use client'
import { Box } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { DatePicker as MuiDatePicker, DatePickerProps } from '@mui/x-date-pickers/DatePicker'
//import { enUS } from 'date-fns/locale'
import { enGB } from 'date-fns/locale'
import { de } from 'date-fns/locale'
import { useMemo } from 'react'

/*Datepicker only supports two languages*/
const DatePicker = (props: DatePickerProps) => {
  const language = useMemo(() => {
    const browserLanguage = typeof window !== 'undefined' ? navigator.language : 'en-GB'

    if (browserLanguage.startsWith('de')) {
      return de
    } else {
      return enGB
    }
  }, [])

  return (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={language}>
        <MuiDatePicker
          slotProps={{
            field: { clearable: true },
            textField: { required: false },
          }}
          {...props}
          sx={{ maxWidth: '250px' }}
        />
      </LocalizationProvider>
    </Box>
  )
}

export default DatePicker
