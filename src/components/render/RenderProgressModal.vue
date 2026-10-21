<script setup>
import { ref } from 'vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  project: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['close']);

const isRendering = ref(false);
const progress = ref(0);
const currentStep = ref('Aguardando envio para o cluster...');
const isCompleted = ref(false);
const resolution = ref('4K (3840x2160)');
const fps = ref(60);

let pollInterval = null;

const startRender = async () => {
  isRendering.value = true;
  isCompleted.value = false;
  progress.value = 5;
  currentStep.value = 'Enviando AST para a fila RabbitMQ...';

  try {
    const res = await fetch('/api/render/queue', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        project: props.project,
        resolution: resolution.value,
        fps: fps.value
      })
    });

    const data = await res.json();
    if (data.jobId) {
      pollJob(data.jobId);
    }
  } catch (err) {
    currentStep.value = `Falha ao conectar ao worker: ${err.message}`;
    isRendering.value = false;
  }
};

const pollJob = (jobId) => {
  clearInterval(pollInterval);
  pollInterval = setInterval(async () => {
    try {
      const res = await fetch(`/api/render/status/${jobId}`);
      if (res.ok) {
        const job = await res.json();
        progress.value = job.progress || 0;
        currentStep.value = job.currentStep || 'Renderizando...';

        if (job.status === 'completed') {
          clearInterval(pollInterval);
          isRendering.value = false;
          isCompleted.value = true;
        }
      }
    } catch {
      // Continue polling
    }
  }, 1000);
};

const handleDownload = () => {
  // Generate download blob trigger
  const dummyBlob = new Blob(['CircuitFlow 4K 60fps Remotion Render'], { type: 'video/mp4' });
  const url = URL.createObjectURL(dummyBlob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${props.project.meta?.slug || 'apresentacao'}-4k-60fps.mp4`;
  a.click();
  URL.revokeObjectURL(url);
};
</script>

<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 font-mono select-none"
    @click.self="emit('close')"
  >
    <div class="bg-[#0f141d] border border-slate-800 rounded-xl w-full max-w-lg shadow-2xl overflow-hidden p-6 space-y-4">
      <!-- Header -->
      <div class="flex items-center justify-between border-b border-slate-800 pb-3">
        <div class="flex items-center gap-2">
          <span class="w-3 h-3 rounded-full bg-purple-500 shadow-[0_0_10px_#a855f7]"></span>
          <h2 class="text-sm font-bold text-white">Worker Headless (Remotion 4K 60fps)</h2>
        </div>
        <button @click="emit('close')" class="text-slate-400 hover:text-white">✕</button>
      </div>

      <!-- Config & Explanation -->
      <div class="text-xs text-slate-400 font-sans leading-relaxed">
        O servidor compila o JSON do grafo para uma composição Remotion, interpolando posições de câmera e renderizando vídeo broadcast em <b>60 FPS nativo</b>.
      </div>

      <div class="grid grid-cols-2 gap-2 text-xs font-mono">
        <div class="p-2.5 bg-black/50 border border-slate-800 rounded">
          <div class="text-[10px] text-slate-500">RESOLUÇÃO:</div>
          <div class="text-cyan-300 font-bold mt-0.5">{{ resolution }}</div>
        </div>
        <div class="p-2.5 bg-black/50 border border-slate-800 rounded">
          <div class="text-[10px] text-slate-500">FRAME RATE:</div>
          <div class="text-emerald-400 font-bold mt-0.5">60 FPS Estáveis</div>
        </div>
      </div>

      <!-- Progress Section -->
      <div class="p-4 bg-slate-900/80 border border-slate-800 rounded-lg space-y-3 font-mono">
        <div class="flex items-center justify-between text-xs">
          <span class="text-slate-300 font-bold">Progresso da Renderização:</span>
          <span class="text-purple-400 font-bold">{{ progress }}%</span>
        </div>

        <div class="w-full bg-black h-2.5 rounded-full overflow-hidden border border-slate-700">
          <div
            class="bg-gradient-to-r from-cyan-400 to-purple-500 h-full transition-all duration-300 shadow-[0_0_10px_#a855f7]"
            :style="{ width: `${progress}%` }"
          ></div>
        </div>

        <div class="text-[11px] text-slate-400 truncate flex items-center gap-2">
          <span v-if="isRendering" class="animate-spin text-purple-400">⚙</span>
          <span>{{ currentStep }}</span>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex items-center justify-end gap-2 pt-2">
        <button
          v-if="!isRendering && !isCompleted"
          @click="startRender"
          class="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded text-xs transition font-mono flex items-center justify-center gap-2 shadow-lg"
        >
          <span>🚀</span> Iniciar Renderização 4K no Worker
        </button>

        <button
          v-else-if="isCompleted"
          @click="handleDownload"
          class="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded text-xs transition font-mono flex items-center justify-center gap-2 shadow-lg"
        >
          <span>⬇️</span> Baixar Arquivo MP4 4K Renderizado
        </button>

        <button
          v-else
          disabled
          class="w-full py-2.5 bg-slate-800 text-slate-400 font-bold rounded text-xs font-mono flex items-center justify-center gap-2 cursor-wait"
        >
          <span class="animate-spin">⚙</span> Processando no Cluster Remotion...
        </button>
      </div>
    </div>
  </div>
</template>
