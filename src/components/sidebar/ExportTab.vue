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
  },
  canvasTheme: {
    type: String,
    default: 'theme-pcb'
  }
});

const emit = defineEmits(['open-render-modal', 'load-project', 'undo', 'redo']);

const exportOutput = ref('');
const feedbackMsg = ref('');
const fileInputRef = ref(null);

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
    canvasTheme: props.canvasTheme,
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
    canvasTheme: props.canvasTheme,
    scenes: props.scenes,
    nodes: props.nodes,
    edges: props.edges,
    exportedAt: new Date().toISOString(),
    version: '2.0.0'
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${props.presentationMeta.slug || 'fluxo'}-circuitflow.json`;
  a.click();
  URL.revokeObjectURL(url);
};

const triggerLoadFile = () => {
  if (fileInputRef.value) {
    fileInputRef.value.value = '';
    fileInputRef.value.click();
  }
};

const onFileSelected = (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (evt) => {
    try {
      const parsed = JSON.parse(evt.target.result);
      emit('load-project', parsed);
      feedbackMsg.value = `✔ Projeto "${file.name}" carregado com sucesso!`;
      setTimeout(() => {
        feedbackMsg.value = '';
      }, 4000);
    } catch (err) {
      feedbackMsg.value = `❌ Erro ao ler arquivo JSON: ${err.message}`;
    }
  };
  reader.readAsText(file);
};

const copyYouTubeChapters = () => {
  let cumulativeSeconds = 0;
  const lines = props.scenes.map((scene, idx) => {
    const mins = Math.floor(cumulativeSeconds / 60);
    const secs = Math.floor(cumulativeSeconds % 60);
    const timestamp = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    const title = scene.title || scene.name || `Cena ${idx + 1}`;

    const duration = scene.duration || 5;
    cumulativeSeconds += duration;

    return `${timestamp} ${title}`;
  });

  const output = lines.join('\n');
  copyToClipboard(output, 'Capítulos do YouTube');
};
</script>

<template>
  <div class="flex-1 overflow-y-auto p-3 space-y-3.5 text-xs font-sans">
    <div class="font-bold text-white font-mono text-xs flex items-center justify-between">
      <span class="flex items-center gap-1.5"><span>📦</span> Salvar, Carregar & Exportar</span>
      <div class="flex items-center gap-1">
        <button
          @click="emit('undo')"
          class="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] border border-slate-700"
          title="Desfazer (Ctrl+Z)"
        >
          ↶ Ctrl+Z
        </button>
        <button
          @click="emit('redo')"
          class="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] border border-slate-700"
          title="Refazer (Ctrl+Y)"
        >
          ↷ Ctrl+Y
        </button>
      </div>
    </div>

    <!-- Hidden file picker -->
    <input
      ref="fileInputRef"
      type="file"
      accept=".json,.circuit.json"
      class="hidden"
      @change="onFileSelected"
    />

    <!-- Local File Actions (Salvar e Carregar) -->
    <div class="p-3 bg-[#0d121c] border border-slate-800 rounded-lg space-y-2 font-mono">
      <div class="text-[11px] font-bold text-cyan-400">💾 Armazenamento Local</div>
      <div class="grid grid-cols-2 gap-2">
        <button
          @click="downloadJsonFile"
          class="py-2 px-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded text-[11px] transition flex items-center justify-center gap-1.5 shadow"
        >
          <span>💾</span> Salvar .json
        </button>

        <button
          @click="triggerLoadFile"
          class="py-2 px-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold rounded text-[11px] transition flex items-center justify-center gap-1.5"
        >
          <span>📂</span> Abrir .json
        </button>
      </div>
    </div>

    <!-- YouTube Chapters Generator -->
    <div class="p-3 bg-[#0d121c] border border-slate-800 rounded-lg space-y-2 font-mono">
      <div class="text-[11px] font-bold text-amber-400 flex items-center gap-1.5">
        <span>⏱</span> Capítulos YouTube (Timestamps)
      </div>
      <p class="text-[10px] text-slate-400 font-sans leading-relaxed">
        Gera a minutagem exata das cenas baseada nas durações da narração para colar na descrição do seu vídeo.
      </p>
      <button
        @click="copyYouTubeChapters"
        class="w-full py-2 bg-amber-500/10 hover:bg-amber-500 hover:text-slate-950 text-amber-300 border border-amber-500/40 font-bold rounded text-[11px] transition flex items-center justify-center gap-1.5"
      >
        <span>📋</span> Copiar Capítulos para o YouTube
      </button>
    </div>

    <!-- Remotion & Broadcast Code -->
    <div class="space-y-2 font-mono pt-1">
      <button
        @click="exportRemotion"
        class="w-full py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-lg transition flex items-center justify-center gap-2 shadow-lg"
      >
        <span>⚛️</span> Copiar Remotion TSX (4K 60fps)
      </button>

      <button
        @click="downloadRemotionFile"
        class="w-full py-2 bg-slate-800 hover:bg-slate-700 text-purple-300 border border-purple-500/40 rounded-lg transition flex items-center justify-center gap-2"
      >
        <span>💾</span> Baixar Remotion.tsx
      </button>

      <button
        @click="exportJson"
        class="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg transition flex items-center justify-center gap-2"
      >
        <span>📋</span> Copiar AST JSON
      </button>

      <button
        @click="emit('open-render-modal')"
        class="w-full py-2.5 bg-cyan-500/10 hover:bg-cyan-500 hover:text-slate-950 text-cyan-300 border border-cyan-500/40 font-bold rounded-lg transition flex items-center justify-center gap-2"
      >
        <span>🚀</span> Renderizar MP4 4K (Headless Queue)
      </button>
    </div>

    <!-- Feedback Message -->
    <div v-if="feedbackMsg" class="p-2.5 bg-emerald-950/60 border border-emerald-500/60 rounded-lg text-[11px] text-emerald-300 font-mono shadow">
      {{ feedbackMsg }}
    </div>

    <!-- Output preview -->
    <div v-if="exportOutput" class="space-y-1.5 pt-2 border-t border-slate-800 font-mono">
      <div class="text-[10px] text-cyan-400 font-bold flex items-center justify-between">
        <span>Conteúdo Gerado:</span>
        <button
          @click="exportOutput = ''"
          class="text-slate-500 hover:text-slate-300"
        >
          ocultar
        </button>
      </div>
      <pre class="p-3 bg-black border border-slate-800 rounded-lg text-[10px] text-cyan-300 max-h-56 overflow-auto leading-relaxed select-all">{{ exportOutput }}</pre>
    </div>
  </div>
</template>
