import React from 'react'
import { Grid, Chip } from '@mui/material'

export default function CategoryItem({ title, Icon }) {
  return (
    <Grid item>
      <Chip icon={<Icon />} label={title} clickable color="primary"></Chip>
    </Grid>
  )
}
