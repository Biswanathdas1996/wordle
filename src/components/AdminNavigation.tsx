import React from 'react'

import { useNavigate } from 'react-router-dom'
const Nav = () => {
  let history = useNavigate()
  return (
    <div className="flex items-center ">
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
    </div>
  )
}

export default Nav
