import { TextField as MuiTextField, TextFieldProps } from '@mui/material'
import React, { FormEvent, InvalidEvent } from 'react'

const TextField = (props: TextFieldProps) => {
  return (
    <MuiTextField
      fullWidth
      lang='en'
      slotProps={{
        input: {
          inputProps: {
            pattern: '\\S.*',
            onInvalid: (e: InvalidEvent<HTMLInputElement>) => {
              const value = e.currentTarget.value
              if (value === '') {
                e.currentTarget.setCustomValidity('Title is required')
              } else if (value.trim() === '') {
                e.currentTarget.setCustomValidity('Don’t enter only spaces')
              }
            },
            onInput: (e: FormEvent<HTMLInputElement>) => {
              e.currentTarget.setCustomValidity('')
            },
          },
        },
      }}
      {...props}
    />
  )
}

export default TextField
