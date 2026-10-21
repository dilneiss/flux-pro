<script setup>
import { ref } from 'vue';

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

const voiceId = ref('21m00Tcm4TlvDq8ikWAM'); // Rachel (ElevenLabs default)
const isAutoCalculating = ref(false);
const syncStatus = ref('');

const handleAutoSync = async () => {
  isAutoCalculating.value = true;
  syncStatus.value = 'Calculando tempos de fala com ElevenLabs with-timestamps...';

  try {
    const res = await fetch('/api/tts/with-timestamps', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
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
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 font-mono select-none"
    @click.self="emit('close')"
  >
    <div class="bg-[#0f141d] border border-slate-800 rounded-xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
      <!-- Modal Header -->
      <div class="h-14 px-6 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div class="flex items-center gap-2.5">
          <span class="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_10px_#10b981]"></span>
          <div>
            <h2 class="text-sm font-bold text-white tracking-wide">
              Sincronização Vocal ElevenLabs (with-timestamps)
            </h2>
            <p class="text-[11px] text-slate-400 font-sans">
              A câmera muda de bloco sozinha no ritmo exato em que a voz pronuncia cada frase
            </p>
          </div>
        </div>
        <button
          @click="emit('close')"
          class="text-slate-400 hover:text-white text-lg px-2 py-1 rounded transition"
        >
          ✕
        </button>
      </div>

      <!-- Modal Body -->
      <div class="p-5 overflow-y-auto space-y-4 text-xs font-sans">
        <!-- Voice Configuration & Sync Trigger -->
        <div class="p-3.5 bg-slate-900/80 border border-slate-800 rounded-lg space-y-3 font-mono">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-slate-200">Voz ElevenLabs:</span>
            <input
              v-model="voiceId"
              placeholder="Voice ID (ex: 21m00Tcm4TlvDq8ikWAM)"
              class="w-64 bg-black border border-slate-700 rounded px-2.5 py-1 text-xs text-cyan-300 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <button
            @click="handleAutoSync"
            :disabled="isAutoCalculating"
            class="w-full py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold rounded text-xs transition flex items-center justify-center gap-2"
          >
            <span>⚡</span>
            {{ isAutoCalculating ? 'Calculando Alinhamento...' : 'Calcular Timestamps da Narração' }}
          </button>

          <div v-if="syncStatus" class="text-[11px] text-emerald-300 font-bold text-center">
            {{ syncStatus }}
          </div>
        </div>

        <!-- Timeline Scrubber & Simulation Player -->
        <div class="p-3.5 bg-black/60 border border-slate-800 rounded-lg space-y-2.5 font-mono">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-cyan-400">Linha do Tempo da Câmera</span>
            <span class="text-[11px] text-slate-400">
              {{ elevenLabs.currentTime.value.toFixed(1) }}s / {{ elevenLabs.duration.value.toFixed(1) }}s
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
              class="px-3 py-1 rounded bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 text-cyan-300 font-bold text-xs"
            >
              {{ elevenLabs.isPlaying.value ? '⏸ Pausar Simulação' : '▶ Reproduzir com Câmera' }}
            </button>
            <label class="flex items-center gap-2 text-[11px] text-slate-300 cursor-pointer">
              <input type="checkbox" v-model="elevenLabs.isSyncActive.value" class="accent-cyan-400" />
              <span>Sincronização de Câmera Ativa</span>
            </label>
          </div>
        </div>

        <!-- Scenes Timestamps List -->
        <div class="space-y-1.5 font-mono">
          <div class="text-[11px] text-slate-400 uppercase font-bold">
            Momento de Entrada de Cada Bloco (em segundos):
          </div>
          <div class="space-y-1 max-h-56 overflow-y-auto pr-1">
            <div
              v-for="(scene, idx) in scenes"
              :key="idx"
              class="p-2 rounded bg-slate-900 border border-slate-800 flex items-center justify-between text-xs"
            >
              <div class="flex items-center gap-2 truncate pr-2">
                <span class="text-cyan-400 font-bold">#{{ String(idx + 1).padStart(2, '0') }}</span>
                <span class="text-white truncate font-sans">{{ scene.title }}</span>
              </div>
              <div class="flex items-center gap-2 shrink-0">
                <span class="text-[10px] text-slate-500">Início:</span>
                <input
                  v-model.number="scene.startTime"
                  type="number"
                  step="0.5"
                  min="0"
                  class="w-16 bg-black border border-slate-700 rounded px-1.5 py-0.5 text-xs text-amber-300 text-center font-bold focus:outline-none focus:border-cyan-500"
                />
                <span class="text-[10px] text-slate-500">seg</span>
                <button
                  @click="emit('activate-scene', idx)"
                  class="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 rounded text-[10px] text-slate-300"
                  title="Focar Agora"
                >
                  🎯
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="h-14 px-6 border-t border-slate-800 flex items-center justify-end shrink-0">
        <button
          @click="emit('close')"
          class="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded text-xs font-mono transition"
        >
          Pronto
        </button>
      </div>
    </div>
  </div>
</template>
