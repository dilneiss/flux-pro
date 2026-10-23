<template>
  <div
    v-if="active"
    class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/75 backdrop-blur-md pointer-events-auto"
  >
    <div class="relative flex items-center justify-center">
      <!-- Glow ring -->
      <div class="w-48 h-48 rounded-full border-2 border-cyan-400/40 animate-ping absolute"></div>
      <div class="w-40 h-40 rounded-full border-2 border-cyan-500/80 bg-cyan-950/40 shadow-[0_0_50px_rgba(6,182,212,0.4)] flex items-center justify-center">
        <span class="text-7xl font-black text-white font-mono tracking-tighter drop-shadow-[0_0_20px_#06b6d4]">
          {{ number }}
        </span>
      </div>
    </div>

    <div class="mt-8 text-center space-y-2">
      <div class="text-xs uppercase font-bold text-cyan-400 tracking-widest font-mono">
        PREPARANDO MÁQUINA DE VÍDEO BROADCAST
      </div>
      <div class="text-sm text-slate-300">
        Iniciando gravação autônoma a 60 FPS com narração e sincronia de cenas...
      </div>
      <button
        @click="$emit('cancel')"
        class="mt-4 px-4 py-1.5 rounded-lg bg-rose-950/80 hover:bg-rose-900 border border-rose-700 text-rose-300 text-xs font-bold transition font-mono"
      >
        Cancelar (Esc)
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  active: {
    type: Boolean,
    default: false
  },
  number: {
    type: Number,
    default: 3
  }
});

defineEmits(['cancel']);
</script>
