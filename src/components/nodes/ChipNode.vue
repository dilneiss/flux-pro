<script setup>
defineProps({
  node: {
    type: Object,
    required: true
  }
});
</script>

<template>
  <div
    class="p-4 border-l-4 rounded transition-colors"
    :class="
      node.variant === 'amber'
        ? 'border-amber-500'
        : node.variant === 'emerald'
        ? 'border-emerald-400'
        : 'border-cyan-400'
    "
  >
    <div class="flex items-center justify-between mb-1">
      <span class="text-[10px] uppercase tracking-widest text-slate-400 font-mono">{{ node.subtitle }}</span>
      <span class="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-cyan-300 font-mono">{{ node.badge }}</span>
    </div>
    <div
      class="text-base font-bold tracking-tight break-all font-mono"
      :class="
        node.variant === 'amber'
          ? 'text-amber-400'
          : node.variant === 'emerald'
          ? 'text-emerald-300'
          : 'text-cyan-300'
      "
    >
      {{ node.title }}
    </div>
    <div v-if="node.content" class="text-xs text-slate-400 mt-1.5 whitespace-pre-line leading-relaxed">
      {{ node.content }}
    </div>
  </div>
</template>
