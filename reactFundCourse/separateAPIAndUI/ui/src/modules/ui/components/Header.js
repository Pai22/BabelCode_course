import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  AppBar,
  Toolbar,
  Link,
  Switch,
  FormControlLabel,
  IconButton,
  Badge
} from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { ShoppingCart } from '@mui/icons-material'
import { makeStyles, ThemeProvider } from '@mui/styles'
import { createTheme } from '@mui/material/styles'
import { useNavigate } from 'react-router-dom'

import logo from 'assets/images/logo.png'
import * as actions from 'modules/ui/actions'

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
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const darkMode = useSelector((state) => state.ui.darkMode)

  const navigateToCart = () => navigate('/cart')

  const toggleDarkMode = () => {
    dispatch(actions.toggleDarkMode())
  }

  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar>
        <Link
          component={RouterLink}
          to="/"
          color="inherit"
          underline="none"
          className={classes.logoLink}
        >
          <img src={logo} alt="Babel Shopping" className={classes.logoImage} />
        </Link>
        <Link
          component={RouterLink}
          to="/products"
          color="inherit"
          underline="none"
          style={{ marginLeft: 8 }}
        >
          Products
        </Link>
        <div className={classes.spacer}></div>
        <FormControlLabel
          control={
            <Switch
              color="sencondary"
              checked={darkMode}
              onChange={toggleDarkMode}
            />
          }
          label="Dark"
        ></FormControlLabel>
        <IconButton color="inherit" onClick={navigateToCart}>
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
