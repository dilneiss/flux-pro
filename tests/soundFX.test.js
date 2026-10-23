import { describe, it, expect } from 'vitest';
import { soundFX } from '../src/utils/soundFX.js';

describe('SoundFX Procedural Web Audio Synthesizer', () => {
  it('initializes with audio enabled by default', () => {
    expect(soundFX.enabled).toBe(true);
  });

  it('toggles audio state correctly', () => {
    const initialState = soundFX.enabled;
    const toggled = soundFX.toggle();
    expect(toggled).toBe(!initialState);
    expect(soundFX.enabled).toBe(!initialState);

    // Toggle back
    soundFX.setEnabled(true);
    expect(soundFX.enabled).toBe(true);
  });

  it('safely handles audio methods when Web Audio context is uninitialized or in test environment', () => {
    expect(() => soundFX.playCameraWhoosh()).not.toThrow();
    expect(() => soundFX.playKeyTick()).not.toThrow();
    expect(() => soundFX.playConnectBeep()).not.toThrow();
    expect(() => soundFX.playChime()).not.toThrow();
    expect(() => soundFX.playCountdownBeep(false)).not.toThrow();
    expect(() => soundFX.playCountdownBeep(true)).not.toThrow();
  });
});
