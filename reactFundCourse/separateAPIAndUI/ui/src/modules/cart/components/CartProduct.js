import React from 'react'
import makeStyles from '@mui/styles/makeStyles'
import { createTheme, ThemeProvider } from '@mui/material'
import {
  CardContent,
  CardMedia,
  IconButton,
  Typography,
  Grid,
  Card
} from '@mui/material'
import { Delete } from '@mui/icons-material'
import currencyFormat from 'utils/currencyFormat'

const theme = createTheme()

const useStyles = makeStyles((theme) => ({
  product: {
    display: 'flex'
  },
  productDetails: {
    flex: 1
  },
  image: {
    width: 150
  }
}))

function CartProductCons({ image, name, price }) {
  const classes = useStyles()

  return (
    <Card className={classes.product}>
      <CardMedia image={image} title={name} className={classes.image} />
      <CardContent className={classes.productDetails}>
        <Typography variant="h5" component="h2">
          {name}
        </Typography>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <div>{currencyFormat(price)}</div>
          </Grid>
          <Grid item>
            <IconButton aria-label="delete" size="small">
              <Delete></Delete>
            </IconButton>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default function CartProduct(props) {
  return (
    <ThemeProvider theme={theme}>
      <CartProductCons {...props}></CartProductCons>
    </ThemeProvider>
  )
}
