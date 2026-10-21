<script setup>
import { computed } from 'vue';

const props = defineProps({
  node: {
    type: Object,
    required: true
  }
});

const parts = computed(() => {
  const raw = props.node.content || '';
  const [left, right] = raw.split('|');
  return {
    left: left ? left.trim() : 'Legado / Lento',
    right: right ? right.trim() : 'Nativo 60fps'
  };
});
</script>

<template>
  <div class="overflow-hidden rounded">
    <div class="bg-[#161b24] px-3 py-1.5 border-b border-slate-800 flex justify-between items-center">
      <span class="text-xs font-bold text-white font-mono">{{ node.title }}</span>
      <span class="text-[10px] text-cyan-400 font-mono">{{ node.badge }}</span>
    </div>
    <div class="grid grid-cols-2 divide-x divide-slate-800 text-xs bg-[#0c0f15]">
      <div class="p-2.5">
        <div class="text-[10px] text-amber-400 font-bold uppercase mb-1 font-mono">❌ Original</div>
        <div class="text-[11px] text-slate-400 whitespace-pre-line leading-relaxed font-mono">{{ parts.left }}</div>
      </div>
      <div class="p-2.5 bg-cyan-950/10">
        <div class="text-[10px] text-cyan-400 font-bold uppercase mb-1 font-mono">✔ Caminho Novo</div>
        <div class="text-[11px] text-slate-200 whitespace-pre-line leading-relaxed font-mono">{{ parts.right }}</div>
      </div>
    </div>
  </div>
</template>
