'use client'

import { useEffect, useState } from 'react'
import { Box } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { TimePicker as MuiTimePicker, TimePickerProps } from '@mui/x-date-pickers/TimePicker'
import { Locale, enUS } from 'date-fns/locale'
import { loadLocale } from '@/utils/locales'

const TimePicker = (props: TimePickerProps) => {
  const [locale, setLocale] = useState<Locale>(enUS)

  useEffect(() => {
    const lang = navigator.language
    loadLocale(lang).then(setLocale)
  }, [])

  return (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={locale}>
        <MuiTimePicker
          slotProps={{
            field: { clearable: true },
          }}
          {...props}
          sx={{ maxWidth: '245px' }}
        />
      </LocalizationProvider>
    </Box>
  )
}

export default TimePicker
