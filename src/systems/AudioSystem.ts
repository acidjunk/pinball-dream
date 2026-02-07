import { Howl, Howler } from 'howler'
import { AUDIO } from '@/config/constants'

interface AudioAssets {
  flipper?: Howl
  bumper?: Howl
  target?: Howl
  launch?: Howl
  drain?: Howl
  background?: Howl
}

export default class AudioSystem {
  private sounds: AudioAssets = {}
  private musicVolume: number = AUDIO.VOLUME.MUSIC
  private sfxVolume: number = AUDIO.VOLUME.SFX
  private isMuted: boolean = false

  constructor() {
    // Load mute state from localStorage
    const savedMuteState = localStorage.getItem('pinball_muted')
    if (savedMuteState !== null) {
      this.isMuted = savedMuteState === 'true'
    }

    Howler.volume(this.isMuted ? 0 : 1)
  }

  loadSounds(_scene: Phaser.Scene): void {
    // For now, we'll use simple oscillator-based sounds since we don't have audio files yet
    // This will be replaced with actual sound files later
    console.log('AudioSystem: Sounds would be loaded here')

    // Placeholder - these will be loaded from files in Phase 7
    // this.sounds.flipper = new Howl({ src: ['assets/audio/flipper.mp3'], volume: this.sfxVolume })
    // this.sounds.bumper = new Howl({ src: ['assets/audio/bumper.mp3'], volume: this.sfxVolume })
    // etc.
  }

  playSFX(soundName: keyof AudioAssets): void {
    if (this.isMuted) return

    const sound = this.sounds[soundName]
    if (sound) {
      sound.play()
    } else {
      // Fallback: use Web Audio API for simple beeps
      this.playBeep(soundName)
    }
  }

  private playBeep(type: string): void {
    if (this.isMuted) return

    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      // Different frequencies for different sounds
      switch (type) {
        case 'flipper':
          oscillator.frequency.value = 200
          gainNode.gain.value = 0.1
          break
        case 'bumper':
          oscillator.frequency.value = 400
          gainNode.gain.value = 0.15
          break
        case 'target':
          oscillator.frequency.value = 600
          gainNode.gain.value = 0.15
          break
        case 'launch':
          oscillator.frequency.value = 300
          gainNode.gain.value = 0.2
          break
        case 'drain':
          oscillator.frequency.value = 100
          gainNode.gain.value = 0.15
          break
        default:
          oscillator.frequency.value = 440
          gainNode.gain.value = 0.1
      }

      oscillator.start()
      oscillator.stop(audioContext.currentTime + 0.1)
    } catch (error) {
      console.warn('Could not play audio:', error)
    }
  }

  playMusic(): void {
    if (this.isMuted) return

    const music = this.sounds.background
    if (music && !music.playing()) {
      music.play()
    }
  }

  stopMusic(): void {
    const music = this.sounds.background
    if (music) {
      music.stop()
    }
  }

  toggleMute(): boolean {
    this.isMuted = !this.isMuted
    Howler.volume(this.isMuted ? 0 : 1)

    // Save state
    localStorage.setItem('pinball_muted', this.isMuted.toString())

    if (this.isMuted) {
      this.stopMusic()
    } else {
      this.playMusic()
    }

    return this.isMuted
  }

  isMutedState(): boolean {
    return this.isMuted
  }

  setMusicVolume(volume: number): void {
    this.musicVolume = Phaser.Math.Clamp(volume, 0, 1)
    if (this.sounds.background) {
      this.sounds.background.volume(this.musicVolume)
    }
  }

  setSFXVolume(volume: number): void {
    this.sfxVolume = Phaser.Math.Clamp(volume, 0, 1)
    Object.entries(this.sounds).forEach(([key, sound]) => {
      if (key !== 'background' && sound) {
        sound.volume(this.sfxVolume)
      }
    })
  }

  destroy(): void {
    Object.values(this.sounds).forEach(sound => {
      if (sound) {
        sound.unload()
      }
    })
    this.sounds = {}
  }
}
