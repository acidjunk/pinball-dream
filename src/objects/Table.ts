import Phaser from 'phaser'
import { GAME, PHYSICS, COLORS, SCORING } from '@/config/constants'
import Ball from './Ball'
import Flipper from './Flipper'
import Bumper from './Bumper'
import Target from './Target'
import Plunger from './Plunger'
import ScoreSystem from '@/systems/ScoreSystem'
import AudioSystem from '@/systems/AudioSystem'

export default class Table {
  private scene: Phaser.Scene
  private scoreSystem: ScoreSystem
  private audioSystem: AudioSystem

  public ball!: Ball
  public leftFlipper!: Flipper
  public rightFlipper!: Flipper
  public plunger!: Plunger

  private bumpers: Bumper[] = []
  private targets: Target[] = []
  private walls: MatterJS.BodyType[] = []

  constructor(scene: Phaser.Scene, scoreSystem: ScoreSystem, audioSystem: AudioSystem) {
    this.scene = scene
    this.scoreSystem = scoreSystem
    this.audioSystem = audioSystem

    this.createWalls()
    this.createFlippers()
    this.createBumpers()
    this.createTargets()
    this.createBall()
    this.createPlunger()

    // Listen for all targets hit
    this.scene.events.on('targetHit', this.checkAllTargetsHit, this)
  }

  private createWalls(): void {
    const { WIDTH, HEIGHT } = GAME
    const wallThickness = 20

    // Create wall graphics
    const graphics = this.scene.add.graphics()
    graphics.lineStyle(wallThickness, COLORS.WALL, 1)

    // Left wall
    const leftWall = this.scene.matter.add.rectangle(
      wallThickness / 2,
      HEIGHT / 2,
      wallThickness,
      HEIGHT,
      {
        isStatic: true,
        restitution: PHYSICS.WALL.RESTITUTION,
        friction: PHYSICS.WALL.FRICTION,
      }
    )
    this.walls.push(leftWall)
    graphics.strokeRect(0, 0, wallThickness, HEIGHT)

    // Right wall
    const rightWall = this.scene.matter.add.rectangle(
      WIDTH - wallThickness / 2,
      HEIGHT / 2,
      wallThickness,
      HEIGHT,
      {
        isStatic: true,
        restitution: PHYSICS.WALL.RESTITUTION,
        friction: PHYSICS.WALL.FRICTION,
      }
    )
    this.walls.push(rightWall)
    graphics.strokeRect(WIDTH - wallThickness, 0, wallThickness, HEIGHT)

    // Top wall
    const topWall = this.scene.matter.add.rectangle(
      WIDTH / 2,
      wallThickness / 2,
      WIDTH,
      wallThickness,
      {
        isStatic: true,
        restitution: PHYSICS.WALL.RESTITUTION,
        friction: PHYSICS.WALL.FRICTION,
      }
    )
    this.walls.push(topWall)
    graphics.strokeRect(0, 0, WIDTH, wallThickness)

    // Pinball-style curved ramps at top (like the reference image)
    const rampRadius = 150
    const rampY = 200

    // Left curved ramp - guides ball down from top-left
    const leftRampOuter = this.scene.matter.add.circle(
      100,
      rampY,
      rampRadius,
      {
        isStatic: true,
        restitution: PHYSICS.WALL.RESTITUTION,
        friction: 0.05,
      }
    )
    this.walls.push(leftRampOuter)

    // Left ramp inner curve (creates channel)
    const leftRampInner = this.scene.matter.add.circle(
      160,
      rampY + 20,
      rampRadius - 60,
      {
        isStatic: true,
        restitution: PHYSICS.WALL.RESTITUTION,
        friction: 0.05,
      }
    )
    this.walls.push(leftRampInner)

    // Right curved ramp - guides ball down from top-right (outside launch lane)
    const rightRampOuter = this.scene.matter.add.circle(
      WIDTH - 280,
      rampY,
      rampRadius,
      {
        isStatic: true,
        restitution: PHYSICS.WALL.RESTITUTION,
        friction: 0.05,
      }
    )
    this.walls.push(rightRampOuter)

    // Right ramp inner curve (creates channel)
    const rightRampInner = this.scene.matter.add.circle(
      WIDTH - 340,
      rampY + 20,
      rampRadius - 60,
      {
        isStatic: true,
        restitution: PHYSICS.WALL.RESTITUTION,
        friction: 0.05,
      }
    )
    this.walls.push(rightRampInner)

    // Draw curved ramps visually
    graphics.lineStyle(wallThickness, COLORS.WALL, 1)
    graphics.strokeCircle(100, rampY, rampRadius)
    graphics.strokeCircle(160, rampY + 20, rampRadius - 60)
    graphics.strokeCircle(WIDTH - 280, rampY, rampRadius)
    graphics.strokeCircle(WIDTH - 340, rampY + 20, rampRadius - 60)

    // Launch lane separator (right side)
    const launchSeparator = this.scene.matter.add.rectangle(
      WIDTH - 120,
      HEIGHT - 400,
      20,
      600,
      {
        isStatic: true,
        restitution: PHYSICS.WALL.RESTITUTION,
        friction: PHYSICS.WALL.FRICTION,
      }
    )
    this.walls.push(launchSeparator)
    graphics.strokeRect(WIDTH - 130, HEIGHT - 700, 20, 600)

    // Launch bucket (bottom of launch lane to catch ball)
    const bucketBottom = this.scene.matter.add.rectangle(
      WIDTH - 60,
      HEIGHT - 80,
      100,
      20,
      {
        isStatic: true,
        restitution: 0.2, // Low restitution so ball settles
        friction: 0.5,
      }
    )
    this.walls.push(bucketBottom)
    graphics.strokeRect(WIDTH - 110, HEIGHT - 90, 100, 20)

    // Launch bucket left wall (keeps ball in place)
    const bucketWall = this.scene.matter.add.rectangle(
      WIDTH - 130,
      HEIGHT - 150,
      20,
      120,
      {
        isStatic: true,
        restitution: PHYSICS.WALL.RESTITUTION,
        friction: PHYSICS.WALL.FRICTION,
      }
    )
    this.walls.push(bucketWall)
    graphics.strokeRect(WIDTH - 140, HEIGHT - 210, 20, 120)

    // Slingshots (triangular kickers above flippers) - HIGH restitution for kick
    const slingshotY = HEIGHT - 200
    const slingshotRestitution = 2.0 // Extra bouncy!

    // Left slingshot (triangle above left flipper)
    const leftSlingshot = this.scene.matter.add.fromVertices(
      150,
      slingshotY,
      '0 0 120 60 120 0',
      {
        isStatic: true,
        restitution: slingshotRestitution,
      }
    )
    this.walls.push(leftSlingshot)

    // Right slingshot (triangle above right flipper)
    const rightSlingshot = this.scene.matter.add.fromVertices(
      WIDTH - 150,
      slingshotY,
      '0 0 0 60 120 60',
      {
        isStatic: true,
        restitution: slingshotRestitution,
      }
    )
    this.walls.push(rightSlingshot)

    // Inlane guides (narrow channels between flippers)
    const inlaneY = HEIGHT - 150

    // Left inlane wall
    const leftInlane = this.scene.matter.add.rectangle(
      WIDTH / 2 - 30,
      inlaneY,
      15,
      100,
      {
        isStatic: true,
        restitution: PHYSICS.WALL.RESTITUTION,
        angle: 0.15,
      }
    )
    this.walls.push(leftInlane)

    // Right inlane wall
    const rightInlane = this.scene.matter.add.rectangle(
      WIDTH / 2 + 30,
      inlaneY,
      15,
      100,
      {
        isStatic: true,
        restitution: PHYSICS.WALL.RESTITUTION,
        angle: -0.15,
      }
    )
    this.walls.push(rightInlane)

    // Outlane guides (outer channels to side walls)
    const outlaneY = HEIGHT - 180

    // Left outlane guide
    const leftOutlane = this.scene.matter.add.rectangle(
      100,
      outlaneY,
      15,
      150,
      {
        isStatic: true,
        restitution: PHYSICS.WALL.RESTITUTION,
        angle: 0.2,
      }
    )
    this.walls.push(leftOutlane)

    // Right outlane guide
    const rightOutlane = this.scene.matter.add.rectangle(
      WIDTH - 100,
      outlaneY,
      15,
      150,
      {
        isStatic: true,
        restitution: PHYSICS.WALL.RESTITUTION,
        angle: -0.2,
      }
    )
    this.walls.push(rightOutlane)
  }

  private createFlippers(): void {
    const { WIDTH, HEIGHT } = GAME
    const flipperY = HEIGHT - 100
    const gap = 50 // Smaller gap between flippers

    // Flippers closer together and lower for better control
    this.leftFlipper = new Flipper(
      this.scene,
      WIDTH / 2 - gap - 20,
      flipperY,
      'left'
    )

    this.rightFlipper = new Flipper(
      this.scene,
      WIDTH / 2 + gap + 20,
      flipperY,
      'right'
    )
  }

  private createBumpers(): void {
    const { WIDTH } = GAME
    const bumperY = 250

    // Create 4 bumpers in a diamond pattern
    const positions = [
      { x: WIDTH / 2, y: bumperY - 60 }, // Top
      { x: WIDTH / 2 - 80, y: bumperY }, // Left
      { x: WIDTH / 2 + 80, y: bumperY }, // Right
      { x: WIDTH / 2, y: bumperY + 60 }, // Bottom
    ]

    positions.forEach(pos => {
      const bumper = new Bumper(
        this.scene,
        pos.x,
        pos.y,
        this.scoreSystem,
        this.audioSystem
      )
      this.bumpers.push(bumper)
    })
  }

  private createTargets(): void {
    const { WIDTH } = GAME
    const targetY = 500
    const spacing = 80

    // Create 6 targets in two rows
    for (let i = 0; i < 6; i++) {
      const row = Math.floor(i / 3)
      const col = i % 3

      const x = WIDTH / 2 - spacing + (col * spacing)
      const y = targetY + (row * 100)

      const target = new Target(
        this.scene,
        x,
        y,
        this.scoreSystem,
        this.audioSystem
      )
      this.targets.push(target)
    }
  }

  private createBall(): void {
    const { WIDTH, HEIGHT } = GAME
    // Start ball in launch bucket at bottom
    this.ball = new Ball(this.scene, WIDTH - 60, HEIGHT - 120)
  }

  private createPlunger(): void {
    const { WIDTH, HEIGHT } = GAME
    this.plunger = new Plunger(
      this.scene,
      WIDTH - 60,
      HEIGHT - 200,
      this.audioSystem
    )

    // Listen for plunger launch
    this.scene.events.on('plungerLaunch', (power: number) => {
      const launchVelocity = -power * 0.5
      this.ball.setVelocity(0, launchVelocity)
    })
  }

  private checkAllTargetsHit(): void {
    const allHit = this.targets.every(target => target.isTargetHit())

    if (allHit) {
      // Bonus points
      this.scoreSystem.addPoints(SCORING.ALL_TARGETS_BONUS)

      // Reset all targets after a delay
      this.scene.time.delayedCall(1000, () => {
        this.targets.forEach(target => target.reset())
      })
    }
  }

  isBallDrained(): boolean {
    return this.ball.isOffScreen(GAME.HEIGHT)
  }

  resetBall(): void {
    const { WIDTH, HEIGHT } = GAME
    // Reset ball to launch bucket
    this.ball.reset(WIDTH - 60, HEIGHT - 120)
  }

  update(): void {
    this.leftFlipper.update()
    this.rightFlipper.update()
    this.plunger.update()
  }

  destroy(): void {
    this.ball.destroy()
    this.leftFlipper.destroy()
    this.rightFlipper.destroy()
    this.plunger.destroy()

    this.bumpers.forEach(bumper => bumper.destroy())
    this.targets.forEach(target => target.destroy())

    this.bumpers = []
    this.targets = []
    this.walls = []
  }
}
