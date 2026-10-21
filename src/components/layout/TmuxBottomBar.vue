<script setup>
defineProps({
  slug: {
    type: String,
    default: 'rea'
  },
  currentSceneIndex: {
    type: Number,
    required: true
  },
  totalScenes: {
    type: Number,
    required: true
  },
  nodeCount: {
    type: Number,
    required: true
  },
  edgeCount: {
    type: Number,
    required: true
  }
});

const emit = defineEmits(['prev-scene', 'next-scene']);
</script>

<template>
  <div class="h-8 bg-[#10141d] border-t border-slate-800/90 px-4 flex items-center justify-between text-xs z-20 shrink-0 font-mono">
    <!-- Left: Status tab -->
    <div class="flex items-center gap-3">
      <span class="bg-cyan-400 text-slate-950 font-bold px-1.5 py-0.5 rounded-sm text-[11px]">[rep]</span>
      <span class="text-slate-300 font-semibold">0: {{ slug }}*</span>
      <span class="text-slate-600">|</span>
      <span class="text-emerald-400 text-[11px]">● 60 FPS Engine</span>
    </div>

    <!-- Center: Keyframe Navigation -->
    <div class="flex items-center gap-2">
      <button
        @click="emit('prev-scene')"
        title="Keyframe Anterior (Seta Esquerda)"
        class="px-2.5 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px] transition"
      >
        ◀ Anterior
      </button>

      <span class="text-slate-400 text-[11px] px-2 font-mono">
        Keyframe <span class="text-cyan-400 font-bold">{{ currentSceneIndex + 1 }}</span> / {{ totalScenes }}
      </span>

      <button
        @click="emit('next-scene')"
        title="Próximo Keyframe (Seta Direita)"
        class="px-2.5 py-0.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded text-[11px] transition"
      >
        Próximo ▶
      </button>
    </div>

    <!-- Right: Stats -->
    <div class="flex items-center gap-3 text-slate-500 text-[11px]">
      <span>{{ nodeCount }} nós</span>
      <span>•</span>
      <span>{{ edgeCount }} conexões</span>
    </div>
  </div>
</template>
