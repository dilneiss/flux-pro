<script setup>
defineProps({
  presentationMeta: {
    type: Object,
    required: true
  },
  cameraZoom: {
    type: Number,
    required: true
  },
  isPresenting: {
    type: Boolean,
    default: false
  },
  isRecordingScreen: {
    type: Boolean,
    default: false
  },
  recordingDurationFormatted: {
    type: String,
    default: '00:00'
  },
  canvasTheme: {
    type: String,
    default: 'theme-pcb'
  },
  isSpotlightActive: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits([
  'auto-layout',
  'reset-camera',
  'toggle-presenting',
  'toggle-record-screen',
  'open-marketplace',
  'open-audio-sync',
  'toggle-chroma',
  'toggle-spotlight'
]);
</script>

<template>
  <div class="h-8 bg-[#10141d] border-b border-slate-800/90 px-3 flex items-center justify-between text-xs text-slate-400 z-20 shrink-0 font-mono">
    <!-- Left: Author & Project -->
    <div class="flex items-center gap-2">
      <span class="text-cyan-400 font-bold tracking-wider">{{ presentationMeta.author || 'viktorkav' }}</span>
      <span class="text-slate-600">/</span>
      <input
        v-model="presentationMeta.project"
        class="bg-transparent text-slate-200 focus:outline-none focus:border-b focus:border-cyan-500 w-32 px-1 transition"
        title="Nome do Projeto"
      />
      <span class="text-slate-600">/</span>
      <input
        v-model="presentationMeta.slug"
        class="bg-transparent text-cyan-300 focus:outline-none focus:border-b focus:border-cyan-500 w-20 px-1 transition text-[11px]"
        title="Slug da Cena"
      />
    </div>

    <!-- Center: Quick Tool Buttons -->
    <div class="hidden lg:flex items-center gap-2 text-[11px]">
      <button
        @click="emit('open-marketplace')"
        class="px-2 py-0.5 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/40 transition flex items-center gap-1"
        title="Explorar presets prontos para nichos comerciais"
      >
        <span>💎</span> Templates SaaS
      </button>

      <button
        @click="emit('open-audio-sync')"
        class="px-2 py-0.5 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 transition flex items-center gap-1"
        title="Sincronizar câmera com ElevenLabs (with-timestamps)"
      >
        <span>🎙</span> ElevenLabs Sync
      </button>

      <button
        @click="emit('toggle-chroma')"
        :class="canvasTheme === 'theme-pip-alpha' ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-300 border border-slate-700'"
        class="px-2 py-0.5 rounded transition flex items-center gap-1"
        title="Modo Chroma/Alpha para OBS e PiP"
      >
        <span>🟢</span> Chroma/PiP
      </button>
      <button
        @click="emit('toggle-spotlight')"
        :class="
          isSpotlightActive
            ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-[0_0_10px_rgba(245,158,11,0.25)] font-bold'
            : 'bg-slate-900 text-slate-500 border-slate-800 hover:text-slate-300'
        "
        class="px-2 py-0.5 rounded border text-[11px] transition flex items-center gap-1 font-mono"
        title="Spotlight Cinematográfico: escurece nós secundários e foca no nó ativo"
      >
        <span>💡</span> Spotlight
      </button>
    </div>

    <!-- Right: Screen Recorder, Layout & Zoom -->
    <div class="flex items-center gap-2">
      <!-- MediaRecorder Instant Browser Capture Button -->
      <button
        @click="emit('toggle-record-screen')"
        :class="
          isRecordingScreen
            ? 'bg-rose-600 text-white animate-pulse font-bold'
            : 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/40'
        "
        class="px-2.5 py-1 rounded text-[11px] font-semibold transition flex items-center gap-1.5"
        title="Gravação instantânea 60fps no próprio navegador (MediaRecorder API)"
      >
        <span class="w-2 h-2 rounded-full bg-rose-400"></span>
        <span>{{ isRecordingScreen ? `REC ${recordingDurationFormatted}` : 'Gravar Tela' }}</span>
      </button>

      <button
        @click="emit('auto-layout')"
        title="Solver Anti-Colisão: organizar e remover qualquer sobreposição"
        class="px-2 py-1 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 rounded text-[11px] text-cyan-300 transition"
      >
        ✨ Alinhar
      </button>

      <button
        @click="emit('reset-camera')"
        title="Restaurar zoom e posição padrão"
        class="px-2 py-1 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 rounded text-[11px] text-slate-300 transition"
      >
        🔍 {{ Math.round(cameraZoom * 100) }}%
      </button>

      <button
        @click="emit('toggle-presenting')"
        :class="
          isPresenting
            ? 'bg-amber-500 text-black font-bold'
            : 'bg-cyan-500/10 hover:bg-cyan-500 hover:text-slate-950 text-cyan-300 border border-cyan-500/40'
        "
        class="px-2.5 py-1 rounded text-[11px] font-semibold transition"
      >
        {{ isPresenting ? '⏹ Sair' : '🎬 Modo Gravar' }}
      </button>
    </div>
  </div>
</template>
