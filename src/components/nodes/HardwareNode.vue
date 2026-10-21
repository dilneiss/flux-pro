<script setup>
import { computed } from 'vue';
import { parseList } from '@/utils/textParser';

const props = defineProps({
  node: {
    type: Object,
    required: true
  }
});

const buttons = computed(() => parseList(props.node.content));
</script>

<template>
  <div class="p-3.5 rounded bg-[#10141d] border border-slate-700">
    <div class="flex items-center justify-between mb-2">
      <span class="text-xs font-bold text-cyan-300 font-mono">🎛 {{ node.title }}</span>
      <span class="text-[10px] text-slate-400 font-mono">{{ node.badge }}</span>
    </div>
    <div class="grid grid-cols-4 gap-1.5 bg-[#080a0f] p-2 rounded border border-slate-800">
      <div
        v-for="(btn, i) in buttons"
        :key="i"
        :class="
          btn.active
            ? 'bg-cyan-500/30 border-cyan-400 text-white shadow-[0_0_8px_rgba(6,182,212,0.3)]'
            : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200'
        "
        class="aspect-square rounded border flex items-center justify-center text-[10px] font-bold text-center p-1 font-mono transition-colors"
      >
        {{ btn.name }}
      </div>
    </div>
  </div>
</template>
