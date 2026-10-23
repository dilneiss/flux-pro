<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { soundFX } from '@/utils/soundFX';

const props = defineProps({
  node: {
    type: Object,
    required: true
  },
  isFocused: {
    type: Boolean,
    default: false
  }
});

const displayedContent = ref(props.node.content || '');
let typewriterTimer = null;

const runTypewriter = () => {
  if (typewriterTimer) clearInterval(typewriterTimer);

  const fullText = props.node.content || '';
  if (!fullText) return;

  displayedContent.value = '';
  let charIdx = 0;
  const speed = Math.max(15, Math.min(45, Math.floor(2500 / fullText.length)));

  typewriterTimer = setInterval(() => {
    charIdx++;
    displayedContent.value = fullText.slice(0, charIdx);

    // Click tick every 3 characters
    if (charIdx % 3 === 0) {
      soundFX.playKeyTick();
    }

    if (charIdx >= fullText.length) {
      clearInterval(typewriterTimer);
      typewriterTimer = null;
    }
  }, speed);
};

watch(() => props.isFocused, (focused) => {
  if (focused) {
    runTypewriter();
  } else {
    displayedContent.value = props.node.content || '';
  }
});

onMounted(() => {
  if (props.isFocused) {
    runTypewriter();
  }
});

onUnmounted(() => {
  if (typewriterTimer) clearInterval(typewriterTimer);
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
      <div class="text-slate-200 whitespace-pre-line">{{ displayedContent }}<span v-if="isFocused" class="cursor-blink ml-0.5">▋</span></div>
      <div
        v-if="node.subtitle"
        class="inline-block bg-cyan-950/90 border border-cyan-500/60 text-cyan-300 px-2 py-0.5 rounded text-[11px] break-all"
      >
        {{ node.subtitle }}<span class="cursor-blink ml-0.5">|</span>
      </div>
    </div>
  </div>
</template>
