'use client'
import { Box } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
//import { DatePicker as MuiDatePicker, DatePickerProps } from '@mui/x-date-pickers/DatePicker'
import {
  DateTimePicker as MuiDateTimePicker,
  DateTimePickerProps,
} from '@mui/x-date-pickers/DateTimePicker'
import { de } from 'date-fns/locale/de'

const DatePicker = (props: DateTimePickerProps) => {
  return (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={de}>
        {/*
        <MuiDatePicker
          slotProps={{
            field: { clearable: true },
          }}
          {...props}
          sx={{ width: '100%' }}
        />
*/}
        <MuiDateTimePicker
          label='Pick Date'
          slotProps={{ field: { clearable: true } }}
          sx={{ width: '100%' }}
          {...props}
        />
      </LocalizationProvider>
    </Box>
  )
}

export default DatePicker
