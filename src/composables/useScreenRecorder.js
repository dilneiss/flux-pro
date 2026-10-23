import { ref } from 'vue';
import { soundFX } from '../utils/soundFX.js';

export function useScreenRecorder() {
  const isRecording = ref(false);
  const recordingDuration = ref(0);
  const recordingTimer = ref(null);
  const recordedBlobs = ref([]);
  const mediaStream = ref(null);
  const mediaRecorder = ref(null);
  const errorMessage = ref('');

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  /**
   * Start recording the screen/canvas using browser MediaRecorder API
   * Uses client GPU and captures 60 FPS without server overhead.
   */
  const startRecording = async () => {
    errorMessage.value = '';
    recordedBlobs.value = [];

    if (!navigator.mediaDevices?.getDisplayMedia) {
      errorMessage.value = 'MediaRecorder/getDisplayMedia não suportado neste navegador.';
      return false;
    }

    try {
      // Prompt user to select screen, window, or tab
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          frameRate: { ideal: 60, max: 60 },
          displaySurface: 'browser'
        },
        audio: false
      });
      // Merge audio tracks from soundFX Master Mixer
      const tracks = [...stream.getVideoTracks()];
      const mixedAudioStream = soundFX.getMixedAudioStream();
      if (mixedAudioStream && mixedAudioStream.getAudioTracks().length > 0) {
        tracks.push(...mixedAudioStream.getAudioTracks());
      } else if (stream.getAudioTracks().length > 0) {
        tracks.push(...stream.getAudioTracks());
      }

      const combinedStream = new MediaStream(tracks);
      mediaStream.value = combinedStream;

      // Select supported mimeType
      const mimeTypes = [
        'video/webm;codecs=vp9,opus',
        'video/webm;codecs=vp8,opus',
        'video/webm',
        'video/mp4'
      ];
      const selectedMime = mimeTypes.find((type) => MediaRecorder.isTypeSupported(type)) || 'video/webm';

      const recorder = new MediaRecorder(combinedStream, {
        mimeType: selectedMime,
        videoBitsPerSecond: 12000000 // 12 Mbps for crystal-clear 1080p/4K
      });

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          recordedBlobs.value.push(event.data);
        }
      };

      recorder.onstop = () => {
        clearInterval(recordingTimer.value);
        isRecording.value = false;

        // Auto download
        if (recordedBlobs.value.length > 0) {
          const blob = new Blob(recordedBlobs.value, { type: selectedMime });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `circuitflow-capture-${Date.now()}.webm`;
          document.body.appendChild(a);
          a.click();
          setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          }, 1000);
        }

        // Stop all tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      // Handle stream end when user clicks "Stop Sharing" on Chrome bar
      stream.getVideoTracks()[0].onended = () => {
        if (isRecording.value) {
          stopRecording();
        }
      };

      recorder.start(1000); // 1s slice
      mediaRecorder.value = recorder;
      isRecording.value = true;
      recordingDuration.value = 0;

      recordingTimer.value = setInterval(() => {
        recordingDuration.value++;
      }, 1000);

      return true;
    } catch (err) {
      if (err.name !== 'NotAllowedError') {
        errorMessage.value = `Falha ao iniciar gravação: ${err.message}`;
      }
      return false;
    }
  };

  /**
   * Stop the active recording session
   */
  const stopRecording = () => {
    if (mediaRecorder.value && mediaRecorder.value.state !== 'inactive') {
      mediaRecorder.value.stop();
    }
    if (mediaStream.value) {
      mediaStream.value.getTracks().forEach((track) => track.stop());
    }
    clearInterval(recordingTimer.value);
    isRecording.value = false;
  };

  return {
    isRecording,
    recordingDuration,
    formatDuration,
    errorMessage,
    startRecording,
    stopRecording
  };
}
