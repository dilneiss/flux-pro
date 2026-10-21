<script setup>
import { computed } from 'vue';
import { parseList } from '@/utils/textParser';

const props = defineProps({
  node: {
    type: Object,
    required: true
  }
});

const items = computed(() => parseList(props.node.content));
</script>

<template>
  <div class="overflow-hidden rounded">
    <div class="bg-[#181e29] px-3 py-1.5 border-b border-slate-800 flex items-center justify-between">
      <div class="flex items-center gap-1.5">
        <span class="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
        <span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
        <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
        <span class="text-xs text-slate-200 ml-1.5 font-semibold">📁 {{ node.title }}</span>
      </div>
      <span class="text-[10px] text-slate-500 font-mono">{{ node.subtitle }}</span>
    </div>
    <div class="p-2 space-y-1 text-xs bg-[#0e1218] font-mono">
      <div
        v-for="(item, i) in items"
        :key="i"
        :class="
          item.active
            ? 'bg-blue-600/30 border border-blue-500/70 text-white font-semibold'
            : 'text-slate-400 hover:text-slate-200'
        "
        class="px-2.5 py-1 rounded flex items-center justify-between transition-colors"
      >
        <span class="truncate">{{ item.active ? '🟣 ' : '📄 ' }}{{ item.name }}</span>
        <span class="text-[10px] opacity-60">{{ node.variant === 'tree' ? 'src' : 'App' }}</span>
      </div>
    </div>
    <div class="bg-[#0a0c10] px-3 py-1 border-t border-slate-800/80 text-[10px] text-slate-500 truncate font-mono">
      Macintosh HD ▸ Applications ▸ <span class="text-cyan-300">{{ node.badge }}</span>
    </div>
  </div>
</template>
