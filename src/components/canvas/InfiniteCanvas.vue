<script setup>
import { ref } from 'vue';
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
  'upload-media'
]);

const canvasContainerRef = ref(null);

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
  emit('end-pan');
};
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
  >
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
        @select="(n) => emit('node-select', n)"
        @start-wire="({ node: n, port }) => emit('start-wire', { node: n, port })"
        @complete-wire="({ node: n, port }) => emit('complete-wire', { node: n, port })"
        @drop-file="(payload) => emit('drop-file', payload)"
        @upload-media="(payload) => emit('upload-media', payload)"
      />
    </div>
  </div>
</template>
