<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue';
import CatalogTab from './CatalogTab.vue';
import ScenesTab from './ScenesTab.vue';
import AiDirectorTab from './AiDirectorTab.vue';
import ExportTab from './ExportTab.vue';
import VariantFlyout from './VariantFlyout.vue';

defineProps({
  scenes: {
    type: Array,
    required: true
  },
  currentSceneIndex: {
    type: Number,
    required: true
  },
  isLiveRecording: {
    type: Boolean,
    default: false
  },
  aiPromptText: {
    type: String,
    required: true
  },
  canvasTheme: {
    type: String,
    required: true
  },
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
  }
});

const emit = defineEmits([
  'auto-layout',
  'add-node',
  'activate-scene',
  'capture-keyframe',
  'remove-scene',
  'toggle-live-recording',
  'update:aiPromptText',
  'update:canvasTheme',
  'generate-graph',
  'open-render-modal',
  'speak-scene',
  'load-project',
  'undo',
  'redo'
]);

const currentTab = ref('nodes');
const selectedModel = ref(null);

// Reset flyout on tab change
watch(currentTab, () => {
  selectedModel.value = null;
});

// Close flyout on Escape key
const handleKeyDown = (e) => {
  if (e.key === 'Escape' && selectedModel.value) {
    selectedModel.value = null;
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
});
</script>

<template>
  <aside class="w-80 bg-[#0c0f15] border-r border-slate-800/90 flex flex-col z-30 shadow-2xl shrink-0 font-mono select-none relative">
    <!-- Brand Header -->
    <div class="h-12 px-3.5 border-b border-slate-800/90 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_10px_#06b6d4]"></span>
        <span class="font-bold text-xs tracking-wider text-white">
          CIRCUITFLOW <span class="text-[10px] text-cyan-400 bg-cyan-950 border border-cyan-800 px-1.5 py-0.5 rounded">v2.0</span>
        </span>
      </div>
      <div class="flex items-center gap-1">
        <button
          @click="emit('auto-layout')"
          title="Organizar e remover qualquer sobreposição"
          class="text-[11px] bg-slate-800 hover:bg-slate-700 text-cyan-300 px-2 py-1 rounded border border-slate-700 transition"
        >
          ✨ Auto-Alinhar
        </button>
      </div>
    </div>

    <!-- Navigation Tabs -->
    <div class="grid grid-cols-4 border-b border-slate-800 bg-[#090c10] text-[11px] font-semibold">
      <button
        @click="currentTab = 'nodes'"
        :class="
          currentTab === 'nodes'
            ? 'text-cyan-400 border-b-2 border-cyan-400 bg-slate-900/60'
            : 'text-slate-400 hover:text-slate-200'
        "
        class="py-2.5 text-center transition"
      >
        + Blocos
      </button>

      <button
        @click="currentTab = 'scenes'"
        :class="
          currentTab === 'scenes'
            ? 'text-cyan-400 border-b-2 border-cyan-400 bg-slate-900/60'
            : 'text-slate-400 hover:text-slate-200'
        "
        class="py-2.5 text-center transition"
      >
        Cenas ({{ scenes.length }})
      </button>

      <button
        @click="currentTab = 'ai'"
        :class="
          currentTab === 'ai'
            ? 'text-cyan-400 border-b-2 border-cyan-400 bg-slate-900/60'
            : 'text-slate-400 hover:text-slate-200'
        "
        class="py-2.5 text-center transition"
      >
        IA Director
      </button>

      <button
        @click="currentTab = 'export'"
        :class="
          currentTab === 'export'
            ? 'text-cyan-400 border-b-2 border-cyan-400 bg-slate-900/60'
            : 'text-slate-400 hover:text-slate-200'
        "
        class="py-2.5 text-center transition"
      >
        Exportar
      </button>
    </div>

    <!-- Tab 1: Catalog -->
    <CatalogTab
      v-if="currentTab === 'nodes'"
      :selected-model-type="selectedModel?.type"
      @select-model="(model) => (selectedModel = selectedModel?.type === model.type ? null : model)"
      @insert-center="(payload) => emit('add-node', payload)"
    />

    <!-- Tab 2: Scenes -->
    <ScenesTab
      v-else-if="currentTab === 'scenes'"
      :scenes="scenes"
      :current-scene-index="currentSceneIndex"
      :is-live-recording="isLiveRecording"
      @activate-scene="(idx) => emit('activate-scene', idx)"
      @capture-keyframe="() => emit('capture-keyframe')"
      @remove-scene="(idx) => emit('remove-scene', idx)"
      @toggle-live-recording="() => emit('toggle-live-recording')"
      @speak-scene="(scene) => emit('speak-scene', scene)"
    />

    <!-- Tab 3: AI Director -->
    <AiDirectorTab
      v-else-if="currentTab === 'ai'"
      :ai-prompt-text="aiPromptText"
      :canvas-theme="canvasTheme"
      @update:ai-prompt-text="(val) => emit('update:aiPromptText', val)"
      @update:canvas-theme="(val) => emit('update:canvasTheme', val)"
      @generate-graph="() => emit('generate-graph')"
    />

    <!-- Tab 4: Export -->
    <ExportTab
      v-else-if="currentTab === 'export'"
      :presentation-meta="presentationMeta"
      :canvas-theme="canvasTheme"
      :nodes="nodes"
      :edges="edges"
      :scenes="scenes"
      @open-render-modal="emit('open-render-modal')"
      @load-project="(data) => emit('load-project', data)"
      @undo="() => emit('undo')"
      @redo="() => emit('redo')"
    />

    <!-- Secondary Variant Flyout Panel (Slides out right next to dock) -->
    <VariantFlyout
      :model="selectedModel"
      @close="selectedModel = null"
      @insert-center="(payload) => emit('add-node', payload)"
    />
  </aside>
</template>
