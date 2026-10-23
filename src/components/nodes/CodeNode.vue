<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  node: {
    type: Object,
    required: true
  },
  isFocused: {
    type: Boolean,
    default: false
  }
});

const lines = computed(() => {
  return (props.node.content || '').split('\n');
});

const activeLineIdx = ref(0);
let lineTimer = null;

const startLineCycle = () => {
  if (lineTimer) clearInterval(lineTimer);
  activeLineIdx.value = 0;
  if (lines.value.length <= 1) return;

  lineTimer = setInterval(() => {
    activeLineIdx.value = (activeLineIdx.value + 1) % lines.value.length;
  }, 1150);
};

watch(() => props.isFocused, (focused) => {
  if (focused) {
    startLineCycle();
  } else {
    if (lineTimer) clearInterval(lineTimer);
    activeLineIdx.value = -1;
  }
});

onMounted(() => {
  if (props.isFocused) startLineCycle();
});

onUnmounted(() => {
  if (lineTimer) clearInterval(lineTimer);
});
</script>

<template>
  <div class="overflow-hidden rounded">
    <div class="bg-[#161c26] px-3 py-1.5 border-b border-slate-800 flex items-center justify-between">
      <span class="text-xs font-bold text-slate-200 font-mono">{{ node.title }}</span>
      <span class="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono">
        {{ node.badge }}
      </span>
    </div>
    <div
      class="p-3 bg-[#090c10] text-[11px] leading-relaxed overflow-x-auto font-mono space-y-0.5"
      :class="
        node.variant === 'diff'
          ? 'text-emerald-300'
          : node.variant === 'asm'
          ? 'text-amber-300'
          : 'text-cyan-300'
      "
    >
      <div
        v-for="(line, idx) in lines"
        :key="idx"
        :class="[
          'px-1.5 py-0.5 rounded transition-all duration-300 flex items-center gap-2',
          isFocused && activeLineIdx === idx
            ? 'bg-cyan-500/25 border-l-2 border-cyan-400 pl-2 text-white font-bold shadow-[inset_0_0_12px_rgba(6,182,212,0.15)]'
            : 'hover:bg-slate-800/40'
        ]"
      >
        <span class="text-[9px] text-slate-600 select-none w-4 text-right shrink-0">{{ idx + 1 }}</span>
        <span class="whitespace-pre">{{ line || ' ' }}</span>
      </div>
    </div>
  </div>
</template>
