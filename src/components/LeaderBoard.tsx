import React, { useEffect, useState } from 'react'
import { Card, Grid } from '@mui/material'
import Typography from '@mui/material/Typography'
import { useNavigate } from 'react-router-dom'
import NavBar from './AdminNavigation'

const LeaderBoard = () => {
  const [user, setUser] = useState<any[]>([])
  let history = useNavigate()

  useEffect(() => {
    const session = sessionStorage.getItem('admin-session')

    if (session === null) {
      history('/admin')
      return
    } else {
      fetchAll()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchAll = () => {
    var requestOptions: any = {
      method: 'GET',
      redirect: 'follow',
    }

    fetch('http://sosal.in/API/config/leaderBoard.php', requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result)
        const shortScore = result.sort(function (a: any, b: any) {
          return a?.score - b?.score
        })
        setUser(shortScore)
      })
      .catch((error) => console.log('error', error))
  }

  return (
    <>
      <Grid style={{ marginTop: 20 }} container>
        <Grid item lg={2} md={2} sm={12} xs={12}></Grid>
        <Grid item lg={8} md={8} sm={12} xs={12}>
          <NavBar />
          <Card>
            <Typography
              style={{ marginLeft: '15px', marginTop: '10px', padding: 3 }}
              component="h1"
              variant="h5"
            >
              Leader Board
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
                            Name
                          </th>

                          <th
                            scope="col"
                            className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                          >
                            Contact Number
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {user &&
                          user?.map((data, key) => {
                            return (
                              <tr
                                className={
                                  key === 0
                                    ? `bg-green-400 border-b`
                                    : `bg-gray-100 border-b`
                                }
                                key={key}
                              >
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {key + 1}
                                </td>
                                <td
                                  className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                                  title={data?.score}
                                >
                                  {data?.name}
                                </td>
                                <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                  {data?.contact_no}
                                </td>
                              </tr>
                            )
                          })}
                      </tbody>
                    </table>
                    {user && user.length === 0 && (
                      <Typography
                        style={{
                          marginLeft: '15px',
                          marginTop: '10px',
                          padding: 3,
                        }}
                        component="h5"
                        variant="h5"
                      >
                        No Data Available
                      </Typography>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </Grid>
        <Grid item lg={2} md={2} sm={12} xs={12}></Grid>
      </Grid>
    </>
  )
}
export default LeaderBoard
