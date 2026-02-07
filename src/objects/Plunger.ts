import Phaser from 'phaser'
import AudioSystem from '@/systems/AudioSystem'
import Ball from './Ball'

export default class Plunger {
  private scene: Phaser.Scene
  private audioSystem: AudioSystem
  private powerMeter: Phaser.GameObjects.Graphics
  private power: number = 0
  private maxPower: number = 30
  private isCharging: boolean = false
  private x: number
  private y: number

  constructor(scene: Phaser.Scene, x: number, y: number, audioSystem: AudioSystem) {
    this.scene = scene
    this.audioSystem = audioSystem
    this.x = x
    this.y = y

    // Create power meter
    this.powerMeter = scene.add.graphics()
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

    // Touch zone for launch area
    const launchZone = this.scene.add.zone(
      this.x,
      this.y,
      100,
      200
    ).setOrigin(0.5, 0.5).setInteractive()

    launchZone.on('pointerdown', () => {
      this.startCharging()
    })

    launchZone.on('pointerup', () => {
      this.launch()
    })
  }

  private startCharging(): void {
    this.isCharging = true
    this.power = 0
  }

  private launch(): void {
    if (!this.isCharging) return

    this.isCharging = false

    // Emit launch event with power
    this.scene.events.emit('plungerLaunch', this.power)

    // Play sound
    this.audioSystem.playSFX('launch')

    // Reset power
    this.power = 0
    this.updatePowerMeter()
  }

  update(): void {
    if (this.isCharging) {
      this.power = Math.min(this.power + 0.5, this.maxPower)
      this.updatePowerMeter()
    }
  }

  private updatePowerMeter(): void {
    this.powerMeter.clear()

    // Draw power meter background
    this.powerMeter.fillStyle(0x333333, 0.5)
    this.powerMeter.fillRect(this.x - 20, this.y - 100, 40, 200)

    // Draw power level
    const powerHeight = (this.power / this.maxPower) * 200
    const powerRatio = this.power / this.maxPower

    // Interpolate color from yellow to red
    const r = 255
    const g = Math.floor(255 * (1 - powerRatio))
    const b = 0

    this.powerMeter.fillStyle(
      Phaser.Display.Color.GetColor(r, g, b),
      1
    )
    this.powerMeter.fillRect(
      this.x - 18,
      this.y + 98 - powerHeight,
      36,
      powerHeight
    )
  }

  launchBall(ball: Ball): void {
    // Apply velocity to ball based on power
    const launchVelocity = -this.power * 0.5
    ball.setVelocity(0, launchVelocity)
  }

  destroy(): void {
    this.powerMeter.destroy()
  }
}
