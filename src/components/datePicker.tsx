'use client'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { DatePicker as MuiDatePicker, DatePickerProps } from '@mui/x-date-pickers/DatePicker'
import { de } from 'date-fns/locale/de'

const DatePicker = (props: DatePickerProps) => {
  console.log('Test')

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={de}>
      <MuiDatePicker
        slotProps={{
          field: { clearable: true },
          textField: {
            required: true,
          },
        }}
        {...props}
        sx={{ width: '100%' }}
      />
    </LocalizationProvider>
  )
}

export default DatePicker
