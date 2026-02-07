import Phaser from 'phaser'

export default class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' })
  }

  preload(): void {
    // Any initial setup can go here
  }

  create(): void {
    // Move to preload scene
    this.scene.start('PreloadScene')
  }
}
