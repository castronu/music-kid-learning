// Audio Engine for Note Synthesis using Web Audio API

export type NoteName = 'do' | 're' | 'mi' | 'fa' | 'sol' | 'la' | 'si';
export type InstrumentType = 'piano' | 'guitar' | 'flute' | 'violin' | 'organ';

// Frequencies for C major scale (4th octave)
const noteFrequencies: Record<NoteName, number> = {
  do: 261.63,   // C4
  re: 293.66,   // D4
  mi: 329.63,   // E4
  fa: 349.23,   // F4
  sol: 392.00,  // G4
  la: 440.00,   // A4
  si: 493.88,   // B4
};

interface InstrumentSettings {
  oscillatorType: OscillatorType;
  attack: number;
  decay: number;
  sustain: number;
  release: number;
  volume: number;
  harmonics?: number[]; // Multipliers for harmonic frequencies
}

const instrumentPresets: Record<InstrumentType, InstrumentSettings> = {
  piano: {
    oscillatorType: 'triangle',
    attack: 0.01,
    decay: 0.1,
    sustain: 0.3,
    release: 0.5,
    volume: 0.3,
  },
  guitar: {
    oscillatorType: 'sawtooth',
    attack: 0.005,
    decay: 0.05,
    sustain: 0.4,
    release: 0.8,
    volume: 0.25,
    harmonics: [1, 0.5, 0.25], // Fundamental + 2 harmonics
  },
  flute: {
    oscillatorType: 'sine',
    attack: 0.05,
    decay: 0.1,
    sustain: 0.6,
    release: 0.3,
    volume: 0.2,
  },
  violin: {
    oscillatorType: 'sawtooth',
    attack: 0.1,
    decay: 0.2,
    sustain: 0.7,
    release: 0.4,
    volume: 0.3,
    harmonics: [1, 0.3, 0.15, 0.08], // Rich harmonic content
  },
  organ: {
    oscillatorType: 'square',
    attack: 0.02,
    decay: 0,
    sustain: 0.8,
    release: 0.1,
    volume: 0.25,
    harmonics: [1, 0.5, 0.25, 0.125], // Organ-like harmonics
  },
};

export class AudioEngine {
  private audioContext: AudioContext | null = null;
  private currentInstrument: InstrumentType = 'piano';

  initialize() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.audioContext;
  }

  setInstrument(instrument: InstrumentType): void {
    this.currentInstrument = instrument;
  }

  getInstrument(): InstrumentType {
    return this.currentInstrument;
  }

  playNote(note: NoteName, duration: number = 1.0): void {
    const ctx = this.initialize();
    const frequency = noteFrequencies[note];
    const settings = instrumentPresets[this.currentInstrument];

    const masterGain = ctx.createGain();
    masterGain.connect(ctx.destination);

    // Create main oscillator
    this.createOscillator(ctx, frequency, duration, settings, masterGain);

    // Add harmonics if defined
    if (settings.harmonics && settings.harmonics.length > 1) {
      for (let i = 1; i < settings.harmonics.length; i++) {
        const harmonicFreq = frequency * (i + 1);
        const harmonicVolume = settings.harmonics[i];
        const harmonicSettings = {
          ...settings,
          volume: settings.volume * harmonicVolume,
        };
        this.createOscillator(ctx, harmonicFreq, duration, harmonicSettings, masterGain);
      }
    }
  }

  private createOscillator(
    ctx: AudioContext,
    frequency: number,
    duration: number,
    settings: InstrumentSettings,
    destination: AudioNode
  ): void {
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = settings.oscillatorType;
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

    // ADSR envelope
    const attackTime = settings.attack;
    const decayTime = settings.decay;
    const sustainLevel = settings.volume * settings.sustain;
    const releaseTime = settings.release;

    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(
      settings.volume,
      ctx.currentTime + attackTime
    );
    gainNode.gain.exponentialRampToValueAtTime(
      Math.max(sustainLevel, 0.01),
      ctx.currentTime + attackTime + decayTime
    );
    gainNode.gain.exponentialRampToValueAtTime(
      Math.max(sustainLevel * 0.8, 0.01),
      ctx.currentTime + Math.max(duration - releaseTime, attackTime + decayTime)
    );
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      ctx.currentTime + duration
    );

    oscillator.connect(gainNode);
    gainNode.connect(destination);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  }

  async close() {
    if (this.audioContext) {
      await this.audioContext.close();
      this.audioContext = null;
    }
  }
}

export const audioEngine = new AudioEngine();
