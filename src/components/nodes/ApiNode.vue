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
    <div class="bg-[#141b24] px-3 py-2 border-b border-slate-800 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <span
          class="px-1.5 py-0.5 rounded text-[10px] font-bold font-mono uppercase"
          :class="
            node.variant === 'get'
              ? 'bg-emerald-500 text-slate-950'
              : node.variant === 'ws'
              ? 'bg-purple-500 text-white'
              : 'bg-amber-500 text-slate-950'
          "
        >
          {{ node.variant ? node.variant.toUpperCase() : 'POST' }}
        </span>
        <span class="text-xs font-bold text-white truncate font-mono">{{ node.title }}</span>
      </div>
      <span class="text-[10px] text-emerald-400 font-mono">{{ node.badge }}</span>
    </div>
    <pre class="p-3 bg-[#0a0d12] text-[11px] text-amber-200 overflow-x-auto font-mono"><code>{{ node.content }}</code></pre>
  </div>
</template>
