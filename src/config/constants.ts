// Game configuration constants

export const GAME = {
  WIDTH: 720,
  HEIGHT: 1280,
  TITLE: 'Pinball Dream',
  BALLS_PER_GAME: 5,
} as const

export const PHYSICS = {
  GRAVITY: { x: 0, y: 1 },
  BALL: {
    RADIUS: 16,
    MASS: 1,
    FRICTION: 0.005,
    RESTITUTION: 0.85,
    DENSITY: 0.001,
  },
  FLIPPER: {
    WIDTH: 200,
    HEIGHT: 24,
    RESTITUTION: 1.2,
    DENSITY: 0.1,
    ANGULAR_VELOCITY: 0.25,
  },
  BUMPER: {
    RADIUS: 32,
    RESTITUTION: 1.3,
    IMPULSE: 15,
  },
  TARGET: {
    WIDTH: 40,
    HEIGHT: 80,
    RESTITUTION: 0.5,
  },
  WALL: {
    RESTITUTION: 0.5,
    FRICTION: 0.1,
  },
} as const

export const SCORING = {
  BUMPER_HIT: 100,
  TARGET_HIT: 500,
  ALL_TARGETS_BONUS: 2500,
} as const

export const COLORS = {
  BACKGROUND: 0x001133,
  BALL: 0xeeeeee,
  FLIPPER: 0xff3333,
  BUMPER: 0x3366ff,
  TARGET: 0xffcc00,
  WALL: 0x666666,
  TEXT: '#ffffff',
} as const

export const AUDIO = {
  VOLUME: {
    SFX: 0.7,
    MUSIC: 0.3,
  },
} as const
