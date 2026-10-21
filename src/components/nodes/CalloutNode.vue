<script setup>
defineProps({
  node: {
    type: Object,
    required: true
  }
});
</script>

<template>
  <div class="p-3.5 rounded bg-amber-950/20 border border-amber-500/50">
    <div class="flex items-center justify-between mb-1">
      <span class="text-xs font-bold text-amber-300 font-mono">⚠ {{ node.title }}</span>
      <span class="text-[10px] text-amber-400 font-mono">{{ node.badge }}</span>
    </div>
    <div class="text-xs text-slate-200 leading-relaxed whitespace-pre-line font-sans">{{ node.content }}</div>
  </div>
</template>
