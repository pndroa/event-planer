import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  typography: {
    fontFamily: 'Arial, Helvetica, sans-serif',
  },
})

export default theme

// Arial: gewünschte Hauptschrift
// Fallback Helvecita: zweite Wahl (auf macOS und vielen Linux-Systemen)
// Fallback sans-serif: dritte Wahl (generische System-Schrift, falls Arial und Helvecita fehlen)
