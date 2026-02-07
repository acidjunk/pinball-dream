import Phaser from 'phaser'
import { GAME, COLORS } from '@/config/constants'
import AudioSystem from '@/systems/AudioSystem'
import HighScoreManager from '@/utils/HighScoreManager'

export default class MenuScene extends Phaser.Scene {
  private audioSystem!: AudioSystem

  constructor() {
    super({ key: 'MenuScene' })
  }

  create(): void {
    this.audioSystem = this.registry.get('audioSystem')

    const { width, height } = this.scale

    // Background
    this.add.rectangle(0, 0, width, height, COLORS.BACKGROUND).setOrigin(0)

    // Title
    this.add.text(width / 2, 200, GAME.TITLE, {
      fontSize: '72px',
      color: COLORS.TEXT,
      fontFamily: 'Arial, sans-serif',
      fontStyle: 'bold',
    }).setOrigin(0.5)

    // Subtitle
    this.add.text(width / 2, 300, 'A Classic Pinball Experience', {
      fontSize: '24px',
      color: '#aaaaaa',
      fontFamily: 'Arial, sans-serif',
      fontStyle: 'italic',
    }).setOrigin(0.5)

    // Start button
    const startButton = this.add.text(width / 2, 500, 'START GAME', {
      fontSize: '48px',
      color: COLORS.TEXT,
      fontFamily: 'Arial, sans-serif',
      fontStyle: 'bold',
      backgroundColor: '#ff3333',
      padding: { x: 40, y: 20 },
    }).setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        this.startGame()
      })
      .on('pointerover', () => {
        startButton.setScale(1.1)
      })
      .on('pointerout', () => {
        startButton.setScale(1)
      })

    // High scores button
    const highScoresButton = this.add.text(width / 2, 620, 'HIGH SCORES', {
      fontSize: '36px',
      color: COLORS.TEXT,
      fontFamily: 'Arial, sans-serif',
      padding: { x: 30, y: 15 },
    }).setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        this.showHighScores()
      })
      .on('pointerover', () => {
        highScoresButton.setScale(1.1)
      })
      .on('pointerout', () => {
        highScoresButton.setScale(1)
      })

    // Controls info
    const controlsText = 'Controls: Arrow Keys / Z, M or Touch Screen'
    this.add.text(width / 2, height - 100, controlsText, {
      fontSize: '20px',
      color: '#888888',
      fontFamily: 'Arial, sans-serif',
    }).setOrigin(0.5)

    // Mute toggle
    const muteText = this.audioSystem.isMutedState() ? '🔇 UNMUTE' : '🔊 MUTE'
    const muteButton = this.add.text(width / 2, 750, muteText, {
      fontSize: '28px',
      color: '#cccccc',
      fontFamily: 'Arial, sans-serif',
    }).setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        const isMuted = this.audioSystem.toggleMute()
        muteButton.setText(isMuted ? '🔇 UNMUTE' : '🔊 MUTE')
      })
  }

  private startGame(): void {
    this.scene.start('GameScene')
  }

  private async showHighScores(): Promise<void> {
    const scores = await HighScoreManager.getHighScores()

    const { width, height } = this.scale

    // Overlay
    const overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.8)
      .setOrigin(0)
      .setDepth(100)
      .setInteractive()

    // Title
    const title = this.add.text(width / 2, 150, 'HIGH SCORES', {
      fontSize: '56px',
      color: COLORS.TEXT,
      fontFamily: 'Arial, sans-serif',
      fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(101)

    // Scores list
    let yPos = 280
    if (scores.length === 0) {
      this.add.text(width / 2, yPos, 'No high scores yet!', {
        fontSize: '32px',
        color: '#888888',
        fontFamily: 'Arial, sans-serif',
      }).setOrigin(0.5).setDepth(101)
    } else {
      scores.forEach((score, index) => {
        const rank = `${index + 1}.`
        const scoreText = `${rank.padEnd(4)}${score.initials.padEnd(8)}${score.score.toLocaleString()}`

        this.add.text(width / 2, yPos, scoreText, {
          fontSize: '32px',
          color: COLORS.TEXT,
          fontFamily: 'monospace',
        }).setOrigin(0.5).setDepth(101)

        yPos += 50
      })
    }

    // Close button
    const closeButton = this.add.text(width / 2, height - 150, 'CLOSE', {
      fontSize: '36px',
      color: COLORS.TEXT,
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#333333',
      padding: { x: 30, y: 15 },
    }).setOrigin(0.5)
      .setDepth(101)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        overlay.destroy()
        title.destroy()
        closeButton.destroy()
        // Clean up score texts
        this.children.each((child: Phaser.GameObjects.GameObject) => {
          const displayObject = child as any
          if (displayObject.depth === 101 && child !== title && child !== closeButton) {
            child.destroy()
          }
        })
      })
  }
}
