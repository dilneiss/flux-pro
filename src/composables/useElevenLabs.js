import { ref, watch } from 'vue';

export function useElevenLabs() {
  const isPlaying = ref(false);
  const currentTime = ref(0);
  const duration = ref(0);
  const audioUrl = ref('');
  const audioPlayer = ref(null);
  const isSyncActive = ref(true);
  const lastTriggeredSceneIndex = ref(-1);

  // Status and error
  const isLoading = ref(false);
  const statusMessage = ref('');

  /**
   * Initializes or updates audio element
   */
  const loadAudio = (url) => {
    if (audioPlayer.value) {
      audioPlayer.value.pause();
      audioPlayer.value = null;
    }
    audioUrl.value = url;
    const audio = new Audio(url);
    audioPlayer.value = audio;

    audio.onloadedmetadata = () => {
      duration.value = audio.duration;
    };

    audio.ontimeupdate = () => {
      currentTime.value = audio.currentTime;
    };

    audio.onended = () => {
      isPlaying.value = false;
      currentTime.value = 0;
      lastTriggeredSceneIndex.value = -1;
    };
  };

  /**
   * Toggle audio playback
   */
  const togglePlay = () => {
    if (!audioPlayer.value) return;
    if (isPlaying.value) {
      audioPlayer.value.pause();
      isPlaying.value = false;
    } else {
      audioPlayer.value.play();
      isPlaying.value = true;
    }
  };

  /**
   * Seek to specific second
   */
  const seekTo = (seconds) => {
    if (!audioPlayer.value) return;
    audioPlayer.value.currentTime = seconds;
    currentTime.value = seconds;
  };

  /**
   * Calculates realistic speech duration estimate (words per minute ~140 wpm for tech presentations)
   * and auto-assigns sequential scene.startTime based on text length.
   */
  const autoAssignTimestampsFromScenes = (scenes) => {
    let accumulator = 0;
    scenes.forEach((scene, idx) => {
      scene.startTime = Number(accumulator.toFixed(2));
      const fullText = `${scene.title} ${scene.subtitle || ''}`;
      const wordCount = fullText.trim().split(/\s+/).filter(Boolean).length;
      // ~130 words per minute => ~0.46s per word + 1.2s pause between scenes
      const estimatedDuration = Math.max(3.0, wordCount * 0.46 + 1.2);
      accumulator += estimatedDuration;
    });
    duration.value = Math.max(duration.value, accumulator);
    return scenes;
  };

  /**
   * Watches audio playback and automatically triggers scene transitions
   * when currentTime reaches or passes scene.startTime
   */
  const bindAudioToScenes = (scenesRef, onActivateScene) => {
    watch(currentTime, (time) => {
      if (!isSyncActive.value || !isPlaying.value || !scenesRef.value?.length) return;

      const scenes = scenesRef.value;
      // Find the latest scene whose startTime <= currentTime
      let targetIndex = 0;
      for (let i = 0; i < scenes.length; i++) {
        const st = scenes[i].startTime ?? (i * 4.0);
        if (time >= st) {
          targetIndex = i;
        } else {
          break;
        }
      }

      if (targetIndex !== lastTriggeredSceneIndex.value) {
        lastTriggeredSceneIndex.value = targetIndex;
        onActivateScene(targetIndex);
      }
    });
  };

  return {
    isPlaying,
    currentTime,
    duration,
    audioUrl,
    isSyncActive,
    isLoading,
    statusMessage,
    loadAudio,
    togglePlay,
    seekTo,
    autoAssignTimestampsFromScenes,
    bindAudioToScenes
  };
}
