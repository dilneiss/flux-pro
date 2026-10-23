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
  },
  isAudioEnabled: {
    type: Boolean,
    default: true
  },
  isCrtFilterActive: {
    type: Boolean,
    default: false
  },
  isProgressiveReveal: {
    type: Boolean,
    default: false
  },
  isMicroDriftActive: {
    type: Boolean,
    default: false
  },
  isAutoProducing: {
    type: Boolean,
    default: false
  },
  isBgmActive: {
    type: Boolean,
    default: false
  },
  isGhostCursorActive: {
    type: Boolean,
    default: true
  },
  aspectRatio: {
    type: String,
    default: '16:9'
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
  'toggle-spotlight',
  'toggle-audio',
  'toggle-crt',
  'toggle-progressive-reveal',
  'toggle-micro-drift',
  'start-auto-produce',
  'toggle-bgm',
  'toggle-ghost-cursor',
  'toggle-aspect-ratio',
  'generate-thumbnail'
]);
</script>

<template>
  <div class="h-9 bg-[#10141d] border-b border-slate-800/90 px-3 flex items-center justify-between text-xs text-slate-400 z-20 shrink-0 font-mono">
    <!-- Left: Author & Project -->
    <div class="flex items-center gap-2">
      <span class="text-cyan-400 font-bold tracking-wider">{{ presentationMeta.author || 'viktorkav' }}</span>
      <span class="text-slate-600">/</span>
      <input
        v-model="presentationMeta.project"
        class="bg-transparent text-slate-200 focus:outline-none focus:border-b focus:border-cyan-500 w-28 px-1 transition"
        title="Nome do Projeto"
      />
      <span class="text-slate-600">/</span>
      <input
        v-model="presentationMeta.slug"
        class="bg-transparent text-cyan-300 focus:outline-none focus:border-b focus:border-cyan-500 w-20 px-1 transition text-[11px]"
        title="Slug da Cena"
      />
    </div>

    <!-- Center: Broadcast Toggles & Presets -->
    <div class="hidden xl:flex items-center gap-1.5 text-[11px]">
      <!-- Prominent Auto-Producer Button -->
      <button
        @click="emit('start-auto-produce')"
        :disabled="isAutoProducing"
        class="px-3 py-1 rounded bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold transition shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center gap-1.5 animate-pulse"
        title="100% Automático: Grava tela a 60fps, move câmera, narra cada cena e baixa o vídeo pronto sozinho!"
      >
        <span>⚡</span> Auto-Produzir Vídeo
      </button>

      <button
        @click="emit('toggle-audio')"
        :class="isAudioEnabled ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/40' : 'bg-slate-900 text-slate-500 border-slate-800'"
        class="px-2 py-0.5 rounded border transition flex items-center gap-1"
        :title="isAudioEnabled ? 'SFX & Narração Ativos' : 'Áudio Mudo'"
      >
        <span>{{ isAudioEnabled ? '🔊' : '🔇' }}</span>
        <span>{{ isAudioEnabled ? 'SFX/Voz' : 'Mudo' }}</span>
      </button>

      <button
        @click="emit('toggle-bgm')"
        :class="isBgmActive ? 'bg-purple-500/25 text-purple-300 border-purple-500/60 shadow-[0_0_12px_rgba(168,85,247,0.3)]' : 'bg-slate-900 text-slate-500 border-slate-800'"
        class="px-2 py-0.5 rounded border transition flex items-center gap-1 font-mono"
        title="BGM Synth-Pad Procedural com Auto-Ducking durante a fala"
      >
        <span>🎵</span>
        <span>BGM</span>
      </button>

      <button
        @click="emit('toggle-ghost-cursor')"
        :class="isGhostCursorActive ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50' : 'bg-slate-900 text-slate-500 border-slate-800'"
        class="px-2 py-0.5 rounded border transition flex items-center gap-1 font-mono"
        title="Cursor Fantasma Automatizado com miras e cliques em nós ativos"
      >
        <span>🎯</span>
        <span>Cursor</span>
      </button>
      <button
        @click="emit('toggle-progressive-reveal')"
        :class="isProgressiveReveal ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/50' : 'bg-slate-900 text-slate-500 border-slate-800'"
        class="px-2 py-0.5 rounded border transition flex items-center gap-1"
        title="Revelar Nós Progressivamente: cada card só nasce ao entrar na sua cena"
      >
        <span>✨</span> Revelar
      </button>

      <button
        @click="emit('toggle-crt')"
        :class="isCrtFilterActive ? 'bg-amber-500/20 text-amber-300 border-amber-500/50' : 'bg-slate-900 text-slate-500 border-slate-800'"
        class="px-2 py-0.5 rounded border transition flex items-center gap-1"
        title="Filtro Broadcast CRT & Vignette"
      >
        <span>📺</span> CRT
      </button>

      <button
        @click="emit('toggle-micro-drift')"
        :class="isMicroDriftActive ? 'bg-sky-500/20 text-sky-300 border-sky-500/50' : 'bg-slate-900 text-slate-500 border-slate-800'"
        class="px-2 py-0.5 rounded border transition flex items-center gap-1"
        title="Micro-Drift da Câmera (movimento orgânico contínuo)"
      >
        <span>🌊</span> Drift
      </button>

      <button
        @click="emit('open-marketplace')"
        class="px-2 py-0.5 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/40 transition flex items-center gap-1"
        title="Explorar presets prontos para nichos comerciais"
      >
        <span>📦</span> Templates SaaS
      </button>

      <button
        @click="emit('open-audio-sync')"
        class="px-2 py-0.5 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 transition flex items-center gap-1"
        title="Sincronizar câmera com ElevenLabs (with-timestamps)"
      >
        <span>🎙</span> ElevenLabs
      </button>

      <button
        @click="emit('toggle-spotlight')"
        :class="isSpotlightActive ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 font-bold' : 'bg-slate-900 text-slate-500 border-slate-800'"
        class="px-2 py-0.5 rounded border transition flex items-center gap-1"
        title="Spotlight Cinematográfico: escurece nós secundários e foca no nó ativo"
      >
        <span>💡</span> Spotlight
      </button>

      <!-- Format Selector (16:9 vs 9:16) -->
      <button
        @click="emit('toggle-aspect-ratio')"
        :class="aspectRatio === '9:16' ? 'bg-pink-500/20 text-pink-300 border-pink-500/50 font-bold' : 'bg-slate-900 text-slate-300 border-slate-700'"
        class="px-2 py-0.5 rounded border transition flex items-center gap-1"
        title="Alternar Proporção: 16:9 YouTube vs 9:16 Shorts/Reels"
      >
        <span>{{ aspectRatio === '9:16' ? '📱 9:16' : '🖥 16:9' }}</span>
      </button>

      <!-- Quick High-Res Thumbnail Generator -->
      <button
        @click="emit('generate-thumbnail')"
        class="px-2 py-0.5 rounded bg-amber-500/10 hover:bg-amber-500/25 text-amber-300 border border-amber-500/40 transition flex items-center gap-1"
        title="Gerar e Baixar Capa Thumbnail PNG 4K (1920x1080)"
      >
        <span>📸</span> Thumb
      </button>
    </div>

    <!-- Right: Screen Recorder, Layout & Zoom -->
    <div class="flex items-center gap-1.5">
      <!-- MediaRecorder Instant Browser Capture Button -->
      <button
        @click="emit('toggle-record-screen')"
        :class="
          isRecordingScreen
            ? 'bg-rose-600 text-white animate-pulse font-bold'
            : 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/40'
        "
        class="px-2.5 py-1 rounded text-[11px] font-semibold transition flex items-center gap-1.5"
        title="Gravação manual 60fps no próprio navegador (MediaRecorder API)"
      >
        <span class="w-2 h-2 rounded-full bg-rose-400"></span>
        <span>{{ isRecordingScreen ? `REC ${recordingDurationFormatted}` : 'Gravar Manual' }}</span>
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
        {{ isPresenting ? '⏹ Sair' : '🎬 Apresentação' }}
      </button>
    </div>
  </div>
</template>
