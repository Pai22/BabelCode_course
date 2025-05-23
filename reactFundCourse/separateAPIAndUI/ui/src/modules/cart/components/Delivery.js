import React from 'react'
import makeStyles from '@mui/styles/makeStyles'
import { createTheme, ThemeProvider } from '@mui/material'
import {
  CardContent,
  TextField,
  Typography,
  Card,
  CardActions,
  Button,
  Stack
} from '@mui/material'

const theme = createTheme()

const useStyles = makeStyles((theme) => ({
  form: {
    '& > * + *': {
      marginTop: theme.spacing(2)
    }
  },
  submitBtn: {
    flex: 1 // กำหนดให้ Button กินพื้นที่เต็ม
  }
}))

export default function Delivery() {
  const classes = useStyles()
  return (
    <ThemeProvider theme={theme}>
      <form autoComplete="off">
        <Card>
          <CardContent className={classes.form}>
            <Typography variant="h5" component="h2">
              Delivery Information
            </Typography>
            <Stack spacing={2}>
              <TextField
                variant="outlined"
                label="Name"
                placeholder="Enter your fullname"
                name="name"
                fullWidth
              />
              <TextField
                type="email"
                variant="outlined"
                label="email"
                placeholder="Enter your email"
                name="email"
                fullWidth
              />
              <TextField
                multiline
                rows={4}
                variant="outlined"
                label="Address"
                placeholder="Enter your fullname"
                name="address"
                fullWidth
              />
            </Stack>
          </CardContent>
          <CardActions>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className={classes.submitBtn}
            >
              Place Order
            </Button>
          </CardActions>
        </Card>
      </form>
    </ThemeProvider>
  )
}
