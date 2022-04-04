import { useState, useEffect } from 'react'
import { Grid } from '../components/grid/Grid'
import { Keyboard } from '../components/keyboard/Keyboard'
import { MAX_CHALLENGES } from '../constants/settings'
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
import Countdown from 'react-countdown'
import { useNavigate } from 'react-router-dom'

function Question() {
  const [currentGuess, setCurrentGuess] = useState('')
  const [isGameWon, setIsGameWon] = useState(false)
  const [currentRowClass, setCurrentRowClass] = useState('')
  const [isGameLost, setIsGameLost] = useState(false)
  const [isSuccessAttemptCompleted, setIsSuccessAttemptCompleted] =
    useState(false)
  const [question, setQuestion] = useState(null)
  const [endTime, setEndTime] = useState<any>('')
  const [answer, setAnswer] = useState('')
  const [isRevealing, setIsRevealing] = useState(false)
  let history = useNavigate()
  const [guesses, setGuesses] = useState<string[]>(() => {
    const loaded = loadGameStateFromLocalStorage()
    if (loaded) {
      return loaded?.guesses
    } else {
      return []
    }
  })

  const user = localStorage.getItem('userName')
  if (!user) {
    history('/')
  }
  const [stats, setStats] = useState(() => loadStats())

  useEffect(
    () => saveGameStateToLocalStorage({ guesses, answer }),
    [guesses, answer]
  )

  const onChar = (value: string) => {
    if (
      unicodeLength(`${currentGuess}${value}`) <= answer.length &&
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

  const getCurrentActiveQuestion = async () => {
    var requestOptions: any = {
      method: 'GET',
      redirect: 'follow',
    }
    const result = await fetch(
      'http://sosal.in/API/config/GetQuestion.php',
      requestOptions
    )
      .then((response) => response.json())
      .then(async (result) => {
        console.log(result)
        await checkIfSuccessAttempt(result)
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
        const answer = result[0]?.answer

        setAnswer(localeAwareUpperCase(answer))
        return result[0]?.id
      })
      .catch((error) => console.log('error', error))
    return result
  }

  useEffect(() => {
    getCurrentActiveQuestion()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function checkIfSuccessAttempt(result: any) {
    const userId: any = localStorage.getItem('userId')
    const questionId: any = localStorage.getItem('questionId')
    var formdata = new FormData()
    formdata.append('user_id', userId)
    formdata.append('question_id', questionId)

    var requestOptions: any = {
      method: 'POST',
      body: formdata,
      redirect: 'follow',
    }

    fetch('http://sosal.in/API/config/checkSuccessAttempt.php', requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        if (data === 1) {
          setIsSuccessAttemptCompleted(true)
        } else {
        }
      })
      .catch((error) => console.log('error', error))
  }

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

  function correctAttempt(guesses: any, attempt: any) {
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
        setIsSuccessAttemptCompleted(true)
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

    if (!(unicodeLength(currentGuess) === answer.length)) {
      setCurrentRowClass('jiggle')
      return false
    }

    // enforce hard mode - all guesses must contain all previously revealed letters

    setIsRevealing(true)

    if (
      unicodeLength(currentGuess) === answer.length &&
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

  const nextQuestion = async () => {
    const currentQuestionId: any = await localStorage.getItem('questionId')
    const getActiveQId: any = await getCurrentActiveQuestion()

    if (currentQuestionId === getActiveQId) {
      swal('Please wait for the next question')
    }
  }

  const renderer = ({ hours, minutes, seconds, completed }: any) => {
    if (completed) {
      // Render a completed state
      return (
        <div
          className="flex flex-column items-center justify-center"
          style={{
            border: '1px solid white',
            padding: 20,
            textAlign: 'center',
          }}
        >
          <h5 className="font-medium leading-tight text-xl mt-0 mb-2 text-lime-50">
            Times up !!
            <p>Thank you for your participation!</p>
          </h5>

          <button
            onClick={() => nextQuestion()}
            className="flex items-center justify-center bg-blue-500 hover:bg-blue-700 text-white font-bold p-4 rounded "
          >
            Next Question
          </button>
        </div>
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
            onEnter={onEnter}
            length={answer.length}
          />

          <div style={{ marginTop: 20 }}>
            <Keyboard
              onChar={onChar}
              onDelete={onDelete}
              onEnter={onEnter}
              guesses={guesses}
              isRevealing={isRevealing}
              answer={answer}
              length={answer.length}
            />
          </div>
          <div
            style={{ marginTop: 20 }}
            className="flex items-center justify-center mx-0.5 text-xs font-bold cursor-pointer "
          ></div>
        </>
      )
    }
  }

  return (
    <Gird2 style={{ marginTop: 20 }} container>
      <Gird2 item lg={12} md={12} sm={12} xs={12}>
        <div className="flex flex-column items-center justify-center">
          <h4 className="font-medium leading-tight  text-2xl mt-0 mb-4 text-lime-50 float-right">
            Welcome {user}
          </h4>
        </div>
      </Gird2>

      <Gird2 item lg={3} md={3} sm={12} xs={12}></Gird2>
      {answer !== '' && !isSuccessAttemptCompleted && (
        <Gird2 item lg={6} md={6} sm={12} xs={12}>
          <h5 className="font-medium leading-tight text-xl mt-0 mb-2 text-lime-50 py-6">
            Question: <b>{question}</b>
          </h5>

          <Countdown date={new Date(endTime * 1000)} renderer={renderer} />
        </Gird2>
      )}

      {isSuccessAttemptCompleted && (
        <Gird2 item lg={6} md={6} sm={12} xs={12}>
          <div
            className="flex flex-column items-center justify-center"
            style={{
              border: '1px solid white',
              padding: 20,
              textAlign: 'center',
            }}
          >
            <h3 className="font-medium leading-tight text-xl mt-0 mb-2 text-lime-50">
              Nice !!
            </h3>
            <h5 className="font-medium leading-tight text-xl mt-0 mb-4 text-lime-50">
              You guess word correctly !
            </h5>

            <button
              onClick={() => nextQuestion()}
              className="flex items-center justify-center bg-blue-500 hover:bg-blue-700 text-white font-bold p-4 rounded "
            >
              Next Question
            </button>
          </div>
        </Gird2>
      )}

      <Gird2 item lg={3} md={3} sm={12} xs={12} style={{ padding: 10 }}></Gird2>
    </Gird2>
  )
}

export default Question
