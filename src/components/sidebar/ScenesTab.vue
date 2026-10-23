<script setup>
defineProps({
  scenes: {
    type: Array,
    required: true
  },
  currentSceneIndex: {
    type: Number,
    required: true
  },
  isLiveRecording: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits([
  'activate-scene',
  'capture-keyframe',
  'remove-scene',
  'toggle-live-recording',
  'speak-scene'
]);
</script>

<template>
  <div class="flex-1 overflow-y-auto p-3 flex flex-col gap-3 font-sans">
    <!-- Top actions -->
    <div class="flex items-center justify-between">
      <span class="text-xs font-bold text-slate-300 font-mono">Keyframes & Roteiro</span>
      <button
        @click="emit('capture-keyframe')"
        class="text-[11px] bg-cyan-500 text-slate-950 font-bold px-2.5 py-1 rounded hover:bg-cyan-400 transition font-mono"
      >
        + Salvar Câmera Atual
      </button>
    </div>

    <!-- Live Presenter Mode Box -->
    <div class="p-2.5 rounded border border-amber-500/40 bg-amber-950/20 text-xs space-y-2 font-mono">
      <div class="flex items-center justify-between">
        <span class="font-bold text-amber-300 flex items-center gap-1.5">
          <span>🔴</span> Live Presenter
        </span>
        <button
          @click="emit('toggle-live-recording')"
          :class="
            isLiveRecording
              ? 'bg-rose-600 text-white animate-pulse'
              : 'bg-slate-800 text-amber-300 hover:bg-slate-700'
          "
          class="px-2 py-0.5 rounded text-[11px] font-bold transition"
        >
          {{ isLiveRecording ? '⏹ Parar Gravação' : '● Gravar Cliques' }}
        </button>
      </div>
      <p class="text-[10px] text-slate-400 leading-relaxed font-sans">
        Cada bloco clicado no canvas vira automaticamente uma nova cena com zoom suave na timeline!
      </p>
    </div>

    <!-- Scenes list -->
    <div class="space-y-2 flex-1 overflow-y-auto pr-0.5">
      <div
        v-for="(scene, idx) in scenes"
        :key="idx"
        @click="emit('activate-scene', idx)"
        :class="
          currentSceneIndex === idx
            ? 'border-cyan-400 bg-cyan-950/30 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
            : 'border-slate-800 bg-slate-900/50 hover:bg-slate-900'
        "
        class="p-2.5 rounded-lg border cursor-pointer transition relative group space-y-1.5"
      >
        <div class="flex items-center justify-between text-xs font-mono">
          <span class="font-bold text-cyan-400 flex items-center gap-1.5">
            <span class="w-1.5 h-1.5 rounded-full" :class="currentSceneIndex === idx ? 'bg-cyan-400 animate-ping' : 'bg-slate-600'"></span>
            #{{ String(idx + 1).padStart(2, '0') }} {{ scene.name }}
          </span>
          <div class="flex items-center gap-1.5">
            <span class="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
              ~{{ scene.duration || 5 }}s
            </span>
            <span class="text-[10px] text-slate-500">{{ Math.round((scene.zoom || 1) * 100) }}%</span>
            <button
              v-if="scenes.length > 1"
              @click.stop="emit('remove-scene', idx)"
              class="text-slate-600 hover:text-rose-400 px-1 text-sm leading-none"
              title="Excluir Cena"
            >
              ×
            </button>
          </div>
        </div>

        <div class="text-[11px] text-white font-medium truncate">{{ scene.title }}</div>
        <div class="text-[10px] text-cyan-300/80 truncate font-mono">{{ scene.subtitle }}</div>

        <!-- Narration text preview / editor -->
        <div v-if="currentSceneIndex === idx" class="pt-1 border-t border-slate-800/80 space-y-1" @click.stop>
          <div class="flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span>🗣 Narração da Cena:</span>
            <button
              @click="emit('speak-scene', scene)"
              class="text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              title="Ouvir Narração Desta Cena"
            >
              <span>🔊</span> Testar Voz
            </button>
          </div>
          <textarea
            v-model="scene.narrationText"
            rows="2"
            class="w-full bg-[#080b10] border border-slate-700/80 rounded p-1.5 text-[11px] text-slate-200 focus:outline-none focus:border-cyan-500 font-sans leading-relaxed"
            placeholder="Texto falado durante esta cena..."
          ></textarea>
        </div>
        <div v-else-if="scene.narrationText" class="text-[10px] text-slate-400 line-clamp-1 italic font-sans">
          "{{ scene.narrationText }}"
        </div>
      </div>
    </div>
  </div>
</template>
