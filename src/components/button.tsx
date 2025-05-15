import React, { ReactNode } from 'react'
import { Button as MuiButton } from '@mui/material'

// Color guidelines:
// - Red: permanent deletions
// - Orange: leave/exit actions
// - Green: safe actions and success messages
// - All other cases: use standard MUI colors

interface ButtonProps {
  onClick?: () => void
  color?: 'green' | 'red' | 'orange'
  children?: ReactNode
}

const colorMap: Record<NonNullable<ButtonProps['color']>, string> = {
  green: '#4caf50',
  red: '#f44336',
  orange: '#ff9800',
}

const Button = ({ onClick, color, children }: ButtonProps) => {
  const customStyles = color
    ? {
        backgroundColor: colorMap[color],
        color: '#fff',
        '&:hover': {
          backgroundColor: colorMap[color],
          opacity: 0.9,
        },
      }
    : undefined

  return (
    <MuiButton variant='contained' onClick={onClick} sx={customStyles}>
      {children}
    </MuiButton>
  )
}

export default Button
