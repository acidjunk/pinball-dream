import Phaser from 'phaser'
import { COLORS } from '@/config/constants'
import AudioSystem from '@/systems/AudioSystem'

export default class PreloadScene extends Phaser.Scene {
  private audioSystem!: AudioSystem

  constructor() {
    super({ key: 'PreloadScene' })
  }

  preload(): void {
    const { width, height } = this.scale

    // Create loading bar
    const progressBar = this.add.graphics()
    const progressBox = this.add.graphics()
    progressBox.fillStyle(0x222222, 0.8)
    progressBox.fillRect(width / 2 - 160, height / 2 - 30, 320, 50)

    // Loading text
    const loadingText = this.add.text(width / 2, height / 2 - 60, 'Loading...', {
      fontSize: '24px',
      color: COLORS.TEXT,
      fontFamily: 'Arial, sans-serif',
    }).setOrigin(0.5)

    const percentText = this.add.text(width / 2, height / 2, '0%', {
      fontSize: '20px',
      color: COLORS.TEXT,
      fontFamily: 'Arial, sans-serif',
    }).setOrigin(0.5)

    // Update progress bar
    this.load.on('progress', (value: number) => {
      progressBar.clear()
      progressBar.fillStyle(COLORS.FLIPPER, 1)
      progressBar.fillRect(width / 2 - 150, height / 2 - 20, 300 * value, 30)
      percentText.setText(`${Math.floor(value * 100)}%`)
    })

    this.load.on('complete', () => {
      progressBar.destroy()
      progressBox.destroy()
      loadingText.destroy()
      percentText.destroy()
    })

    // Initialize audio system
    this.audioSystem = new AudioSystem()
    this.registry.set('audioSystem', this.audioSystem)

    // Load assets here (will be added in Phase 7)
    // For now, we'll just use a small delay to show the loading screen
    this.load.image('placeholder', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==')
  }

  create(): void {
    // Load sounds
    this.audioSystem.loadSounds(this)

    // Move to menu after a short delay
    this.time.delayedCall(500, () => {
      this.scene.start('MenuScene')
    })
  }
}
