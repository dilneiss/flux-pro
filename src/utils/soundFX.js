/**
 * CircuitFlow Studio v5.0 - Master Audio Mixer & Procedural Synthesizer
 * 100% Local, Zero external audio files.
 * Generates broadcast UI sound effects + Cyberpunk Synth-Pad Ambient Drone with Auto-Ducking.
 * Mixes all audio into a single MediaStreamDestination for guaranteed inclusion in exported .webm!
 */

class SoundFXSynthesizer {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.mediaStreamDestination = null;
    this.enabled = true;

    // Ambient Synth-Pad BGM State
    this.isBgmActive = false;
    this.bgmGainNode = null;
    this.bgmOscillators = [];
    this.bgmLfo = null;
    this.bgmFilter = null;
    this.bgmBaseVolume = 0.07;
  }

  /**
   * Lazy initializes the AudioContext and Master MediaStream Mixer
   */
  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();

        // Master Output Gain
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(1.0, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);

        // MediaStream Destination for recording mix
        if (this.ctx.createMediaStreamDestination) {
          this.mediaStreamDestination = this.ctx.createMediaStreamDestination();
          this.masterGain.connect(this.mediaStreamDestination);
        }
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  /**
   * Helper to connect any sound source to both speakers and recording stream
   */
  _connectSource(audioNode) {
    if (!this.masterGain) this.init();
    if (this.masterGain && audioNode) {
      audioNode.connect(this.masterGain);
    }
  }

  /**
   * Returns the mixed audio track to be merged into MediaRecorder
   */
  getMixedAudioStream() {
    this.init();
    return this.mediaStreamDestination ? this.mediaStreamDestination.stream : null;
  }

  setEnabled(val) {
    this.enabled = !!val;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.enabled ? 1.0 : 0.0, this.ctx.currentTime);
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    this.setEnabled(this.enabled);
    return this.enabled;
  }

  /* ====================================================================
   * PROCEDURAL CYBERPUNK AMBIENT SYNTH-PAD WITH AUTO-DUCKING
   * ==================================================================== */

  /**
   * Start multi-oscillator ambient synth-pad drone with warm resonant lowpass filter
   */
  startAmbientDrone() {
    if (this.isBgmActive) return;
    this.init();
    if (!this.ctx) return;

    try {
      this.stopAmbientDrone();
      const now = this.ctx.currentTime;

      // Master BGM gain node
      this.bgmGainNode = this.ctx.createGain();
      this.bgmGainNode.gain.setValueAtTime(0.001, now);
      this.bgmGainNode.gain.linearRampToValueAtTime(this.bgmBaseVolume, now + 1.5);
      this._connectSource(this.bgmGainNode);

      // Lowpass resonant warm filter
      this.bgmFilter = this.ctx.createBiquadFilter();
      this.bgmFilter.type = 'lowpass';
      this.bgmFilter.frequency.setValueAtTime(240, now);
      this.bgmFilter.Q.setValueAtTime(3.5, now);
      this.bgmFilter.connect(this.bgmGainNode);

      // LFO for slow analog filter breathing (0.12Hz)
      this.bgmLfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      this.bgmLfo.frequency.setValueAtTime(0.12, now);
      lfoGain.gain.setValueAtTime(60, now); // Modulate ±60Hz
      this.bgmLfo.connect(lfoGain);
      lfoGain.connect(this.bgmFilter.frequency);
      this.bgmLfo.start(now);

      // Detuned warm chord (A1 = 55Hz, E2 = 82.4Hz, A2 = 110Hz + detune)
      const freqs = [
        { f: 55.0, detune: -4, type: 'sawtooth' },
        { f: 55.0, detune: +4, type: 'triangle' },
        { f: 82.4, detune: -2, type: 'sine' },
        { f: 110.0, detune: +3, type: 'triangle' },
        { f: 165.0, detune: -5, type: 'sine' }
      ];

      this.bgmOscillators = freqs.map(({ f, detune, type }) => {
        const osc = this.ctx.createOscillator();
        osc.type = type;
        osc.frequency.setValueAtTime(f, now);
        osc.detune.setValueAtTime(detune, now);
        osc.connect(this.bgmFilter);
        osc.start(now);
        return osc;
      });

      this.isBgmActive = true;
    } catch {
      // AudioContext fallback handled
    }
  }

  /**
   * Stop ambient drone smoothly
   */
  stopAmbientDrone() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    if (this.bgmGainNode) {
      try {
        this.bgmGainNode.gain.cancelScheduledValues(now);
        this.bgmGainNode.gain.linearRampToValueAtTime(0.0001, now + 0.8);
      } catch {}
    }

    setTimeout(() => {
      if (this.bgmOscillators.length) {
        this.bgmOscillators.forEach((osc) => {
          try { osc.stop(); osc.disconnect(); } catch {}
        });
        this.bgmOscillators = [];
      }
      if (this.bgmLfo) {
        try { this.bgmLfo.stop(); this.bgmLfo.disconnect(); } catch {}
        this.bgmLfo = null;
      }
      this.isBgmActive = false;
    }, 850);
  }

  /**
   * Toggle BGM drone on/off
   */
  toggleBgm() {
    if (this.isBgmActive) {
      this.stopAmbientDrone();
      return false;
    } else {
      this.startAmbientDrone();
      return true;
    }
  }

  /**
   * Auto-Ducking: lowers BGM volume by 70% during spoken narration, recovers between scenes
   * @param {boolean} isSpeaking
   */
  setDucking(isSpeaking) {
    if (!this.bgmGainNode || !this.ctx || !this.isBgmActive) return;
    try {
      const now = this.ctx.currentTime;
      this.bgmGainNode.gain.cancelScheduledValues(now);

      if (isSpeaking) {
        // Duck volume down to 30% of base
        this.bgmGainNode.gain.linearRampToValueAtTime(this.bgmBaseVolume * 0.28, now + 0.2);
      } else {
        // Smoothly recover to full volume
        this.bgmGainNode.gain.linearRampToValueAtTime(this.bgmBaseVolume, now + 0.6);
      }
    } catch {}
  }

  /* ====================================================================
   * PROCEDURAL SOUND FX (WHITE NOISE, CHIRPS, TICKS, CHIMES)
   * ==================================================================== */

  /**
   * Camera transition whoosh: filtered noise sweep
   */
  playCameraWhoosh() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const duration = 0.28;
      const bufferSize = Math.floor(this.ctx.sampleRate * duration);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);

      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99 * b0 + white * 0.05;
        b1 = 0.95 * b1 + white * 0.1;
        b2 = 0.85 * b2 + white * 0.15;
        data[i] = (b0 + b1 + b2) * 0.4;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.Q.value = 2.5;

      const now = this.ctx.currentTime;
      filter.frequency.setValueAtTime(280, now);
      filter.frequency.exponentialRampToValueAtTime(1400, now + duration * 0.45);
      filter.frequency.exponentialRampToValueAtTime(220, now + duration);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.18, now + duration * 0.35);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      noise.connect(filter);
      filter.connect(gain);
      this._connectSource(gain);

      noise.start(now);
      noise.stop(now + duration);
    } catch {}
  }

  /**
   * Mechanical key tick for code/terminal typewriter micro-animations
   */
  playKeyTick() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1800 + Math.random() * 600, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.015);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.018);

      osc.connect(gain);
      this._connectSource(gain);

      osc.start(now);
      osc.stop(now + 0.02);
    } catch {}
  }

  /**
   * Sine chirp when a node or badge [ok] is highlighted/revealed
   */
  playConnectBeep(startFreq = 880, endFreq = 1320) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const duration = 0.12;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(startFreq, now);
      osc.frequency.exponentialRampToValueAtTime(endFreq, now + duration * 0.7);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      this._connectSource(gain);

      osc.start(now);
      osc.stop(now + duration);
    } catch {}
  }

  /**
   * Two-tone chime for auto-production completion or project load
   */
  playChime() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50];

      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const noteStart = now + idx * 0.09;
        const duration = 0.35;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, noteStart);

        gain.gain.setValueAtTime(0.001, noteStart);
        gain.gain.linearRampToValueAtTime(0.14, noteStart + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, noteStart + duration);

        osc.connect(gain);
        this._connectSource(gain);

        osc.start(noteStart);
        osc.stop(noteStart + duration);
      });
    } catch {}
  }

  /**
   * Countdown beep for 3, 2, 1
   */
  playCountdownBeep(isFinal = false) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const freq = isFinal ? 1200 : 700;
      const duration = isFinal ? 0.35 : 0.12;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(isFinal ? 0.25 : 0.15, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      this._connectSource(gain);

      osc.start(now);
      osc.stop(now + duration);
    } catch {}
  }
}

export const soundFX = new SoundFXSynthesizer();
