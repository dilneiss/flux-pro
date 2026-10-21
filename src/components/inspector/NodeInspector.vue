<script setup>
import { NODE_CATALOG } from '@/constants/catalog';

defineProps({
  node: {
    type: Object,
    required: true
  }
});

const emit = defineEmits([
  'delete-node',
  'duplicate-node',
  'focus-node'
]);
</script>

<template>
  <div class="space-y-3 font-sans text-xs">
    <!-- Header -->
    <div class="flex items-center justify-between border-b border-slate-800 pb-2">
      <span class="text-xs font-bold uppercase text-cyan-400 font-mono">Propriedades do Bloco</span>
      <div class="flex items-center gap-2">
        <button
          @click="emit('duplicate-node')"
          class="text-xs text-slate-400 hover:text-cyan-300 font-mono"
          title="Duplicar nó"
        >
          ❐ Duplicar
        </button>
        <button
          @click="emit('delete-node')"
          class="text-xs text-rose-400 hover:text-rose-300 font-mono"
          title="Excluir nó"
        >
          🗑 Excluir
        </button>
      </div>
    </div>

    <!-- Type and Variant -->
    <div class="grid grid-cols-2 gap-2 font-mono">
      <div>
        <label class="text-[10px] text-slate-400 block mb-1">Modelo (15)</label>
        <select
          v-model="node.type"
          class="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-cyan-500"
        >
          <option v-for="c in NODE_CATALOG" :key="c.type" :value="c.type">
            {{ c.name }}
          </option>
        </select>
      </div>

      <div>
        <label class="text-[10px] text-slate-400 block mb-1">Variação Visual</label>
        <input
          v-model="node.variant"
          class="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-cyan-300 focus:outline-none focus:border-cyan-500 font-mono"
        />
      </div>
    </div>

    <!-- Group label -->
    <div>
      <label class="text-[10px] text-slate-400 block mb-1 font-mono">Rótulo Tracejado Acima (Grupo)</label>
      <input
        v-model="node.groupLabel"
        placeholder="ex: no Finder, caminho..."
        class="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
      />
    </div>

    <!-- Title -->
    <div>
      <label class="text-[10px] text-slate-400 block mb-1 font-mono">Título Principal</label>
      <input
        v-model="node.title"
        class="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
      />
    </div>

    <!-- Subtitle -->
    <div>
      <label class="text-[10px] text-slate-400 block mb-1 font-mono">Subtítulo / Caminho / URL</label>
      <input
        v-model="node.subtitle"
        class="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
      />
    </div>

    <!-- Media URL (Media or Browser type) -->
    <div
      v-if="['media', 'browser'].includes(node.type)"
      class="p-2.5 rounded bg-cyan-950/30 border border-cyan-800/50 space-y-1.5"
    >
      <label class="text-[10px] text-cyan-300 font-bold block font-mono">
        🖼 Imagem Interna (Aceita Ctrl+V)
      </label>
      <input
        v-model="node.mediaUrl"
        placeholder="Cole print com Ctrl+V ou URL..."
        class="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
      />
    </div>

    <!-- Content / Code -->
    <div>
      <label class="text-[10px] text-slate-400 block mb-1 font-mono">Conteúdo / Linhas / Código</label>
      <textarea
        v-model="node.content"
        rows="4"
        class="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500 leading-relaxed"
      ></textarea>
    </div>

    <!-- Width and Badge -->
    <div class="grid grid-cols-2 gap-2 font-mono">
      <div>
        <label class="text-[10px] text-slate-400 block mb-1">Largura (px)</label>
        <input
          v-model.number="node.w"
          type="number"
          step="24"
          class="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
        />
      </div>

      <div>
        <label class="text-[10px] text-slate-400 block mb-1">Badge Status</label>
        <input
          v-model="node.badge"
          class="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
        />
      </div>
    </div>

    <!-- Focus Camera Action -->
    <button
      @click="emit('focus-node', node)"
      class="w-full py-2 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 rounded text-xs text-cyan-300 font-bold transition flex items-center justify-center gap-1.5 font-mono"
    >
      <span>🎯</span> Focar Câmera Neste Bloco
    </button>
  </div>
</template>
