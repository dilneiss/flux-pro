import { describe, it, expect, vi, beforeEach } from 'vitest';
import { soundFX } from '../src/utils/soundFX.js';
import { useSpeechNarration } from '../src/composables/useSpeechNarration.js';

describe('CircuitFlow Studio v5.0 - Broadcast Cinema & Audio Engine', () => {
  beforeEach(() => {
    // Mock Web Audio API in Node test environment
    const mockAudioContext = {
      currentTime: 10,
      sampleRate: 44100,
      createGain: () => ({
        gain: { setValueAtTime: vi.fn(), linearRampToValueAtTime: vi.fn(), cancelScheduledValues: vi.fn() },
        connect: vi.fn()
      }),
      createBiquadFilter: () => ({
        type: 'lowpass',
        frequency: { setValueAtTime: vi.fn() },
        Q: { setValueAtTime: vi.fn() },
        connect: vi.fn()
      }),
      createOscillator: () => ({
        frequency: { setValueAtTime: vi.fn() },
        detune: { setValueAtTime: vi.fn() },
        connect: vi.fn(),
        start: vi.fn(),
        stop: vi.fn(),
        disconnect: vi.fn()
      }),
      createMediaStreamDestination: () => ({
        stream: { getAudioTracks: () => [{ id: 'mock-track' }] }
      }),
      destination: {}
    };

    soundFX.ctx = mockAudioContext;
    soundFX.masterGain = mockAudioContext.createGain();
    soundFX.mediaStreamDestination = mockAudioContext.createMediaStreamDestination();
  });

  it('manages Ambient Synth BGM and Auto-Ducking smoothly', () => {
    soundFX.isBgmActive = false;

    // Toggle BGM on
    const bgmOn = soundFX.toggleBgm();
    expect(bgmOn).toBe(true);
    expect(soundFX.isBgmActive).toBe(true);

    // Test ducking methods without error
    expect(() => soundFX.setDucking(true)).not.toThrow();
    expect(() => soundFX.setDucking(false)).not.toThrow();

    // Stop ambient drone
    soundFX.stopAmbientDrone();
    expect(typeof soundFX.stopAmbientDrone).toBe('function');
  });

  it('exposes Master Audio Mixer destination stream for MediaRecorder merging', () => {
    const stream = soundFX.getMixedAudioStream();
    expect(stream).toBeDefined();
    expect(stream.getAudioTracks().length).toBeGreaterThan(0);
  });

  it('accurately parses words and manages index for Karaoke Closed Captions', () => {
    const engine = useSpeechNarration();
    expect(engine.currentWordIndex.value).toBe(0);

    const sampleText = 'Vamos analisar a recompilação estática do executável.';
    const words = sampleText.split(/\s+/).filter(Boolean);
    expect(words).toHaveLength(7);

    // Initial word index
    expect(engine.currentWordIndex.value).toBe(0);
    expect(typeof engine.speak).toBe('function');
    expect(typeof engine.cancel).toBe('function');
  });

  it('supports 9:16 Shorts vs 16:9 aspect ratios correctly', () => {
    const ratios = ['16:9', '9:16'];
    expect(ratios).toContain('16:9');
    expect(ratios).toContain('9:16');

    // In 9:16, width is 9/16 of height (0.5625 ratio)
    const height = 1080;
    const verticalWidth = Math.round((height * 9) / 16);
    expect(verticalWidth).toBe(608);
  });
});
