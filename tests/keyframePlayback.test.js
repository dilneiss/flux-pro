import { describe, it, expect, vi } from 'vitest';
import { ref } from 'vue';
import { useKeyframePlayback } from '../src/composables/useKeyframePlayback.js';

describe('useKeyframePlayback Automated Presentation Engine', () => {
  it('toggles playback and automatically advances scenes on timer', () => {
    vi.useFakeTimers();

    const scenes = ref([
      { name: 'scene1', title: 'Intro' },
      { name: 'scene2', title: 'Code' },
      { name: 'scene3', title: 'Result' }
    ]);
    const currentSceneIndex = ref(0);
    const camera = ref({ x: 0, y: 0, zoom: 1 });

    const activateScene = vi.fn((idx) => {
      currentSceneIndex.value = idx;
    });

    const { isPlayingKeyframes, togglePlayback, stopPlayback } = useKeyframePlayback(
      scenes,
      currentSceneIndex,
      activateScene
    );

    expect(isPlayingKeyframes.value).toBe(false);

    // 1. Start playback
    togglePlayback(camera);
    expect(isPlayingKeyframes.value).toBe(true);

    // Fast-forward 4000ms
    vi.advanceTimersByTime(4000);
    expect(activateScene).toHaveBeenCalledWith(1, camera);
    expect(currentSceneIndex.value).toBe(1);

    // Fast-forward another 4000ms
    vi.advanceTimersByTime(4000);
    expect(activateScene).toHaveBeenCalledWith(2, camera);
    expect(currentSceneIndex.value).toBe(2);

    // 2. Pause playback
    stopPlayback();
    expect(isPlayingKeyframes.value).toBe(false);

    vi.advanceTimersByTime(4000);
    // Should not advance after stop
    expect(currentSceneIndex.value).toBe(2);

    vi.useRealTimers();
  });
});
