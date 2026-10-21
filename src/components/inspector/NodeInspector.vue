<script setup>
import { computed } from 'vue';
import { NODE_CATALOG } from '@/constants/catalog';

const props = defineProps({
  node: {
    type: Object,
    required: true
  }
});

const emit = defineEmits([
  'delete-node',
  'duplicate-node',
  'focus-node',
  'close'
]);

const currentCatalogItem = computed(() => {
  return NODE_CATALOG.find((c) => c.type === props.node.type) || NODE_CATALOG[0];
});

const availableVariants = computed(() => {
  return currentCatalogItem.value?.variants || [];
});

const onModelChange = (newType) => {
  props.node.type = newType;
  const item = NODE_CATALOG.find((c) => c.type === newType);
  if (item && item.variants.length > 0) {
    props.node.variant = item.variants[0].id;
  }
};

const widthPresets = [288, 336, 384, 432, 480, 624];
const badgePresets = ['alvo', '[ok]', '60 fps', 'online', 'ativo', 'diff', 'PostgreSQL'];
</script>

<template>
  <div class="space-y-4 font-mono text-xs select-none">
    <!-- Header -->
    <div class="flex items-center justify-between border-b border-slate-800 pb-3">
      <div class="flex items-center gap-2 truncate pr-2">
        <span
          class="w-6 h-6 rounded bg-slate-800 flex items-center justify-center text-xs shrink-0 font-bold"
          :class="currentCatalogItem.color"
        >
          {{ currentCatalogItem.icon }}
        </span>
        <div class="truncate">
          <div class="text-xs font-bold text-white truncate">{{ currentCatalogItem.name }}</div>
          <div class="text-[10px] text-slate-500 font-sans">#{{ node.id }}</div>
        </div>
      </div>

      <div class="flex items-center gap-1.5 shrink-0">
        <button
          @click="emit('duplicate-node')"
          class="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-cyan-300 transition"
          title="Duplicar Bloco (Ctrl+D)"
        >
          ❐
        </button>
        <button
          @click="emit('delete-node')"
          class="p-1.5 rounded hover:bg-rose-950/50 text-slate-400 hover:text-rose-400 transition"
          title="Excluir Bloco (Del)"
        >
          🗑
        </button>
        <button
          @click="emit('close')"
          class="p-1.5 rounded hover:bg-slate-800 text-slate-500 hover:text-white transition text-sm ml-1"
          title="Fechar Painel"
        >
          ✕
        </button>
      </div>
    </div>

    <!-- 1. MODELO & VARIAÇÃO VISUAL -->
    <div class="p-3 bg-[#0e131d] border border-slate-800/80 rounded-lg space-y-2.5">
      <div>
        <label class="text-[10px] text-slate-400 uppercase font-bold block mb-1">Modelo de Componente</label>
        <select
          :value="node.type"
          @change="onModelChange($event.target.value)"
          class="w-full bg-slate-900 border border-slate-700/80 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono transition"
        >
          <option v-for="c in NODE_CATALOG" :key="c.type" :value="c.type">
            {{ c.icon }} {{ c.name }}
          </option>
        </select>
      </div>

      <!-- Interactive Variant Pills -->
      <div>
        <label class="text-[10px] text-slate-400 uppercase font-bold block mb-1.5">Variação de Estilo</label>
        <div class="grid grid-cols-3 gap-1.5">
          <button
            v-for="v in availableVariants"
            :key="v.id"
            @click="node.variant = v.id"
            :class="
              node.variant === v.id
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.2)] font-bold'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
            "
            class="px-2 py-1.5 rounded border text-[10px] text-center truncate transition font-mono"
            :title="`Variação: ${v.label}`"
          >
            {{ v.label }}
          </button>
        </div>
      </div>
    </div>

    <!-- 2. IDENTIFICAÇÃO (Rótulo & Badge) -->
    <div class="p-3 bg-[#0e131d] border border-slate-800/80 rounded-lg space-y-2.5">
      <div>
        <label class="text-[10px] text-slate-400 uppercase font-bold block mb-1">Rótulo de Grupo (Topo)</label>
        <input
          v-model="node.groupLabel"
          placeholder="ex: caminho, no Finder, etapa 01..."
          class="w-full bg-slate-900 border border-slate-700/80 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono transition"
        />
      </div>

      <div>
        <div class="flex items-center justify-between mb-1">
          <label class="text-[10px] text-slate-400 uppercase font-bold">Badge de Status</label>
          <span class="text-[9px] text-slate-500">Presets rápidos</span>
        </div>
        <input
          v-model="node.badge"
          placeholder="ex: alvo, [ok], 60 fps..."
          class="w-full bg-slate-900 border border-slate-700/80 rounded px-2.5 py-1.5 text-xs text-cyan-300 focus:outline-none focus:border-cyan-500 font-mono transition mb-1.5"
        />
        <!-- Quick Badge Presets -->
        <div class="flex items-center gap-1 flex-wrap">
          <button
            v-for="b in badgePresets"
            :key="b"
            @click="node.badge = b"
            :class="node.badge === b ? 'border-cyan-400 text-cyan-300' : 'border-slate-800 text-slate-500 hover:text-slate-300'"
            class="px-1.5 py-0.5 rounded bg-slate-900 border text-[9px] transition"
          >
            {{ b }}
          </button>
        </div>
      </div>
    </div>

    <!-- 3. CONTEÚDO PRINCIPAL -->
    <div class="p-3 bg-[#0e131d] border border-slate-800/80 rounded-lg space-y-2.5">
      <div>
        <label class="text-[10px] text-slate-400 uppercase font-bold block mb-1">Título do Bloco</label>
        <input
          v-model="node.title"
          placeholder="Título descritivo..."
          class="w-full bg-slate-900 border border-slate-700/80 rounded px-2.5 py-1.5 text-xs text-white font-bold focus:outline-none focus:border-cyan-500 font-mono transition"
        />
      </div>

      <div>
        <label class="text-[10px] text-slate-400 uppercase font-bold block mb-1">Subtítulo / Caminho / URL</label>
        <input
          v-model="node.subtitle"
          placeholder="URL, caminho ou parâmetro..."
          class="w-full bg-slate-900 border border-slate-700/80 rounded px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-cyan-500 font-mono transition"
        />
      </div>

      <!-- Image upload / URL for media and browser -->
      <div
        v-if="['media', 'browser'].includes(node.type)"
        class="p-2.5 rounded bg-cyan-950/20 border border-cyan-800/40 space-y-2"
      >
        <div class="flex items-center justify-between">
          <span class="text-[10px] text-cyan-300 font-bold">🖼 Imagem / Captura</span>
          <span class="text-[9px] text-slate-400">Aceita Ctrl+V</span>
        </div>
        <input
          v-model="node.mediaUrl"
          placeholder="URL da imagem ou cole com Ctrl+V..."
          class="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
        />
        <div v-if="node.mediaUrl" class="h-16 w-full rounded overflow-hidden border border-slate-700 bg-black">
          <img :src="node.mediaUrl" alt="Preview" class="w-full h-full object-cover" />
        </div>
      </div>

      <div>
        <div class="flex items-center justify-between mb-1">
          <label class="text-[10px] text-slate-400 uppercase font-bold">Conteúdo / Código / Linhas</label>
          <span class="text-[9px] text-slate-500 font-sans">* no início destaca a linha</span>
        </div>
        <textarea
          v-model="node.content"
          rows="4"
          placeholder="Insira o texto, código ou lista de itens..."
          class="w-full bg-slate-900 border border-slate-700/80 rounded p-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500 leading-relaxed"
        ></textarea>
      </div>
    </div>

    <!-- 4. DIMENSÕES & LARGURA -->
    <div class="p-3 bg-[#0e131d] border border-slate-800/80 rounded-lg space-y-2">
      <div class="flex items-center justify-between">
        <label class="text-[10px] text-slate-400 uppercase font-bold">Largura do Card (px)</label>
        <div class="flex items-center gap-1.5 font-bold text-cyan-400">
          <button
            @click="node.w = Math.max(240, (node.w || 384) - 24)"
            class="w-5 h-5 rounded bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-xs"
          >
            -
          </button>
          <span>{{ node.w || 384 }}px</span>
          <button
            @click="node.w = (node.w || 384) + 24"
            class="w-5 h-5 rounded bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-xs"
          >
            +
          </button>
        </div>
      </div>

      <!-- Quick Width Presets -->
      <div class="grid grid-cols-6 gap-1">
        <button
          v-for="w in widthPresets"
          :key="w"
          @click="node.w = w"
          :class="node.w === w ? 'border-cyan-400 text-cyan-300 font-bold bg-cyan-950/40' : 'border-slate-800 text-slate-400 bg-slate-900 hover:border-slate-700'"
          class="py-1 rounded border text-[9px] text-center transition"
        >
          {{ w }}
        </button>
      </div>
    </div>

    <!-- 5. AÇÃO DA CÂMERA -->
    <button
      @click="emit('focus-node', node)"
      class="w-full py-2.5 bg-cyan-500/10 hover:bg-cyan-500 hover:text-slate-950 border border-cyan-500/40 rounded-lg text-xs text-cyan-300 font-bold transition flex items-center justify-center gap-2 shadow-lg group"
    >
      <span class="group-hover:scale-125 transition-transform">🎯</span>
      <span>Centralizar Câmera no Bloco</span>
    </button>
  </div>
</template>
