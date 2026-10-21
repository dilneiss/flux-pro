<script setup>
import { CANVAS_THEMES } from '@/constants/themes';

defineProps({
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
  'generate-graph'
]);
</script>

<template>
  <div class="flex-1 overflow-y-auto p-3 space-y-4 font-sans text-xs">
    <!-- Header -->
    <div>
      <div class="text-xs font-bold text-cyan-400 font-mono flex items-center gap-1.5">
        <span>🤖</span> Script-to-Graph AI Director
      </div>
      <p class="text-[11px] text-slate-400 leading-relaxed mt-1">
        Cole os tópicos do seu vídeo (uma etapa por linha no formato
        <code class="text-cyan-300 font-mono">Tipo: Título | Subtítulo</code>)
        e a ferramenta constrói os nós, conecta os cabos ortogonais e cria os zooms de câmera de forma automática.
      </p>
    </div>

    <!-- Textarea -->
    <div class="space-y-1">
      <label class="text-[10px] text-slate-400 uppercase font-mono block">Roteiro Estruturado:</label>
      <textarea
        :value="aiPromptText"
        @input="emit('update:aiPromptText', $event.target.value)"
        rows="8"
        class="w-full bg-slate-900 border border-slate-700 rounded p-2.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500 leading-relaxed"
        placeholder="chip: /Applications/App.app | Binário Original&#10;terminal: Análise de Código | Engenharia Reversa&#10;code: driver.rs | Versão Recompilada"
      ></textarea>
    </div>

    <!-- Action Button -->
    <button
      @click="emit('generate-graph')"
      class="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded text-xs transition shadow-lg flex items-center justify-center gap-1.5 font-mono"
    >
      <span>⚡</span> Gerar Grafo + Cenas Automatizadas
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
          <span class="text-[9px] uppercase px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
            {{ t.badge }}
          </span>
        </button>
      </div>
    </div>
  </div>
</template>
