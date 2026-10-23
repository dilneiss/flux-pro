<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import CanvasWires from './CanvasWires.vue';
import CanvasNode from './CanvasNode.vue';

const props = defineProps({
  camera: {
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
  selectedNode: {
    type: Object,
    default: null
  },
  selectedEdge: {
    type: Object,
    default: null
  },
  activeWire: {
    type: Object,
    default: null
  },
  draggingNode: {
    type: Object,
    default: null
  },
  isDraggingCanvas: {
    type: Boolean,
    default: false
  },
  isPresenting: {
    type: Boolean,
    default: false
  },
  canvasTheme: {
    type: String,
    default: 'theme-pcb'
  },
  getNodeById: {
    type: Function,
    required: true
  },
  isSpotlightActive: {
    type: Boolean,
    default: false
  },
  activeNodeIds: {
    type: Array,
    default: null
  },
  isProgressiveReveal: {
    type: Boolean,
    default: false
  },
  revealedNodeIds: {
    type: Object,
    default: null
  },
  isCrtFilterActive: {
    type: Boolean,
    default: false
  },
  isMicroDriftActive: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits([
  'start-pan',
  'pan',
  'end-pan',
  'wheel',
  'node-drag-start',
  'node-select',
  'edge-select',
  'clear-selection',
  'start-wire',
  'update-wire',
  'complete-wire',
  'cancel-wire',
  'drop-file',
  'drop-node',
  'upload-media'
]);

const isCanvasDragOver = ref(false);

const getViewportRect = () => {
  const el = document.getElementById('infinite-canvas-viewport');
  return el ? el.getBoundingClientRect() : { left: 0, top: 0, width: 1440, height: 900 };
};

const onCanvasDragOver = (e) => {
  if (e.dataTransfer?.types?.includes('application/json')) {
    e.dataTransfer.dropEffect = 'copy';
    isCanvasDragOver.value = true;
  }
};

const onCanvasDragLeave = (e) => {
  // Only unset if leaving canvas container
  if (e.target.id === 'infinite-canvas-viewport') {
    isCanvasDragOver.value = false;
  }
};

const onCanvasDrop = (e) => {
  isCanvasDragOver.value = false;
  const raw = e.dataTransfer?.getData('application/json');
  if (!raw) return;

  try {
    const data = JSON.parse(raw);
    if (data.type) {
      const rect = getViewportRect();
      const worldX = Math.round(((e.clientX - rect.left - props.camera.x) / props.camera.zoom) / 24) * 24;
      const worldY = Math.round(((e.clientY - rect.top - props.camera.y) / props.camera.zoom) / 24) * 24;

      emit('drop-node', {
        type: data.type,
        variant: data.variant,
        coords: { x: worldX, y: worldY }
      });
    }
  } catch {
    // ignore
  }
};

const onMouseDown = (e) => {
  if (e.target.closest('.node-card')) return;
  emit('clear-selection');
  emit('start-pan', e);
};

const onMouseMove = (e) => {
  if (props.activeWire) {
    const rect = getViewportRect();
    const worldX = (e.clientX - rect.left - props.camera.x) / props.camera.zoom;
    const worldY = (e.clientY - rect.top - props.camera.y) / props.camera.zoom;
    emit('update-wire', { x: worldX, y: worldY });
    return;
  }

  if (props.isDraggingCanvas) {
    emit('pan', e);
  }
};

const onMouseUp = () => {
  if (props.isDraggingCanvas || props.activeWire) {
    emit('end-pan');
  }
};

onMounted(() => {
  window.addEventListener('mouseup', onMouseUp);
});

onUnmounted(() => {
  window.removeEventListener('mouseup', onMouseUp);
});
</script>

<template>
  <div
    id="infinite-canvas-viewport"
    :class="[
      'flex-1 relative overflow-hidden select-none',
      isDraggingCanvas ? 'cursor-grabbing' : 'cursor-grab',
      canvasTheme
    ]"
    @wheel.prevent="emit('wheel', $event)"
    @mousedown="onMouseDown"
    @mousemove="onMouseMove"
    @mouseup="onMouseUp"
    @mouseleave="onMouseUp"
    @dragover.prevent="onCanvasDragOver"
    @dragleave="onCanvasDragLeave"
    @drop.prevent="onCanvasDrop"
  >
    <!-- Visual Dropzone Guide when dragging from catalog -->
    <div
      v-if="isCanvasDragOver"
      class="absolute inset-0 z-50 pointer-events-none bg-cyan-950/20 border-2 border-dashed border-cyan-400 flex items-center justify-center font-mono text-cyan-300 text-sm backdrop-blur-[1px]"
    >
      <span class="bg-slate-900/95 px-4 py-2.5 rounded-lg border border-cyan-500 shadow-2xl flex items-center gap-2">
        <span class="text-lg">📍</span> Solte aqui para posicionar o bloco
      </span>
    </div>

    <!-- Broadcast Overlays (CRT Scanlines & Vignette) -->
    <div v-if="isCrtFilterActive" class="absolute inset-0 z-40 crt-overlay pointer-events-none"></div>
    <div v-if="isCrtFilterActive" class="absolute inset-0 z-40 vignette-overlay pointer-events-none"></div>

    <!-- World Transform Container -->
    <div
      :class="{
        'camera-smooth': !isDraggingCanvas && !draggingNode && !activeWire,
        'camera-micro-drift': isMicroDriftActive
      }"
      :style="{
        transform: `translate(${camera.x}px, ${camera.y}px) scale(${camera.zoom})`,
        transformOrigin: '0 0'
      }"
      class="w-[5000px] h-[4000px] relative pointer-events-auto"
    >
      <!-- SVG Cables Layer -->
      <CanvasWires
        :edges="edges"
        :selected-edge="selectedEdge"
        :active-wire="activeWire"
        :get-node-by-id="getNodeById"
        :is-spotlight-active="isSpotlightActive"
        :active-node-ids="activeNodeIds"
        @select-edge="(edge) => emit('edge-select', edge)"
      />

      <!-- Nodes Layer -->
      <CanvasNode
        v-for="node in nodes"
        :key="node.id"
        :node="node"
        :is-selected="selectedNode?.id === node.id"
        :is-presenting="isPresenting"
        :active-wire-source-id="activeWire?.fromId"
        :is-spotlight-active="isSpotlightActive"
        :active-node-ids="activeNodeIds"
        :is-progressive-reveal="isProgressiveReveal"
        :revealed-node-ids="revealedNodeIds"
        :camera="camera"
        @resize-end="() => emit('end-pan')"
        @drag-start="(e, n) => emit('node-drag-start', e, n)"
        @drag-end="() => emit('end-pan')"
        @select="(n) => emit('node-select', n)"
        @start-wire="({ node: n, port }) => emit('start-wire', { node: n, port })"
        @complete-wire="({ node: n, port }) => emit('complete-wire', { node: n, port })"
        @drop-file="(payload) => emit('drop-file', payload)"
        @upload-media="(payload) => emit('upload-media', payload)"
      />
    </div>
  </div>
</template>
