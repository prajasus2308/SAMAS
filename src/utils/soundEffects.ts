// High-Fidelity Vintage Luxury Arcade Web Audio API Sound Synthesizer
// Distinct sound effects for:
// 1. Lever Pull (spring tension + filtered noise gear ratchet + release)
// 2. Reel Spinning (electromechanical escapement drum ticks with speed/reel modulation)
// 3. Individual Reel Stops (heavy solenoid brake thud + metallic latch + ascending harmonic chimes)
// 4. Final Result Reveal (golden swarmandal/harp glissando shimmer + sparkle burst)
// 5. Celebratory Jingle (multi-voice vintage arcade jackpot fanfare with bass & bell overtones)
// 6. Refined Mute Toggle + Volume Control with Master GainNode instant silencing and persistence

const MUTE_STORAGE_KEY = 'sanskrit_samas_sound_muted_v1';
const VOLUME_STORAGE_KEY = 'sanskrit_samas_sound_volume_v1';

class ArcadeSoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private noiseBuffer: AudioBuffer | null = null;
  private isMuted: boolean = false;
  private masterVolume: number = 0.85;

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        const savedMute = localStorage.getItem(MUTE_STORAGE_KEY);
        if (savedMute === 'true') {
          this.isMuted = true;
        }
        const savedVol = localStorage.getItem(VOLUME_STORAGE_KEY);
        if (savedVol !== null) {
          const parsed = parseFloat(savedVol);
          if (!Number.isNaN(parsed) && parsed >= 0 && parsed <= 1) {
            this.masterVolume = parsed;
          }
        }
      } catch {
        // ignore storage access issues
      }
    }
  }

  private getContext(): { ctx: AudioContext; out: GainNode } | null {
    if (this.isMuted) return null;
    if (typeof window === 'undefined') return null;

    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = this.isMuted ? 0 : this.masterVolume;
        this.masterGain.connect(this.ctx.destination);
      }
    }

    if (!this.ctx || !this.masterGain) return null;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    return { ctx: this.ctx, out: this.masterGain };
  }

  private getNoiseBuffer(ctx: AudioContext): AudioBuffer {
    if (this.noiseBuffer) return this.noiseBuffer;
    const bufferSize = ctx.sampleRate * 0.25;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    this.noiseBuffer = buffer;
    return buffer;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    try {
      localStorage.setItem(MUTE_STORAGE_KEY, String(muted));
    } catch {
      // ignore storage errors
    }

    if (this.ctx && this.masterGain) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setTargetAtTime(
        muted ? 0 : this.masterVolume,
        now,
        0.012
      );
    }

    if (muted && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // ignore
      }
    }

    if (!muted) {
      this.playUnmuteChime();
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setVolume(vol: number) {
    const clamped = Math.max(0, Math.min(1, vol));
    this.masterVolume = clamped;
    try {
      localStorage.setItem(VOLUME_STORAGE_KEY, String(clamped));
    } catch {
      // ignore
    }
    if (this.ctx && this.masterGain && !this.isMuted) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setTargetAtTime(clamped, now, 0.015);
    }
  }

  public getVolume(): number {
    return this.masterVolume;
  }

  private playUnmuteChime() {
    const audio = this.getContext();
    if (!audio) return;
    const { ctx, out } = audio;
    const now = ctx.currentTime;

    [523.25, 659.25, 783.99].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.055);

      gain.gain.setValueAtTime(0.08, now + i * 0.055);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.055 + 0.16);

      osc.connect(gain);
      gain.connect(out);
      osc.start(now + i * 0.055);
      osc.stop(now + i * 0.055 + 0.18);
    });
  }

  // 1. LEVER PULL: Heavy mechanical spring coil + 7-tooth brass gear ratchet + release snap
  public playLeverPull() {
    const audio = this.getContext();
    if (!audio) return;
    const { ctx, out } = audio;
    const now = ctx.currentTime;

    // A. Low mechanical spring coil tension sweep
    const springOsc = ctx.createOscillator();
    const springGain = ctx.createGain();
    springOsc.type = 'sawtooth';
    springOsc.frequency.setValueAtTime(65, now);
    springOsc.frequency.linearRampToValueAtTime(155, now + 0.25);
    springOsc.frequency.exponentialRampToValueAtTime(48, now + 0.38);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(360, now);

    springGain.gain.setValueAtTime(0.12, now);
    springGain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

    springOsc.connect(filter);
    filter.connect(springGain);
    springGain.connect(out);
    springOsc.start(now);
    springOsc.stop(now + 0.4);

    // B. 7-step gear ratchet clicks + crisp percussive transient
    const clickOffsets = [0, 0.036, 0.074, 0.115, 0.16, 0.21, 0.27];
    clickOffsets.forEach((offset, i) => {
      const t = now + offset;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      const baseFreq = 280 - i * 18;
      osc.frequency.setValueAtTime(baseFreq, t);
      osc.frequency.exponentialRampToValueAtTime(75, t + 0.032);

      gain.gain.setValueAtTime(0.18, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.035);

      osc.connect(gain);
      gain.connect(out);
      osc.start(t);
      osc.stop(t + 0.038);
    });

    // C. Mechanical release air whoosh using filtered noise
    const noiseSrc = ctx.createBufferSource();
    noiseSrc.buffer = this.getNoiseBuffer(ctx);
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(800, now + 0.26);
    noiseFilter.Q.setValueAtTime(3.0, now + 0.26);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.001, now + 0.26);
    noiseGain.gain.linearRampToValueAtTime(0.08, now + 0.29);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.39);

    noiseSrc.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(out);
    noiseSrc.start(now + 0.26);
    noiseSrc.stop(now + 0.4);
  }

  // 2A. REEL SPIN START: Electric motor clutch kick + rotor acceleration whine + escapement release
  public playReelSpinStart() {
    const audio = this.getContext();
    if (!audio) return;
    const { ctx, out } = audio;
    const now = ctx.currentTime;

    // A. High-torque electric motor clutch kick (punchy sub-transient)
    const motorKick = ctx.createOscillator();
    const kickGain = ctx.createGain();
    motorKick.type = 'triangle';
    motorKick.frequency.setValueAtTime(140, now);
    motorKick.frequency.exponentialRampToValueAtTime(38, now + 0.08);

    kickGain.gain.setValueAtTime(0.24, now);
    kickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    motorKick.connect(kickGain);
    kickGain.connect(out);
    motorKick.start(now);
    motorKick.stop(now + 0.1);

    // B. Rotor angular acceleration sweep (whine spinning up into high speed)
    const rotorOsc = ctx.createOscillator();
    const rotorFilter = ctx.createBiquadFilter();
    const rotorGain = ctx.createGain();

    rotorOsc.type = 'sawtooth';
    rotorOsc.frequency.setValueAtTime(95, now);
    rotorOsc.frequency.exponentialRampToValueAtTime(380, now + 0.28);

    rotorFilter.type = 'bandpass';
    rotorFilter.frequency.setValueAtTime(450, now);
    rotorFilter.frequency.exponentialRampToValueAtTime(1250, now + 0.28);
    rotorFilter.Q.setValueAtTime(2.8, now);

    rotorGain.gain.setValueAtTime(0.001, now);
    rotorGain.gain.linearRampToValueAtTime(0.12, now + 0.04);
    rotorGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    rotorOsc.connect(rotorFilter);
    rotorFilter.connect(rotorGain);
    rotorGain.connect(out);
    rotorOsc.start(now);
    rotorOsc.stop(now + 0.32);

    // C. Triple mechanical brake release clicks (disengaging 3 reel drums)
    [0.015, 0.048, 0.082].forEach((offset, idx) => {
      const t = now + offset;
      const clickOsc = ctx.createOscillator();
      const clickGain = ctx.createGain();
      clickOsc.type = 'triangle';
      clickOsc.frequency.setValueAtTime(620 + idx * 80, t);
      clickOsc.frequency.exponentialRampToValueAtTime(110, t + 0.02);

      clickGain.gain.setValueAtTime(0.1, t);
      clickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.022);

      clickOsc.connect(clickGain);
      clickGain.connect(out);
      clickOsc.start(t);
      clickOsc.stop(t + 0.025);
    });

    // D. Subtle vintage arcade flight chime (ascending C5 -> G5 -> C6)
    [523.25, 783.99, 1046.5].forEach((freq, i) => {
      const t = now + 0.04 + i * 0.038;
      const chimeOsc = ctx.createOscillator();
      const chimeGain = ctx.createGain();
      chimeOsc.type = 'sine';
      chimeOsc.frequency.setValueAtTime(freq, t);

      chimeGain.gain.setValueAtTime(0.05, t);
      chimeGain.gain.exponentialRampToValueAtTime(0.001, t + 0.16);

      chimeOsc.connect(chimeGain);
      chimeGain.connect(out);
      chimeOsc.start(t);
      chimeOsc.stop(t + 0.18);
    });
  }

  // 2. REEL SPINNING: Vintage electromechanical drum escapement click
  public playReelTick(activeReelsCount: number = 3, stepIndex: number = 0) {
    const audio = this.getContext();
    if (!audio) return;
    const { ctx, out } = audio;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    const harmonicShift = (stepIndex % 3) * 20;
    const reelFactor = activeReelsCount === 3 ? 1.0 : activeReelsCount === 2 ? 0.91 : 0.82;
    const startFreq = (490 + harmonicShift) * reelFactor;

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.024);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(960, now);
    filter.Q.setValueAtTime(2.4, now);

    gain.gain.setValueAtTime(0.09, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.028);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(out);
    osc.start(now);
    osc.stop(now + 0.03);
  }

  // 3. INDIVIDUAL REEL STOP:
  // Synchronized with Framer Motion spring bounce (stiffness: 420, damping: 22, mass: 0.9)
  // Distinct Solenoid Brake Thud + Metallic Recoil + Harmonic Chime for Reel 0 (C4), Reel 1 (E4), Reel 2 (G4)
  public playIndividualReelStop(reelIndex: 0 | 1 | 2) {
    const audio = this.getContext();
    if (!audio) return;
    const { ctx, out } = audio;
    const now = ctx.currentTime;

    // Harmonic musical pitches for each reel:
    // Reel 0 (पूर्वपद): C4 (261.63 Hz) — Foundation Tonic
    // Reel 1 (उत्तरपद): E4 (329.63 Hz) — Major Third (tension builds)
    // Reel 2 (समस्त पद): G4 (392.00 Hz) + C5 (523.25 Hz) — Dominant Triad Resolution
    const reelPitches = [
      { bell: 261.63, overtone: 523.25, punch: 175, drop: 40, decay: 0.13 },
      { bell: 329.63, overtone: 659.25, punch: 200, drop: 46, decay: 0.14 },
      { bell: 392.00, overtone: 783.99, punch: 225, drop: 34, decay: 0.18 },
    ];
    const pitch = reelPitches[reelIndex];

    // A. Heavy mechanical solenoid brake thud (low-frequency punch)
    const thudOsc = ctx.createOscillator();
    const thudGain = ctx.createGain();
    thudOsc.type = 'sine';
    thudOsc.frequency.setValueAtTime(pitch.punch, now);
    thudOsc.frequency.exponentialRampToValueAtTime(pitch.drop, now + pitch.decay);

    thudGain.gain.setValueAtTime(reelIndex === 2 ? 0.36 : 0.28, now);
    thudGain.gain.exponentialRampToValueAtTime(0.001, now + pitch.decay);

    thudOsc.connect(thudGain);
    thudGain.connect(out);
    thudOsc.start(now);
    thudOsc.stop(now + pitch.decay + 0.02);

    // On final reel 3, add deep sub-bass impact layer
    if (reelIndex === 2) {
      const subOsc = ctx.createOscillator();
      const subGain = ctx.createGain();
      subOsc.type = 'triangle';
      subOsc.frequency.setValueAtTime(68, now);
      subOsc.frequency.exponentialRampToValueAtTime(28, now + 0.22);
      subGain.gain.setValueAtTime(0.2, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      subOsc.connect(subGain);
      subGain.connect(out);
      subOsc.start(now);
      subOsc.stop(now + 0.24);
    }

    // B. Crisp metallic latch tooth clamp (ratchet catch transient)
    const latchOsc = ctx.createOscillator();
    const latchGain = ctx.createGain();
    latchOsc.type = 'square';
    latchOsc.frequency.setValueAtTime(940 + reelIndex * 120, now);
    latchOsc.frequency.exponentialRampToValueAtTime(210, now + 0.028);

    latchGain.gain.setValueAtTime(0.08, now);
    latchGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

    latchOsc.connect(latchGain);
    latchGain.connect(out);
    latchOsc.start(now);
    latchOsc.stop(now + 0.032);

    // C. Spring recoil rebound click (accurately in sync with Framer Motion spring rebound at 80ms)
    const reboundTime = now + 0.082;
    const reboundOsc = ctx.createOscillator();
    const reboundGain = ctx.createGain();
    reboundOsc.type = 'triangle';
    reboundOsc.frequency.setValueAtTime(420 + reelIndex * 60, reboundTime);
    reboundOsc.frequency.exponentialRampToValueAtTime(160, reboundTime + 0.02);

    reboundGain.gain.setValueAtTime(0.05, reboundTime);
    reboundGain.gain.exponentialRampToValueAtTime(0.001, reboundTime + 0.022);

    reboundOsc.connect(reboundGain);
    reboundGain.connect(out);
    reboundOsc.start(reboundTime);
    reboundOsc.stop(reboundTime + 0.025);

    // D. Pure resonant brass bell chime note with natural warm ring
    const bellOsc = ctx.createOscillator();
    const overtoneOsc = ctx.createOscillator();
    const bellGain = ctx.createGain();

    bellOsc.type = 'sine';
    overtoneOsc.type = 'triangle';
    bellOsc.frequency.setValueAtTime(pitch.bell, now);
    overtoneOsc.frequency.setValueAtTime(pitch.overtone, now);

    bellGain.gain.setValueAtTime(reelIndex === 2 ? 0.22 : 0.16, now);
    bellGain.gain.exponentialRampToValueAtTime(0.001, now + (reelIndex === 2 ? 0.52 : 0.38));

    bellOsc.connect(bellGain);
    overtoneOsc.connect(bellGain);
    bellGain.connect(out);

    bellOsc.start(now);
    overtoneOsc.start(now);
    bellOsc.stop(now + 0.54);
    overtoneOsc.stop(now + 0.54);
  }

  // Alias for backward compatibility
  public playReelStop(reelIndex: 0 | 1 | 2) {
    this.playIndividualReelStop(reelIndex);
  }

  // 4. FINAL RESULT REVEAL: Golden swarmandal / harp glissando shimmer + particle burst sparkle
  public playResultReveal() {
    const audio = this.getContext();
    if (!audio) return;
    const { ctx, out } = audio;
    const now = ctx.currentTime;

    const shimmerNotes = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5, 1318.5];
    shimmerNotes.forEach((freq, i) => {
      const start = now + i * 0.038;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0.001, start);
      gain.gain.linearRampToValueAtTime(0.11, start + 0.014);
      gain.gain.exponentialRampToValueAtTime(0.0008, start + 0.42);

      osc.connect(gain);
      gain.connect(out);
      osc.start(start);
      osc.stop(start + 0.44);
    });
  }

  // 5. UNIQUE CELEBRATORY JINGLE:
  // Multi-voice triumphant arcade jackpot fanfare for winning result reveal,
  // synchronized with Framer Motion result reveal card & celebratory confetti animation.
  // Supports dynamic tier adaptation ('common' | 'rare' | 'master')
  public playCelebratoryJingle(level?: 'common' | 'rare' | 'master') {
    const audio = this.getContext();
    if (!audio) return;
    const { ctx, out } = audio;
    const now = ctx.currentTime;

    // A. Main Fanfare Melody (Triumphant Bilawal / Major ascending sequence):
    // C5 -> E5 -> G5 -> A5 -> G5 -> C6 -> E6 sustain
    const baseMelody = [
      { freq: 523.25, start: 0.00, dur: 0.11 }, // C5
      { freq: 659.25, start: 0.09, dur: 0.11 }, // E5
      { freq: 783.99, start: 0.18, dur: 0.11 }, // G5
      { freq: 880.00, start: 0.27, dur: 0.09 }, // A5
      { freq: 783.99, start: 0.35, dur: 0.10 }, // G5
      { freq: 1046.5, start: 0.44, dur: 0.35 }, // C6
      { freq: 1318.5, start: 0.58, dur: level === 'master' ? 0.95 : 0.75 }, // E6 apex
    ];

    baseMelody.forEach((note) => {
      const t = now + note.start;
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const oscDetune = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'triangle';
      osc2.type = 'sine';
      oscDetune.type = 'sawtooth';

      osc1.frequency.setValueAtTime(note.freq, t);
      osc2.frequency.setValueAtTime(note.freq * 1.5, t); // upper harmonic (Pa / 5th)
      oscDetune.frequency.setValueAtTime(note.freq * 1.004, t); // rich arcade chorus detune

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2600, t);

      const peakGain = level === 'master' ? 0.18 : level === 'rare' ? 0.16 : 0.14;
      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(peakGain, t + 0.018);
      gain.gain.exponentialRampToValueAtTime(0.0008, t + note.dur);

      osc1.connect(gain);
      osc2.connect(gain);
      oscDetune.connect(filter);
      filter.connect(gain);
      gain.connect(out);

      osc1.start(t);
      osc2.start(t);
      oscDetune.start(t);
      osc1.stop(t + note.dur + 0.03);
      osc2.stop(t + note.dur + 0.03);
      oscDetune.stop(t + note.dur + 0.03);
    });

    // B. Warm Root Fanfare Bass Foundation:
    // C3 (0.0s) -> F3 (0.27s) -> G3 (0.35s) -> C4 + low C2 sub (0.44s sustain)
    const bassline = [
      { freq: 130.81, start: 0.00, dur: 0.24 }, // C3
      { freq: 174.61, start: 0.26, dur: 0.18 }, // F3
      { freq: 196.00, start: 0.35, dur: 0.16 }, // G3
      { freq: 261.63, start: 0.44, dur: 0.85 }, // C4
      { freq: 65.41, start: 0.44, dur: 0.85 },  // C2 sub punch
    ];

    bassline.forEach((b) => {
      const t = now + b.start;
      const bassOsc = ctx.createOscillator();
      const bassGain = ctx.createGain();
      bassOsc.type = 'triangle';
      bassOsc.frequency.setValueAtTime(b.freq, t);

      bassGain.gain.setValueAtTime(0.12, t);
      bassGain.gain.exponentialRampToValueAtTime(0.001, t + b.dur);

      bassOsc.connect(bassGain);
      bassGain.connect(out);
      bassOsc.start(t);
      bassOsc.stop(t + b.dur + 0.02);
    });

    // C. Swarmandal / Harp Rapid Shimmer Arpeggio (spanning two octaves)
    const harpNotes = [523.25, 659.25, 783.99, 1046.5, 1318.5, 1567.98];
    harpNotes.forEach((f, i) => {
      const t = now + 0.18 + i * 0.034;
      const hOsc = ctx.createOscillator();
      const hGain = ctx.createGain();
      hOsc.type = 'sine';
      hOsc.frequency.setValueAtTime(f, t);

      hGain.gain.setValueAtTime(0.001, t);
      hGain.gain.linearRampToValueAtTime(0.08, t + 0.012);
      hGain.gain.exponentialRampToValueAtTime(0.0008, t + 0.38);

      hOsc.connect(hGain);
      hGain.connect(out);
      hOsc.start(t);
      hOsc.stop(t + 0.4);
    });

    // D. Master / Rare Tier Extra Arcade Flourish:
    if (level === 'master' || level === 'rare') {
      const flourishNotes =
        level === 'master'
          ? [1046.5, 1318.5, 1567.98, 2093.0] // High C6 -> E6 -> G6 -> C7 sparkle
          : [783.99, 1046.5, 1318.5]; // High G5 -> C6 -> E6 sparkle

      flourishNotes.forEach((f, i) => {
        const t = now + 0.65 + i * 0.06;
        const fOsc = ctx.createOscillator();
        const fGain = ctx.createGain();
        fOsc.type = 'triangle';
        fOsc.frequency.setValueAtTime(f, t);

        fGain.gain.setValueAtTime(0.001, t);
        fGain.gain.linearRampToValueAtTime(0.11, t + 0.01);
        fGain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);

        fOsc.connect(fGain);
        fGain.connect(out);
        fOsc.start(t);
        fOsc.stop(t + 0.48);
      });
    }
  }

  public playWinFanfare(level?: 'common' | 'rare' | 'master') {
    this.playCelebratoryJingle(level);
  }

  public playCategorySelect() {
    const audio = this.getContext();
    if (!audio) return;
    const { ctx, out } = audio;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(660, now + 0.045);

    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(out);
    osc.start(now);
    osc.stop(now + 0.055);
  }

  public playButtonClick() {
    const audio = this.getContext();
    if (!audio) return;
    const { ctx, out } = audio;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(580, now);
    osc.frequency.exponentialRampToValueAtTime(290, now + 0.03);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

    osc.connect(gain);
    gain.connect(out);
    osc.start(now);
    osc.stop(now + 0.04);
  }

  // Active Om Drone references
  private omNodes: {
    oscillators: OscillatorNode[];
    gains: GainNode[];
    filter: BiquadFilterNode;
    lfo?: OscillatorNode;
  } | null = null;

  public playSacredOmDrone(durationSeconds: number = 5.5) {
    if (this.isMuted) return;
    this.stopSacredOmDrone();

    const audio = this.getContext();
    if (!audio) return;
    const { ctx, out } = audio;
    const now = ctx.currentTime;

    // Sacred ॐ tuning: 136.1 Hz (Sadja / Earth frequency)
    const baseFreq = 136.1;
    const partials = [
      { freq: baseFreq, gain: 0.22, type: 'sine' as OscillatorType },
      { freq: baseFreq * 1.5, gain: 0.14, type: 'sine' as OscillatorType }, // Pa (5th)
      { freq: baseFreq * 2.0, gain: 0.11, type: 'sine' as OscillatorType }, // Octave
      { freq: baseFreq * 2.5, gain: 0.06, type: 'triangle' as OscillatorType }, // Ga (3rd)
      { freq: baseFreq * 4.0, gain: 0.04, type: 'sine' as OscillatorType }, // High chime
    ];

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, now);
    filter.frequency.exponentialRampToValueAtTime(950, now + 1.8);
    filter.frequency.exponentialRampToValueAtTime(380, now + durationSeconds);
    filter.Q.setValueAtTime(2.2, now);

    const masterOmGain = ctx.createGain();
    masterOmGain.gain.setValueAtTime(0.0001, now);
    // Smooth swelling attack
    masterOmGain.gain.exponentialRampToValueAtTime(0.35, now + 1.4);
    // Sustained meditative glow
    masterOmGain.gain.setValueAtTime(0.35, now + Math.max(1.5, durationSeconds - 1.8));
    // Soft decrescendo into peace
    masterOmGain.gain.exponentialRampToValueAtTime(0.0001, now + durationSeconds);

    filter.connect(masterOmGain);
    masterOmGain.connect(out);

    // Subtle gentle breathing tremolo LFO
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.setValueAtTime(0.35, now);
    lfoGain.gain.setValueAtTime(0.08, now);
    lfo.connect(lfoGain.gain);
    lfo.start(now);
    lfo.stop(now + durationSeconds + 0.5);

    const oscs: OscillatorNode[] = [lfo];
    const gains: GainNode[] = [masterOmGain];

    partials.forEach((part) => {
      const osc = ctx.createOscillator();
      const pGain = ctx.createGain();
      osc.type = part.type;
      osc.frequency.setValueAtTime(part.freq, now);

      pGain.gain.setValueAtTime(part.gain, now);

      osc.connect(pGain);
      pGain.connect(filter);

      osc.start(now);
      osc.stop(now + durationSeconds + 0.1);

      oscs.push(osc);
      gains.push(pGain);
    });

    this.omNodes = {
      oscillators: oscs,
      gains,
      filter,
      lfo,
    };
  }

  public stopSacredOmDrone() {
    if (!this.omNodes || !this.ctx) return;
    const now = this.ctx.currentTime;
    try {
      this.omNodes.gains.forEach((g) => {
        g.gain.cancelScheduledValues(now);
        g.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
      });
      setTimeout(() => {
        this.omNodes?.oscillators.forEach((osc) => {
          try {
            osc.stop();
          } catch {
            // ignore
          }
        });
        this.omNodes = null;
      }, 450);
    } catch {
      this.omNodes = null;
    }
  }

  // Play audio file /public/audio/om.mp3 with automatic fallback to high-fidelity Vedic drone synthesis
  public async playOmWithFallback(options?: {
    onAudioEnded?: () => void;
    onSourceDetermined?: (source: 'file' | 'synth') => void;
  }): Promise<() => void> {
    if (this.isMuted) {
      options?.onSourceDetermined?.('synth');
      return () => {};
    }

    // Try HTMLAudioElement for /public/audio/om.mp3
    let audioElem: HTMLAudioElement | null = null;
    let didUseSynth = false;

    const stopFunction = () => {
      if (audioElem) {
        audioElem.pause();
        audioElem.currentTime = 0;
        audioElem = null;
      }
      if (didUseSynth) {
        this.stopSacredOmDrone();
      }
    };

    try {
      audioElem = new Audio('/audio/om.mp3');
      audioElem.volume = Math.max(0, Math.min(1, this.masterVolume));

      const playPromise = audioElem.play();
      if (playPromise !== undefined) {
        await playPromise;
        options?.onSourceDetermined?.('file');
        audioElem.onended = () => {
          options?.onAudioEnded?.();
        };
        return stopFunction;
      }
    } catch {
      // Audio file not present or play blocked -> fallback to procedural synth drone
    }

    // Fallback: Vedic Om Synthesizer Drone
    didUseSynth = true;
    options?.onSourceDetermined?.('synth');
    this.playSacredOmDrone(5.5);
    const synthTimer = setTimeout(() => {
      options?.onAudioEnded?.();
    }, 5500);

    return () => {
      clearTimeout(synthTimer);
      this.stopSacredOmDrone();
    };
  }
}

export const soundEngine = new ArcadeSoundEngine();

