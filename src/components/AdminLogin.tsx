import React from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { Card, Grid } from '@mui/material'
import Typography from '@mui/material/Typography'
import { useNavigate } from 'react-router-dom'
import swal from 'sweetalert'

const VendorSchema = Yup.object().shape({
  number: Yup.string().required('Password is required'),
})

const makeid = (length: any) => {
  var result = ''
  var characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  var charactersLength = characters.length
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

const Registration = () => {
  let history = useNavigate()

  const saveData = (value: any) => {
    console.log(value)

    var formdata = new FormData()
    formdata.append('password', value.number)

    var requestOptions: any = {
      method: 'POST',
      body: formdata,
      redirect: 'follow',
    }

    fetch('http://sosal.in/API/config/adminLogin.php', requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result === 1) {
          sessionStorage.setItem('admin-session', makeid(10))
          history('/question-list')
        } else {
          swal('Please check the password')
        }
      })
      .catch((error) => console.log('error', error))
  }

  return (
    <>
      <Grid style={{ marginTop: 20 }} container>
        <Grid item lg={3} md={3} sm={12} xs={12}></Grid>
        <Grid item lg={6} md={6} sm={12} xs={12}>
          <Card>
            <Typography
              style={{ marginLeft: '15px', marginTop: '10px', padding: 3 }}
              component="h1"
              variant="h5"
            >
              Admin
            </Typography>
            <div
              className="p-8 h-full"
              style={{ justifyContent: 'center', padding: '20px' }}
            >
              <Formik
                initialValues={{
                  number: '',
                }}
                validationSchema={VendorSchema}
                onSubmit={(values, { setSubmitting }) => {
                  saveData(values)
                  setSubmitting(false)
                }}
              >
                {({ touched, errors, isSubmitting }) => (
                  <Form>
                    <div className="form-group">
                      <label htmlFor="name">Password</label>
                      <Field
                        type="password"
                        name="number"
                        autoComplete="flase"
                        placeholder="Enter password"
                        className={`form-control text-muted ${
                          touched.number && errors.number ? 'is-invalid' : ''
                        }`}
                      />

                      <ErrorMessage
                        component="div"
                        name="number"
                        className="invalid-feedback"
                      />
                    </div>

                    <span className="input-group-btn">
                      <input
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        type="submit"
                        value={'Sign in'}
                        style={{ marginTop: 20, color: 'black' }}
                      />
                    </span>
                  </Form>
                )}
              </Formik>
            </div>
          </Card>
        </Grid>
        <Grid item lg={3} md={3} sm={12} xs={12}></Grid>
      </Grid>
    </>
  )
}
export default Registration
