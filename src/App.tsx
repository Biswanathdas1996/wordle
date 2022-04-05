import React from 'react'
import Question from './components/Question'
import Register from './components/Register'
import QuestionList from './components/QuestionList'
import AdminLogin from './components/AdminLogin'
import LeaderBoard from './components/LeaderBoard'
import './App.css'
import { Routes, Route } from 'react-router-dom'

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/question" element={<Question />} />
        <Route path="/question-list" element={<QuestionList />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/score" element={<LeaderBoard />} />
      </Routes>
    </div>
  )
}

export default App
