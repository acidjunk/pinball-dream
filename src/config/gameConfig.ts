import Phaser from 'phaser'
import { GAME, PHYSICS } from './constants'
import BootScene from '@/scenes/BootScene'
import PreloadScene from '@/scenes/PreloadScene'
import MenuScene from '@/scenes/MenuScene'
import GameScene from '@/scenes/GameScene'
import GameOverScene from '@/scenes/GameOverScene'

const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: GAME.WIDTH,
  height: GAME.HEIGHT,
  backgroundColor: '#001133',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    min: {
      width: 320,
      height: 568,
    },
    max: {
      width: 1080,
      height: 1920,
    },
  },
  physics: {
    default: 'matter',
    matter: {
      gravity: PHYSICS.GRAVITY,
      enableSleeping: false,
      debug: false,
      // High iterations for accuracy with fast-moving ball
      positionIterations: 6,
      velocityIterations: 10,
    },
  },
  scene: [BootScene, PreloadScene, MenuScene, GameScene, GameOverScene],
  audio: {
    disableWebAudio: false,
  },
}

export default gameConfig
