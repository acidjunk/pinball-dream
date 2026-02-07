import Phaser from 'phaser'
import { PHYSICS, COLORS, SCORING } from '@/config/constants'
import ScoreSystem from '@/systems/ScoreSystem'
import AudioSystem from '@/systems/AudioSystem'

export default class Bumper {
  private sprite: Phaser.Physics.Matter.Sprite
  private scene: Phaser.Scene
  private scoreSystem: ScoreSystem
  private audioSystem: AudioSystem

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

    // Create bumper sprite
    this.sprite = scene.matter.add.sprite(x, y, '', undefined, {
      shape: { type: 'circle', radius: PHYSICS.BUMPER.RADIUS },
      isStatic: true,
      restitution: PHYSICS.BUMPER.RESTITUTION,
    })

    // Create visual texture
    const graphics = scene.add.graphics()
    graphics.fillStyle(COLORS.BUMPER, 1)
    graphics.fillCircle(0, 0, PHYSICS.BUMPER.RADIUS)
    graphics.lineStyle(3, 0x6699ff, 1)
    graphics.strokeCircle(0, 0, PHYSICS.BUMPER.RADIUS)
    graphics.generateTexture('bumper', PHYSICS.BUMPER.RADIUS * 2, PHYSICS.BUMPER.RADIUS * 2)
    graphics.destroy()

    this.sprite.setTexture('bumper')
    this.sprite.setCollisionCategory(2)
    this.sprite.setCollidesWith([1])

    // Collision detection
    this.sprite.setOnCollide((data: MatterJS.ICollisionPair) => {
      this.onHit(data)
    })
  }

  private onHit(data: MatterJS.ICollisionPair): void {
    // Add score
    this.scoreSystem.addPoints(SCORING.BUMPER_HIT)

    // Play sound
    this.audioSystem.playSFX('bumper')

    // Visual feedback - scale animation
    this.scene.tweens.add({
      targets: this.sprite,
      scaleX: 1.3,
      scaleY: 1.3,
      duration: 100,
      yoyo: true,
      ease: 'Quad.easeOut',
    })

    // Apply impulse to ball
    const ball = data.bodyA === (this.sprite.body as MatterJS.BodyType) ? data.bodyB : data.bodyA
    const ballBody = ball as any
    const angle = Phaser.Math.Angle.Between(
      this.sprite.x,
      this.sprite.y,
      ballBody.position.x,
      ballBody.position.y
    )

    const forceX = Math.cos(angle) * PHYSICS.BUMPER.IMPULSE * 0.001
    const forceY = Math.sin(angle) * PHYSICS.BUMPER.IMPULSE * 0.001

    // Apply force to the ball body
    const matterBall = ball as MatterJS.BodyType
    this.scene.matter.body.applyForce(matterBall, matterBall.position, { x: forceX, y: forceY })
  }

  destroy(): void {
    this.sprite.destroy()
  }
}
