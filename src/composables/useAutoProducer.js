import { ref } from 'vue';
import { soundFX } from '../utils/soundFX.js';

export function useAutoProducer(scenesRef, currentSceneIndexRef, activateSceneFn, cameraRef, isPresentingRef, speechEngine, screenRecorder) {
  const isAutoProducing = ref(false);
  const autoProducePhase = ref('idle'); // 'idle' | 'countdown' | 'producing' | 'zooming_out' | 'finished'
  const countdownNumber = ref(3);
  const currentCaption = ref('');
  const breathingPauseMs = ref(400);

  let abortFlag = false;

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  /**
   * Start 100% Autonomous Video Producer
   */
  const startAutoProduce = async () => {
    if (isAutoProducing.value) return;
    abortFlag = false;

    // 1. Request screen share at 60fps
    const streamStarted = await screenRecorder.startRecording();
    if (!streamStarted) {
      return false;
    }

    isAutoProducing.value = true;
    isPresentingRef.value = true;
    autoProducePhase.value = 'countdown';

    // 2. Countdown 3... 2... 1...
    for (let c = 3; c >= 1; c--) {
      if (abortFlag) return cancelAutoProduce();
      countdownNumber.value = c;
      soundFX.playCountdownBeep(c === 1);
      await sleep(1000);
    }

    if (abortFlag) return cancelAutoProduce();
    autoProducePhase.value = 'producing';

    const totalScenes = scenesRef.value.length;
    if (totalScenes === 0) {
      await finishProduction();
      return true;
    }

    // 3. Play each scene sequentially with camera movement + speech narration
    for (let i = 0; i < totalScenes; i++) {
      if (abortFlag) return cancelAutoProduce();

      // Activate scene & move camera
      activateSceneFn(i, cameraRef);
      soundFX.playCameraWhoosh();
      soundFX.playConnectBeep(920, 1380);

      const scene = scenesRef.value[i];
      const textToSpeak = scene?.narrationText || scene?.title || `Cena ${i + 1}`;
      currentCaption.value = textToSpeak;

      // Speak narration and await exact end of speech
      await new Promise((resolve) => {
        let finished = false;
        const done = () => {
          if (!finished) {
            finished = true;
            resolve();
          }
        };

        // Fallback max timeout if speech fails: duration + 3s
        const maxDuration = ((scene?.duration || speechEngine.estimateDuration(textToSpeak)) + 3) * 1000;
        const fallbackTimer = setTimeout(done, Math.max(maxDuration, 5000));

        speechEngine.speak(textToSpeak, {
          onStart: () => {},
          onEnd: () => {
            clearTimeout(fallbackTimer);
            done();
          }
        });
      });

      if (abortFlag) return cancelAutoProduce();

      // Breathing room between scenes
      await sleep(breathingPauseMs.value);
    }

    // 4. Final Cinematic Zoom-Out (Master Overview)
    autoProducePhase.value = 'zooming_out';
    currentCaption.value = 'Visão Geral do Fluxo Conectado';
    soundFX.playCameraWhoosh();

    if (cameraRef && cameraRef.value) {
      cameraRef.value = {
        x: 60,
        y: 40,
        zoom: 0.68
      };
    }

    soundFX.playChime();
    await sleep(2200);

    // 5. Complete and save video
    await finishProduction();
    return true;
  };

  /**
   * Finalize recording and restore UI
   */
  const finishProduction = async () => {
    autoProducePhase.value = 'finished';
    speechEngine.cancel();
    screenRecorder.stopRecording();

    await sleep(400);
    isPresentingRef.value = false;
    isAutoProducing.value = false;
    autoProducePhase.value = 'idle';
    currentCaption.value = '';
  };

  /**
   * Abort auto producer
   */
  const cancelAutoProduce = () => {
    abortFlag = true;
    speechEngine.cancel();
    screenRecorder.stopRecording();
    isPresentingRef.value = false;
    isAutoProducing.value = false;
    autoProducePhase.value = 'idle';
    currentCaption.value = '';
  };

  return {
    isAutoProducing,
    autoProducePhase,
    countdownNumber,
    currentCaption,
    breathingPauseMs,
    startAutoProduce,
    cancelAutoProduce
  };
}
