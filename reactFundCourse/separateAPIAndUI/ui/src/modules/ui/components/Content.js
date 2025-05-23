import React from 'react'
import { Container, Toolbar, Snackbar, Button } from '@mui/material'
import { makeStyles, ThemeProvider } from '@mui/styles'
import { createTheme } from '@mui/material/styles'

import ContentsRoutes from './Routes'

const theme = createTheme()

const useStyles = makeStyles((theme) => ({
  content: {
    padding: theme.spacing(2, 0)
  }
}))

function Contents() {
  const classes = useStyles()
  return (
    <main className={classes.content}>
      <Container maxWidth="lg">
        <Toolbar></Toolbar>
        <ContentsRoutes></ContentsRoutes>
        <Snackbar
          open
          message="Hello"
          action={
            <Button color="inherit" size="small">
              Close
            </Button>
          }
        />
      </Container>
    </main>
  )
}

export default function Content() {
  return (
    <ThemeProvider theme={theme}>
      <Contents></Contents>
    </ThemeProvider>
  )
}
