'use client'

import { Box, TextFieldProps } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { DatePicker as MuiDatePicker, DatePickerProps } from '@mui/x-date-pickers/DatePicker'
import { de, enGB } from 'date-fns/locale'
import { useMemo, useState, useEffect } from 'react'
import { isValid } from 'date-fns'

type CustomDatePickerProps = DatePickerProps & {
  onValidChange?: (isValid: boolean) => void
  showError?: boolean
  isDuplicate?: boolean
}

const MIN_DATE = new Date(2000, 0, 1)
const MAX_DATE = new Date(2099, 11, 31)

const DatePicker = ({
  onValidChange,
  showError = true,
  isDuplicate = false,
  ...props
}: CustomDatePickerProps) => {
  const language = useMemo(() => {
    const browserLanguage = typeof window !== 'undefined' ? navigator.language : 'en-GB'
    return browserLanguage.startsWith('de') ? de : enGB
  }, [])

  const [touched, setTouched] = useState(false)
  const [error, setError] = useState(false)

  const value = props.value
  const hasDate = !!value && isValid(value)
  const isInRange = hasDate && value >= MIN_DATE && value <= MAX_DATE
  const isValidDate = !value || (hasDate && isInRange)

  useEffect(() => {
    setError(touched && !!value && !isValidDate)
    onValidChange?.(isValidDate)
  }, [value, touched, isValidDate, onValidChange])

  const textFieldProps =
    typeof props.slotProps?.textField === 'object' ? props.slotProps?.textField : {}

  const externalError = 'error' in textFieldProps ? textFieldProps.error : undefined
  const externalHelperText = 'helperText' in textFieldProps ? textFieldProps.helperText : undefined

  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: { xs: -3 } }}>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={language}>
        <MuiDatePicker
          minDate={MIN_DATE}
          maxDate={MAX_DATE}
          {...props}
          onChange={(newValue, context) => {
            setTouched(true)
            props.onChange?.(newValue, context)
          }}
          slotProps={{
            field: {
              clearable: true,
              onBlur: () => setTouched(true),
            },
            textField: {
              error: externalError ?? (showError && (error || isDuplicate)),
              helperText:
                externalHelperText ??
                (showError && (error || isDuplicate)
                  ? isDuplicate
                    ? 'Duplicate date'
                    : 'Valid date range: 2000–2099'
                  : ' '),
              fullWidth: false,
              sx: {
                width: { xs: '245px', sm: '250px' },
              },
              InputProps: {
                sx: {
                  backgroundColor: 'white',
                },
              },
            } as TextFieldProps,
          }}
        />
      </LocalizationProvider>
    </Box>
  )
}

export default DatePicker
