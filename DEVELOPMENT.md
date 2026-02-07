# Development Guide

## Quick Start

```bash
# Use correct Node version
nvm use

# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── config/          # Game configuration and constants
│   ├── constants.ts     # Physics, scoring, colors
│   └── gameConfig.ts    # Phaser configuration
├── scenes/          # Phaser scenes (game states)
│   ├── BootScene.ts     # Initial boot
│   ├── PreloadScene.ts  # Asset loading
│   ├── MenuScene.ts     # Main menu
│   ├── GameScene.ts     # Main gameplay
│   └── GameOverScene.ts # Game over and high scores
├── objects/         # Game objects
│   ├── Ball.ts          # Ball physics
│   ├── Flipper.ts       # Flipper with constraints
│   ├── Bumper.ts        # Bumper with collision
│   ├── Target.ts        # Score targets
│   ├── Plunger.ts       # Ball launcher
│   └── Table.ts         # Table container
├── systems/         # Game systems
│   ├── ScoreSystem.ts   # Score management
│   ├── AudioSystem.ts   # Sound management
│   └── InputSystem.ts   # Input handling
├── ui/              # UI components
│   ├── HUD.ts           # Score display
│   └── TouchControls.ts # Mobile controls
├── utils/           # Utilities
│   ├── HighScoreManager.ts # Score persistence
│   └── MobileDetect.ts     # Device detection
└── types/           # TypeScript types
    └── index.d.ts
```

## Key Concepts

### Physics (Matter.js via Phaser)

The game uses Matter.js for realistic 2D physics:

- **Ball**: Circular body with high restitution for bouncing
- **Flippers**: Rectangular bodies with constraint-based hinges
- **Bumpers**: Static circular bodies that apply impulse on hit
- **Targets**: Static rectangular bodies
- **Walls**: Static bodies forming table boundaries

### Scene Flow

1. **BootScene** → Immediately moves to PreloadScene
2. **PreloadScene** → Loads assets, shows progress, moves to MenuScene
3. **MenuScene** → Main menu, can start game or view high scores
4. **GameScene** → Main gameplay loop
5. **GameOverScene** → Shows final score, high score entry, return to menu

### Input System

Supports multiple input methods:
- Keyboard: Arrow keys, Z (left flipper), M (right flipper), Space (launch)
- Touch: Left/right screen zones for flippers
- Multi-touch: Both flippers can be active simultaneously

### Audio System

- Uses Howler.js for cross-browser audio
- Fallback to Web Audio API for beeps (current implementation)
- Mute state persisted to localStorage

### High Scores

- Stored locally using LocalForage (IndexedDB)
- Top 10 scores with initials and timestamp
- Async operations for all storage access

## Configuration

### Physics Tuning

Edit `src/config/constants.ts`:

```typescript
export const PHYSICS = {
  GRAVITY: { x: 0, y: 1 },  // Increase y for faster fall
  BALL: {
    RESTITUTION: 0.85,        // Bounciness (0-1)
    FRICTION: 0.005,          // Surface friction
    // ...
  },
  FLIPPER: {
    ANGULAR_VELOCITY: 0.3,    // Flipper speed
    RESTITUTION: 1.2,         // Power transfer to ball
    // ...
  },
  // ...
}
```

### Scoring

Edit `src/config/constants.ts`:

```typescript
export const SCORING = {
  BUMPER_HIT: 100,
  TARGET_HIT: 500,
  ALL_TARGETS_BONUS: 2500,
}
```

### Game Settings

Edit `src/config/constants.ts`:

```typescript
export const GAME = {
  WIDTH: 720,              // Game width
  HEIGHT: 1280,            // Game height
  BALLS_PER_GAME: 3,       // Lives per game
}
```

## Adding New Features

### Adding a New Game Object

1. Create class in `src/objects/NewObject.ts`
2. Import and add to `Table.ts`
3. Update collision handling if needed
4. Add to scene update loop if dynamic

Example:

```typescript
// src/objects/NewObject.ts
export default class NewObject {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    // Create sprite with Matter physics
    // Set up collision detection
    // Add visual feedback
  }
}

// src/objects/Table.ts
import NewObject from './NewObject'

createNewObjects(): void {
  this.newObject = new NewObject(this.scene, x, y)
}
```

### Adding Sound Effects

1. Add audio file to `public/assets/audio/`
2. Load in `AudioSystem.loadSounds()`
3. Play with `audioSystem.playSFX('soundName')`

Example:

```typescript
// In AudioSystem.loadSounds()
this.sounds.newSound = new Howl({
  src: ['assets/audio/newsound.mp3'],
  volume: this.sfxVolume
})

// In game code
this.audioSystem.playSFX('newSound')
```

### Adding UI Elements

1. Create component in `src/ui/`
2. Initialize in `GameScene.create()`
3. Update in `GameScene.update()` if needed
4. Clean up in `GameScene.shutdown()`

## Testing

### Desktop Testing

```bash
npm run dev
# Open http://localhost:5173
```

Test with:
- Arrow keys for flippers
- Z/M keys for flippers
- Space for launch
- Mouse for UI interaction

### Mobile Testing

```bash
npm run dev -- --host
# Get local IP: ipconfig getifaddr en0 (Mac)
# Access from mobile: http://[YOUR_IP]:5173
```

Test:
- Touch zones for flippers
- Multi-touch (both flippers)
- Launch mechanic
- No scrolling/zooming
- Performance (should be ~60 FPS)

### Production Build Testing

```bash
npm run build
npm run preview
# Test at http://localhost:4173
```

Verify:
- All assets load correctly
- Base path works (/pinball-dream/)
- High scores persist
- Audio works (may need user interaction)

## Debugging

### Enable Physics Debug Mode

Edit `src/config/gameConfig.ts`:

```typescript
matter: {
  // ...
  debug: true,  // Shows collision shapes
}
```

### Console Logging

The game instance is exposed as `window.game`:

```javascript
// In browser console:
game.scene.scenes[3]  // Access GameScene
game.scale.refresh()  // Refresh scaling
```

### Common Issues

**Ball falls through flipper:**
- Check collision categories match
- Verify constraint anchor is correct
- Increase velocity iterations in physics config

**Flipper doesn't move:**
- Check angular velocity is applied
- Verify constraint is created correctly
- Check input system is detecting key/touch

**Audio doesn't play on mobile:**
- Browser security requires user interaction
- Ensure audio plays after user touch/click
- Check mute state in localStorage

**Touch controls not working:**
- Verify touch zones are interactive
- Check touch-action CSS is set
- Test preventDefault is working

## Performance Optimization

### Current Optimizations

- Phaser texture atlas for sprites (when added)
- Matter.js sleeping disabled (keeps physics active)
- High velocity/position iterations for accuracy
- Minimal particle effects

### Future Optimizations

- Use texture atlases for all sprites
- Object pooling for particles
- Reduce physics update rate on lower-end devices
- Lazy load audio files

## Deployment

### GitHub Pages (Automatic)

Push to main branch:

```bash
git push origin main
```

GitHub Actions will:
1. Build the project
2. Deploy to gh-pages branch
3. Make available at `https://[username].github.io/pinball-dream/`

### Manual Deployment

```bash
npm run build
# Upload dist/ folder to hosting service
# Ensure base path is set correctly in vite.config.ts
```

## Code Style

- TypeScript strict mode enabled
- Use explicit types for function parameters
- Use readonly for constants
- Prefer const over let
- Use arrow functions for callbacks
- Use async/await for promises

## Git Workflow

```bash
# Feature branch
git checkout -b feature/new-feature

# Make changes
git add .
git commit -m "Add new feature"

# Push and create PR
git push origin feature/new-feature
```

## Resources

- [Phaser 3 Documentation](https://photonstorm.github.io/phaser3-docs/)
- [Matter.js Documentation](https://brm.io/matter-js/docs/)
- [Vite Documentation](https://vitejs.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## Getting Help

- Check browser console for errors
- Enable physics debug mode to visualize collisions
- Use `console.log()` to trace execution
- Check the README for common issues
