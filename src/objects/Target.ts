import Phaser from 'phaser'
import { PHYSICS, COLORS, SCORING } from '@/config/constants'
import ScoreSystem from '@/systems/ScoreSystem'
import AudioSystem from '@/systems/AudioSystem'

export default class Target {
  private sprite: Phaser.Physics.Matter.Sprite
  private scene: Phaser.Scene
  private scoreSystem: ScoreSystem
  private audioSystem: AudioSystem
  private isHit: boolean = false

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    scoreSystem: ScoreSystem,
    audioSystem: AudioSystem
  ) {
    this.scene = scene
    this.scoreSystem = scoreSystem
    this.audioSystem = audioSystem

    // Create target sprite
    this.sprite = scene.matter.add.sprite(x, y, '', undefined, {
      shape: {
        type: 'rectangle',
        width: PHYSICS.TARGET.WIDTH,
        height: PHYSICS.TARGET.HEIGHT,
      },
      isStatic: true,
      restitution: PHYSICS.TARGET.RESTITUTION,
    })

    // Create visual textures (active and hit states)
    this.createTextures()

    this.sprite.setTexture('target-active')
    this.sprite.setCollisionCategory(2)
    this.sprite.setCollidesWith([1])

    // Collision detection
    this.sprite.setOnCollide(() => {
      this.onHit()
    })
  }

  private createTextures(): void {
    // Active state
    const graphics = this.scene.add.graphics()
    graphics.fillStyle(COLORS.TARGET, 1)
    graphics.fillRoundedRect(
      0,
      0,
      PHYSICS.TARGET.WIDTH,
      PHYSICS.TARGET.HEIGHT,
      5
    )
    graphics.lineStyle(2, 0xffdd33, 1)
    graphics.strokeRoundedRect(
      0,
      0,
      PHYSICS.TARGET.WIDTH,
      PHYSICS.TARGET.HEIGHT,
      5
    )
    graphics.generateTexture('target-active', PHYSICS.TARGET.WIDTH, PHYSICS.TARGET.HEIGHT)

    // Hit state
    graphics.clear()
    graphics.fillStyle(0x666666, 1)
    graphics.fillRoundedRect(
      0,
      0,
      PHYSICS.TARGET.WIDTH,
      PHYSICS.TARGET.HEIGHT,
      5
    )
    graphics.generateTexture('target-hit', PHYSICS.TARGET.WIDTH, PHYSICS.TARGET.HEIGHT)
    graphics.destroy()
  }

  private onHit(): void {
    if (this.isHit) return

    this.isHit = true

    // Change visual state
    this.sprite.setTexture('target-hit')

    // Add score
    this.scoreSystem.addPoints(SCORING.TARGET_HIT)

    // Play sound
    this.audioSystem.playSFX('target')

    // Visual feedback - flash animation
    this.scene.tweens.add({
      targets: this.sprite,
      alpha: 0.5,
      duration: 100,
      yoyo: true,
      repeat: 2,
      ease: 'Quad.easeInOut',
    })

    // Emit event for Table to check if all targets are hit
    this.scene.events.emit('targetHit')
  }

  reset(): void {
    this.isHit = false
    this.sprite.setTexture('target-active')
    this.sprite.setAlpha(1)
  }

  isTargetHit(): boolean {
    return this.isHit
  }

  destroy(): void {
    this.sprite.destroy()
  }
}
