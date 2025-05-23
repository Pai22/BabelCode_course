import React from 'react'
import { useMediaQuery, CssBaseline } from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles'

import Header from './Header'
import Content from './Content'

export default function Layout() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')

  const darkTheme = createTheme({
    palette: {
      mode: prefersDarkMode ? 'dark' : 'light',
      primary: {
        main: '#1abc9c'
      }
    }
  })

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline></CssBaseline>
      <Header></Header>
      <Content></Content>
    </ThemeProvider>
  )
}
