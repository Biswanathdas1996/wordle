import React from 'react'
import Question from './components/Question'
import Register from './components/Register'
import Login from './components/Login'
import QuestionList from './components/QuestionList'
import AdminLogin from './components/AdminLogin'
import LeaderBoard from './components/LeaderBoard'
import AddQuestion from './components/AddQuestion'
import ChooseSession from './components/ChooseSession'
import './App.css'
import { Routes, Route } from 'react-router-dom'

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/question" element={<Question />} />
        <Route path="/question-list" element={<QuestionList />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/score" element={<LeaderBoard />} />
        <Route path="/add-question" element={<AddQuestion />} />
        <Route path="/choose-session" element={<ChooseSession />} />
      </Routes>
    </div>
  )
}

export default App
