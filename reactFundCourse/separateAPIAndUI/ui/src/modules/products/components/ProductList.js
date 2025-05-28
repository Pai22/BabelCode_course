import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Typography, Grid, CircularProgress } from '@mui/material'
import { makeStyles, ThemeProvider } from '@mui/styles'
import { createTheme } from '@mui/material/styles'
import { useLocation } from 'react-router-dom'

import queryString from 'query-string'

import * as actions from '../actions'
import CategoryList from './CategoryList'
import ProductItem from './ProductItem'

const theme = createTheme()

const useStyles = makeStyles((theme) => ({
  title: {
    textAlign: 'center',
    marginBottom: theme.spacing(2)
  },
  progress: {
    textAlign: 'center'
  }
}))

function ProductListContent() {
  const classes = useStyles()
  const dispatch = useDispatch()
  const { isLoading, items: products } = useSelector((state) => state.products)
  const { search } = useLocation()
  const { category } = queryString.parse(search)

  useEffect(() => {
    const action = actions.loadProducts(search)
    dispatch(action)
  }, [dispatch, search])

  return (
    <>
      <Typography variant="h4" component="h1" className={classes.title}>
        {category || 'All'} Products
      </Typography>
      <CategoryList></CategoryList>
      {isLoading ? (
        <div className={classes.progress}>
          <CircularProgress color="secondary"></CircularProgress>
        </div>
      ) : (
        <Grid container spacing={2}>
          {products.map((product) => (
            <ProductItem key={product.id} {...product}></ProductItem>
          ))}
        </Grid>
      )}
    </>
  )
}

export default function ProductList() {
  return (
    <ThemeProvider theme={theme}>
      <ProductListContent></ProductListContent>
    </ThemeProvider>
  )
}
