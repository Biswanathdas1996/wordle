import React, { useEffect, useState } from 'react'
import { Card, Grid } from '@mui/material'
import Typography from '@mui/material/Typography'
import { useNavigate } from 'react-router-dom'

import NavBar from './AdminNavigation'
export const convertTime = (unix_timestamp: any) => {
  // Create a new JavaScript Date object based on the timestamp
  // multiplied by 1000 so that the argument is in milliseconds, not seconds.
  var date = new Date(unix_timestamp * 1000)
  // Hours part from the timestamp
  var hours = date.getHours()
  // Minutes part from the timestamp
  var minutes = '0' + date.getMinutes()
  // Seconds part from the timestamp
  var seconds = '0' + date.getSeconds()
  var miliSeconds = '0' + date.getMilliseconds()

  // Will display time in 10:30:23 format
  var formattedTime =
    hours +
    ':' +
    minutes.substr(-2) +
    ':' +
    seconds.substr(-2) +
    ':' +
    miliSeconds.substr(-2)

  console.log(formattedTime)
  return formattedTime
}

const Registration = () => {
  const [question, setQuestion] = useState<any[]>([])
  let history = useNavigate()

  useEffect(() => {
    const session = sessionStorage.getItem('admin-session')

    if (session === null) {
      history('/admin')
      return
    } else {
      fetchAllQuestion()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchAllQuestion = () => {
    const session_id = sessionStorage.getItem('session_id')

    var requestOptions: any = {
      method: 'GET',
      redirect: 'follow',
    }

    fetch(
      `http://sosal.in/API/config/getAllQuestion.php?session_id=${session_id}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result)
        setQuestion(result)
      })
      .catch((error) => console.log('error', error))
  }
  const updateStatus = (id: any, session_id: any) => {
    const formdata = new FormData()
    console.log(id)
    formdata.append('id', id)
    formdata.append('session_id', session_id)

    var requestOptions: any = {
      method: 'POST',
      body: formdata,
      redirect: 'follow',
    }

    fetch('http://sosal.in/API/config/activateQuestion.php', requestOptions)
      .then((response) => response.text())
      .then((result) => {
        fetchAllQuestion()
      })
      .catch((error) => console.log('error', error))
  }

  return (
    <>
      <NavBar />
      <Grid style={{ marginTop: 20 }} container>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <Card className="mx-4">
            <Typography
              style={{ marginLeft: '15px', marginTop: '10px', padding: 3 }}
              component="h1"
              variant="h5"
            >
              Questions
            </Typography>

            <div className="flex flex-col">
              <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
                  <div className="overflow-hidden">
                    <table className="min-w-full">
                      <thead className="bg-white border-b">
                        <tr>
                          <th
                            scope="col"
                            className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                          >
                            #
                          </th>
                          <th
                            scope="col"
                            className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                          >
                            Question
                          </th>

                          <th
                            scope="col"
                            className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                          >
                            Start Time
                          </th>
                          <th
                            scope="col"
                            className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                          >
                            End Time
                          </th>
                          <th
                            scope="col"
                            className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                          >
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {question &&
                          question.map((data, key) => {
                            return (
                              <tr className="bg-gray-100 border-b" key={key}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {data?.id}
                                </td>
                                <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                  {data?.question}
                                </td>

                                <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                  {data?.new_start_time}
                                </td>
                                <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                  {data?.new_end_time}
                                </td>
                                <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                  {data?.status === '1' ? (
                                    <b style={{ color: 'green' }}>
                                      Currently Active
                                    </b>
                                  ) : data?.status !== '2' ? (
                                    <button
                                      onClick={() =>
                                        updateStatus(data?.id, data?.session_id)
                                      }
                                      disabled={data?.status === '2'}
                                      className="flex items-center justify-center bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 rounded "
                                    >
                                      Activate
                                    </button>
                                  ) : (
                                    <b style={{ color: 'red' }}>Finished</b>
                                  )}
                                </td>
                              </tr>
                            )
                          })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </Grid>
      </Grid>
    </>
  )
}
export default Registration
