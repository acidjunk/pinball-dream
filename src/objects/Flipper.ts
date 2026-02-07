import Phaser from 'phaser'
import { PHYSICS, COLORS } from '@/config/constants'
import { FlipperSide } from '@/types'

export default class Flipper {
  public body: MatterJS.BodyType
  private sprite: Phaser.Physics.Matter.Sprite
  private scene: Phaser.Scene
  private side: FlipperSide
  private constraint: MatterJS.ConstraintType
  private isActive: boolean = false
  private restAngle: number
  private activeAngle: number

  constructor(scene: Phaser.Scene, x: number, y: number, side: FlipperSide) {
    this.scene = scene
    this.side = side

    // Set rotation angles based on side
    if (side === 'left') {
      this.restAngle = -0.3 // Pointing down-left
      this.activeAngle = 0.6 // Rotates up
    } else {
      this.restAngle = 0.3 // Pointing down-right
      this.activeAngle = -0.6 // Rotates up
    }

    // Create flipper sprite
    this.sprite = scene.matter.add.sprite(x, y, '', undefined, {
      shape: {
        type: 'rectangle',
        width: PHYSICS.FLIPPER.WIDTH,
        height: PHYSICS.FLIPPER.HEIGHT,
      },
      restitution: PHYSICS.FLIPPER.RESTITUTION,
      density: PHYSICS.FLIPPER.DENSITY,
    })

    // Create visual texture
    const graphics = scene.add.graphics()
    graphics.fillStyle(COLORS.FLIPPER, 1)
    graphics.fillRoundedRect(
      -PHYSICS.FLIPPER.WIDTH / 2,
      -PHYSICS.FLIPPER.HEIGHT / 2,
      PHYSICS.FLIPPER.WIDTH,
      PHYSICS.FLIPPER.HEIGHT,
      5
    )
    graphics.generateTexture('flipper', PHYSICS.FLIPPER.WIDTH, PHYSICS.FLIPPER.HEIGHT)
    graphics.destroy()

    this.sprite.setTexture('flipper')
    this.sprite.setAngle(this.restAngle * (180 / Math.PI))
    this.sprite.setCollisionCategory(2)
    this.sprite.setCollidesWith([1])

    this.body = this.sprite.body as MatterJS.BodyType

    // Create constraint to act as hinge
    const hingeX = side === 'left' ? x - PHYSICS.FLIPPER.WIDTH / 3 : x + PHYSICS.FLIPPER.WIDTH / 3

    // Create a static body for the hinge point
    const anchor = scene.matter.add.rectangle(hingeX, y, 1, 1, { isStatic: true })

    this.constraint = scene.matter.add.constraint(
      this.body,
      anchor,
      0,
      1,
      {
        pointA: { x: 0, y: 0 },
        pointB: { x: 0, y: 0 },
      }
    )
  }

  activate(): void {
    if (this.isActive) return

    this.isActive = true

    const targetAngularVelocity = this.side === 'left'
      ? PHYSICS.FLIPPER.ANGULAR_VELOCITY
      : -PHYSICS.FLIPPER.ANGULAR_VELOCITY

    this.sprite.setAngularVelocity(targetAngularVelocity)
  }

  deactivate(): void {
    if (!this.isActive) return

    this.isActive = false

    const targetAngularVelocity = this.side === 'left'
      ? -PHYSICS.FLIPPER.ANGULAR_VELOCITY / 2
      : PHYSICS.FLIPPER.ANGULAR_VELOCITY / 2

    this.sprite.setAngularVelocity(targetAngularVelocity)
  }

  update(): void {
    // Constrain flipper rotation
    const currentAngle = this.sprite.rotation

    if (this.isActive) {
      // Moving to active position
      if (this.side === 'left' && currentAngle >= this.activeAngle) {
        this.sprite.setAngularVelocity(0)
        this.sprite.setRotation(this.activeAngle)
      } else if (this.side === 'right' && currentAngle <= this.activeAngle) {
        this.sprite.setAngularVelocity(0)
        this.sprite.setRotation(this.activeAngle)
      }
    } else {
      // Returning to rest position
      if (this.side === 'left' && currentAngle <= this.restAngle) {
        this.sprite.setAngularVelocity(0)
        this.sprite.setRotation(this.restAngle)
      } else if (this.side === 'right' && currentAngle >= this.restAngle) {
        this.sprite.setAngularVelocity(0)
        this.sprite.setRotation(this.restAngle)
      }
    }
  }

  destroy(): void {
    if (this.constraint) {
      this.scene.matter.world.removeConstraint(this.constraint)
    }
    this.sprite.destroy()
  }
}
