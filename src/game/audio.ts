/**
 * Procedural Web Audio API Engine for Fold Fold
 * - Tactile origami paper cardstock foley & wooden marimba match chimes
 * - Warm minimalist Bauhaus ambient marimba & pad generative music loop
 */

const CATEGORY_SCALES: number[][] = [
  // 01 First Crease: C Major Pentatonic (warm, clear)
  [261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33, 659.25],
  // 02 Layered Order: F Lydian (curious, architectural)
  [261.63, 293.66, 329.63, 349.23, 392.0, 440.0, 493.88, 523.25],
  // 03 One-Way Tape: D Dorian (crisp, rhythmic)
  [293.66, 329.63, 349.23, 392.0, 440.0, 493.88, 523.25, 587.33],
  // 04 Duplex Ink: G Major 9th (bright, playful)
  [293.66, 329.63, 392.0, 440.0, 493.88, 587.33, 659.25, 783.99],
  // 05 Master Archive: A Minor Pentatonic / Modern (focused, deep)
  [220.0, 261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33],
  // 06 Pressroom Edition: E Dorian Printshop (crisp, kinetic)
  [246.94, 293.66, 329.63, 369.99, 440.0, 493.88, 587.33, 659.25],
];

const MOTIF_PATTERNS: number[][] = [
  [0, 2, 4, 2, 5, 4, 2, 1],
  [0, 3, 5, 4, 2, 4, 6, 4],
  [2, 4, 7, 5, 4, 2, 3, 0],
  [0, 4, 2, 5, 3, 6, 4, 2],
];

class FoldAudioEngine {
  private ctx: AudioContext | null = null;
  private sfxEnabled = true;
  private musicEnabled = true;
  private musicTimer: number | null = null;
  private musicStep = 0;
  private categoryIndex = 0;
  private musicRunning = false;
  private unlocked = false;

  constructor() {
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          this.pauseMusicLoop();
        } else if (this.musicEnabled && this.unlocked) {
          this.startMusicLoop();
        }
      });
    }
  }

  public initSettings(sfx: boolean, music: boolean) {
    this.sfxEnabled = sfx;
    this.musicEnabled = music;
  }

  public isSfxEnabled() {
    return this.sfxEnabled;
  }

  public isMusicEnabled() {
    return this.musicEnabled;
  }

  public setSfxEnabled(enabled: boolean) {
    this.sfxEnabled = enabled;
    if (enabled) {
      this.unlock();
      this.playClick(640);
    }
  }

  public setMusicEnabled(enabled: boolean) {
    this.musicEnabled = enabled;
    if (enabled) {
      this.unlock();
      this.startMusicLoop();
    } else {
      this.pauseMusicLoop();
    }
  }

  public setCategoryMood(index: number) {
    this.categoryIndex = Math.max(0, Math.min(CATEGORY_SCALES.length - 1, index));
  }

  public unlock() {
    if (typeof window === 'undefined') return;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    this.unlocked = true;
    if (this.musicEnabled && !this.musicRunning) {
      this.startMusicLoop();
    }
  }

  private startMusicLoop() {
    if (this.musicRunning || !this.musicEnabled || !this.ctx) return;
    this.musicRunning = true;

    const tick = () => {
      if (!this.musicRunning || !this.musicEnabled || !this.ctx) return;
      if (this.ctx.state === 'running') {
        this.playMusicBeat(this.musicStep);
        this.musicStep++;
      }
    };

    // Calm 108 BPM eighth-note pulse (~278ms)
    this.musicTimer = window.setInterval(tick, 310);
  }

  private pauseMusicLoop() {
    this.musicRunning = false;
    if (this.musicTimer !== null) {
      window.clearInterval(this.musicTimer);
      this.musicTimer = null;
    }
  }

  private playMusicBeat(step: number) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const scale = CATEGORY_SCALES[this.categoryIndex] || CATEGORY_SCALES[0];
    const bar = Math.floor(step / 8);
    const beatInBar = step % 8;
    const motif = MOTIF_PATTERNS[(bar + this.categoryIndex) % MOTIF_PATTERNS.length];

    // Gentle wooden marimba arpeggio (skip occasional beats for breathable minimalism)
    const shouldPlayMarimba = beatInBar !== 3 && !(bar % 2 === 1 && beatInBar === 6);
    if (shouldPlayMarimba) {
      const noteIdx = motif[beatInBar % motif.length];
      const freq = scale[noteIdx % scale.length];
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      const accent = beatInBar === 0 || beatInBar === 4 ? 0.036 : 0.022;
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(accent, now + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.42);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.45);
    }

    // Soft warm bass pad every 8 beats
    if (beatInBar === 0) {
      const rootFreq = scale[bar % 2 === 0 ? 0 : 2] * 0.5;
      const padOsc = this.ctx.createOscillator();
      const padFilter = this.ctx.createBiquadFilter();
      const padGain = this.ctx.createGain();

      padOsc.type = 'triangle';
      padOsc.frequency.setValueAtTime(rootFreq, now);
      padFilter.type = 'lowpass';
      padFilter.frequency.setValueAtTime(420, now);

      padGain.gain.setValueAtTime(0.0001, now);
      padGain.gain.linearRampToValueAtTime(0.034, now + 0.35);
      padGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.3);

      padOsc.connect(padFilter);
      padFilter.connect(padGain);
      padGain.connect(this.ctx.destination);
      padOsc.start(now);
      padOsc.stop(now + 2.35);
    }

    // Subtle paper brush pulse on off-beats
    if (beatInBar === 2 || beatInBar === 6) {
      const dur = 0.04;
      const len = Math.floor(this.ctx.sampleRate * dur);
      const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < len; i++) {
        data[i] = (Math.random() * 2 - 1) * (1 - i / len);
      }
      const src = this.ctx.createBufferSource();
      src.buffer = buf;

      const hp = this.ctx.createBiquadFilter();
      hp.type = 'highpass';
      hp.frequency.setValueAtTime(3200, now);

      const g = this.ctx.createGain();
      g.gain.setValueAtTime(0.012, now);
      g.gain.exponentialRampToValueAtTime(0.0005, now + dur);

      src.connect(hp);
      hp.connect(g);
      g.connect(this.ctx.destination);
      src.start(now);
    }
  }

  public playClick(pitch = 600) {
    if (!this.sfxEnabled) return;
    this.unlock();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(pitch, now);
    osc.frequency.exponentialRampToValueAtTime(170, now + 0.035);

    gain.gain.setValueAtTime(0.085, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.045);
  }

  public playSplashStamp() {
    if (!this.sfxEnabled) return;
    this.unlock();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    [392.0, 523.25, 659.25].forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.06);
      g.gain.setValueAtTime(0.0001, now + idx * 0.06);
      g.gain.linearRampToValueAtTime(0.08, now + idx * 0.06 + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0005, now + idx * 0.06 + 0.45);
      osc.connect(g);
      g.connect(this.ctx.destination);
      osc.start(now + idx * 0.06);
      osc.stop(now + idx * 0.06 + 0.48);
    });
  }

  public playCardstockFold() {
    if (!this.sfxEnabled) return;
    this.unlock();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const duration = 0.21;
    const bufferSize = Math.floor(this.ctx.sampleRate * duration);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.sin((i / bufferSize) * Math.PI);
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1100, now);
    filter.frequency.exponentialRampToValueAtTime(2400, now + 0.1);
    filter.Q.value = 1.4;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.15, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    noise.start(now);

    // Crisp cardstock snap thump
    const osc = this.ctx.createOscillator();
    const thud = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(175, now + 0.14);
    osc.frequency.exponentialRampToValueAtTime(60, now + 0.23);
    thud.gain.setValueAtTime(0.11, now + 0.14);
    thud.gain.exponentialRampToValueAtTime(0.001, now + 0.24);
    osc.connect(thud);
    thud.connect(this.ctx.destination);
    osc.start(now + 0.14);
    osc.stop(now + 0.25);
  }

  public playUndoSwoosh() {
    if (!this.sfxEnabled) return;
    this.unlock();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const dur = 0.14;
    const len = Math.floor(this.ctx.sampleRate * dur);
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.sin((i / len) * Math.PI);
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buf;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1800, now);
    filter.frequency.exponentialRampToValueAtTime(750, now + dur);

    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.09, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + dur);

    noise.connect(filter);
    filter.connect(g);
    g.connect(this.ctx.destination);
    noise.start(now);
  }

  public playMarimbaMatch(combo = 0) {
    if (!this.sfxEnabled) return;
    this.unlock();
    if (!this.ctx) return;

    const now = this.ctx.currentTime + 0.04;
    const notes = [523.25, 659.25, 783.99, 1046.5];
    const root = notes[combo % notes.length];

    [root, root * 1.5].forEach((freq, i) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.032);

      gain.gain.setValueAtTime(0.0001, now + i * 0.032);
      gain.gain.linearRampToValueAtTime(
        i === 0 ? 0.13 : 0.058,
        now + i * 0.032 + 0.01
      );
      gain.gain.exponentialRampToValueAtTime(0.0005, now + i * 0.032 + 0.45);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + i * 0.032);
      osc.stop(now + i * 0.032 + 0.48);
    });
  }

  public playDuplexFlip() {
    if (!this.sfxEnabled) return;
    this.unlock();
    if (!this.ctx) return;

    const now = this.ctx.currentTime + 0.06;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(660, now + 0.1);
    g.gain.setValueAtTime(0.001, now);
    g.gain.linearRampToValueAtTime(0.075, now + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0005, now + 0.15);
    osc.connect(g);
    g.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.16);
  }

  public playPaperTear() {
    if (!this.sfxEnabled) return;
    this.unlock();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const duration = 0.24;
    const len = Math.floor(this.ctx.sampleRate * duration);
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) {
      const t = i / len;
      // Stuttered perforation-tooth micro-pulses as paper rips cleanly
      const teeth = 0.62 + 0.38 * Math.sin(t * Math.PI * 22);
      const env = Math.sin(t * Math.PI) * teeth;
      data[i] = (Math.random() * 2 - 1) * env;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buf;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1600, now);
    filter.frequency.exponentialRampToValueAtTime(3800, now + duration);
    filter.Q.value = 1.8;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.18, now + 0.025);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    noise.start(now);
  }

  public playCarbonStamp() {
    if (!this.sfxEnabled) return;
    this.unlock();
    if (!this.ctx) return;

    const now = this.ctx.currentTime + 0.03;
    // Deep rubber ink-stamp thump
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(75, now + 0.12);
    g.gain.setValueAtTime(0.14, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
    osc.connect(g);
    g.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.15);

    // Crisp double-overtone confirmation tick
    const ping = this.ctx.createOscillator();
    const pg = this.ctx.createGain();
    ping.type = 'triangle';
    ping.frequency.setValueAtTime(587.33, now + 0.04);
    ping.frequency.exponentialRampToValueAtTime(783.99, now + 0.13);
    pg.gain.setValueAtTime(0.001, now + 0.04);
    pg.gain.linearRampToValueAtTime(0.07, now + 0.055);
    pg.gain.exponentialRampToValueAtTime(0.0008, now + 0.22);
    ping.connect(pg);
    pg.connect(this.ctx.destination);
    ping.start(now + 0.04);
    ping.stop(now + 0.24);
  }

  public playLockUnlock() {
    if (!this.sfxEnabled) return;
    this.unlock();
    if (!this.ctx) return;

    const now = this.ctx.currentTime + 0.05;
    [659.25, 987.77, 1318.5].forEach((freq, i) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = i === 0 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.05);
      g.gain.setValueAtTime(0.001, now + i * 0.05);
      g.gain.linearRampToValueAtTime(0.085, now + i * 0.05 + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0005, now + i * 0.05 + 0.32);
      osc.connect(g);
      g.connect(this.ctx.destination);
      osc.start(now + i * 0.05);
      osc.stop(now + i * 0.05 + 0.35);
    });
  }

  public playBlockedThud(isPin = false) {
    if (!this.sfxEnabled) return;
    this.unlock();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = isPin ? 'square' : 'sawtooth';
    osc.frequency.setValueAtTime(isPin ? 210 : 145, now);
    osc.frequency.linearRampToValueAtTime(isPin ? 130 : 82, now + 0.11);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = isPin ? 560 : 380;

    gain.gain.setValueAtTime(0.11, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.13);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.14);
  }

  public playHintChime() {
    if (!this.sfxEnabled) return;
    this.unlock();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    [587.33, 880].forEach((freq, i) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.07);
      g.gain.setValueAtTime(0.001, now + i * 0.07);
      g.gain.linearRampToValueAtTime(0.08, now + i * 0.07 + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0005, now + i * 0.07 + 0.3);
      osc.connect(g);
      g.connect(this.ctx.destination);
      osc.start(now + i * 0.07);
      osc.stop(now + i * 0.07 + 0.34);
    });
  }

  public playVictoryFanfare() {
    if (!this.sfxEnabled) return;
    this.unlock();
    if (!this.ctx) return;

    const now = this.ctx.currentTime + 0.12;
    const chord = [523.25, 659.25, 783.99, 1046.5, 1318.5];
    chord.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.055);

      gain.gain.setValueAtTime(0.0001, now + idx * 0.055);
      gain.gain.linearRampToValueAtTime(0.095, now + idx * 0.055 + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0005, now + idx * 0.055 + 0.95);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.055);
      osc.stop(now + idx * 0.055 + 1.0);
    });
  }
}

export const foldAudio = new FoldAudioEngine();
