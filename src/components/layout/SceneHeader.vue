<script setup>
defineProps({
  currentScene: {
    type: Object,
    required: true
  },
  currentSceneIndex: {
    type: Number,
    required: true
  },
  slug: {
    type: String,
    default: 'rea'
  }
});
</script>

<template>
  <div class="px-8 pt-4 pb-3 border-b border-slate-800/40 bg-[#090b0e]/85 backdrop-blur-md z-10 flex justify-between items-end pointer-events-none shrink-0">
    <div>
      <div class="text-xs text-cyan-400 mb-0.5 font-mono">~/{{ slug }}</div>
      <div class="text-[11px] text-slate-500 mb-1 font-mono">
        {{ String(currentSceneIndex + 1).padStart(2, '0') }} / {{ currentScene.name }}
      </div>
      <h1 class="text-2xl font-bold text-white tracking-tight leading-tight">
        {{ currentScene.title }}
      </h1>
      <h2 class="text-lg font-bold text-cyan-400 tracking-tight leading-tight">
        {{ currentScene.subtitle }}
      </h2>
    </div>

    <div class="hidden lg:flex flex-col items-end text-right text-xs text-slate-500 font-mono">
      <span class="text-cyan-400/80">CIRCUITFLOW VISUAL PRESENTER</span>
      <span>camera: x={{ currentScene.x }}, y={{ currentScene.y }} ({{ Math.round((currentScene.zoom || 1) * 100) }}%)</span>
    </div>
  </div>
</template>
