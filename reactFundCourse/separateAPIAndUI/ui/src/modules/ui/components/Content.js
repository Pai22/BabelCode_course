import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Container, Toolbar, Snackbar, Button } from '@mui/material'
import { makeStyles, ThemeProvider } from '@mui/styles'
import { createTheme } from '@mui/material/styles'

import ContentsRoutes from './Routes'
import * as actions from 'modules/ui/actions'

const theme = createTheme()

const useStyles = makeStyles((theme) => ({
  content: {
    padding: theme.spacing(2, 0)
  }
}))

function Contents() {
  const classes = useStyles()
  const dispatch = useDispatch()
  const flashMessage = useSelector((state) => state.ui.flashMessage)

  const closeFlashMessage = () => {
    dispatch(actions.clearFlashMessage())
  }

  return (
    <main className={classes.content}>
      <Container maxWidth="lg">
        <Toolbar></Toolbar>
        <ContentsRoutes></ContentsRoutes>
        {flashMessage && (
          <Snackbar
            open
            message={flashMessage}
            action={
              <Button color="inherit" size="small" onClick={closeFlashMessage}>
                Close
              </Button>
            }
          />
        )}
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
