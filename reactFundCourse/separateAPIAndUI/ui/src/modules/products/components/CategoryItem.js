import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Grid, Chip } from '@mui/material'

export default function CategoryItem({ title, Icon }) {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const filterProductsByCategory = () =>
    navigate(`${pathname}?category=${title}`)

  return (
    <Grid item onClick={filterProductsByCategory}>
      <Chip icon={<Icon />} label={title} clickable color="primary"></Chip>
    </Grid>
  )
}
