import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  typography: {
    fontFamily: 'Arial, "Liberation Sans", sans-serif',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          fontFamily: 'Arial, "Liberation Sans", sans-serif',
        },
      },
    },
  },
})

export default theme
