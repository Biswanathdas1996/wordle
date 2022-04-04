import { MAX_CHALLENGES } from '../../constants/settings'
import { CompletedRow } from './CompletedRow'
import { CurrentRow } from './CurrentRow'
import { EmptyRow } from './EmptyRow'

type Props = {
  guesses: string[]
  currentGuess: string
  isRevealing?: boolean
  currentRowClassName: string
  answer?: any
  onEnter?: any
  length?: any
}

export const Grid = ({
  guesses,
  currentGuess,
  isRevealing,
  currentRowClassName,
  answer,
  onEnter,
  length,
}: Props) => {
  const empties =
    guesses.length < MAX_CHALLENGES - 1
      ? Array.from(Array(MAX_CHALLENGES - 1 - guesses.length))
      : []

  return (
    <>
      {guesses.map((guess, i) => (
        <>
          <CompletedRow
            key={i}
            guess={guess}
            isRevealing={isRevealing && guesses.length - 1 === i}
            answer={answer}
          />
        </>
      ))}
      {guesses.length < MAX_CHALLENGES && (
        <>
          <CurrentRow
            guess={currentGuess}
            className={currentRowClassName}
            length={length}
          />
          <div className="flex flex-column items-center justify-center py-3">
            <button
              className="px-4"
              style={{ color: 'white', border: '1px solid white', padding: 15 }}
              onClick={() => onEnter()}
            >
              Submit
            </button>
          </div>
        </>
      )}
      {empties.map((_, i) => (
        <EmptyRow key={i} length={length} />
      ))}
    </>
  )
}
