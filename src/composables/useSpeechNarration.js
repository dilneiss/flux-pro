import { ref, onMounted, getCurrentInstance } from 'vue';

export function useSpeechNarration() {
  const isSpeechEnabled = ref(true);
  const isSpeaking = ref(false);
  const currentSpokenText = ref('');
  const spokenCharIndex = ref(0);
  const speechRate = ref(1.02); // Natural cadence for technical presentations
  const speechPitch = ref(1.0);
  const availableVoices = ref([]);
  const selectedVoiceURI = ref('');
  const elevenLabsApiKey = ref(typeof localStorage !== 'undefined' ? localStorage.getItem('circuitflow_elevenlabs_key') || '' : '');
  const elevenLabsVoiceId = ref('21m00Tcm4TlvDq8ikWAM'); // Rachel default

  /**
   * Estimates scene duration in seconds based on text length
   */
  const estimateDuration = (text = '') => {
    if (!text || typeof text !== 'string') return 4;
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    // ~140 words per minute = ~2.33 words per second, plus 0.8s breathing room
    return Math.max(3.5, Number((words / 2.33 + 0.8).toFixed(1)));
  };

  /**
   * Discovers and chooses the best Portuguese voice available on the OS
   */
  const refreshVoices = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    const voices = window.speechSynthesis.getVoices() || [];
    availableVoices.value = voices;

    if (voices.length > 0 && !selectedVoiceURI.value) {
      // Prioritize natural Brazilian Portuguese voices
      const ptBrVoices = voices.filter(v => v.lang === 'pt-BR' || v.lang === 'pt_BR');
      const naturalPt = ptBrVoices.find(v =>
        v.name.includes('Antonio') ||
        v.name.includes('Francisca') ||
        v.name.includes('Heloisa') ||
        v.name.includes('Felipe') ||
        v.name.includes('Daniel') ||
        v.name.includes('Google') ||
        v.name.includes('Natural')
      );

      if (naturalPt) {
        selectedVoiceURI.value = naturalPt.voiceURI;
      } else if (ptBrVoices.length > 0) {
        selectedVoiceURI.value = ptBrVoices[0].voiceURI;
      } else {
        const anyPt = voices.find(v => v.lang.startsWith('pt'));
        if (anyPt) selectedVoiceURI.value = anyPt.voiceURI;
      }
    }
  };

  /**
   * Speak a text string with either ElevenLabs or Native SpeechSynthesis
   * @param {string} text - text to speak
   * @param {Object} options - callbacks: onStart, onEnd, onBoundary
   */
  let activeAudioElement = null;

  const speak = (text, options = {}) => {
    const { onStart, onEnd, onBoundary } = options;

    cancel();

    if (!text || !text.trim() || !isSpeechEnabled.value) {
      if (onStart) onStart();
      const delay = estimateDuration(text) * 1000;
      const timer = setTimeout(() => {
        if (onEnd) onEnd();
      }, Math.min(delay, 4000));
      return () => clearTimeout(timer);
    }

    currentSpokenText.value = text;
    spokenCharIndex.value = 0;
    isSpeaking.value = true;

    // 1. ElevenLabs Speech if configured
    if (elevenLabsApiKey.value && elevenLabsApiKey.value.trim().length > 10) {
      speakViaElevenLabs(text, { onStart, onEnd });
      return cancel;
    }

    // 2. Native SpeechSynthesis fallback (100% offline & immediate)
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      try {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = speechRate.value;
        utterance.pitch = speechPitch.value;
        utterance.lang = 'pt-BR';

        const voice = availableVoices.value.find(v => v.voiceURI === selectedVoiceURI.value);
        if (voice) {
          utterance.voice = voice;
        }

        utterance.onstart = () => {
          isSpeaking.value = true;
          if (onStart) onStart();
        };

        utterance.onboundary = (event) => {
          if (typeof event.charIndex === 'number') {
            spokenCharIndex.value = event.charIndex;
          }
          if (onBoundary) onBoundary(event);
        };

        utterance.onend = () => {
          isSpeaking.value = false;
          if (onEnd) onEnd();
        };

        utterance.onerror = (err) => {
          console.warn('[SpeechSynthesis] Event error:', err);
          isSpeaking.value = false;
          if (onEnd) onEnd();
        };

        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.warn('[SpeechSynthesis] Failed:', err);
        isSpeaking.value = false;
        if (onEnd) onEnd();
      }
    } else {
      isSpeaking.value = false;
      if (onEnd) onEnd();
    }

    return cancel;
  };

  /**
   * Speak using ElevenLabs REST API
   */
  const speakViaElevenLabs = async (text, { onStart, onEnd }) => {
    try {
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${elevenLabsVoiceId.value}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': elevenLabsApiKey.value.trim()
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.8
          }
        })
      });

      if (!response.ok) {
        throw new Error(`ElevenLabs error: ${response.status}`);
      }

      const blob = await response.blob();
      const audioUrl = URL.createObjectURL(blob);
      const audio = new Audio(audioUrl);
      activeAudioElement = audio;

      audio.onplay = () => {
        isSpeaking.value = true;
        if (onStart) onStart();
      };

      audio.onended = () => {
        isSpeaking.value = false;
        URL.revokeObjectURL(audioUrl);
        activeAudioElement = null;
        if (onEnd) onEnd();
      };

      audio.onerror = () => {
        isSpeaking.value = false;
        activeAudioElement = null;
        if (onEnd) onEnd();
      };

      await audio.play();
    } catch (err) {
      console.warn('[ElevenLabs] Fallback to native speech:', err);
      // Fallback directly to native speech
      elevenLabsApiKey.value = '';
      speak(text, { onStart, onEnd });
    }
  };

  /**
   * Stop any current speech playback
   */
  const cancel = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (activeAudioElement) {
      activeAudioElement.pause();
      activeAudioElement = null;
    }
    isSpeaking.value = false;
  };

  if (getCurrentInstance()) {
    onMounted(() => {
      refreshVoices();
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = refreshVoices;
      }
    });
  }

  return {
    isSpeechEnabled,
    isSpeaking,
    currentSpokenText,
    spokenCharIndex,
    speechRate,
    speechPitch,
    availableVoices,
    selectedVoiceURI,
    elevenLabsApiKey,
    elevenLabsVoiceId,
    estimateDuration,
    speak,
    cancel,
    refreshVoices
  };
}
