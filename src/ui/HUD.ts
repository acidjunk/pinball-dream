import Phaser from 'phaser'
import { COLORS } from '@/config/constants'
import ScoreSystem from '@/systems/ScoreSystem'
import AudioSystem from '@/systems/AudioSystem'

export default class HUD {
  private scene: Phaser.Scene
  private scoreSystem: ScoreSystem
  private audioSystem: AudioSystem

  private scoreText!: Phaser.GameObjects.Text
  private ballsText!: Phaser.GameObjects.Text
  private muteButton!: Phaser.GameObjects.Text

  constructor(scene: Phaser.Scene, scoreSystem: ScoreSystem, audioSystem: AudioSystem) {
    this.scene = scene
    this.scoreSystem = scoreSystem
    this.audioSystem = audioSystem

    this.create()
    this.setupListeners()
  }

  private create(): void {
    const { width } = this.scene.scale

    // Score display
    this.scoreText = this.scene.add.text(20, 20, 'SCORE: 0', {
      fontSize: '28px',
      color: COLORS.TEXT,
      fontFamily: 'Arial, sans-serif',
      fontStyle: 'bold',
    })

    // Balls remaining display
    this.ballsText = this.scene.add.text(width - 20, 20, 'BALLS: 3', {
      fontSize: '28px',
      color: COLORS.TEXT,
      fontFamily: 'Arial, sans-serif',
      fontStyle: 'bold',
    }).setOrigin(1, 0)

    // Mute button
    const muteText = this.audioSystem.isMutedState() ? '🔇' : '🔊'
    this.muteButton = this.scene.add.text(width / 2, 20, muteText, {
      fontSize: '32px',
    }).setOrigin(0.5, 0)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        const isMuted = this.audioSystem.toggleMute()
        this.muteButton.setText(isMuted ? '🔇' : '🔊')
      })

    // Set depth to appear above game objects
    this.scoreText.setDepth(1000)
    this.ballsText.setDepth(1000)
    this.muteButton.setDepth(1000)
  }

  private setupListeners(): void {
    this.scoreSystem.on('scoreChanged', (score: number) => {
      this.updateScore(score)
    })
  }

  updateScore(score: number): void {
    this.scoreText.setText(`SCORE: ${score.toLocaleString()}`)
  }

  updateBalls(balls: number): void {
    this.ballsText.setText(`BALLS: ${balls}`)
  }

  destroy(): void {
    this.scoreText.destroy()
    this.ballsText.destroy()
    this.muteButton.destroy()
  }
}
