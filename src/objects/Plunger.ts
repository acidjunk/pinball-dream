import Phaser from 'phaser'
import AudioSystem from '@/systems/AudioSystem'
import Ball from './Ball'

export default class Plunger {
  private scene: Phaser.Scene
  private audioSystem: AudioSystem
  private powerMeter: Phaser.GameObjects.Graphics
  private powerIndicator: Phaser.GameObjects.Graphics
  private instructionText?: Phaser.GameObjects.Text
  private power: number = 0
  private minPower: number = 10
  private maxPower: number = 30
  private isCharging: boolean = false
  private powerDirection: number = 1 // 1 for increasing, -1 for decreasing
  private powerSpeed: number = 0.8
  private x: number
  private y: number
  private meterWidth: number = 60
  private meterHeight: number = 300

  constructor(scene: Phaser.Scene, x: number, y: number, audioSystem: AudioSystem) {
    this.scene = scene
    this.audioSystem = audioSystem
    this.x = x
    this.y = y

    // Create power meter graphics
    this.powerMeter = scene.add.graphics()
    this.powerIndicator = scene.add.graphics()
    this.updatePowerMeter()

    // Set up input
    this.setupInput()
  }

  private setupInput(): void {
    // Space bar or touch in launch area
    if (this.scene.input.keyboard) {
      const spaceKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)

      spaceKey.on('down', () => {
        this.startCharging()
      })

      spaceKey.on('up', () => {
        this.launch()
      })
    }

    // Touch zone for launch area - larger area for easier tapping
    const launchZone = this.scene.add.zone(
      this.x,
      this.y,
      120,
      400
    ).setOrigin(0.5, 0.5).setInteractive()

    launchZone.on('pointerdown', () => {
      this.startCharging()
    })

    launchZone.on('pointerup', () => {
      this.launch()
    })
  }

  private startCharging(): void {
    if (this.isCharging) return // Already charging

    this.isCharging = true
    this.power = this.minPower
    this.powerDirection = 1

    // Show instruction text
    if (!this.instructionText) {
      this.instructionText = this.scene.add.text(
        this.x,
        this.y - this.meterHeight / 2 - 50,
        'Release to Launch!',
        {
          fontSize: '24px',
          color: '#ffff00',
          fontFamily: 'Arial, sans-serif',
          fontStyle: 'bold',
          backgroundColor: '#000000cc',
          padding: { x: 15, y: 10 },
        }
      ).setOrigin(0.5).setDepth(1001)
    }
  }

  private launch(): void {
    if (!this.isCharging) return

    this.isCharging = false

    // Emit launch event with power
    this.scene.events.emit('plungerLaunch', this.power)

    // Play sound
    this.audioSystem.playSFX('launch')

    // Hide instruction text
    if (this.instructionText) {
      this.instructionText.destroy()
      this.instructionText = undefined
    }

    // Reset power and hide meter
    this.power = 0
    this.updatePowerMeter()
  }

  update(): void {
    if (this.isCharging) {
      // Oscillate power back and forth
      this.power += this.powerSpeed * this.powerDirection

      // Reverse direction at boundaries
      if (this.power >= this.maxPower) {
        this.power = this.maxPower
        this.powerDirection = -1
      } else if (this.power <= this.minPower) {
        this.power = this.minPower
        this.powerDirection = 1
      }

      this.updatePowerMeter()
    }
  }

  private updatePowerMeter(): void {
    this.powerMeter.clear()
    this.powerIndicator.clear()

    if (!this.isCharging && this.power === 0) {
      // Don't show meter when not charging
      return
    }

    const meterX = this.x - this.meterWidth / 2
    const meterY = this.y - this.meterHeight / 2

    // Draw meter background
    this.powerMeter.fillStyle(0x222222, 0.9)
    this.powerMeter.fillRoundedRect(meterX, meterY, this.meterWidth, this.meterHeight, 8)

    // Draw meter border
    this.powerMeter.lineStyle(3, 0xffffff, 1)
    this.powerMeter.strokeRoundedRect(meterX, meterY, this.meterWidth, this.meterHeight, 8)

    // Draw power zones with colors
    const zoneHeight = this.meterHeight / 3

    // Weak zone (bottom - green)
    this.powerMeter.fillStyle(0x00ff00, 0.3)
    this.powerMeter.fillRect(meterX + 2, meterY + this.meterHeight - zoneHeight, this.meterWidth - 4, zoneHeight - 2)

    // Medium zone (middle - yellow)
    this.powerMeter.fillStyle(0xffff00, 0.3)
    this.powerMeter.fillRect(meterX + 2, meterY + zoneHeight, this.meterWidth - 4, zoneHeight)

    // Strong zone (top - red)
    this.powerMeter.fillStyle(0xff0000, 0.3)
    this.powerMeter.fillRect(meterX + 2, meterY + 2, this.meterWidth - 4, zoneHeight)

    // Draw moving indicator
    const powerRatio = (this.power - this.minPower) / (this.maxPower - this.minPower)
    const indicatorY = meterY + this.meterHeight - (powerRatio * this.meterHeight)

    // Indicator line (bright and thick)
    this.powerIndicator.lineStyle(6, 0xffffff, 1)
    this.powerIndicator.beginPath()
    this.powerIndicator.moveTo(meterX - 5, indicatorY)
    this.powerIndicator.lineTo(meterX + this.meterWidth + 5, indicatorY)
    this.powerIndicator.strokePath()

    // Indicator arrow/triangle
    this.powerIndicator.fillStyle(0xffffff, 1)
    this.powerIndicator.fillTriangle(
      meterX - 10, indicatorY,
      meterX, indicatorY - 8,
      meterX, indicatorY + 8
    )
    this.powerIndicator.fillTriangle(
      meterX + this.meterWidth + 10, indicatorY,
      meterX + this.meterWidth, indicatorY - 8,
      meterX + this.meterWidth, indicatorY + 8
    )

    // Draw power labels
    if (this.isCharging) {
      this.powerMeter.fillStyle(0xffffff, 1)

      // "STRONG" label at top
      const strongText = this.scene.add.text(
        this.x,
        meterY + 20,
        'STRONG',
        {
          fontSize: '14px',
          color: '#ffffff',
          fontFamily: 'Arial, sans-serif',
          fontStyle: 'bold',
        }
      ).setOrigin(0.5).setDepth(1000)

      // "WEAK" label at bottom
      const weakText = this.scene.add.text(
        this.x,
        meterY + this.meterHeight - 20,
        'WEAK',
        {
          fontSize: '14px',
          color: '#ffffff',
          fontFamily: 'Arial, sans-serif',
          fontStyle: 'bold',
        }
      ).setOrigin(0.5).setDepth(1000)

      // Clean up labels after a frame
      this.scene.time.delayedCall(16, () => {
        strongText.destroy()
        weakText.destroy()
      })
    }
  }

  launchBall(ball: Ball): void {
    // Apply velocity to ball based on power
    const launchVelocity = -this.power * 0.5
    ball.setVelocity(0, launchVelocity)
  }

  destroy(): void {
    this.powerMeter.destroy()
    this.powerIndicator.destroy()
    if (this.instructionText) {
      this.instructionText.destroy()
    }
  }
}
