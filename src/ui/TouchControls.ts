import Phaser from 'phaser'
import { isTouchDevice } from '@/utils/MobileDetect'

export default class TouchControls {
  private scene: Phaser.Scene
  private leftButton?: Phaser.GameObjects.Graphics
  private rightButton?: Phaser.GameObjects.Graphics

  constructor(scene: Phaser.Scene) {
    this.scene = scene

    if (isTouchDevice()) {
      this.create()
    }
  }

  private create(): void {
    const { width, height } = this.scene.scale

    // Left flipper button overlay
    this.leftButton = this.scene.add.graphics()
    this.leftButton.fillStyle(0xff3333, 0.2)
    this.leftButton.fillRoundedRect(20, height - 120, 150, 100, 10)
    this.leftButton.lineStyle(3, 0xff3333, 0.5)
    this.leftButton.strokeRoundedRect(20, height - 120, 150, 100, 10)
    this.leftButton.setDepth(999)

    // Add "L" text
    this.scene.add.text(95, height - 70, 'L', {
      fontSize: '48px',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(999).setAlpha(0.5)

    // Right flipper button overlay
    this.rightButton = this.scene.add.graphics()
    this.rightButton.fillStyle(0xff3333, 0.2)
    this.rightButton.fillRoundedRect(width - 170, height - 120, 150, 100, 10)
    this.rightButton.lineStyle(3, 0xff3333, 0.5)
    this.rightButton.strokeRoundedRect(width - 170, height - 120, 150, 100, 10)
    this.rightButton.setDepth(999)

    // Add "R" text
    this.scene.add.text(width - 95, height - 70, 'R', {
      fontSize: '48px',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(999).setAlpha(0.5)
  }

  destroy(): void {
    if (this.leftButton) this.leftButton.destroy()
    if (this.rightButton) this.rightButton.destroy()
  }
}
