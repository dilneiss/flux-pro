<script setup>
defineProps({
  presentationMeta: {
    type: Object,
    required: true
  },
  cameraZoom: {
    type: Number,
    required: true
  },
  isPresenting: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits([
  'auto-layout',
  'reset-camera',
  'toggle-presenting'
]);
</script>

<template>
  <div class="h-8 bg-[#10141d] border-b border-slate-800/90 px-4 flex items-center justify-between text-xs text-slate-400 z-20 shrink-0 font-mono">
    <!-- Left: Author & Project -->
    <div class="flex items-center gap-2">
      <span class="text-cyan-400 font-bold tracking-wider">{{ presentationMeta.author || 'viktorkav' }}</span>
      <span class="text-slate-600">/</span>
      <input
        v-model="presentationMeta.project"
        class="bg-transparent text-slate-200 focus:outline-none focus:border-b focus:border-cyan-500 w-36 px-1 transition"
        title="Nome do Projeto"
      />
      <span class="text-slate-600">/</span>
      <input
        v-model="presentationMeta.slug"
        class="bg-transparent text-cyan-300 focus:outline-none focus:border-b focus:border-cyan-500 w-24 px-1 transition text-[11px]"
        title="Slug da Cena"
      />
    </div>

    <!-- Center: TMUX status and Quick actions -->
    <div class="flex items-center gap-3">
      <div class="text-slate-500 text-[11px] bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
        tmux 3.4
      </div>
      <div class="hidden md:flex items-center gap-4 text-[11px]">
        <span class="flex items-center gap-1.5">
          <span class="w-3 h-0.5 bg-amber-500 inline-block shadow-[0_0_6px_#f59e0b]"></span> ligação original
        </span>
        <span class="flex items-center gap-1.5">
          <span class="w-3 h-0.5 bg-cyan-400 inline-block shadow-[0_0_6px_#06b6d4]"></span> caminho novo
        </span>
      </div>
    </div>

    <!-- Right: Quick Controls -->
    <div class="flex items-center gap-2">
      <button
        @click="emit('auto-layout')"
        title="Organizar e remover qualquer sobreposição"
        class="px-2.5 py-1 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 rounded text-[11px] text-cyan-300 transition"
      >
        ✨ Auto-Alinhar
      </button>

      <button
        @click="emit('reset-camera')"
        title="Restaurar zoom e posição padrão"
        class="px-2 py-1 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 rounded text-[11px] text-slate-300 transition"
      >
        🔍 {{ Math.round(cameraZoom * 100) }}%
      </button>

      <button
        @click="emit('toggle-presenting')"
        :class="
          isPresenting
            ? 'bg-amber-500 text-black font-bold'
            : 'bg-cyan-500/10 hover:bg-cyan-500 hover:text-slate-950 text-cyan-300 border border-cyan-500/40'
        "
        class="px-3 py-1 rounded text-[11px] font-semibold transition"
      >
        {{ isPresenting ? '⏹ Sair Apresentação' : '🎬 Modo Gravar' }}
      </button>
    </div>
  </div>
</template>
