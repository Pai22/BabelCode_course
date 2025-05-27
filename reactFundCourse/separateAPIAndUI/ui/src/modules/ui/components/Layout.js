import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useMediaQuery, CssBaseline } from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles'

import * as actions from 'modules/ui/actions'
import Header from './Header'
import Content from './Content'

export default function Layout() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
  const darkMode = useSelector((state) => state.ui.darkMode)
  const dispatch = useDispatch()

  useEffect(() => {
    const action = actions.setDarkMode(prefersDarkMode)

    dispatch(action)
  }, [prefersDarkMode, dispatch])

  const darkTheme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
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
