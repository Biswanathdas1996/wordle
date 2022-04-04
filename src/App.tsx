import React from 'react'
import Question from './components/Question'
import Register from './components/Register'
import QuestionList from './components/QuestionList'
import './App.css'
import { Routes, Route } from 'react-router-dom'

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/question" element={<Question />} />
        <Route path="/question-list" element={<QuestionList />} />
      </Routes>
    </div>
  )
}

export default App
