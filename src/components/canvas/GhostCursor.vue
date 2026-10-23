<template>
  <div
    v-if="active && targetNode"
    :style="{
      left: `${cursorX}px`,
      top: `${cursorY}px`
    }"
    class="absolute z-40 pointer-events-none transition-all duration-700 ease-out"
  >
    <!-- Crosshair reticle -->
    <div class="relative flex items-center justify-center">
      <!-- Expanding click ping ring -->
      <div
        :key="pingKey"
        class="w-10 h-10 rounded-full border-2 border-cyan-400 absolute animate-ping opacity-75"
      ></div>

      <!-- Core Reticle Circle -->
      <div class="w-6 h-6 rounded-full border-2 border-cyan-400/90 bg-cyan-950/60 shadow-[0_0_15px_#06b6d4] flex items-center justify-center">
        <span class="w-1.5 h-1.5 rounded-full bg-cyan-300"></span>
      </div>

      <!-- Corner Marks -->
      <div class="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-cyan-400"></div>
      <div class="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 border-cyan-400"></div>
      <div class="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 border-cyan-400"></div>
      <div class="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-cyan-400"></div>

      <!-- Badge Label -->
      <div class="absolute top-6 left-3 px-1.5 py-0.5 rounded bg-black/90 border border-cyan-500/80 text-[9px] font-mono font-bold text-cyan-300 shadow-lg whitespace-nowrap flex items-center gap-1">
        <span class="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
        <span>agent-cursor</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';

const props = defineProps({
  active: {
    type: Boolean,
    default: false
  },
  targetNode: {
    type: Object,
    default: null
  }
});

const pingKey = ref(0);

const cursorX = computed(() => {
  if (!props.targetNode) return 0;
  const w = props.targetNode.w || 384;
  return props.targetNode.x + w / 2;
});

const cursorY = computed(() => {
  if (!props.targetNode) return 0;
  return props.targetNode.y + 60;
});

watch(() => props.targetNode?.id, () => {
  pingKey.value++;
});
</script>
