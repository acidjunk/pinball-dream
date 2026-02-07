import Phaser from 'phaser'
import { PHYSICS, COLORS } from '@/config/constants'

export default class Ball {
  public body: MatterJS.BodyType
  public sprite: Phaser.Physics.Matter.Sprite

  constructor(scene: Phaser.Scene, x: number, y: number) {
    // Create the ball sprite with Matter physics
    this.sprite = scene.matter.add.sprite(x, y, '', undefined, {
      shape: { type: 'circle', radius: PHYSICS.BALL.RADIUS },
      friction: PHYSICS.BALL.FRICTION,
      restitution: PHYSICS.BALL.RESTITUTION,
      density: PHYSICS.BALL.DENSITY,
    })

    // Visual representation (since we don't have sprites yet)
    const graphics = scene.add.graphics()
    graphics.fillStyle(COLORS.BALL, 1)
    graphics.fillCircle(0, 0, PHYSICS.BALL.RADIUS)
    graphics.generateTexture('ball', PHYSICS.BALL.RADIUS * 2, PHYSICS.BALL.RADIUS * 2)
    graphics.destroy()

    this.sprite.setTexture('ball')
    this.sprite.setCollisionCategory(1)
    this.sprite.setCollidesWith([1, 2])

    this.body = this.sprite.body as MatterJS.BodyType
  }

  reset(x: number, y: number): void {
    this.sprite.setPosition(x, y)
    this.sprite.setVelocity(0, 0)
    this.sprite.setAngularVelocity(0)
    this.sprite.setActive(true)
    this.sprite.setVisible(true)
  }

  getPosition(): { x: number; y: number } {
    return {
      x: this.sprite.x,
      y: this.sprite.y,
    }
  }

  setVelocity(x: number, y: number): void {
    this.sprite.setVelocity(x, y)
  }

  isOffScreen(height: number): boolean {
    return this.sprite.y > height + 50
  }

  destroy(): void {
    this.sprite.destroy()
  }
}
