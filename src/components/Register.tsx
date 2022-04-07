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
  const [session, setSession] = useState([])

  useEffect(() => {
    localStorage.removeItem('gameState')
    localStorage.removeItem('gameStats')
    localStorage.removeItem('sessionId')
    getAllSession()
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
        localStorage.setItem('userId', result?.id)
        localStorage.setItem('userName', result?.name)

        setLoader(false)
        history('/choose-session')
        // history('/question')
      })
      .catch((error) => {
        console.log('error', error)
        swal('An error occurred, Please try again')
        setLoader(false)
      })
  }
  const reset = () => {
    swal({
      title: 'Are you sure?',
      text: 'You want to re-set the current seeion !',
      icon: 'warning',

      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        localStorage.clear()
        window.location.reload()
      }
    })
  }

  const getAllSession = () => {
    var requestOptions: any = {
      method: 'GET',
      redirect: 'follow',
    }

    fetch('http://sosal.in/API/config/getAllSession.php', requestOptions)
      .then((response) => response.json())
      .then((result) => setSession(result))
      .catch((error) => console.log('error', error))
  }
  console.log(session)

  return (
    <>
      <Grid style={{ marginTop: 20 }} container>
        <Grid item lg={3} md={3} sm={12} xs={12}></Grid>
        <Grid item lg={6} md={6} sm={12} xs={12}>
          <Card className="m-4 p-1">
            <Typography
              style={{ marginLeft: '15px', marginTop: '10px', padding: 3 }}
              component="h1"
              variant="h5"
            >
              Registration
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
                      <Field
                        type="text"
                        name="name"
                        autoComplete="flase"
                        placeholder="Full name"
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
                    <div className="form-group mt-2">
                      <Field
                        type="number"
                        name="number"
                        autoComplete="flase"
                        placeholder="Contact number"
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
                            value={'Lets Begin'}
                            style={{ width: '100%' }}
                          />
                        </div>
                      )}
                    </span>
                  </Form>
                )}
              </Formik>

              <p
                onClick={() => history('/login')}
                style={{ float: 'left' }}
                className="mt-2 p-2 text-xl"
              >
                Log in
              </p>
              <p
                onClick={() => reset()}
                style={{ float: 'right' }}
                className="mt-2 p-2 text-xl"
              >
                Reset session
              </p>
            </div>
          </Card>
        </Grid>
        <Grid item lg={3} md={3} sm={12} xs={12}></Grid>
      </Grid>
    </>
  )
}
export default Registration
