import React from 'react'
import makeStyles from '@mui/styles/makeStyles'
import { createTheme, ThemeProvider } from '@mui/material'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import {
  CardContent,
  TextField,
  Typography,
  Card,
  CardActions,
  Button,
  Stack
} from '@mui/material'

const theme = createTheme()

const useStyles = makeStyles((theme) => ({
  form: {
    '& > * + *': {
      marginTop: theme.spacing(2)
    }
  },
  submitBtn: {
    flex: 1 // กำหนดให้ Button กินพื้นที่เต็ม
  }
}))

const schema = yup.object().shape({
  name: yup.string().required(),
  email: yup.string().email().required(),
  address: yup.string().required()
})

export default function Delivery() {
  const classes = useStyles()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  })

  const submit = (deliveryInfo) => {
    console.log(deliveryInfo)
  }

  return (
    <ThemeProvider theme={theme}>
      <form onSubmit={handleSubmit(submit)} autoComplete="off">
        <Card>
          <CardContent className={classes.form}>
            <Typography variant="h5" component="h2">
              Delivery Information
            </Typography>
            <Stack spacing={2}>
              <TextField
                {...register('name')}
                variant="outlined"
                label="Name"
                placeholder="Enter your fullname"
                name="name"
                fullWidth
                helperText={errors.name?.message || ''} // helperText ของ TextField ข้อความที่เป็นตัวช่วย
                error={!!errors.name} // error={true} ของ TextField จะแสดงข้อความเป็นสีแดงพร้อมกรอบ
                //error={!!errors.name} ใส่เครื่ิงหมายตกใจ 2 ครั้งเป็นการทำให้ errors.name เป็น boolean
              />
              <TextField
                {...register('email')}
                type="email"
                variant="outlined"
                label="email"
                placeholder="Enter your email"
                name="email"
                fullWidth
                helperText={errors.email?.message || ''}
                error={!!errors.email}
              />
              <TextField
                {...register('address')}
                multiline
                rows={4}
                variant="outlined"
                label="Address"
                placeholder="Enter your fullname"
                name="address"
                fullWidth
                helperText={errors.address?.message || ''}
                error={!!errors.address}
              />
            </Stack>
          </CardContent>
          <CardActions>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className={classes.submitBtn}
            >
              Place Order
            </Button>
          </CardActions>
        </Card>
      </form>
    </ThemeProvider>
  )
}
