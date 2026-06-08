export type TimeMode = 15 | 30 | 60 | 120

export type DifficultyMode = 'easy' | 'difficult'

export type GamePhase = 'idle' | 'running' | 'results'

export type CharState = 'correct' | 'incorrect' | 'untyped' | 'extra'

export interface CharResult {
  expected: string
  typed: string
  state: CharState
}

export interface GameState {
  phase: GamePhase
  words: string[]
  typedWords: string[][] // Array of typed words (each word split into character strings)
  currentInput: string
  wordIndex: number
  charIndex: number
  timeMode: TimeMode
  difficultyMode: DifficultyMode
  elapsed: number // seconds since first keystroke
  wpm: number
  rawWpm: number
  accuracy: number
  correctChars: number
  totalChars: number
}

export interface ResultRecord {
  wpm: number
  rawWpm: number
  accuracy: number
  timeMode: TimeMode
  difficultyMode: DifficultyMode
  timestamp: number
}

export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
  prompt(): Promise<void>
}
