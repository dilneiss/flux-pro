<script setup>
import { ref, computed, watch } from 'vue';
import { MARKETPLACE_PRESETS } from '@/constants/marketplacePresets';

defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close', 'load-preset']);

const selectedPreset = ref(MARKETPLACE_PRESETS[0]);
const searchQuery = ref('');
const activeCategory = ref('all');

const categories = [
  { id: 'all', label: 'Todos os Templates' },
  { id: 'devtools', label: 'DevTools & IA' },
  { id: 'saas', label: 'Arquitetura SaaS' },
  { id: 'growth', label: 'Funil & VSL' },
  { id: 'performance', label: 'Performance' }
];

const filteredPresets = computed(() => {
  return MARKETPLACE_PRESETS.filter((preset) => {
    // Category match
    let matchesCategory = true;
    if (activeCategory.value === 'devtools') {
      matchesCategory = preset.category.includes('DevTools') || preset.category.includes('Aulas');
    } else if (activeCategory.value === 'saas') {
      matchesCategory = preset.category.includes('Arquitetura') || preset.category.includes('Inteligência');
    } else if (activeCategory.value === 'growth') {
      matchesCategory = preset.category.includes('Marketing') || preset.category.includes('VSL');
    } else if (activeCategory.value === 'performance') {
      matchesCategory = preset.category.includes('Performance');
    }

    // Search query match
    let matchesQuery = true;
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase();
      matchesQuery =
        preset.name.toLowerCase().includes(q) ||
        preset.tagline.toLowerCase().includes(q) ||
        preset.category.toLowerCase().includes(q) ||
        preset.nodes.some((n) => n.title.toLowerCase().includes(q));
    }

    return matchesCategory && matchesQuery;
  });
});
watch(filteredPresets, (newList) => {
  if (newList.length > 0 && !newList.some((p) => p.id === selectedPreset.value?.id)) {
    selectedPreset.value = newList[0];
  }
});


const handleSelect = (preset) => {
  selectedPreset.value = preset;
};

const handleApply = () => {
  if (selectedPreset.value) {
    emit('load-preset', selectedPreset.value);
    emit('close');
  }
};

const getCategoryStyle = (category) => {
  if (category.includes('DevTools')) {
    return {
      bg: 'bg-amber-950/70 border-amber-500/50 text-amber-300',
      dot: 'bg-amber-400 shadow-[0_0_6px_#f59e0b]'
    };
  }
  if (category.includes('Arquitetura')) {
    return {
      bg: 'bg-cyan-950/70 border-cyan-500/50 text-cyan-300',
      dot: 'bg-cyan-400 shadow-[0_0_6px_#06b6d4]'
    };
  }
  if (category.includes('Marketing')) {
    return {
      bg: 'bg-emerald-950/70 border-emerald-500/50 text-emerald-300',
      dot: 'bg-emerald-400 shadow-[0_0_6px_#10b981]'
    };
  }
  if (category.includes('Performance')) {
    return {
      bg: 'bg-purple-950/70 border-purple-500/50 text-purple-300',
      dot: 'bg-purple-400 shadow-[0_0_6px_#a855f7]'
    };
  }
  return {
    bg: 'bg-fuchsia-950/70 border-fuchsia-500/50 text-fuchsia-300',
    dot: 'bg-fuchsia-400 shadow-[0_0_6px_#d946ef]'
  };
};
</script>

<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 sm:p-6 font-sans select-none animate-in fade-in duration-200"
    @click.self="emit('close')"
  >
    <div class="bg-[#0c1017] border border-slate-800 rounded-2xl w-full max-w-5xl h-[88vh] max-h-[780px] flex flex-col shadow-[0_25px_70px_rgba(0,0,0,0.85)] overflow-hidden">
      <!-- Modal Header -->
      <div class="h-16 px-6 border-b border-slate-800/90 flex items-center justify-between shrink-0 bg-[#0a0d13]">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 font-bold text-base shadow-[0_0_15px_rgba(6,182,212,0.4)]">
            📦
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h2 class="text-sm font-bold text-white tracking-tight">
                Marketplace de Templates Comerciais
              </h2>
              <span class="px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800/70 text-[10px] font-mono font-bold">
                5 Modelos Prontos
              </span>
            </div>
            <p class="text-xs text-slate-400 mt-0.5">
              Estruturas completas em 60fps prontas para carregar no canvas com 1 clique
            </p>
          </div>
        </div>

        <button
          @click="emit('close')"
          class="w-8 h-8 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition"
          title="Fechar (Esc)"
        >
          ✕
        </button>
      </div>

      <!-- Search & Category Filters Bar -->
      <div class="px-6 py-2.5 bg-[#0e131b] border-b border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
        <!-- Search Input -->
        <div class="relative w-full sm:w-64">
          <span class="absolute left-3 top-2 text-slate-500 text-xs">🔍</span>
          <input
            v-model="searchQuery"
            placeholder="Buscar templates..."
            class="w-full bg-[#080b10] border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
          />
          <button
            v-if="searchQuery"
            @click="searchQuery = ''"
            class="absolute right-2.5 top-1.5 text-xs text-slate-500 hover:text-slate-300"
          >
            ×
          </button>
        </div>

        <!-- Category Pills -->
        <div class="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <button
            v-for="cat in categories"
            :key="cat.id"
            @click="activeCategory = cat.id"
            :class="
              activeCategory === cat.id
                ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/50 font-semibold shadow-[0_0_10px_rgba(6,182,212,0.15)]'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
            "
            class="px-2.5 py-1 rounded-full border text-xs whitespace-nowrap transition"
          >
            {{ cat.label }}
          </button>
        </div>
      </div>

      <!-- Modal Body (Two-Column Layout) -->
      <div class="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-slate-800/90">
        <!-- Left: Template Cards List (Col 5) -->
        <div class="md:col-span-5 overflow-y-auto p-4 space-y-2.5 bg-[#090c12]">
          <div
            v-for="preset in filteredPresets"
            :key="preset.id"
            @click="handleSelect(preset)"
            @dblclick="handleApply"
            :class="
              selectedPreset?.id === preset.id
                ? 'border-cyan-400 bg-[#0f1724] ring-1 ring-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.2)]'
                : 'border-slate-800/80 bg-[#0e131b] hover:border-slate-700 hover:bg-[#121822]'
            "
            class="p-3.5 rounded-xl border cursor-pointer transition-all duration-150 relative group flex flex-col justify-between gap-2.5"
          >
            <!-- Card Header: Category Tag & Price -->
            <div class="flex items-center justify-between text-xs">
              <span
                class="px-2.5 py-0.5 rounded-full border text-[10px] font-semibold tracking-wide flex items-center gap-1.5"
                :class="getCategoryStyle(preset.category).bg"
              >
                <span class="w-1.5 h-1.5 rounded-full" :class="getCategoryStyle(preset.category).dot"></span>
                {{ preset.category }}
              </span>

              <div class="flex items-center gap-2">
                <span class="text-xs font-bold font-mono text-amber-300 bg-amber-950/60 border border-amber-800/50 px-2 py-0.5 rounded-md">
                  {{ preset.price }}
                </span>
                <span class="text-slate-600 group-hover:text-cyan-400 transition-colors text-sm font-bold">›</span>
              </div>
            </div>

            <!-- Card Content -->
            <div>
              <h3 class="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                {{ preset.name }}
              </h3>
              <p class="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                {{ preset.tagline }}
              </p>
            </div>

            <!-- Card Footer: Stats & Author -->
            <div class="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800/60 font-mono">
              <div class="flex items-center gap-1.5 text-amber-400">
                <span>★</span>
                <span class="text-slate-300 font-bold">{{ preset.stars }}</span>
              </div>
              <div class="flex items-center gap-2 text-slate-400">
                <span>{{ preset.nodes.length }} blocos</span>
                <span>•</span>
                <span>{{ preset.scenes.length }} cenas</span>
                <span>•</span>
                <span class="px-1.5 py-0.2 rounded bg-slate-900 border border-slate-800 text-cyan-400 font-sans text-[10px]">
                  {{ preset.theme.replace('theme-', '') }}
                </span>
              </div>
            </div>
          </div>

          <div v-if="filteredPresets.length === 0" class="text-center py-12 text-slate-500 text-xs">
            Nenhum template encontrado com "{{ searchQuery }}".
          </div>
        </div>

        <!-- Right: Rich Visual Preview & Details Panel (Col 7) -->
        <div class="md:col-span-7 flex flex-col justify-between bg-[#0b0f16] overflow-hidden">
          <div v-if="selectedPreset" class="flex-1 overflow-y-auto p-6 space-y-4">
            <!-- Header Banner -->
            <div class="flex items-start justify-between gap-4">
              <div>
                <div class="flex items-center gap-2 mb-1.5">
                  <span class="px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[11px] font-bold">
                    {{ selectedPreset.badge }}
                  </span>
                  <span class="text-xs text-slate-400">
                    Criado por <b class="text-slate-200">{{ selectedPreset.author }}</b>
                  </span>
                  <span class="text-[10px] text-emerald-400 flex items-center gap-0.5 font-semibold">
                    <span>✓</span> Verificado
                  </span>
                </div>
                <h2 class="text-xl font-bold text-white tracking-tight leading-tight">
                  {{ selectedPreset.name }}
                </h2>
                <p class="text-xs text-slate-300 mt-1 leading-relaxed">
                  {{ selectedPreset.tagline }}
                </p>
              </div>

              <!-- Price Box -->
              <div class="p-3 rounded-xl bg-[#0f1724] border border-cyan-500/30 text-right shrink-0 shadow-lg">
                <div class="text-[10px] uppercase font-bold text-slate-400">Valor de Licença</div>
                <div class="text-xl font-bold font-mono text-emerald-400 leading-none mt-1">
                  {{ selectedPreset.price }}
                </div>
                <div class="text-[9px] text-slate-500 mt-1">vitalício • 60fps</div>
              </div>
            </div>

            <!-- Visual Flow Schematic Preview (Mini-Diagram Map) -->
            <div class="p-4 bg-[#080b10] border border-slate-800/90 rounded-xl space-y-3">
              <div class="flex items-center justify-between text-xs">
                <span class="font-bold text-cyan-400 flex items-center gap-1.5">
                  <span>🗺️</span> Fluxo Estrutural do Diagrama:
                </span>
                <span class="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-400">
                  Estilo: {{ selectedPreset.theme }}
                </span>
              </div>

              <!-- Interactive Node Chain Flowchart -->
              <div class="grid grid-cols-2 gap-2 text-xs">
                <div
                  v-for="(n, i) in selectedPreset.nodes"
                  :key="n.id"
                  class="p-2.5 rounded-lg bg-[#0e131d] border border-slate-800 flex flex-col justify-between gap-1 relative group hover:border-slate-700 transition"
                >
                  <div class="flex items-center justify-between text-[10px]">
                    <span class="font-mono text-cyan-400 font-bold">#0{{ i + 1 }} {{ n.groupLabel }}</span>
                    <span class="px-1.5 py-0.2 rounded bg-slate-900 border border-slate-800 text-slate-400 font-mono text-[9px]">
                      {{ n.type }}
                    </span>
                  </div>
                  <div class="font-semibold text-white truncate text-[11px]">{{ n.title }}</div>
                  <div class="text-[10px] text-slate-400 truncate font-sans">{{ n.subtitle || n.content }}</div>
                </div>
              </div>
            </div>

            <!-- Keyframe Camera Storyboard -->
            <div class="p-4 bg-[#080b10] border border-slate-800/90 rounded-xl space-y-3">
              <div class="flex items-center justify-between text-xs">
                <span class="font-bold text-amber-300 flex items-center gap-1.5">
                  <span>🎬</span> Roteiro de Câmera ({{ selectedPreset.scenes.length }} Keyframes Cinemáticos):
                </span>
                <span class="text-[10px] text-slate-400 font-mono">
                  ~{{ selectedPreset.scenes[selectedPreset.scenes.length - 1]?.startTime + 4 }}s de vídeo
                </span>
              </div>

              <!-- Horizontal Storyboard Timeline -->
              <div class="grid grid-cols-2 gap-2 text-xs">
                <div
                  v-for="(s, i) in selectedPreset.scenes"
                  :key="i"
                  class="p-2 rounded-lg bg-[#0e131d] border border-slate-800 flex items-center justify-between"
                >
                  <div class="flex items-center gap-2 truncate pr-2">
                    <span class="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-300 font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
                      {{ i + 1 }}
                    </span>
                    <div class="truncate">
                      <div class="font-bold text-white text-[11px] truncate">{{ s.title }}</div>
                      <div class="text-[10px] text-slate-400 font-sans truncate">{{ s.subtitle }}</div>
                    </div>
                  </div>
                  <span class="text-[10px] font-mono text-amber-400 bg-amber-950/40 px-1.5 py-0.5 rounded shrink-0 font-bold">
                    {{ s.startTime }}s
                  </span>
                </div>
              </div>
            </div>

            <!-- Commercial Features Checklist -->
            <div class="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
              <div class="flex items-center gap-1.5 text-emerald-400">
                <span>✓</span> <span>{{ selectedPreset.nodes.length }} nós pré-configurados</span>
              </div>
              <div class="flex items-center gap-1.5 text-emerald-400">
                <span>✓</span> <span>Trilhas Manhattan 90° animadas</span>
              </div>
              <div class="flex items-center gap-1.5 text-emerald-400">
                <span>✓</span> <span>Interpolação de câmera 60 FPS</span>
              </div>
              <div class="flex items-center gap-1.5 text-emerald-400">
                <span>✓</span> <span>Exportação Remotion TSX inclusa</span>
              </div>
            </div>
          </div>

          <!-- Pinned Bottom Actions Bar -->
          <div class="px-6 py-4 border-t border-slate-800/90 flex items-center justify-between shrink-0 bg-[#0a0d14]">
            <div class="text-xs text-slate-400">
              Pronto para gravar com <kbd class="bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded text-[10px] text-slate-300 font-mono">Espaço</kbd> ou exportar
            </div>

            <div class="flex items-center gap-3">
              <button
                @click="emit('close')"
                class="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-900 transition"
              >
                Cancelar
              </button>

              <button
                @click="handleApply"
                class="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-lg text-xs transition shadow-[0_0_20px_rgba(6,182,212,0.35)] flex items-center gap-2 group cursor-pointer"
              >
                <span class="group-hover:scale-125 transition-transform">⚡</span>
                <span>Carregar Template no Canvas</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
