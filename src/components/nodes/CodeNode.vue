<script setup>
defineProps({
  node: {
    type: Object,
    required: true
  }
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
    <pre
      class="p-3 bg-[#090c10] text-[11px] leading-relaxed overflow-x-auto font-mono typewriter-line"
      :class="
        node.variant === 'diff'
          ? 'text-emerald-300'
          : node.variant === 'asm'
          ? 'text-amber-300'
          : 'text-cyan-300'
      "
    ><code>{{ node.content }}</code></pre>
  </div>
</template>
