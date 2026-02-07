# 🚀 Quick Start Guide

Get Pinball Dream running in 60 seconds!

## Prerequisites

- Node.js 22+ installed
- npm (comes with Node.js)
- Git (for deployment)

## Install & Run

```bash
# 1. Navigate to project directory
cd pinball-dream

# 2. Install dependencies (first time only)
npm install

# 3. Start the game
npm run dev
```

The game will open at **http://localhost:5173** 🎮

## Controls

### Desktop 🖥️
- **Arrow Keys** or **Z / M**: Control flippers
- **Space**: Launch ball
- **Mouse**: Click menu buttons

### Mobile 📱
- **Tap Left/Right**: Control flippers
- **Tap Launch Area**: Launch ball
- **Tap Buttons**: Navigate menus

## Game Rules

1. Launch the ball with Space or tap
2. Use flippers to keep the ball in play
3. Hit bumpers (100 points) and targets (500 points)
4. Complete all targets for 2,500 bonus points
5. You have 3 balls per game
6. Try to beat the high score!

## Build for Production

```bash
# Build the game
npm run build

# Preview the build
npm run preview
```

## Deploy to GitHub Pages

```bash
# Push to GitHub (first time setup required)
git push origin main

# GitHub Actions will automatically deploy
# Game will be live at: https://[username].github.io/pinball-dream/
```

## Testing on Mobile

```bash
# Start dev server with network access
npm run dev -- --host

# Get your local IP address
# macOS: ipconfig getifaddr en0
# Linux: ip addr show
# Windows: ipconfig

# On your mobile device, visit:
# http://[YOUR-IP-ADDRESS]:5173
```

## Troubleshooting

### Port already in use?
```bash
# Try a different port
npm run dev -- --port 3000
```

### Build errors?
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

### Touch controls not working?
- Make sure you're accessing via HTTPS or localhost
- Check that your browser supports touch events
- Try rotating device to portrait orientation

### No sound?
- Click/tap the screen first (browser security)
- Check that mute is not enabled (speaker icon)
- Try toggling mute off/on

## What's Next?

- 📖 Read [README.md](README.md) for full documentation
- 🛠️ Check [DEVELOPMENT.md](DEVELOPMENT.md) for technical details
- 📊 See [IMPLEMENTATION_STATUS.md](IMPLEMENTATION_STATUS.md) for current status

## Need Help?

- Check browser console for errors (F12)
- Ensure Node.js 22+ is installed: `node --version`
- Make sure you're in the correct directory
- Try clearing browser cache (Ctrl+Shift+R)

## Have Fun! 🎉

Enjoy playing Pinball Dream! Try to beat your high score and challenge your friends!

---

Made with ❤️ using Phaser, TypeScript, and Vite
