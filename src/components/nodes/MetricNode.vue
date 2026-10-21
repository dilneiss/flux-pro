<script setup>
defineProps({
  node: {
    type: Object,
    required: true
  }
});
</script>

<template>
  <div class="p-4 rounded bg-gradient-to-br from-[#111823] to-[#0b0e14]">
    <div class="flex items-center justify-between text-[10px] text-slate-400 uppercase font-mono">
      <span>{{ node.subtitle }}</span>
      <span class="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">{{ node.badge }}</span>
    </div>
    <div class="text-3xl font-bold text-white my-1 tracking-tight font-mono">{{ node.title }}</div>
    <div class="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
      <div class="bg-cyan-400 h-full w-4/5 shadow-[0_0_10px_#06b6d4]"></div>
    </div>
    <div class="text-[11px] text-slate-400 mt-2 font-mono">{{ node.content }}</div>
  </div>
</template>
