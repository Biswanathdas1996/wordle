import React from 'react'

import { useNavigate } from 'react-router-dom'
const Nav = () => {
  let history = useNavigate()
  return (
    <div className="flex items-center ">
      <button
        onClick={() => history('/question-list')}
        className="flex items-center justify-center bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 rounded mr-2 my-4"
      >
        Questions
      </button>
      <button
        onClick={() => history('/score')}
        className="flex items-center justify-center bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 rounded "
      >
        Leader Board
      </button>
    </div>
  )
}

export default Nav
