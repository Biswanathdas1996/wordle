import React, { useEffect, useState } from 'react'
import { Card, Grid } from '@mui/material'
import Typography from '@mui/material/Typography'
import { useNavigate } from 'react-router-dom'
import NavBar from './AdminNavigation'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'

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
    const session_id: any = sessionStorage.getItem('session_id')
    var formdata = new FormData()
    formdata.append('session_id', session_id)

    var requestOptions: any = {
      method: 'POST',
      body: formdata,
      redirect: 'follow',
    }

    fetch('http://sosal.in/API/config/leaderBoard.php', requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log('-----', result)
        const shortScore = result.sort(function (a: any, b: any) {
          return a?.score - b?.score
        })
        setUser(shortScore?.slice(0, 10))
      })
      .catch((error) => console.log('error', error))
  }

  return (
    <>
      <NavBar />
      <Grid style={{ marginTop: 20 }} container>
        <Grid item lg={1} md={1} sm={12} xs={12}></Grid>
        <Grid item lg={10} md={10} sm={12} xs={12}>
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
                            Rank
                          </th>
                          <th
                            scope="col"
                            className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                          >
                            Name
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {user &&
                          user?.map((data, key) => {
                            const size = 50 - key * 5
                            const sizeText = 30 - key * 5
                            return (
                              <tr
                                className={
                                  key === 0
                                    ? `bg-gray-400 border-b`
                                    : key === 1
                                    ? `bg-gray-300 border-b`
                                    : key === 2
                                    ? `bg-gray-200 border-b`
                                    : `bg-gray-100 border-b`
                                }
                                key={key}
                              >
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  <b style={{ fontSize: sizeText }}>
                                    {[0, 1, 2].includes(key) && (
                                      <EmojiEventsIcon
                                        className="mr-2"
                                        style={{ fontSize: size }}
                                      />
                                    )}{' '}
                                    {key + 1}
                                  </b>
                                </td>
                                <td
                                  className="px-2 py-3 whitespace-nowrap text-sm font-medium text-gray-900"
                                  title={data?.score}
                                >
                                  <b
                                    style={
                                      [0, 1, 2].includes(key)
                                        ? { fontSize: sizeText }
                                        : { fontSize: 15 }
                                    }
                                  >
                                    {data?.user_name}
                                  </b>

                                  <p>{data?.user_contact_number}</p>
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
        <Grid item lg={1} md={1} sm={12} xs={12}></Grid>
      </Grid>
    </>
  )
}
export default LeaderBoard
