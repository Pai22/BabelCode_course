import React from 'react'
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActionArea,
  Chip
} from '@mui/material'
import { makeStyles, ThemeProvider } from '@mui/styles'
import { createTheme } from '@mui/material/styles'
import { useNavigate, useLocation } from 'react-router-dom'

import currencyFormat from 'utils/currencyFormat'

const theme = createTheme()

const useStyles = makeStyles((theme) => ({
  media: {
    height: 200
  },
  footer: {
    marginTop: theme.spacing(2)
  }
}))

function ProductItemCons({ id, name, desc, image, category, price }) {
  const classes = useStyles()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const navigateToDetailst = () => navigate(`${pathname}/${id}`)

  return (
    <Grid item size={{ xs: 12, sm: 6, lg: 4 }}>
      <Card onClick={navigateToDetailst}>
        <CardActionArea>
          <CardMedia image={image} title={name} className={classes.media} />
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              {name}
            </Typography>
            <Typography gutterBottom variant="body2" component="p">
              {desc}
            </Typography>

            <Grid
              container
              alignItems="center"
              justifyContent="space-between"
              className={classes.footer}
            >
              <span>{currencyFormat(price)}</span>
              <Chip label={category} size="small"></Chip>
            </Grid>
          </CardContent>
        </CardActionArea>
      </Card>
    </Grid>
  )
}

export default function ProductItem(props) {
  return (
    <ThemeProvider theme={theme}>
      <ProductItemCons {...props}></ProductItemCons>
    </ThemeProvider>
  )
}
