<script setup>
import { ref, computed } from 'vue';
import { NODE_CATALOG } from '@/constants/catalog';
import NodeMiniPreview from './NodeMiniPreview.vue';

const props = defineProps({
  selectedModelType: {
    type: String,
    default: null
  }
});

const emit = defineEmits([
  'select-model',
  'insert-center',
  'drag-start'
]);

const search = ref('');

const filteredCatalog = computed(() => {
  if (!search.value) return NODE_CATALOG;
  const q = search.value.toLowerCase();
  return NODE_CATALOG.filter(
    (c) => c.name.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q)
  );
});

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
  <div class="flex-1 overflow-y-auto p-3 space-y-3 font-mono select-none">
    <!-- Quick Tip -->
    <div class="p-2.5 rounded bg-cyan-950/20 border border-cyan-800/40 text-[10px] text-slate-300 space-y-1 font-sans leading-relaxed">
      <div class="font-bold text-cyan-300 flex items-center gap-1.5 font-mono">
        <span>⚡</span> Ações Rápidas:
      </div>
      <div>• <b>Clique</b> para abrir a barra de variações ao lado.</div>
      <div>• <b>Arraste</b> para soltar exatamente onde quiser no canvas.</div>
      <div>• <b>2 cliques</b> para inserir no centro da visão atual.</div>
    </div>

    <!-- Search input -->
    <div class="relative">
      <input
        v-model="search"
        placeholder="🔍 Filtrar 15 modelos de blocos..."
        class="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
      />
      <button
        v-if="search"
        @click="search = ''"
        class="absolute right-2 top-1.5 text-xs text-slate-500 hover:text-slate-300"
      >
        ×
      </button>
    </div>

    <!-- Clean, High-End Model Cards Grid -->
    <div class="space-y-2.5">
      <div
        v-for="item in filteredCatalog"
        :key="item.type"
        draggable="true"
        @dragstart="onDragStart($event, item.type, item.variants[0]?.id || 'default')"
        @click="emit('select-model', item)"
        @dblclick="emit('insert-center', { type: item.type, variant: item.variants[0]?.id || 'default' })"
        :class="
          selectedModelType === item.type
            ? 'border-cyan-400 bg-cyan-950/30 ring-1 ring-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.2)]'
            : 'border-slate-800/80 bg-[#111620] hover:border-slate-700 hover:bg-[#141a26]'
        "
        class="p-2.5 rounded-lg border transition-all cursor-grab active:cursor-grabbing group relative flex flex-col gap-2"
        :title="`Clique para ver ${item.variants.length} variações ou arraste para o canvas`"
      >
        <!-- Card Header -->
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span
              class="w-5 h-5 rounded bg-slate-800 flex items-center justify-center text-xs font-bold"
              :class="item.color"
            >
              {{ item.icon }}
            </span>
            <span class="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
              {{ item.name }}
            </span>
          </div>

          <span class="text-[9px] px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400 group-hover:text-cyan-400 transition-colors">
            {{ item.variants.length }} opções ›
          </span>
        </div>

        <!-- Realistic Visual Mini Preview -->
        <NodeMiniPreview :type="item.type" :variant="item.variants[0]?.id" />

        <!-- Card Footer -->
        <div class="flex items-center justify-between text-[9px] text-slate-500 font-sans">
          <span class="truncate pr-2">{{ item.desc }}</span>
          <span class="text-slate-400 font-mono shrink-0 flex items-center gap-1 group-hover:text-cyan-400">
            <span>⠿</span> arrastar
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
