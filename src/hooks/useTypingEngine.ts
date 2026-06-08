import { useCallback, useReducer, useRef } from 'react'
import { WORD_POOL } from '../data/words'
import { calcWPM, calcRawWPM, calcAccuracy, fisherYates } from '../lib/stats'
import type { GameState, TimeMode, DifficultyMode } from '../types'
import { useTimer } from './useTimer'

const WORD_COUNT = 80

function generateWords(difficulty: DifficultyMode): string[] {
  const filtered = WORD_POOL.filter((word) => {
    if (difficulty === 'easy') {
      return word.length <= 4
    } else {
      return word.length >= 6
    }
  })
  
  // Fallback to full pool if filtered list is somehow empty
  const poolToUse = filtered.length > 0 ? filtered : WORD_POOL
  return fisherYates(poolToUse).slice(0, WORD_COUNT)
}

function makeInitialState(timeMode: TimeMode, difficultyMode: DifficultyMode): GameState {
  return {
    phase: 'idle',
    words: generateWords(difficultyMode),
    typedWords: [],
    currentInput: '',
    wordIndex: 0,
    charIndex: 0,
    timeMode,
    difficultyMode,
    elapsed: 0,
    wpm: 0,
    rawWpm: 0,
    accuracy: 100,
    correctChars: 0,
    totalChars: 0,
  }
}

type Action =
  | { type: 'INPUT'; value: string }
  | { type: 'TICK'; elapsed: number }
  | { type: 'RESTART' }
  | { type: 'CANCEL' }
  | { type: 'SET_MODE'; mode: TimeMode }
  | { type: 'SET_DIFFICULTY'; difficulty: DifficultyMode }

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'INPUT': {
      const { value } = action
      // Ignore inputs if in results phase
      if (state.phase === 'results') return state

      const wasIdle = state.phase === 'idle'
      const nextPhase = wasIdle ? 'running' : state.phase
      const currentWord = state.words[state.wordIndex]

      // Space pressed — commit current word
      if (value.endsWith(' ')) {
        const typed = value.slice(0, -1)
        let correct = 0
        const total = typed.length

        // Compare characters up to max length of expected and typed
        const maxLen = Math.max(currentWord.length, typed.length)
        for (let i = 0; i < maxLen; i++) {
          if (typed[i] === currentWord[i]) correct++
        }

        const newCorrectChars = state.correctChars + correct
        const newTotalChars = state.totalChars + total
        const newTypedWords = [...state.typedWords]
        newTypedWords[state.wordIndex] = typed.split('')

        return {
          ...state,
          phase: nextPhase,
          currentInput: '',
          wordIndex: state.wordIndex + 1,
          charIndex: 0,
          correctChars: newCorrectChars,
          totalChars: newTotalChars,
          typedWords: newTypedWords,
          wpm: calcWPM(newCorrectChars, state.elapsed || 1),
          rawWpm: calcRawWPM(newTotalChars, state.elapsed || 1),
          accuracy: calcAccuracy(newCorrectChars, newTotalChars),
        }
      }

      // Regular character typed
      // Clamp active input to a maximum of word.length + 10 to prevent layout overflow
      const clampedValue = value.slice(0, currentWord.length + 10)
      return {
        ...state,
        phase: nextPhase,
        currentInput: clampedValue,
        charIndex: clampedValue.length,
      }
    }

    case 'TICK': {
      if (state.phase !== 'running') return state

      const remaining = state.timeMode - action.elapsed
      if (remaining <= 0) {
        // Test finished. Commit current active input characters if there are any
        const currentWord = state.words[state.wordIndex]
        const typed = state.currentInput
        let correct = 0
        const total = typed.length

        if (total > 0) {
          const maxLen = Math.max(currentWord.length, typed.length)
          for (let i = 0; i < maxLen; i++) {
            if (typed[i] === currentWord[i]) correct++
          }
        }

        const newCorrectChars = state.correctChars + correct
        const newTotalChars = state.totalChars + total
        const newTypedWords = [...state.typedWords]
        if (total > 0) {
          newTypedWords[state.wordIndex] = typed.split('')
        }

        return {
          ...state,
          phase: 'results',
          elapsed: state.timeMode,
          correctChars: newCorrectChars,
          totalChars: newTotalChars,
          typedWords: newTypedWords,
          wpm: calcWPM(newCorrectChars, state.timeMode),
          rawWpm: calcRawWPM(newTotalChars, state.timeMode),
          accuracy: calcAccuracy(newCorrectChars, newTotalChars),
        }
      }

      return {
        ...state,
        elapsed: action.elapsed,
        wpm: calcWPM(state.correctChars, action.elapsed || 1),
        rawWpm: calcRawWPM(state.totalChars, action.elapsed || 1),
      }
    }

    case 'RESTART':
      return makeInitialState(state.timeMode, state.difficultyMode)

    case 'CANCEL':
      return {
        ...makeInitialState(state.timeMode, state.difficultyMode),
        words: state.words, // preserve the current word list
      }

    case 'SET_MODE':
      return makeInitialState(action.mode, state.difficultyMode)

    case 'SET_DIFFICULTY':
      return makeInitialState(state.timeMode, action.difficulty)

    default:
      return state
  }
}

export function useTypingEngine() {
  const [state, dispatch] = useReducer(reducer, makeInitialState(30, 'easy'))
  const timerStartedRef = useRef(false)

  const { start: startTimer, reset: resetTimer } = useTimer(
    useCallback((elapsed) => {
      dispatch({ type: 'TICK', elapsed })
    }, [])
  )

  const onInput = useCallback((value: string) => {
    if (state.phase === 'results') return

    if (state.phase === 'idle' && !timerStartedRef.current) {
      timerStartedRef.current = true
      startTimer()
    }

    dispatch({ type: 'INPUT', value })
  }, [state.phase, startTimer])

  const restart = useCallback(() => {
    timerStartedRef.current = false
    resetTimer()
    dispatch({ type: 'RESTART' })
  }, [resetTimer])

  const cancel = useCallback(() => {
    timerStartedRef.current = false
    resetTimer()
    dispatch({ type: 'CANCEL' })
  }, [resetTimer])

  const setTimeMode = useCallback((mode: TimeMode) => {
    timerStartedRef.current = false
    resetTimer()
    dispatch({ type: 'SET_MODE', mode })
  }, [resetTimer])

  const setDifficultyMode = useCallback((difficulty: DifficultyMode) => {
    timerStartedRef.current = false
    resetTimer()
    dispatch({ type: 'SET_DIFFICULTY', difficulty })
  }, [resetTimer])

  const onKeyDown = useCallback((e: KeyboardEvent | React.KeyboardEvent) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      restart()
    }
    if (e.key === 'Escape' && state.phase === 'running') {
      e.preventDefault()
      cancel()
    }
    if (e.key === 'Enter' && state.phase === 'results') {
      e.preventDefault()
      restart()
    }
  }, [state.phase, restart, cancel])

  return { state, onInput, onKeyDown, restart, setTimeMode, setDifficultyMode }
}
