import React from 'react'
import { useSelector } from 'react-redux'
import makeStyles from '@mui/styles/makeStyles'
import { createTheme, ThemeProvider } from '@mui/material'
import CartProduct from './CartProduct'
import { Typography } from '@mui/material'
import currencyFormat from 'utils/currencyFormat'

const theme = createTheme()

const useStyles = makeStyles((theme) => ({
  products: {
    '& > * + *': {
      marginTop: theme.spacing(2)
    }
  },
  price: {
    color: theme.palette.secondary.main,
    textAlign: 'right'
    // marginTop: theme.spacing(2),
  }
}))

function OrderContent() {
  const classes = useStyles()
  const price = useSelector((state) => state.cart.price)
  const productIds = useSelector((state) => state.cart.productIds)
  const products = useSelector((state) =>
    state.products.items.filter((product) => productIds.includes(product.id))
  )
  // const allProducts = useSelector((state) => state.products.items)
  // const productIds = useSelector((state) => state.cart.productIds)

  // const cartProducts = allProducts.filter((product) =>
  //   productIds.includes(product.id)
  // )

  return (
    <>
      <div className={classes.products}>
        {products.map((product) => (
          <CartProduct key={product.id} {...product}></CartProduct>
        ))}
      </div>
      {products.length > 0 && (
        <Typography
          variant="h5"
          component="h3"
          className={classes.price}
          marginTop={2}
        >
          {currencyFormat(price)}
        </Typography>
      )}
    </>
  )
}

export default function Order() {
  return (
    <ThemeProvider theme={theme}>
      <OrderContent></OrderContent>
    </ThemeProvider>
  )
}
