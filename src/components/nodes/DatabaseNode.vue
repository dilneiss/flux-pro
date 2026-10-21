<script setup>
import { computed } from 'vue';
import { parseList } from '@/utils/textParser';

const props = defineProps({
  node: {
    type: Object,
    required: true
  }
});

const rows = computed(() => parseList(props.node.content));
</script>

<template>
  <div class="overflow-hidden rounded">
    <div class="bg-indigo-950/60 px-3 py-1.5 border-b border-indigo-800/60 flex items-center justify-between">
      <span class="text-xs font-bold text-indigo-300 font-mono">🗄 {{ node.title }}</span>
      <span class="text-[10px] px-1.5 py-0.5 rounded bg-indigo-900/60 text-indigo-200 font-mono">{{ node.badge }}</span>
    </div>
    <div class="p-2.5 bg-[#0c0f17] space-y-1 text-[11px] font-mono">
      <div
        v-for="(row, i) in rows"
        :key="i"
        class="flex items-center justify-between py-1 px-2 rounded bg-slate-900/70 border border-slate-800/50"
      >
        <span :class="row.active ? 'text-amber-300 font-bold' : 'text-slate-300'">
          {{ row.active ? '🔑 ' : '▫ ' }}{{ row.name.split(':')[0] }}
        </span>
        <span class="text-[10px] text-indigo-400">
          {{ row.name.split(':')[1] || 'UUID' }}
        </span>
      </div>
    </div>
  </div>
</template>
