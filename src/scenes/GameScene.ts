import Phaser from 'phaser'
import { GAME, COLORS } from '@/config/constants'
import Table from '@/objects/Table'
import ScoreSystem from '@/systems/ScoreSystem'
import AudioSystem from '@/systems/AudioSystem'
import InputSystem from '@/systems/InputSystem'
import HUD from '@/ui/HUD'
import TouchControls from '@/ui/TouchControls'

export default class GameScene extends Phaser.Scene {
  private table!: Table
  private scoreSystem!: ScoreSystem
  private audioSystem!: AudioSystem
  private inputSystem!: InputSystem
  private hud!: HUD
  private touchControls!: TouchControls

  private ballsRemaining: number = GAME.BALLS_PER_GAME
  private isPlaying: boolean = false
  private isPaused: boolean = false
  private ballActive: boolean = true

  constructor() {
    super({ key: 'GameScene' })
  }

  create(): void {
    const { width, height } = this.scale

    // Background
    this.add.rectangle(0, 0, width, height, COLORS.BACKGROUND).setOrigin(0)

    // Initialize systems
    this.scoreSystem = new ScoreSystem()
    this.audioSystem = this.registry.get('audioSystem')
    this.inputSystem = new InputSystem(this)

    // Create table
    this.table = new Table(this, this.scoreSystem, this.audioSystem)

    // Create UI
    this.hud = new HUD(this, this.scoreSystem, this.audioSystem)
    this.touchControls = new TouchControls(this)

    // Update HUD
    this.hud.updateBalls(this.ballsRemaining)

    // Start playing
    this.isPlaying = true

    // Instructions
    this.showInstructions()
  }

  private showInstructions(): void {
    const { width, height } = this.scale

    const instructions = this.add.text(
      width / 2,
      height / 2,
      'Press SPACE or tap to launch the ball!\n\nUse Arrow Keys / Z, M or Touch to control flippers',
      {
        fontSize: '28px',
        color: COLORS.TEXT,
        fontFamily: 'Arial, sans-serif',
        align: 'center',
        backgroundColor: '#000000cc',
        padding: { x: 30, y: 20 },
      }
    ).setOrigin(0.5).setDepth(1001)

    // Fade out after 3 seconds
    this.time.delayedCall(3000, () => {
      this.tweens.add({
        targets: instructions,
        alpha: 0,
        duration: 500,
        onComplete: () => {
          instructions.destroy()
        },
      })
    })
  }

  update(): void {
    if (!this.isPlaying || this.isPaused) return

    // Update table
    this.table.update()

    // Handle flipper input
    if (this.inputSystem.isLeftFlipperActive()) {
      this.table.leftFlipper.activate()
      this.audioSystem.playSFX('flipper')
    } else {
      this.table.leftFlipper.deactivate()
    }

    if (this.inputSystem.isRightFlipperActive()) {
      this.table.rightFlipper.activate()
      this.audioSystem.playSFX('flipper')
    } else {
      this.table.rightFlipper.deactivate()
    }

    // Check if ball is drained (only if ball is active)
    if (this.ballActive && this.table.isBallDrained()) {
      this.onBallDrained()
    }
  }

  private onBallDrained(): void {
    // Mark ball as inactive to prevent multiple drain detections
    this.ballActive = false

    this.ballsRemaining--
    this.hud.updateBalls(this.ballsRemaining)

    // Play drain sound
    this.audioSystem.playSFX('drain')

    if (this.ballsRemaining > 0) {
      // Reset ball for next life
      this.time.delayedCall(1500, () => {
        this.table.resetBall()
        this.ballActive = true // Reactivate ball
      })
    } else {
      // Game over
      this.time.delayedCall(1500, () => {
        this.gameOver()
      })
    }
  }

  private gameOver(): void {
    this.isPlaying = false

    const finalScore = this.scoreSystem.getScore()

    // Move to game over scene
    this.scene.start('GameOverScene', { score: finalScore })
  }

  shutdown(): void {
    // Clean up
    if (this.table) {
      this.table.destroy()
    }
    if (this.inputSystem) {
      this.inputSystem.destroy()
    }
    if (this.hud) {
      this.hud.destroy()
    }
    if (this.touchControls) {
      this.touchControls.destroy()
    }
  }
}
