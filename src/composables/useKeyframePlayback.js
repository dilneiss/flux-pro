import { ref, onUnmounted, getCurrentInstance } from 'vue';

export function useKeyframePlayback(scenesRef, currentSceneIndexRef, activateSceneFn) {
  const isPlayingKeyframes = ref(false);
  const playbackInterval = ref(4000); // 4 seconds per scene default
  let playbackTimer = null;

  const stopPlayback = () => {
    if (playbackTimer) {
      clearInterval(playbackTimer);
      playbackTimer = null;
    }
    isPlayingKeyframes.value = false;
  };

  const advanceNextKeyframe = (cameraRef) => {
    if (!scenesRef.value || scenesRef.value.length === 0) return;
    const nextIdx = (currentSceneIndexRef.value + 1) % scenesRef.value.length;
    activateSceneFn(nextIdx, cameraRef);
  };

  const startPlayback = (cameraRef) => {
    stopPlayback();
    isPlayingKeyframes.value = true;

    playbackTimer = setInterval(() => {
      if (!isPlayingKeyframes.value) {
        stopPlayback();
        return;
      }
      advanceNextKeyframe(cameraRef);
    }, playbackInterval.value);
  };

  const togglePlayback = (cameraRef) => {
    if (isPlayingKeyframes.value) {
      stopPlayback();
    } else {
      startPlayback(cameraRef);
    }
  };

  if (getCurrentInstance()) {
    onUnmounted(() => {
      stopPlayback();
    });
  }

  return {
    isPlayingKeyframes,
    playbackInterval,
    startPlayback,
    stopPlayback,
    togglePlayback
  };
}
