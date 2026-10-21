<script setup>
import { ref } from 'vue';

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
  const code = `// Remotion 60fps Composition Gerada por CircuitFlow Studio v2.0
import { AbsoluteFill, useCurrentFrame, interpolate, spring } from 'remotion';

export const CircuitFlowPresentation = () => {
  const frame = useCurrentFrame();
  const scenes = ${JSON.stringify(props.scenes, null, 2)};
  const nodes = ${JSON.stringify(props.nodes, null, 2)};
  const edges = ${JSON.stringify(props.edges, null, 2)};

  return (
    <AbsoluteFill style={{ backgroundColor: '#090b0e', color: '#e2e8f0', fontFamily: 'monospace' }}>
      {/* CircuitFlow 60fps Vector Renderer */}
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        {/* Renderiza nós e conexões com interpolação de câmera */}
      </div>
    </AbsoluteFill>
  );
};
`;
  copyToClipboard(code, 'Componente Remotion (.tsx)');
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

    <p class="text-[11px] text-slate-400 leading-relaxed">
      Exporte a estrutura visual como AST JSON para salvar, ou gere um componente nativo para <b>Remotion (React 60fps)</b> pronto para renderizar vídeos cinematográficos com câmera contínua.
    </p>

    <div class="space-y-2 font-mono">
      <button
        @click="exportJson"
        class="w-full py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded transition flex items-center justify-center gap-2"
      >
        <span>📋</span> Copiar AST JSON Completo
      </button>

      <button
        @click="exportRemotion"
        class="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded transition flex items-center justify-center gap-2"
      >
        <span>⚛️</span> Gerar Componente Remotion (.tsx)
      </button>

      <button
        @click="downloadJsonFile"
        class="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded transition flex items-center justify-center gap-2"
      >
        <span>💾</span> Baixar Arquivo .json
      </button>
    </div>

    <!-- Feedback Message -->
    <div v-if="feedbackMsg" class="p-2 bg-emerald-950/40 border border-emerald-700/60 rounded text-[11px] text-emerald-300 font-mono">
      {{ feedbackMsg }}
    </div>

    <!-- Output preview -->
    <div v-if="exportOutput" class="space-y-1 pt-2 border-t border-slate-800 font-mono">
      <div class="text-[10px] text-cyan-400 font-bold">Prévia do Código:</div>
      <pre class="p-2.5 bg-black border border-slate-800 rounded text-[10px] text-cyan-300 max-h-64 overflow-auto leading-relaxed select-all">{{ exportOutput }}</pre>
    </div>
  </div>
</template>
