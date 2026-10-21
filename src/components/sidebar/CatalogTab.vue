<script setup>
import { ref, computed } from 'vue';
import { NODE_CATALOG } from '@/constants/catalog';

const emit = defineEmits(['add-node']);

const search = ref('');

const filteredCatalog = computed(() => {
  if (!search.value) return NODE_CATALOG;
  const q = search.value.toLowerCase();
  return NODE_CATALOG.filter(
    (c) => c.name.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q)
  );
});
</script>

<template>
  <div class="flex-1 overflow-y-auto p-3 space-y-3 font-sans">
    <!-- Quick Connection and Paste Tips -->
    <div class="p-2.5 rounded bg-cyan-950/30 border border-cyan-800/50 text-[11px] text-slate-300 space-y-1.5 font-mono">
      <div class="font-bold text-cyan-300 flex items-center gap-1.5">
        <span>🔌</span> Dica de Conexão e Imagem:
      </div>
      <div class="text-[10px] leading-relaxed text-slate-400">
        1. Passe o mouse num bloco e <b>arraste a bolinha azul</b> de qualquer borda até outro bloco.
      </div>
      <div class="text-[10px] leading-relaxed text-slate-400">
        2. Selecione um bloco e aperte <kbd class="bg-slate-800 px-1 py-0.5 rounded text-cyan-300 font-bold">Ctrl+V</kbd> para colar prints da área de transferência.
      </div>
    </div>

    <!-- Filter input -->
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

    <!-- Catalog Grid -->
    <div class="space-y-2">
      <div
        v-for="item in filteredCatalog"
        :key="item.type"
        class="p-2.5 rounded border border-slate-800/90 bg-[#11161f] hover:border-slate-700 transition group"
      >
        <div class="flex items-center justify-between mb-1.5">
          <div class="flex items-center gap-2">
            <span
              class="w-6 h-6 rounded bg-slate-800 flex items-center justify-center text-xs font-mono font-bold"
              :class="item.color"
            >
              {{ item.icon }}
            </span>
            <div>
              <div class="text-xs font-bold text-white leading-none font-mono">{{ item.name }}</div>
              <div class="text-[10px] text-slate-400 mt-0.5">{{ item.desc }}</div>
            </div>
          </div>
          <button
            @click="emit('add-node', { type: item.type, variant: item.variants[0]?.id || 'default' })"
            class="px-2 py-1 bg-cyan-500/10 hover:bg-cyan-500 hover:text-slate-950 text-cyan-300 border border-cyan-500/40 rounded text-[11px] font-bold font-mono transition"
          >
            + Adicionar
          </button>
        </div>

        <!-- Variants buttons -->
        <div class="flex items-center gap-1 pt-1.5 border-t border-slate-800/60 flex-wrap">
          <span class="text-[9px] uppercase text-slate-500 font-mono mr-1">Variações:</span>
          <button
            v-for="v in item.variants"
            :key="v.id"
            @click="emit('add-node', { type: item.type, variant: v.id })"
            class="px-1.5 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-[10px] text-slate-300 hover:text-cyan-300 border border-slate-800 transition font-mono"
          >
            + {{ v.label }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
