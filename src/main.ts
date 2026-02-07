import Phaser from 'phaser'
import gameConfig from './config/gameConfig'

// Prevent default touch behaviors
document.addEventListener('touchmove', (e) => {
  e.preventDefault()
}, { passive: false })

document.addEventListener('gesturestart', (e) => {
  e.preventDefault()
})

// Initialize game
const game = new Phaser.Game(gameConfig)

// Handle window resize
window.addEventListener('resize', () => {
  game.scale.refresh()
})

// Expose game instance for debugging
;(window as any).game = game

console.log('🎮 Pinball Dream initialized!')
