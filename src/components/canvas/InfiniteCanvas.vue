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

const canvasContainerRef = ref(null);
const isCanvasDragOver = ref(false);

const onCanvasDragOver = (e) => {
  if (e.dataTransfer?.types?.includes('application/json')) {
    e.dataTransfer.dropEffect = 'copy';
    isCanvasDragOver.value = true;
  }
};

const onCanvasDragLeave = () => {
  isCanvasDragOver.value = false;
};

const onCanvasDrop = (e) => {
  isCanvasDragOver.value = false;
  const raw = e.dataTransfer?.getData('application/json');
  if (!raw) return;

  try {
    const data = JSON.parse(raw);
    if (data.type) {
      const rect = canvasContainerRef.value?.getBoundingClientRect();
      const rx = rect ? rect.left : 0;
      const ry = rect ? rect.top : 0;
      const worldX = Math.round(((e.clientX - rx - props.camera.x) / props.camera.zoom) / 24) * 24;
      const worldY = Math.round(((e.clientY - ry - props.camera.y) / props.camera.zoom) / 24) * 24;

      emit('drop-node', {
        type: data.type,
        variant: data.variant,
        coords: { x: worldX, y: worldY }
      });
    }
  } catch {
    // ignore non-json drops
  }
};

const onMouseDown = (e) => {
  if (e.target.closest('.node-card')) return;
  emit('clear-selection');
  emit('start-pan', e);
};

const onMouseMove = (e) => {
  const rect = canvasContainerRef.value?.getBoundingClientRect();
  if (!rect) return;

  const worldX = (e.clientX - rect.left - props.camera.x) / props.camera.zoom;
  const worldY = (e.clientY - rect.top - props.camera.y) / props.camera.zoom;

  if (props.activeWire) {
    emit('update-wire', { x: worldX, y: worldY });
    return;
  }

  if (props.draggingNode) {
    emit('pan', e);
  } else if (props.isDraggingCanvas) {
    emit('pan', e);
  }
};

const onMouseUp = () => {
  if (props.draggingNode || props.isDraggingCanvas || props.activeWire) {
    emit('end-pan');
  }
};

const onWindowMouseMove = (e) => {
  if (props.draggingNode || props.isDraggingCanvas || props.activeWire) {
    onMouseMove(e);
  }
};

onMounted(() => {
  window.addEventListener('mousemove', onWindowMouseMove);
  window.addEventListener('mouseup', onMouseUp);
});

onUnmounted(() => {
  window.removeEventListener('mousemove', onWindowMouseMove);
  window.removeEventListener('mouseup', onMouseUp);
});
</script>

<template>
  <div
    ref="canvasContainerRef"
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
        <span class="text-lg">📍</span> Solte aqui para posicionar o bloco neste ponto
      </span>
    </div>
    <!-- World Transform Container -->
    <div
      :class="{
        'camera-smooth': !isDraggingCanvas && !draggingNode && !activeWire
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
        @drag-start="(e, n) => emit('node-drag-start', e, n)"
        :is-spotlight-active="isSpotlightActive"
        :active-node-ids="activeNodeIds"
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
