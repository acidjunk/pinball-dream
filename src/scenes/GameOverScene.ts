import Phaser from 'phaser'
import { COLORS } from '@/config/constants'
import HighScoreManager from '@/utils/HighScoreManager'
import { HighScore } from '@/types'

interface GameOverData {
  score: number
}

export default class GameOverScene extends Phaser.Scene {
  private finalScore: number = 0
  private isHighScore: boolean = false

  constructor() {
    super({ key: 'GameOverScene' })
  }

  init(data: GameOverData): void {
    this.finalScore = data.score || 0
  }

  async create(): Promise<void> {
    const { width, height } = this.scale

    // Background
    this.add.rectangle(0, 0, width, height, COLORS.BACKGROUND).setOrigin(0)

    // Game Over title
    this.add.text(width / 2, 150, 'GAME OVER', {
      fontSize: '72px',
      color: COLORS.TEXT,
      fontFamily: 'Arial, sans-serif',
      fontStyle: 'bold',
    }).setOrigin(0.5)

    // Final score
    this.add.text(width / 2, 280, `Final Score: ${this.finalScore.toLocaleString()}`, {
      fontSize: '42px',
      color: COLORS.TEXT,
      fontFamily: 'Arial, sans-serif',
    }).setOrigin(0.5)

    // Check if high score
    this.isHighScore = await HighScoreManager.isHighScore(this.finalScore)

    if (this.isHighScore) {
      this.showHighScoreEntry()
    } else {
      this.showHighScores()
      this.showButtons()
    }
  }

  private showHighScoreEntry(): void {
    const { width } = this.scale

    this.add.text(width / 2, 400, 'NEW HIGH SCORE!', {
      fontSize: '48px',
      color: '#ffcc00',
      fontFamily: 'Arial, sans-serif',
      fontStyle: 'bold',
    }).setOrigin(0.5)

    this.add.text(width / 2, 480, 'Enter your initials:', {
      fontSize: '32px',
      color: COLORS.TEXT,
      fontFamily: 'Arial, sans-serif',
    }).setOrigin(0.5)

    let initials = ''
    const initialsText = this.add.text(width / 2, 560, '___', {
      fontSize: '64px',
      color: COLORS.TEXT,
      fontFamily: 'monospace',
      fontStyle: 'bold',
    }).setOrigin(0.5)

    // Keyboard input for initials
    if (this.input.keyboard) {
      this.input.keyboard.on('keydown', (event: KeyboardEvent) => {
        if (event.key.length === 1 && /[a-zA-Z]/.test(event.key) && initials.length < 3) {
          initials += event.key.toUpperCase()
          initialsText.setText(initials.padEnd(3, '_'))
        } else if (event.key === 'Backspace' && initials.length > 0) {
          initials = initials.slice(0, -1)
          initialsText.setText(initials.padEnd(3, '_'))
        } else if (event.key === 'Enter' && initials.length === 3) {
          this.saveHighScore(initials)
        }
      })
    }

    // Submit button
    const submitButton = this.add.text(width / 2, 680, 'SUBMIT', {
      fontSize: '36px',
      color: COLORS.TEXT,
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#ff3333',
      padding: { x: 40, y: 15 },
    }).setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        if (initials.length === 3) {
          this.saveHighScore(initials)
        }
      })
      .on('pointerover', () => {
        if (initials.length === 3) {
          submitButton.setScale(1.1)
        }
      })
      .on('pointerout', () => {
        submitButton.setScale(1)
      })
  }

  private async saveHighScore(initials: string): Promise<void> {
    await HighScoreManager.saveScore(initials, this.finalScore)

    // Clean up entry UI
    this.children.removeAll(true)

    // Recreate base UI
    const { width, height } = this.scale
    this.add.rectangle(0, 0, width, height, COLORS.BACKGROUND).setOrigin(0)
    this.add.text(width / 2, 150, 'GAME OVER', {
      fontSize: '72px',
      color: COLORS.TEXT,
      fontFamily: 'Arial, sans-serif',
      fontStyle: 'bold',
    }).setOrigin(0.5)

    // Show high scores
    this.showHighScores()
    this.showButtons()
  }

  private async showHighScores(): Promise<void> {
    const { width } = this.scale

    this.add.text(width / 2, 400, 'HIGH SCORES', {
      fontSize: '42px',
      color: COLORS.TEXT,
      fontFamily: 'Arial, sans-serif',
      fontStyle: 'bold',
    }).setOrigin(0.5)

    const scores = await HighScoreManager.getHighScores()

    let yPos = 480
    if (scores.length === 0) {
      this.add.text(width / 2, yPos, 'No high scores yet!', {
        fontSize: '28px',
        color: '#888888',
        fontFamily: 'Arial, sans-serif',
      }).setOrigin(0.5)
    } else {
      scores.slice(0, 5).forEach((score: HighScore, index: number) => {
        const rank = `${index + 1}.`
        const scoreText = `${rank.padEnd(4)}${score.initials.padEnd(8)}${score.score.toLocaleString()}`

        const color = score.score === this.finalScore ? '#ffcc00' : COLORS.TEXT

        this.add.text(width / 2, yPos, scoreText, {
          fontSize: '28px',
          color: color,
          fontFamily: 'monospace',
        }).setOrigin(0.5)

        yPos += 45
      })
    }
  }

  private showButtons(): void {
    const { width, height } = this.scale

    // Play again button
    const playAgainButton = this.add.text(width / 2, height - 250, 'PLAY AGAIN', {
      fontSize: '42px',
      color: COLORS.TEXT,
      fontFamily: 'Arial, sans-serif',
      fontStyle: 'bold',
      backgroundColor: '#ff3333',
      padding: { x: 40, y: 20 },
    }).setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        this.scene.start('GameScene')
      })
      .on('pointerover', () => {
        playAgainButton.setScale(1.1)
      })
      .on('pointerout', () => {
        playAgainButton.setScale(1)
      })

    // Menu button
    const menuButton = this.add.text(width / 2, height - 150, 'MAIN MENU', {
      fontSize: '32px',
      color: COLORS.TEXT,
      fontFamily: 'Arial, sans-serif',
      padding: { x: 30, y: 15 },
    }).setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        this.scene.start('MenuScene')
      })
      .on('pointerover', () => {
        menuButton.setScale(1.1)
      })
      .on('pointerout', () => {
        menuButton.setScale(1)
      })
  }
}
