<script setup>
defineProps({
  node: {
    type: Object,
    required: true
  }
});
</script>

<template>
  <div class="p-3.5 rounded bg-[#14121d] border-l-4 border-purple-500">
    <div class="flex items-center justify-between">
      <span class="text-[10px] uppercase text-purple-300 font-bold font-mono">◇ {{ node.subtitle }}</span>
      <span class="text-[10px] bg-purple-950 text-purple-300 px-1.5 py-0.5 rounded font-mono">{{ node.badge }}</span>
    </div>
    <div class="text-sm font-bold text-white mt-1">{{ node.title }}</div>
    <div class="text-[11px] text-slate-400 mt-1 whitespace-pre-line leading-relaxed">{{ node.content }}</div>
  </div>
</template>
