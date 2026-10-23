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
      class="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 pointer-events-none max-w-4xl w-[92%] px-6 py-2.5 bg-[#0a0d14]/90 backdrop-blur-md border border-cyan-500/30 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.8),0_0_20px_rgba(6,182,212,0.15)] flex items-center gap-3.5"
    >
      <!-- Audio Waveform pulse -->
      <div class="flex items-center gap-1 shrink-0">
        <span class="w-1 h-3 bg-cyan-400 rounded-full animate-pulse"></span>
        <span class="w-1 h-5 bg-cyan-300 rounded-full animate-pulse [animation-delay:150ms]"></span>
        <span class="w-1 h-2.5 bg-cyan-500 rounded-full animate-pulse [animation-delay:300ms]"></span>
      </div>

      <!-- Speaker Badge -->
      <span class="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-800/80 text-cyan-300 shrink-0 font-mono">
        NARRAÇÃO
      </span>

      <!-- Subtitle Text -->
      <p class="text-sm md:text-base font-medium text-slate-100 tracking-wide leading-snug drop-shadow font-sans">
        {{ caption }}
      </p>
    </div>
  </transition>
</template>

<script setup>
defineProps({
  caption: {
    type: String,
    default: ''
  }
});
</script>
