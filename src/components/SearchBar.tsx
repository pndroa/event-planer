'use client'

import { TextField } from '@mui/material'

interface SearchBarProps {
  searchTerm: string
  onSearchTermChange: (value: string) => void
}

export default function SearchBar({ searchTerm, onSearchTermChange }: SearchBarProps) {
  return (
    <TextField
      label='Search by title'
      value={searchTerm}
      onChange={(e) => onSearchTermChange(e.target.value)}
      size='small'
      sx={{ flex: 1, minWidth: 220, maxWidth: 400 }}
    />
  )
}
