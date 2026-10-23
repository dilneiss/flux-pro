<script setup>
import { ref } from 'vue';
import { generateRemotionTsx } from '@/utils/remotionExporter';

const props = defineProps({
  presentationMeta: {
    type: Object,
    required: true
  },
  nodes: {
    type: Array,
    required: true
  },
  edges: {
    type: Array,
    required: true
  },
  scenes: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['open-render-modal']);

const exportOutput = ref('');
const feedbackMsg = ref('');

const copyToClipboard = (text, label) => {
  exportOutput.value = text;
  navigator.clipboard?.writeText(text);
  feedbackMsg.value = `✔ ${label} copiado para a área de transferência!`;
  setTimeout(() => {
    feedbackMsg.value = '';
  }, 4000);
};

const exportJson = () => {
  const data = {
    meta: props.presentationMeta,
    scenes: props.scenes,
    nodes: props.nodes,
    edges: props.edges,
    exportedAt: new Date().toISOString()
  };
  const jsonStr = JSON.stringify(data, null, 2);
  copyToClipboard(jsonStr, 'AST JSON');
};

const exportRemotion = () => {
  const code = generateRemotionTsx({
    meta: props.presentationMeta,
    scenes: props.scenes,
    nodes: props.nodes,
    edges: props.edges
  });
  copyToClipboard(code, 'Componente Remotion (.tsx)');
};

const downloadRemotionFile = () => {
  const code = generateRemotionTsx({
    meta: props.presentationMeta,
    scenes: props.scenes,
    nodes: props.nodes,
    edges: props.edges
  });
  const blob = new Blob([code], { type: 'text/typescript' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `CircuitFlowComposition.tsx`;
  a.click();
  URL.revokeObjectURL(url);
};

const downloadJsonFile = () => {
  const data = {
    meta: props.presentationMeta,
    scenes: props.scenes,
    nodes: props.nodes,
    edges: props.edges
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${props.presentationMeta.slug || 'fluxo'}-circuitflow.json`;
  a.click();
  URL.revokeObjectURL(url);
};
</script>

<template>
  <div class="flex-1 overflow-y-auto p-3 space-y-3 text-xs font-sans">
    <div class="font-bold text-white font-mono text-xs flex items-center gap-1.5">
      <span>📦</span> Pipeline de Exportação Comercial
    </div>

    <p class="text-[11px] text-slate-400 leading-relaxed font-sans">
      Exporte a estrutura visual como AST JSON ou gere o componente nativo <b>Remotion 4K (.tsx)</b> com interpolação de câmera em 60fps para renderização via backend.
    </p>

    <div class="space-y-2 font-mono">
      <button
        @click="exportRemotion"
        class="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-lg transition flex items-center justify-center gap-2 shadow-lg"
      >
        <span>⚛️</span> Gerar Componente Remotion (.tsx)
      </button>

      <button
        @click="downloadRemotionFile"
        class="w-full py-2 bg-slate-800 hover:bg-slate-700 text-purple-300 border border-purple-500/40 rounded-lg transition flex items-center justify-center gap-2"
      >
        <span>💾</span> Baixar CircuitFlowComposition.tsx
      </button>

      <button
        @click="exportJson"
        class="w-full py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg transition flex items-center justify-center gap-2"
      >
        <span>📋</span> Copiar AST JSON Completo
      </button>

      <button
        @click="downloadJsonFile"
        class="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg transition flex items-center justify-center gap-2"
      >
        <span>📄</span> Baixar Arquivo .json
      </button>

      <button
        @click="emit('open-render-modal')"
        class="w-full py-2.5 bg-cyan-500/10 hover:bg-cyan-500 hover:text-slate-950 text-cyan-300 border border-cyan-500/40 font-bold rounded-lg transition flex items-center justify-center gap-2"
      >
        <span>🚀</span> Renderizar MP4 4K (Remotion Headless Queue)
      </button>
    </div>

    <!-- Feedback Message -->
    <div v-if="feedbackMsg" class="p-2.5 bg-emerald-950/60 border border-emerald-500/60 rounded-lg text-[11px] text-emerald-300 font-mono shadow">
      {{ feedbackMsg }}
    </div>

    <!-- Output preview -->
    <div v-if="exportOutput" class="space-y-1.5 pt-2 border-t border-slate-800 font-mono">
      <div class="text-[10px] text-cyan-400 font-bold flex items-center justify-between">
        <span>Prévia do Código Remotion TSX:</span>
        <button
          @click="exportOutput = ''"
          class="text-slate-500 hover:text-slate-300"
        >
          ocultar
        </button>
      </div>
      <pre class="p-3 bg-black border border-slate-800 rounded-lg text-[10px] text-cyan-300 max-h-64 overflow-auto leading-relaxed select-all">{{ exportOutput }}</pre>
    </div>
  </div>
</template>
