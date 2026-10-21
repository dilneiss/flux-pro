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
    <div class="bg-[#181f2a] px-3 py-1.5 border-b border-slate-800 flex items-center gap-2">
      <div class="flex gap-1">
        <span class="w-2 h-2 rounded-full bg-rose-500"></span>
        <span class="w-2 h-2 rounded-full bg-amber-500"></span>
        <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
      </div>
      <div class="flex-1 bg-[#0c1017] border border-slate-700/80 rounded px-2 py-0.5 text-[10px] text-cyan-300 truncate font-mono">
        🔒 {{ node.subtitle || 'https://circuitflow.io' }}
      </div>
    </div>
    <div v-if="node.mediaUrl" class="aspect-video bg-black overflow-hidden">
      <img :src="node.mediaUrl" alt="Screenshot" class="w-full h-full object-cover" />
    </div>
    <div class="p-3 bg-[#0e131b]">
      <div class="text-xs font-bold text-white">{{ node.title }}</div>
      <div class="text-[11px] text-slate-400 mt-1 whitespace-pre-line leading-relaxed">{{ node.content }}</div>
    </div>
  </div>
</template>
