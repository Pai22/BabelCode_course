import React from 'react'
import { Grid } from '@mui/material'
import {
  Headset,
  Watch,
  CameraAlt,
  Nature,
  Computer,
  Book,
  InvertColors,
  Visibility
} from '@mui/icons-material'
import { makeStyles, ThemeProvider } from '@mui/styles'
import { createTheme } from '@mui/material/styles'

import CategoryItem from './CategoryItem'

const theme = createTheme()

const CATEGORIES = [
  {
    title: 'Headphone',
    Icon: Headset
  },
  {
    title: 'Watch',
    Icon: Watch
  },
  {
    title: 'Camera',
    Icon: CameraAlt
  },
  {
    title: 'Nature',
    Icon: Nature
  },
  {
    title: 'Computer',
    Icon: Computer
  },
  {
    title: 'Book',
    Icon: Book
  },
  {
    title: 'Lotion',
    Icon: InvertColors
  },
  {
    title: 'Eyeglass',
    Icon: Visibility
  }
]

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(2)
  }
}))

function CategoryListCons() {
  const classes = useStyles()
  return (
    <Grid
      container
      justifyContent="center"
      spacing={2}
      className={classes.root}
    >
      {CATEGORIES.map((category) => (
        <CategoryItem key={category.title} {...category}></CategoryItem>
      ))}
    </Grid>
  )
}

export default function CategoryList() {
  return (
    <ThemeProvider theme={theme}>
      <CategoryListCons></CategoryListCons>
    </ThemeProvider>
  )
}
