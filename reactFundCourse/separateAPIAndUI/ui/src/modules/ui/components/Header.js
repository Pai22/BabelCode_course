import React from 'react'
import {
  AppBar,
  Toolbar,
  Link,
  Switch,
  FormControlLabel,
  IconButton,
  Badge
} from '@mui/material'
import { ShoppingCart } from '@mui/icons-material'
import { makeStyles, ThemeProvider } from '@mui/styles'
import { createTheme } from '@mui/material/styles'

import logo from 'assets/images/logo.png'

const theme = createTheme()

const useStyles = makeStyles((theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer
  },
  logoLink: {
    marginRight: theme.spacing(2)
  },
  logoImage: {
    width: 30,
    height: 30
  },
  spacer: {
    flexGrow: 1
  }
}))

function HeaderContent() {
  const classes = useStyles()
  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar>
        <Link
          href="/"
          color="inherit"
          underline="none"
          className={classes.logoLink}
        >
          <img src={logo} alt="Babel Shopping" className={classes.logoImage} />
        </Link>
        <Link
          href="/products"
          color="inherit"
          underline="none"
          style={{ marginLeft: 8 }}
        >
          Products
        </Link>
        <div className={classes.spacer}></div>
        <FormControlLabel
          control={<Switch color="sencondary" />}
          label="Dark"
        ></FormControlLabel>
        <IconButton color="inherit">
          <Badge badgeContent={5} color="secondary">
            <ShoppingCart></ShoppingCart>
          </Badge>
        </IconButton>
      </Toolbar>
    </AppBar>
  )
}

export default function Header() {
  return (
    <ThemeProvider theme={theme}>
      <HeaderContent />
    </ThemeProvider>
  )
}
