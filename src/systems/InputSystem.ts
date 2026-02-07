import Phaser from 'phaser'
import { isTouchDevice } from '@/utils/MobileDetect'

export default class InputSystem {
  private scene: Phaser.Scene
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys
  private zKey?: Phaser.Input.Keyboard.Key
  private mKey?: Phaser.Input.Keyboard.Key
  private leftFlipperActive: boolean = false
  private rightFlipperActive: boolean = false

  constructor(scene: Phaser.Scene) {
    this.scene = scene
    this.setupKeyboard()
    this.setupTouch()
  }

  private setupKeyboard(): void {
    if (!this.scene.input.keyboard) return

    this.cursors = this.scene.input.keyboard.createCursorKeys()
    this.zKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z)
    this.mKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M)
  }

  private setupTouch(): void {
    if (!isTouchDevice()) return

    // Prevent default touch behaviors
    this.scene.input.addPointer(2) // Allow multi-touch

    // Touch zones for flippers
    const width = this.scene.scale.width
    const height = this.scene.scale.height

    // Left half for left flipper
    const leftZone = this.scene.add.zone(0, 0, width / 2, height)
      .setOrigin(0, 0)
      .setInteractive()

    leftZone.on('pointerdown', () => {
      this.leftFlipperActive = true
    })

    leftZone.on('pointerup', () => {
      this.leftFlipperActive = false
    })

    leftZone.on('pointerout', () => {
      this.leftFlipperActive = false
    })

    // Right half for right flipper
    const rightZone = this.scene.add.zone(width / 2, 0, width / 2, height)
      .setOrigin(0, 0)
      .setInteractive()

    rightZone.on('pointerdown', () => {
      this.rightFlipperActive = true
    })

    rightZone.on('pointerup', () => {
      this.rightFlipperActive = false
    })

    rightZone.on('pointerout', () => {
      this.rightFlipperActive = false
    })
  }

  isLeftFlipperActive(): boolean {
    if (this.leftFlipperActive) return true

    return !!(
      this.cursors?.left.isDown ||
      this.zKey?.isDown
    )
  }

  isRightFlipperActive(): boolean {
    if (this.rightFlipperActive) return true

    return !!(
      this.cursors?.right.isDown ||
      this.mKey?.isDown
    )
  }

  reset(): void {
    this.leftFlipperActive = false
    this.rightFlipperActive = false
  }

  destroy(): void {
    this.reset()
  }
}
