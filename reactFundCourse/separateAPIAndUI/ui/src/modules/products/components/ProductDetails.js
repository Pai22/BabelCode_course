import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Paper,
  Grid,
  useMediaQuery,
  Typography,
  ButtonGroup,
  Button
} from '@mui/material'
import { makeStyles, ThemeProvider } from '@mui/styles'
import { createTheme } from '@mui/material/styles'
import { useNavigate, useParams } from 'react-router-dom'

import * as productActions from '../actions'
import * as cartActions from 'modules/cart/action'

const theme = createTheme()

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2)
  },
  content: {
    height: '100%'
  },
  amountContainer: {
    marginBottom: theme.spacing(2)
  },
  amout: {
    padding: theme.spacing(0, 2)
  }
}))

function ProductDetailsCons() {
  const { id } = useParams()
  const classes = useStyles()
  const dispatch = useDispatch()
  const [product] = useSelector((state) => state.products.items)
  const productIds = useSelector((state) => state.cart.productIds)
  const exists = productIds.includes(id)
  const navigate = useNavigate()
  const isMediumUp = useMediaQuery(theme.breakpoints.up('md'))

  useEffect(() => {
    const action = productActions.loadProduct(id)

    dispatch(action)
  }, [dispatch, id])

  const addToCart = () => dispatch(cartActions.addToCart(id))

  const buyNow = () => {
    dispatch(cartActions.addToCart(id))
    navigate('/cart')
  }

  if (!product) return null

  return (
    <Paper className={classes.root}>
      <Grid
        container
        spacing={2}
        justifyContent={isMediumUp ? 'flex-start' : 'center'}
      >
        <Grid item>
          <img src={product.image} alt={product.name} />
        </Grid>
        <Grid item>
          <Grid
            container
            className={classes.content}
            direction="column"
            justifyContent="space-between"
          >
            <Grid item>
              <Typography variant="h4" component="h1">
                {product.name}
              </Typography>
              <p>{product.desc}</p>
            </Grid>
            {!exists && (
              <Grid item>
                <ButtonGroup
                  variant="contained"
                  aria-label="Basic button group"
                >
                  <Button onClick={buyNow}>Buy Now</Button>
                  <Button onClick={addToCart}>Add to Cart</Button>
                </ButtonGroup>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  )
}

export default function ProductDetails() {
  return (
    <ThemeProvider theme={theme}>
      <ProductDetailsCons></ProductDetailsCons>
    </ThemeProvider>
  )
}
