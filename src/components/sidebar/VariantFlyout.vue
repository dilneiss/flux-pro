<script setup>
import NodeMiniPreview from './NodeMiniPreview.vue';

const props = defineProps({
  model: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['close', 'insert-center', 'drag-start']);

const onDragStart = (e, type, variantId) => {
  e.dataTransfer.setData(
    'application/json',
    JSON.stringify({ type, variant: variantId })
  );
  e.dataTransfer.effectAllowed = 'copy';
  emit('drag-start', { type, variant: variantId });
};
</script>

<template>
  <div
    v-if="model"
    class="absolute left-80 top-0 bottom-0 w-80 bg-[#0d1118]/98 border-r border-slate-800 shadow-[25px_0_50px_rgba(0,0,0,0.7)] backdrop-blur-md z-40 flex flex-col font-mono select-none animate-in fade-in slide-in-from-left-4 duration-200"
  >
    <!-- Header -->
    <div class="h-12 px-4 border-b border-slate-800/90 flex items-center justify-between shrink-0 bg-[#0a0d13]">
      <div class="flex items-center gap-2 truncate pr-2">
        <span class="w-6 h-6 rounded bg-slate-800 flex items-center justify-center text-xs font-bold shrink-0" :class="model.color">
          {{ model.icon }}
        </span>
        <div class="truncate">
          <div class="text-xs font-bold text-white truncate">{{ model.name }}</div>
          <div class="text-[10px] text-slate-400 font-sans truncate">{{ model.desc }}</div>
        </div>
      </div>
      <button
        @click="emit('close')"
        class="text-slate-400 hover:text-white px-1.5 py-0.5 rounded text-sm transition"
        title="Fechar Painel de Variações"
      >
        ✕
      </button>
    </div>

    <!-- Instructions Tip -->
    <div class="p-2.5 bg-cyan-950/20 border-b border-cyan-800/40 text-[10px] text-cyan-300 font-sans leading-relaxed">
      ✨ <b>Arraste</b> uma variação direto para onde quiser no canvas, ou dê <b>2 cliques</b> para inserir no centro.
    </div>

    <!-- Variants List -->
    <div class="flex-1 overflow-y-auto p-3 space-y-3">
      <div
        v-for="v in model.variants"
        :key="v.id"
        draggable="true"
        @dragstart="onDragStart($event, model.type, v.id)"
        @dblclick="emit('insert-center', { type: model.type, variant: v.id })"
        class="p-3 rounded-lg border border-slate-800/90 bg-[#111620] hover:border-cyan-500/60 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] transition-all cursor-grab active:cursor-grabbing group relative"
      >
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-1.5">
            <span class="text-xs font-bold text-white">{{ v.label }}</span>
            <span class="text-[9px] px-1 py-0.2 rounded bg-slate-900 border border-slate-800 text-slate-400">
              {{ v.id }}
            </span>
          </div>

          <button
            @click.stop="emit('insert-center', { type: model.type, variant: v.id })"
            class="px-2 py-0.5 bg-cyan-500/10 hover:bg-cyan-500 hover:text-slate-950 text-cyan-300 border border-cyan-500/40 rounded text-[10px] font-bold transition"
            title="Inserir no centro do canvas"
          >
            + Inserir
          </button>
        </div>

        <!-- Realistic Visual Mini Preview matching the variant -->
        <NodeMiniPreview :type="model.type" :variant="v.id" />

        <!-- Drag handle indicator -->
        <div class="flex items-center justify-between text-[9px] text-slate-500 pt-2 mt-1 border-t border-slate-800/60 font-sans">
          <span class="flex items-center gap-1">
            <span class="text-cyan-400">⠿</span> Arraste para o canvas
          </span>
          <span class="opacity-60">2 cliques para centro</span>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="h-10 px-4 border-t border-slate-800/90 flex items-center justify-between text-[10px] text-slate-500 shrink-0 bg-[#090c10]">
      <span>{{ model.variants.length }} variações disponíveis</span>
      <kbd class="bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded text-[9px]">Esc fecha</kbd>
    </div>
  </div>
</template>
