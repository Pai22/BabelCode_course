import React from 'react'
import makeStyles from '@mui/styles/makeStyles'
import { createTheme, ThemeProvider } from '@mui/material'
import { Typography, Grid } from '@mui/material'

import Order from './Order'
import Delivery from './Delivery'

const theme = createTheme()

const useStyles = makeStyles((theme) => ({
  title: {
    textAlign: 'center',
    marginBottom: theme.spacing(2)
  }
}))

function CartContent() {
  const classes = useStyles()
  return (
    <>
      <Typography variant="h4" component="h1" className={classes.title}>
        Order Summary
      </Typography>
      {/* variant คือรูปแบบการแสดงผลบนหน้าจอ component เป็น tag ของมัน */}
      <Grid container spacing={2}>
        <Grid item size={{ xs: 12, lg: 8 }}>
          <Order></Order>
        </Grid>
        <Grid item size={{ xs: 12, lg: 4 }}>
          <Delivery></Delivery>
        </Grid>
      </Grid>
    </>
  )
}

export default function Cart() {
  return (
    <ThemeProvider theme={theme}>
      <CartContent></CartContent>
    </ThemeProvider>
  )
}
