import Phaser from 'phaser'

export default class ScoreSystem extends Phaser.Events.EventEmitter {
  private score: number = 0

  constructor() {
    super()
  }

  addPoints(points: number): void {
    this.score += points
    this.emit('scoreChanged', this.score)
  }

  getScore(): number {
    return this.score
  }

  reset(): void {
    this.score = 0
    this.emit('scoreChanged', this.score)
  }

  setScore(score: number): void {
    this.score = score
    this.emit('scoreChanged', this.score)
  }
}
