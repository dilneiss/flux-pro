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
    <div class="bg-[#161c26] px-3 py-2 border-b border-slate-800 flex items-center justify-between text-xs">
      <div v-if="node.variant !== 'bash'" class="flex items-center gap-1.5">
        <span class="text-slate-400 text-[11px]">agente</span>
        <span class="bg-slate-800 text-slate-200 px-1.5 py-0.5 rounded text-[10px]">⚙ Codex</span>
        <span class="bg-amber-950 text-amber-300 border border-amber-700/50 px-1.5 py-0.5 rounded text-[10px]">✴ Claude Code</span>
      </div>
      <div v-else class="flex items-center gap-1.5 text-emerald-400 font-bold text-[11px]">
        <span>$_ zsh</span>
        <span class="text-slate-500 font-normal">▸ {{ node.title }}</span>
      </div>
      <span class="text-[10px] text-emerald-400 font-mono">● {{ node.badge }}</span>
    </div>
    <div class="p-3.5 bg-[#0b0e13] text-xs leading-relaxed space-y-2.5 font-mono">
      <div class="text-slate-200 whitespace-pre-line typewriter-line">{{ node.content }}</div>
      <div
        v-if="node.subtitle"
        class="inline-block bg-cyan-950/90 border border-cyan-500/60 text-cyan-300 px-2 py-0.5 rounded text-[11px] break-all"
      >
        {{ node.subtitle }}<span class="cursor-blink ml-0.5">|</span>
      </div>
    </div>
  </div>
</template>
