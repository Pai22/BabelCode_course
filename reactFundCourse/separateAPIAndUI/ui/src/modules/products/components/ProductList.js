import React, { useState, useEffect } from 'react'
import { Typography, Grid, CircularProgress } from '@mui/material'
import { makeStyles, ThemeProvider } from '@mui/styles'
import { createTheme } from '@mui/material/styles'
import axios from 'axios'

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
  const [products, setPreoducts] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true)
      const { data } = await axios.get('/products')

      setPreoducts(data)
      setIsLoading(false)
    }
    loadProducts()
  }, [])

  return (
    <>
      <Typography variant="h4" component="h1" className={classes.title}>
        All Products
      </Typography>
      <CategoryList></CategoryList>
      {isLoading ? (
        <div className={classes.progress}>
          <CircularProgress color="secondary"></CircularProgress>
        </div>
      ) : (
        <Grid container spacing={2}>
          {products.map((products) => (
            <ProductItem key={products.id} {...products}></ProductItem>
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
