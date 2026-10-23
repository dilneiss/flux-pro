<template>
  <transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="opacity-0 translate-y-3"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 translate-y-3"
  >
    <div
      v-if="caption && caption.trim()"
      :class="[
        'fixed z-50 pointer-events-none backdrop-blur-md border rounded-xl shadow-[0_12px_36px_rgba(0,0,0,0.85),0_0_25px_rgba(6,182,212,0.2)] flex items-center gap-3.5',
        isVerticalFormat
          ? 'bottom-24 left-1/2 -translate-x-1/2 w-[88%] max-w-sm px-4 py-3 bg-[#0a0d14]/95 border-cyan-400/50 flex-col text-center'
          : 'bottom-12 left-1/2 -translate-x-1/2 max-w-4xl w-[92%] px-6 py-2.5 bg-[#0a0d14]/90 border-cyan-500/30'
      ]"
    >
      <!-- Top header bar in subtitle -->
      <div class="flex items-center gap-2 shrink-0">
        <!-- Audio Waveform pulse -->
        <div class="flex items-center gap-1">
          <span class="w-1 h-3 bg-cyan-400 rounded-full animate-pulse"></span>
          <span class="w-1 h-5 bg-cyan-300 rounded-full animate-pulse [animation-delay:150ms]"></span>
          <span class="w-1 h-2.5 bg-cyan-500 rounded-full animate-pulse [animation-delay:300ms]"></span>
        </div>

        <!-- Speaker Badge -->
        <span class="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-800/80 text-cyan-300 font-mono">
          VOZ IA
        </span>
      </div>

      <!-- Karaoke Word-by-Word Highlight Text -->
      <p
        :class="[
          'leading-relaxed drop-shadow font-sans tracking-wide',
          isVerticalFormat ? 'text-base font-bold' : 'text-sm md:text-base font-medium'
        ]"
      >
        <span
          v-for="(word, idx) in words"
          :key="idx"
          :class="[
            'inline-block transition-all duration-150 mx-0.5',
            idx === currentWordIndex
              ? 'bg-cyan-400 text-slate-950 font-black px-1.5 py-0.5 rounded shadow-[0_0_14px_#06b6d4] scale-105'
              : idx < currentWordIndex
              ? 'text-white'
              : 'text-slate-400/80'
          ]"
        >
          {{ word }}
        </span>
      </p>
    </div>
  </transition>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  caption: {
    type: String,
    default: ''
  },
  currentWordIndex: {
    type: Number,
    default: 0
  },
  isVerticalFormat: {
    type: Boolean,
    default: false
  }
});

const words = computed(() => {
  if (!props.caption) return [];
  return props.caption.trim().split(/\s+/).filter(Boolean);
});
</script>
