import React, { useState, useEffect } from 'react'
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
import axios from 'axios'

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
  const classes = useStyles()
  // const id = 1
  const [product, setProduct] = useState()
  const isMediumUp = useMediaQuery(theme.breakpoints.up('md'))
  const navigate = useNavigate()
  const { id } = useParams()

  const buyNow = () => navigate('/cart')

  useEffect(() => {
    const loadProduct = async () => {
      const { data } = await axios.get(`/products/${id}`)

      setProduct(data)
    }
    loadProduct()
  }, [id])

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
            classesName={classes.content}
            direction="column"
            justifyContent="space-between"
          >
            <Grid item>
              <Typography variant="h4" component="h1">
                {product.name}
              </Typography>
              <p>{product.desc}</p>
            </Grid>
            <Grid item>
              <ButtonGroup variant="contained" aria-label="Basic button group">
                <Button onClick={buyNow}>Buy Now</Button>
                <Button>Add to Cart</Button>
              </ButtonGroup>
            </Grid>
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
