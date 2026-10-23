<script setup>
import { ref, computed, watch, onMounted } from 'vue';

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

const targetNumber = computed(() => {
  const match = (props.node.title || '').match(/[\d.]+/);
  return match ? parseFloat(match[0]) : null;
});

const suffix = computed(() => {
  if (!targetNumber.value) return '';
  return (props.node.title || '').replace(/[\d.]+/, '');
});

const animatedValue = ref(props.node.title || '');

const runCountUp = () => {
  const target = targetNumber.value;
  if (target === null) {
    animatedValue.value = props.node.title || '';
    return;
  }

  const duration = 1400; // 1.4s
  const start = performance.now();
  const isFloat = String(target).includes('.');

  const tick = (now) => {
    const progress = Math.min(1, (now - start) / duration);
    // EaseOutCubic
    const ease = 1 - Math.pow(1 - progress, 3);
    const current = target * ease;

    animatedValue.value = `${isFloat ? current.toFixed(1) : Math.round(current)}${suffix.value}`;

    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      animatedValue.value = props.node.title;
    }
  };

  requestAnimationFrame(tick);
};

watch(() => props.isFocused, (focused) => {
  if (focused) runCountUp();
  else animatedValue.value = props.node.title || '';
});

onMounted(() => {
  if (props.isFocused) runCountUp();
});
</script>

<template>
  <div class="p-4 rounded bg-gradient-to-br from-[#111823] to-[#0b0e14]">
    <div class="flex items-center justify-between text-[10px] text-slate-400 uppercase font-mono">
      <span>{{ node.subtitle }}</span>
      <span class="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">{{ node.badge }}</span>
    </div>
    <div class="text-3xl font-bold text-white my-1 tracking-tight font-mono">
      {{ isFocused && targetNumber !== null ? animatedValue : node.title }}
    </div>
    <div class="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
      <div class="bg-cyan-400 h-full w-4/5 shadow-[0_0_10px_#06b6d4]"></div>
    </div>
    <div class="text-[11px] text-slate-400 mt-2 font-mono">{{ node.content }}</div>
  </div>
</template>
