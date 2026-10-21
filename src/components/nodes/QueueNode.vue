<script setup>
defineProps({
  node: {
    type: Object,
    required: true
  }
});
</script>

<template>
  <div class="p-3.5 rounded bg-[#12161f]">
    <div class="flex items-center justify-between mb-2">
      <span class="text-xs font-bold text-amber-400 font-mono">⚡ {{ node.title }}</span>
      <span class="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-mono">{{ node.badge }}</span>
    </div>
    <div class="grid grid-cols-4 gap-1.5 my-2">
      <div
        v-for="n in 4"
        :key="n"
        class="h-6 rounded bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-[10px] text-amber-300 font-bold font-mono"
      >
        JOB #{{ n }}
      </div>
    </div>
    <div class="text-[11px] text-slate-400 font-mono mt-1 leading-relaxed">{{ node.content }}</div>
  </div>
</template>
