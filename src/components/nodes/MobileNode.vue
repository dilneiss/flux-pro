<script setup>
import { computed } from 'vue';
import { parseList } from '@/utils/textParser';

const props = defineProps({
  node: {
    type: Object,
    required: true
  }
});

const messages = computed(() => parseList(props.node.content));
</script>

<template>
  <div class="overflow-hidden rounded-2xl border-2 border-slate-700 bg-[#0b0e14]">
    <div class="bg-[#121822] px-4 py-2 border-b border-slate-800 flex items-center justify-between">
      <span class="text-xs font-bold text-emerald-400 font-mono">📱 {{ node.title }}</span>
      <span class="w-12 h-2.5 bg-black rounded-full"></span>
      <span class="text-[10px] text-slate-400 font-mono">{{ node.badge }}</span>
    </div>
    <div class="p-3 space-y-2 text-xs font-sans">
      <div
        v-for="(msg, i) in messages"
        :key="i"
        :class="
          msg.active
            ? 'ml-6 bg-emerald-900/50 border border-emerald-700/60 text-emerald-100'
            : 'mr-6 bg-slate-800 text-slate-200'
        "
        class="p-2.5 rounded-lg text-[11px] leading-relaxed shadow"
      >
        {{ msg.name }}
      </div>
    </div>
  </div>
</template>
