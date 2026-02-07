import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  base: '/pinball-dream/',
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  },
  build: {
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks: {
          phaser: ['phaser']
        }
      }
    }
  }
})
