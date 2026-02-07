# 🎮 Pinball Dream

A browser-based 2D pinball game optimized for mobile devices. Built with Phaser 3, TypeScript, and Matter.js physics.

## ✨ Features

- **Realistic Physics**: Matter.js-powered pinball physics simulation
- **Mobile-Optimized**: Touch controls with responsive design
- **Sound Effects**: Audio feedback for all game actions
- **High Scores**: Local score persistence with top 10 leaderboard
- **Cross-Platform**: Works on desktop and mobile browsers

## 🎯 Gameplay

- Launch the ball with SPACE or tap
- Control flippers with:
  - **Desktop**: Arrow keys, Z (left), M (right)
  - **Mobile**: Tap left/right half of screen
- Hit bumpers and targets to score points
- Complete all targets for bonus points
- 3 balls per game

## 🏗️ Technology Stack

- **Framework**: [Phaser 3](https://phaser.io/) - 2D game framework
- **Physics**: [Matter.js](https://brm.io/matter-js/) - 2D physics engine
- **Language**: [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- **Build Tool**: [Vite](https://vitejs.dev/) - Fast dev server and bundler
- **Audio**: [Howler.js](https://howlerjs.com/) - Cross-browser audio
- **Storage**: [LocalForage](https://localforage.github.io/localForage/) - Offline storage

## 🚀 Getting Started

### Prerequisites

- Node.js 22+ (specified in `.nvmrc`)
- npm

### Installation

```bash
# Use correct Node version (if using nvm)
nvm use

# Install dependencies
npm install

# Start development server
npm run dev
```

The game will be available at `http://localhost:5173`

### Building for Production

```bash
# Build the game
npm run build

# Preview production build
npm run preview
```

## 📱 Mobile Testing

To test on a mobile device:

```bash
# Start dev server with network access
npm run dev -- --host

# Find your local IP
# macOS: ipconfig getifaddr en0
# Linux: ip addr show

# Access from mobile: http://[YOUR_IP]:5173
```

## 🎮 Game Controls

### Desktop
- **Arrow Keys / Z / M**: Control flippers
- **Space**: Launch ball
- **Mouse**: Click UI buttons

### Mobile
- **Tap left half**: Left flipper
- **Tap right half**: Right flipper
- **Tap/hold launch area**: Charge and launch ball
- **Tap UI**: Interact with menus

## 📊 Scoring

- **Bumper Hit**: 100 points
- **Target Hit**: 500 points
- **All Targets Bonus**: 2,500 points

## 🗂️ Project Structure

```
pinball-dream/
├── src/
│   ├── config/          # Game configuration
│   ├── scenes/          # Phaser scenes
│   ├── objects/         # Game objects (Ball, Flipper, etc.)
│   ├── systems/         # Game systems (Score, Audio, Input)
│   ├── ui/              # UI components
│   ├── utils/           # Utility functions
│   └── types/           # TypeScript types
├── public/
│   └── assets/          # Images and audio (to be added)
└── .github/
    └── workflows/       # CI/CD configuration
```

## 🚢 Deployment

This game is configured to deploy automatically to GitHub Pages:

1. Push to `main` branch
2. GitHub Actions builds the project
3. Deploys to `gh-pages` branch
4. Available at `https://[username].github.io/pinball-dream/`

### Manual Deployment Setup

1. Go to repository Settings → Pages
2. Set Source to "GitHub Actions"
3. Push to main branch to trigger deployment

## 🎨 Asset Credits

Currently using placeholder graphics and basic audio. Future versions will include:
- Custom sprite artwork
- Professional sound effects from [freesound.org](https://freesound.org)
- Background music (royalty-free)

## 🐛 Known Issues

- Audio may require user interaction to play on mobile (browser security)
- Physics can be tweaked for better feel
- Additional visual polish planned

## 🛠️ Development

### Key Files

- `src/config/gameConfig.ts` - Phaser and physics configuration
- `src/scenes/GameScene.ts` - Main game loop
- `src/objects/Table.ts` - Table layout and elements
- `src/objects/Flipper.ts` - Flipper physics
- `vite.config.ts` - Build configuration

### Adding New Features

1. Create new objects in `src/objects/`
2. Add to Table in `src/objects/Table.ts`
3. Update scoring in `src/config/constants.ts`
4. Test on both desktop and mobile

## 📝 License

MIT License - feel free to use and modify

## 🙏 Acknowledgments

- Built with [Phaser 3](https://phaser.io/)
- Physics by [Matter.js](https://brm.io/matter-js/)
- Inspired by classic pinball games

## 🤝 Contributing

Contributions welcome! Please feel free to submit issues or pull requests.

---

Made with ❤️ and TypeScript
