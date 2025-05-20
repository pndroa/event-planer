'use client'

import { useEffect, useState } from 'react'
import { Box } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { DatePicker as MuiDatePicker, DatePickerProps } from '@mui/x-date-pickers/DatePicker'
import { enUS, Locale } from 'date-fns/locale'
import { loadLocale } from '@/utils/locales'

const DatePicker = (props: DatePickerProps) => {
  const [locale, setLocale] = useState<Locale>(enUS)

  useEffect(() => {
    const lang = navigator.language
    loadLocale(lang).then(setLocale)
  }, [])

  return (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={locale}>
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
