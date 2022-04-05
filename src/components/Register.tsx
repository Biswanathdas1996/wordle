import React, { useEffect, useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { Card, Grid } from '@mui/material'
import Typography from '@mui/material/Typography'
import { useNavigate } from 'react-router-dom'
import swal from 'sweetalert'
import Loader from './Loader'

const VendorSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  number: Yup.string().required('Contact Number is required'),
})

const Registration = () => {
  let history = useNavigate()
  const [loader, setLoader] = useState(false)

  useEffect(() => {
    localStorage.removeItem('gameState')
    localStorage.removeItem('gameStats')
  }, [])

  const saveData = (value: any) => {
    setLoader(true)
    var formdata = new FormData()
    formdata.append('name', value?.name)
    formdata.append('contact_number', value?.number)

    var requestOptions: any = {
      method: 'POST',
      body: formdata,
      redirect: 'follow',
    }

    fetch('http://sosal.in/API/config/Register.php', requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result)

        localStorage.setItem('userId', result?.id)
        localStorage.setItem('userName', result?.name)
        setLoader(false)
        history('/question')
      })
      .catch((error) => {
        console.log('error', error)
        swal('An error occurred, Please try again')
        setLoader(false)
      })
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
              User Registration
            </Typography>
            <div
              className="p-8 h-full"
              style={{ justifyContent: 'center', padding: '20px' }}
            >
              <Formik
                initialValues={{
                  name: '',
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
                      <label htmlFor="name">Full Name</label>
                      <Field
                        type="text"
                        name="name"
                        autoComplete="flase"
                        placeholder="Enter full name"
                        className={`form-control text-muted ${
                          touched.name && errors.name ? 'is-invalid' : ''
                        }`}
                      />

                      <ErrorMessage
                        component="div"
                        name="name"
                        className="invalid-feedback"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="name">Contact No</label>
                      <Field
                        type="number"
                        name="number"
                        autoComplete="flase"
                        placeholder="Enter contact number"
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
                      {loader ? (
                        <Loader />
                      ) : (
                        <div
                          className="flex justify-center items-center mt-4"
                          style={{
                            background: '#414141',
                            padding: 10,
                            color: 'white',
                          }}
                        >
                          <input
                            className="flex justify-center items-center  text-white font-bold py-2 px-4 rounded"
                            type="submit"
                            value={'Enter in room'}
                            style={{ width: '100%' }}
                          />
                        </div>
                      )}
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
