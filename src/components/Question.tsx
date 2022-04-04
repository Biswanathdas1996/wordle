import { useState, useEffect } from 'react'
import { Grid } from '../components/grid/Grid'
import { Keyboard } from '../components/keyboard/Keyboard'
import { MAX_WORD_LENGTH, MAX_CHALLENGES } from '../constants/settings'
import {
  isWinningWord,
  unicodeLength,
  localeAwareUpperCase,
} from '../lib/words'
import { addStatsForCompletedGame, loadStats } from '../lib/stats'
import {
  loadGameStateFromLocalStorage,
  saveGameStateToLocalStorage,
} from '../lib/localStorage'
import { default as GraphemeSplitter } from 'grapheme-splitter'
import { Grid as Gird2 } from '@mui/material'
import swal from 'sweetalert'
import Timer from './Timer'
// const answer = localeAwareUpperCase('money')

import { convertTime } from './QuestionList'
import Countdown from 'react-countdown'

const Completionist = () => (
  <span style={{ color: 'white' }}>You are good to go!</span>
)

function Question() {
  const [currentGuess, setCurrentGuess] = useState('')
  const [isGameWon, setIsGameWon] = useState(false)
  const [currentRowClass, setCurrentRowClass] = useState('')
  const [isGameLost, setIsGameLost] = useState(false)
  const [question, setQuestion] = useState(null)
  const [endTime, setEndTime] = useState<any>('')
  const [answer, setAnswer] = useState('')
  const [isRevealing, setIsRevealing] = useState(false)

  const [guesses, setGuesses] = useState<string[]>(() => {
    const loaded = loadGameStateFromLocalStorage()
    if (loaded) {
      return loaded?.guesses
    } else {
      return []
    }
  })

  const user = localStorage.getItem('userName')

  const [stats, setStats] = useState(() => loadStats())

  useEffect(
    () => saveGameStateToLocalStorage({ guesses, answer }),
    [guesses, answer]
  )

  const onChar = (value: string) => {
    if (
      unicodeLength(`${currentGuess}${value}`) <= MAX_WORD_LENGTH &&
      guesses.length < MAX_CHALLENGES &&
      !isGameWon
    ) {
      setCurrentGuess(`${currentGuess}${value}`)
    }
  }

  const onDelete = () => {
    setCurrentGuess(
      new GraphemeSplitter().splitGraphemes(currentGuess).slice(0, -1).join('')
    )
  }

  useEffect(() => {
    var requestOptions: any = {
      method: 'GET',
      redirect: 'follow',
    }

    fetch('http://sosal.in/API/config/GetQuestion.php', requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result)

        const currentQuestionId = localStorage.getItem('questionId')
        if (currentQuestionId && currentQuestionId !== result[0]?.id) {
          localStorage.removeItem('gameState')
          localStorage.removeItem('gameStats')
          localStorage.removeItem('questionId')

          window.location.reload()
          return
        }

        localStorage.setItem('questionId', result[0]?.id)
        setQuestion(result[0]?.question)
        setEndTime(result[0]?.end_time)
        setAnswer(localeAwareUpperCase(result[0]?.answer))
      })
      .catch((error) => console.log('error', error))
  }, [])

  const insertEnrty = (guesses: any): any => {
    const userId: any = localStorage.getItem('userId')
    const questionId: any = localStorage.getItem('questionId')

    var formdata = new FormData()
    formdata.append('user_id', userId)
    formdata.append('question_id', questionId)
    formdata.append('attempt', JSON.stringify(guesses))

    var requestOptions: any = {
      method: 'POST',
      body: formdata,
      redirect: 'follow',
    }

    fetch('http://sosal.in/API/config/InsertResponse.php', requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.log('error', error))
  }

  const correctAttempt: (guesses: any, attempt: any) => void = (
    guesses,
    attempt
  ) => {
    const userId: any = localStorage.getItem('userId')
    const questionId: any = localStorage.getItem('questionId')
    const date = new Date()
    var formdata = new FormData()
    formdata.append('user_id', userId)
    formdata.append('question_id', questionId)
    formdata.append('correct_attempt', attempt?.toString())
    formdata.append('time', date.getTime().toString())
    formdata.append('attempt', JSON.stringify(guesses))

    var requestOptions: any = {
      method: 'POST',
      body: formdata,
      redirect: 'follow',
    }

    fetch('http://sosal.in/API/config/correctAttempt.php', requestOptions)
      .then((response) => response.text())
      .then((result) => {
        console.log(result)
        swal('Success!', 'you have successfully completed the test', 'success')
      })
      .catch((error) => console.log('error', error))
  }

  let winningWord = false
  if (answer !== '') {
    winningWord = isWinningWord(currentGuess, answer)
  }

  const onEnter = () => {
    if (isGameWon || isGameLost) {
      return
    }

    if (!(unicodeLength(currentGuess) === MAX_WORD_LENGTH)) {
      setCurrentRowClass('jiggle')
      return false
    }

    // enforce hard mode - all guesses must contain all previously revealed letters

    setIsRevealing(true)

    if (
      unicodeLength(currentGuess) === MAX_WORD_LENGTH &&
      guesses.length < MAX_CHALLENGES &&
      !isGameWon
    ) {
      setGuesses([...guesses, currentGuess])

      if (winningWord) {
        correctAttempt(
          [...guesses, currentGuess],
          [...guesses, currentGuess].length
        )
      } else {
        insertEnrty([...guesses, currentGuess])
      }

      setCurrentGuess('')

      if (winningWord) {
        setStats(addStatsForCompletedGame(stats, guesses.length))
        return setIsGameWon(true)
      }

      if (guesses.length === MAX_CHALLENGES - 1) {
        setStats(addStatsForCompletedGame(stats, guesses.length + 1))
        setIsGameLost(true)
      }
    }
  }

  const renderer = ({ hours, minutes, seconds, completed }: any) => {
    if (completed) {
      // Render a completed state
      return (
        <>
          <h5 className="font-medium leading-tight text-xl mt-0 mb-2 text-lime-50">
            Times up !!
            <p>Thank you for your participation!</p>
          </h5>
          <br />
          <button className="flex items-center justify-center bg-blue-500 hover:bg-blue-700 text-white font-bold p-4 rounded ">
            Next Question
          </button>
        </>
      )
    } else {
      // Render a countdown
      return (
        <>
          <div
            style={{
              border: '1px solid white',
              padding: 10,
              textAlign: 'center',
            }}
          >
            <h4 className="font-medium leading-tight  text-2xl mt-0 mb-2 text-lime-50 ">
              <small>Time Remaining: </small> {hours} <small>Hours</small> -{' '}
              {minutes} <small>Minutes</small> - {seconds}{' '}
              <small> Seconds</small>
            </h4>
          </div>
          <br />
          <Grid
            guesses={guesses}
            currentGuess={currentGuess}
            isRevealing={isRevealing}
            currentRowClassName={currentRowClass}
            answer={answer}
          />

          <div style={{ marginTop: 20 }}>
            <Keyboard
              onChar={onChar}
              onDelete={onDelete}
              onEnter={onEnter}
              guesses={guesses}
              isRevealing={isRevealing}
              answer={answer}
            />
          </div>
          <div
            style={{ marginTop: 20 }}
            className="flex items-center justify-center mx-0.5 text-xs font-bold cursor-pointer "
          >
            <button
              onClick={() => onEnter()}
              className="flex items-center justify-center bg-blue-500 hover:bg-blue-700 text-white font-bold p-4 rounded "
            >
              Submit
            </button>
          </div>
        </>
      )
    }
  }

  return (
    <Gird2 style={{ marginTop: 20 }} container>
      <Gird2 item lg={3} md={3} sm={12} xs={12}></Gird2>
      {answer !== '' && (
        <Gird2 item lg={6} md={6} sm={12} xs={12}>
          <h5 className="font-medium leading-tight text-xl mt-0 mb-2 text-lime-50 py-6">
            Question: <b>{question}</b>
          </h5>

          <Countdown date={new Date(endTime * 1000)} renderer={renderer} />
        </Gird2>
      )}

      <Gird2 item lg={3} md={3} sm={12} xs={12} style={{ padding: 10 }}>
        <h4 className="font-medium leading-tight  text-2xl mt-0 mb-2 text-lime-50 float-right">
          Welcome {user}
        </h4>
      </Gird2>
    </Gird2>
  )
}

export default Question
