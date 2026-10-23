<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  scenes: {
    type: Array,
    required: true
  },
  elevenLabs: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['close', 'activate-scene', 'update-scenes']);

const apiKey = ref('');
const voiceId = ref('21m00Tcm4TlvDq8ikWAM'); // Rachel default
const isCustomVoice = ref(false);
const isAutoCalculating = ref(false);
const syncStatus = ref('');
const uploadedAudioName = ref('');

const voiceOptions = [
  { id: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel (Calma & Narrativa Técnica)' },
  { id: 'pNInz6obpgDQGcFmaJgB', name: 'Adam (Profunda & Autoritária)' },
  { id: 'ErXwobaYiN019PkySvjV', name: 'Antoni (Dinâmica & Expressiva)' },
  { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Bella (Amigável & Envolvente)' },
  { id: 'TxGEqnHWrfWFTfGW9XjX', name: 'Josh (Moderna & Conversacional)' },
  { id: 'AZnzlk1XvdvUeBnXmlld', name: 'Domi (Energética & Direta)' },
  { id: 'custom', name: 'Outra (Digitar Voice ID customizado)' }
];

// Ensure narrationText is initialized on scenes
onMounted(() => {
  props.scenes.forEach((s) => {
    if (!s.narrationText) {
      s.narrationText = `${s.title}. ${s.subtitle || ''}`;
    }
  });
});

const onAudioFileUpload = (e) => {
  const file = e.target.files?.[0];
  if (file) {
    uploadedAudioName.value = file.name;
    const url = URL.createObjectURL(file);
    props.elevenLabs.loadAudio(url);
    syncStatus.value = `✔ Áudio "${file.name}" carregado com sucesso!`;
  }
};

const handleAutoSync = async () => {
  isAutoCalculating.value = true;
  syncStatus.value = 'Calculando tempos de fala com ElevenLabs with-timestamps...';

  // Make sure each scene has narrationText
  props.scenes.forEach((s) => {
    if (!s.narrationText) {
      s.narrationText = `${s.title}. ${s.subtitle || ''}`;
    }
  });

  try {
    const res = await fetch('/api/tts/with-timestamps', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        apiKey: apiKey.value,
        voiceId: voiceId.value,
        scenes: props.scenes
      })
    });

    if (res.ok) {
      const data = await res.json();
      data.timestamps.forEach((t) => {
        if (props.scenes[t.sceneIndex]) {
          props.scenes[t.sceneIndex].startTime = t.startTime;
        }
      });
      syncStatus.value = `✔ ${data.timestamps.length} keyframes sincronizados com precisão de milissegundos!`;
    } else {
      props.elevenLabs.autoAssignTimestampsFromScenes(props.scenes);
      syncStatus.value = '✔ Timestamps calculados com base na cadência vocal natural (135 wpm)';
    }
  } catch {
    props.elevenLabs.autoAssignTimestampsFromScenes(props.scenes);
    syncStatus.value = '✔ Timestamps estimados com cadência natural';
  } finally {
    isAutoCalculating.value = false;
    setTimeout(() => {
      syncStatus.value = '';
    }, 4000);
  }
};
</script>

<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 sm:p-6 font-sans select-none animate-in fade-in duration-200"
    @click.self="emit('close')"
  >
    <div class="bg-[#0c1017] border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[88vh] flex flex-col shadow-[0_25px_70px_rgba(0,0,0,0.85)] overflow-hidden">
      <!-- Modal Header -->
      <div class="h-16 px-6 border-b border-slate-800/90 flex items-center justify-between shrink-0 bg-[#0a0d13]">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-slate-950 font-bold text-base shadow-[0_0_15px_rgba(16,185,129,0.4)]">
            🎙
          </div>
          <div>
            <h2 class="text-sm font-bold text-white tracking-tight">
              Sincronização Vocal ElevenLabs (Voz IA + Timeline)
            </h2>
            <p class="text-xs text-slate-400 mt-0.5">
              Apresentação 100% autônoma: a câmera voa sozinha no ritmo exato em que a voz fala cada frase
            </p>
          </div>
        </div>

        <button
          @click="emit('close')"
          class="w-8 h-8 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition"
          title="Fechar (Esc)"
        >
          ✕
        </button>
      </div>

      <!-- Modal Body -->
      <div class="p-6 overflow-y-auto space-y-5 text-xs font-sans flex-1">
        <!-- Voice Configuration Card -->
        <div class="p-4 bg-[#0e131d] border border-slate-800 rounded-xl space-y-3.5 font-mono">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <span class="text-[10px] text-slate-400 uppercase font-bold block mb-1">API Key ElevenLabs:</span>
              <input
                v-model="apiKey"
                type="password"
                placeholder="xi-api-key (opcional se usar simulação)..."
                class="w-full bg-[#080b10] border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 transition"
              />
            </div>

            <div>
              <span class="text-[10px] text-slate-400 uppercase font-bold block mb-1">Voz ElevenLabs:</span>
              <select
                v-model="voiceId"
                class="w-full bg-[#080b10] border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-cyan-300 focus:outline-none focus:border-cyan-500 transition font-sans"
              >
                <option v-for="v in voiceOptions" :key="v.id" :value="v.id">
                  {{ v.name }}
                </option>
              </select>
            </div>
          </div>

          <!-- Bottom Action Bar of Config -->
          <div class="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
            <label class="cursor-pointer px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs flex items-center gap-2 transition w-full sm:w-auto justify-center">
              <span>📁</span>
              <span class="truncate max-w-[200px]">{{ uploadedAudioName || 'Upload de Gravação (.mp3 / .wav)' }}</span>
              <input type="file" accept="audio/*" class="hidden" @change="onAudioFileUpload" />
            </label>

            <button
              @click="handleAutoSync"
              :disabled="isAutoCalculating"
              class="px-5 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 disabled:opacity-50 text-slate-950 font-bold rounded-lg text-xs transition flex items-center gap-2 shadow-lg w-full sm:w-auto justify-center"
            >
              <span>⚡</span>
              <span>{{ isAutoCalculating ? 'Calculando...' : 'Gerar Áudio e Sincronizar Cenas' }}</span>
            </button>
          </div>

          <div v-if="syncStatus" class="p-2 bg-emerald-950/50 border border-emerald-500/40 rounded-lg text-xs text-emerald-300 font-mono text-center">
            {{ syncStatus }}
          </div>
        </div>

        <!-- Timeline Scrubber & Simulation Player -->
        <div class="p-4 bg-[#080b10] border border-slate-800 rounded-xl space-y-3 font-mono">
          <div class="flex items-center justify-between text-xs">
            <span class="font-bold text-cyan-400 flex items-center gap-1.5">
              <span>⏱️</span> Linha do Tempo da Câmera
            </span>
            <span class="text-xs text-slate-400">
              <b class="text-cyan-300">{{ elevenLabs.currentTime.value.toFixed(1) }}s</b> / {{ elevenLabs.duration.value.toFixed(1) }}s
            </span>
          </div>

          <input
            type="range"
            min="0"
            :max="Math.max(1, elevenLabs.duration.value)"
            step="0.1"
            :value="elevenLabs.currentTime.value"
            @input="elevenLabs.seekTo(Number($event.target.value))"
            class="w-full accent-cyan-400 cursor-pointer"
          />

          <div class="flex items-center justify-between pt-1">
            <button
              @click="elevenLabs.togglePlay"
              class="px-4 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 text-cyan-300 font-bold text-xs flex items-center gap-2 transition"
            >
              <span>{{ elevenLabs.isPlaying.value ? '⏸ Pausar Apresentação' : '▶ Iniciar Apresentação Zero-Touch' }}</span>
            </button>

            <label class="flex items-center gap-2 text-xs text-slate-300 cursor-pointer font-sans">
              <input type="checkbox" v-model="elevenLabs.isSyncActive.value" class="accent-cyan-400" />
              <span>Sincronização de Câmera Ativa</span>
            </label>
          </div>
        </div>

        <!-- Per-Keyframe Narration Text Editor -->
        <div class="space-y-2.5">
          <div class="text-xs font-bold text-slate-300 flex items-center justify-between">
            <span class="flex items-center gap-1.5">
              <span>✍️</span> Narração em Voz para Cada Keyframe:
            </span>
            <span class="text-[11px] text-slate-500 font-normal">A câmera transiciona automaticamente ao início de cada bloco</span>
          </div>

          <div class="space-y-2.5 max-h-72 overflow-y-auto pr-1">
            <div
              v-for="(scene, idx) in scenes"
              :key="idx"
              class="p-3.5 rounded-xl bg-[#0e131d] border border-slate-800 space-y-2 relative group hover:border-slate-700 transition"
            >
              <div class="flex items-center justify-between text-xs">
                <div class="flex items-center gap-2">
                  <span class="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-300 font-mono text-[10px] font-bold flex items-center justify-center">
                    {{ idx + 1 }}
                  </span>
                  <span class="font-bold text-white">{{ scene.title }}</span>
                </div>

                <div class="flex items-center gap-2 font-mono">
                  <span class="text-[10px] text-slate-400">Início:</span>
                  <input
                    v-model.number="scene.startTime"
                    type="number"
                    step="0.5"
                    min="0"
                    class="w-16 bg-black border border-slate-700 rounded px-1.5 py-0.5 text-xs text-amber-300 text-center font-bold focus:outline-none focus:border-cyan-500"
                  />
                  <span class="text-[10px] text-slate-400">seg</span>
                  <button
                    @click="emit('activate-scene', idx)"
                    class="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                    title="Focar Câmera Nesta Cena Agora"
                  >
                    🎯
                  </button>
                </div>
              </div>

              <!-- Narration textarea for this scene -->
              <textarea
                v-model="scene.narrationText"
                rows="2"
                placeholder="Digite a fala exata desta etapa para a voz da ElevenLabs..."
                class="w-full bg-[#080b10] border border-slate-700/80 rounded-lg p-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 leading-relaxed font-sans"
              ></textarea>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="h-16 px-6 border-t border-slate-800/90 flex items-center justify-between shrink-0 bg-[#0a0d14]">
        <span class="text-xs text-slate-400">
          {{ scenes.length }} cenas configuradas • Câmera sincronizada em 60 FPS
        </span>

        <button
          @click="emit('close')"
          class="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg text-xs font-sans transition shadow-lg cursor-pointer"
        >
          Pronto
        </button>
      </div>
    </div>
  </div>
</template>
