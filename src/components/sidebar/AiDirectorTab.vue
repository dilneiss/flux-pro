<script setup>
import { ref } from 'vue';
import { CANVAS_THEMES } from '@/constants/themes';

const props = defineProps({
  aiPromptText: {
    type: String,
    required: true
  },
  canvasTheme: {
    type: String,
    required: true
  }
});

const emit = defineEmits([
  'update:aiPromptText',
  'update:canvasTheme',
  'generate-graph',
  'generate-from-topic'
]);

const topicInput = ref('Como funciona um sistema de cache com Redis, RabbitMQ e PostgreSQL');
const selectedProvider = ref('heuristic'); // 'heuristic' | 'ollama'
const selectedModel = ref('llama3');
const isGenerating = ref(false);

const handleGenerateTopic = async () => {
  isGenerating.value = true;
  emit('generate-from-topic', {
    topic: topicInput.value,
    provider: selectedProvider.value,
    model: selectedModel.value
  });
  setTimeout(() => {
    isGenerating.value = false;
  }, 600);
};
</script>

<template>
  <div class="flex-1 overflow-y-auto p-3 space-y-4 font-sans text-xs">
    <!-- Header -->
    <div>
      <div class="text-xs font-bold text-cyan-400 font-mono flex items-center gap-1.5">
        <span>🤖</span> Copiloto Universal de Roteiros
      </div>
      <p class="text-[11px] text-slate-400 leading-relaxed mt-1">
        Crie apresentações técnicas completas a partir de qualquer tema ou cole seu roteiro estruturado de 4 partes.
      </p>
    </div>

    <!-- 1. Smart Generator by Topic/Theme -->
    <div class="p-3 bg-[#0d121c] border border-cyan-500/30 rounded-lg space-y-2.5 font-mono shadow-lg">
      <div class="text-[11px] font-bold text-cyan-300 flex items-center justify-between">
        <span>🧠 Criar por Tema (IA Copilot)</span>
        <span class="text-[9px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">v6.0</span>
      </div>

      <!-- Provider Selector -->
      <div class="grid grid-cols-2 gap-1.5 text-[10px]">
        <button
          @click="selectedProvider = 'heuristic'"
          :class="
            selectedProvider === 'heuristic'
              ? 'bg-cyan-500 text-slate-950 font-bold shadow'
              : 'bg-slate-900 text-slate-400 border border-slate-800'
          "
          class="py-1 px-1.5 rounded transition truncate"
          title="Heurístico 100% Offline e Instantâneo"
        >
          ⚡ Heurístico Local
        </button>

        <button
          @click="selectedProvider = 'ollama'"
          :class="
            selectedProvider === 'ollama'
              ? 'bg-purple-500 text-white font-bold shadow'
              : 'bg-slate-900 text-slate-400 border border-slate-800'
          "
          class="py-1 px-1.5 rounded transition truncate"
          title="Ollama Local em http://localhost:11434"
        >
          🦙 Ollama Local
        </button>
      </div>

      <!-- Topic Input -->
      <div>
        <label class="text-[9px] text-slate-400 block mb-1">Tema / Assunto do Vídeo:</label>
        <input
          v-model="topicInput"
          class="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-sans"
          placeholder="Ex: Como funciona arquitetura de microsserviços em Go"
        />
      </div>

      <!-- Model Selector if Ollama -->
      <div v-if="selectedProvider === 'ollama'" class="flex items-center gap-2">
        <label class="text-[9px] text-slate-400 shrink-0">Modelo:</label>
        <input
          v-model="selectedModel"
          class="flex-1 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-[11px] text-purple-300 focus:outline-none"
          placeholder="llama3, qwen2.5-coder..."
        />
      </div>

      <!-- Generate from topic button -->
      <button
        @click="handleGenerateTopic"
        :disabled="isGenerating"
        class="w-full py-2 bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-400 hover:to-sky-500 text-slate-950 font-bold rounded text-xs transition flex items-center justify-center gap-1.5 shadow"
      >
        <span>✨</span> Criar Roteiro + Grafo Inteligente
      </button>
    </div>

    <!-- 2. Structured Script Editor (4 parts) -->
    <div class="space-y-1">
      <div class="flex items-center justify-between">
        <label class="text-[10px] text-slate-400 uppercase font-mono block">Roteiro Estruturado (4 Partes):</label>
        <span class="text-[9px] text-slate-500 font-mono">Tipo | Título | Subtítulo | Narração</span>
      </div>
      <textarea
        :value="aiPromptText"
        @input="emit('update:aiPromptText', $event.target.value)"
        rows="8"
        class="w-full bg-slate-900 border border-slate-700 rounded p-2.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500 leading-relaxed"
        placeholder="Tipo | Título | Subtítulo | Narração Falada"
      ></textarea>
    </div>

    <!-- Action Button -->
    <button
      @click="emit('generate-graph')"
      class="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-lg text-xs transition shadow-[0_0_20px_rgba(6,182,212,0.3)] flex items-center justify-center gap-2 font-mono"
    >
      <span>⚡</span> Gerar Apresentação Narrada Completa
    </button>

    <!-- Visual Themes -->
    <div class="border-t border-slate-800 pt-3 space-y-2">
      <div class="text-xs font-bold text-slate-300 font-mono">🎨 Temas Visuais do Estúdio</div>
      <div class="grid grid-cols-1 gap-1.5 text-[11px]">
        <button
          v-for="t in CANVAS_THEMES"
          :key="t.id"
          @click="emit('update:canvasTheme', t.id)"
          :class="
            canvasTheme === t.id
              ? 'border-cyan-400 text-cyan-300 bg-cyan-950/30'
              : 'border-slate-800 text-slate-400 bg-slate-900 hover:border-slate-700'
          "
          class="p-2 rounded border text-left flex items-center justify-between transition font-mono"
        >
          <div>
            <div class="font-bold">{{ t.name }}</div>
            <div class="text-[10px] text-slate-500 font-sans">{{ t.desc }}</div>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>
