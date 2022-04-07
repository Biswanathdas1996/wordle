import React from 'react'

import { useNavigate } from 'react-router-dom'
const Nav = () => {
  let history = useNavigate()

  const logOut = () => {
    sessionStorage.clear()
    history('/admin')
    return
  }

  const session_id: any = sessionStorage.getItem('session_id')
  const allSessionString: any = sessionStorage.getItem('allSession')
  const allSession = JSON.parse(allSessionString)
  const currentSession = allSession.find((data: any) => data?.id === session_id)

  // allSession
  return (
    <>
      <div
        className="flex flex-column items-center justify-center"
        style={{
          background: 'grey',
          padding: 10,
          top: 0,
          position: 'absolute',
          width: '100%',
        }}
      >
        <h4 className=" font-medium leading-tight  text-2xl mt-0 text-lime-50 float-right">
          {currentSession?.session_name}
        </h4>
      </div>

      <div className="flex items-center my-5 mx-2">
        {/* <div
        className="flex justify-center items-center my-4 mr-2 p-0"
        style={{
          background: 'white',
        }}
      >
        <button
          onClick={() => history('/add-question')}
          className="flex items-center justify-center  text-dark font-bold p-2 rounded mr-2 "
          style={{ width: '100%' }}
        >
          Add Questions
        </button>
      </div> */}

        <div
          className="flex justify-center items-center my-4 mr-2 p-0"
          style={{
            background: 'white',
          }}
        >
          <button
            onClick={() => history('/question-list')}
            className="flex items-center justify-center  text-dark font-bold p-2 rounded mr-2 "
            style={{ width: '100%' }}
          >
            Questions
          </button>
        </div>

        <div
          className="flex justify-center items-center my-4 mr-2 p-0"
          style={{
            background: 'white',
          }}
        >
          <button
            onClick={() => history('/score')}
            className="flex items-center justify-center  text-dark font-bold p-2 rounded mr-2 "
            style={{ width: '100%' }}
          >
            Leader Board
          </button>
        </div>
        <div
          className="flex justify-center items-center my-4 mr-2 p-0"
          style={{
            background: 'white',
          }}
        >
          <button
            onClick={() => logOut()}
            className="flex items-center justify-center  text-dark font-bold p-2 rounded mr-2 float-right"
            style={{ width: '100%' }}
          >
            Log Out
          </button>
        </div>
      </div>
    </>
  )
}

export default Nav
