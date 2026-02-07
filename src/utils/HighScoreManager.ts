import localforage from 'localforage'
import { HighScore } from '@/types'

const HIGH_SCORES_KEY = 'pinball_dream_high_scores'
const MAX_HIGH_SCORES = 10

class HighScoreManager {
  private store: LocalForage

  constructor() {
    this.store = localforage.createInstance({
      name: 'pinball-dream',
      storeName: 'scores',
    })
  }

  async getHighScores(): Promise<HighScore[]> {
    try {
      const scores = await this.store.getItem<HighScore[]>(HIGH_SCORES_KEY)
      return scores || []
    } catch (error) {
      console.error('Error loading high scores:', error)
      return []
    }
  }

  async saveScore(initials: string, score: number): Promise<boolean> {
    try {
      const scores = await this.getHighScores()

      const newScore: HighScore = {
        initials: initials.toUpperCase().substring(0, 3),
        score,
        timestamp: Date.now(),
      }

      scores.push(newScore)
      scores.sort((a, b) => b.score - a.score)
      scores.splice(MAX_HIGH_SCORES)

      await this.store.setItem(HIGH_SCORES_KEY, scores)
      return true
    } catch (error) {
      console.error('Error saving high score:', error)
      return false
    }
  }

  async isHighScore(score: number): Promise<boolean> {
    const scores = await this.getHighScores()

    if (scores.length < MAX_HIGH_SCORES) {
      return true
    }

    return score > scores[scores.length - 1].score
  }

  async clearHighScores(): Promise<void> {
    try {
      await this.store.removeItem(HIGH_SCORES_KEY)
    } catch (error) {
      console.error('Error clearing high scores:', error)
    }
  }
}

export default new HighScoreManager()
