<script setup>
import { ref } from 'vue';
import { MARKETPLACE_PRESETS } from '@/constants/marketplacePresets';

defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close', 'load-preset']);

const selectedPreset = ref(MARKETPLACE_PRESETS[0]);

const handleSelect = (preset) => {
  selectedPreset.value = preset;
};

const handleApply = () => {
  if (selectedPreset.value) {
    emit('load-preset', selectedPreset.value);
    emit('close');
  }
};
</script>

<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 font-mono select-none"
    @click.self="emit('close')"
  >
    <div class="bg-[#0f141d] border border-slate-800 rounded-xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
      <!-- Modal Header -->
      <div class="h-14 px-6 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div class="flex items-center gap-2.5">
          <span class="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_10px_#06b6d4]"></span>
          <div>
            <h2 class="text-sm font-bold text-white tracking-wide">
              Marketplace SaaS — Templates Vendáveis de Alta Conversão
            </h2>
            <p class="text-[11px] text-slate-400 font-sans">
              Pacotes completos de apresentação em JSON (~4KB) para nichos lucrativos
            </p>
          </div>
        </div>
        <button
          @click="emit('close')"
          class="text-slate-400 hover:text-white text-lg px-2 py-1 rounded transition"
        >
          ✕
        </button>
      </div>

      <!-- Modal Body -->
      <div class="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-slate-800">
        <!-- Preset List (Col 1-2) -->
        <div class="md:col-span-2 overflow-y-auto p-3 space-y-2">
          <div
            v-for="preset in MARKETPLACE_PRESETS"
            :key="preset.id"
            @click="handleSelect(preset)"
            :class="
              selectedPreset?.id === preset.id
                ? 'border-cyan-400 bg-cyan-950/30 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                : 'border-slate-800/80 bg-slate-900/60 hover:border-slate-700'
            "
            class="p-3 rounded-lg border cursor-pointer transition relative group"
          >
            <div class="flex items-center justify-between text-xs mb-1">
              <span class="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">
                {{ preset.category }}
              </span>
              <span class="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                {{ preset.price }}
              </span>
            </div>
            <div class="text-xs font-bold text-white">{{ preset.name }}</div>
            <div class="text-[11px] text-slate-400 font-sans line-clamp-1 mt-0.5">{{ preset.tagline }}</div>
            <div class="flex items-center gap-3 mt-2 text-[10px] text-slate-500">
              <span>★ {{ preset.stars }}</span>
              <span>•</span>
              <span>{{ preset.nodes.length }} blocos</span>
              <span>•</span>
              <span>{{ preset.scenes.length }} cenas</span>
            </div>
          </div>
        </div>

        <!-- Preset Detail Preview (Col 3-5) -->
        <div class="md:col-span-3 overflow-y-auto p-5 flex flex-col justify-between space-y-4">
          <div v-if="selectedPreset" class="space-y-4">
            <div>
              <div class="flex items-center gap-2 mb-1">
                <span class="text-xs px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold">
                  {{ selectedPreset.badge }}
                </span>
                <span class="text-xs text-slate-400">Criado por {{ selectedPreset.author }}</span>
              </div>
              <h3 class="text-lg font-bold text-white">{{ selectedPreset.name }}</h3>
              <p class="text-xs text-slate-300 font-sans mt-1 leading-relaxed">
                {{ selectedPreset.tagline }}
              </p>
            </div>

            <!-- Preview of nodes & scenes -->
            <div class="p-3 bg-black/50 border border-slate-800 rounded-lg space-y-2">
              <div class="text-[11px] text-cyan-400 font-bold flex items-center justify-between">
                <span>Estrutura do Grafo Incluído:</span>
                <span class="text-slate-400 font-normal">{{ selectedPreset.theme }}</span>
              </div>
              <div class="space-y-1.5 text-xs">
                <div
                  v-for="(n, i) in selectedPreset.nodes"
                  :key="n.id"
                  class="flex items-center justify-between p-1.5 rounded bg-slate-900/80 text-[11px]"
                >
                  <span class="text-slate-300 truncate"><b>#{{ i + 1 }}</b> {{ n.title }}</span>
                  <span class="text-[10px] text-cyan-400 px-1.5 py-0.2 rounded bg-cyan-950 border border-cyan-800 font-mono">
                    {{ n.type }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Scenes Timeline Preview -->
            <div class="p-3 bg-black/50 border border-slate-800 rounded-lg space-y-1.5">
              <div class="text-[11px] text-amber-300 font-bold">
                Cenas e Transições de Câmera ({{ selectedPreset.scenes.length }} keyframes):
              </div>
              <div class="grid grid-cols-2 gap-1.5 text-[10px]">
                <div
                  v-for="(s, i) in selectedPreset.scenes"
                  :key="i"
                  class="p-1.5 rounded bg-slate-900 border border-slate-800 truncate"
                >
                  <span class="text-cyan-300 font-bold">0{{ i + 1 }}.</span> {{ s.title }}
                </div>
              </div>
            </div>
          </div>

          <!-- Bottom Actions -->
          <div class="pt-3 border-t border-slate-800 flex items-center justify-between shrink-0">
            <div class="text-xs text-slate-400">
              Valor de mercado: <b class="text-emerald-400 text-sm">{{ selectedPreset?.price }}</b>
            </div>
            <div class="flex items-center gap-2">
              <button
                @click="emit('close')"
                class="px-3 py-1.5 rounded text-xs text-slate-400 hover:text-white transition"
              >
                Cancelar
              </button>
              <button
                @click="handleApply"
                class="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded text-xs transition shadow-lg flex items-center gap-1.5"
              >
                <span>⚡</span> Carregar Template no Canvas
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
