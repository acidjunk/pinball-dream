// Global type definitions

export interface HighScore {
  initials: string
  score: number
  timestamp: number
}

export interface GameState {
  score: number
  ballsRemaining: number
  isPlaying: boolean
  isPaused: boolean
}

export type FlipperSide = 'left' | 'right'
