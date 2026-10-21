<script setup>
import { ref } from 'vue';
import PortHandle from './PortHandle.vue';
import NodeRenderer from '../nodes/NodeRenderer.vue';

const props = defineProps({
  node: {
    type: Object,
    required: true
  },
  isSelected: {
    type: Boolean,
    default: false
  },
  isPresenting: {
    type: Boolean,
    default: false
  },
  activeWireSourceId: {
    type: String,
    default: null
  }
});

const emit = defineEmits([
  'drag-start',
  'drag-end',
  'select',
  'start-wire',
  'complete-wire',
  'drop-file',
  'upload-media'
]);

const isDragOver = ref(false);

const onDropFile = (e) => {
  isDragOver.value = false;
  const file = e.dataTransfer?.files?.[0];
  if (file && file.type.startsWith('image/')) {
    emit('drop-file', { file, node: props.node });
  }
};
const onMouseDown = (e) => {
  if (e.target.closest('button, input, select, textarea, a, .port-handle')) return;
  emit('drag-start', e, props.node);
};

const onMouseUp = () => {
  if (props.activeWireSourceId && props.activeWireSourceId !== props.node.id) {
    emit('complete-wire', { node: props.node, port: 'left' });
  }
  emit('drag-end');
};
</script>

<template>
  <div
    :id="`node-${node.id}`"
    :style="{
      left: `${node.x}px`,
      top: `${node.y}px`,
      width: `${node.w || 384}px`
    }"
    :class="[
      'node-card absolute z-10 rounded bg-[#10141c]/95 transition-shadow duration-150 select-none cursor-move',
      node.type === 'chip' ? 'ic-pins' : '',
      isSelected
        ? 'ring-2 ring-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.3)]'
        : isDragOver
        ? 'ring-2 ring-emerald-400 bg-emerald-950/40 border-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.3)]'
        : 'border border-slate-700/80 shadow-2xl hover:border-slate-500/80'
    ]"
    @mousedown="onMouseDown"
    @mouseup="onMouseUp"
    @dragenter.prevent="isDragOver = true"
    @dragleave.prevent="isDragOver = false"
    @dragover.prevent="isDragOver = true"
    @drop.prevent="onDropFile"
  >
    <!-- 4 Magnetic Port Handles (shown when not in presentation mode) -->
    <template v-if="!isPresenting">
      <PortHandle
        position="top"
        :is-active="activeWireSourceId === node.id"
        @start-wire="(p) => emit('start-wire', { node, port: p })"
        @complete-wire="(p) => emit('complete-wire', { node, port: p })"
      />
      <PortHandle
        position="right"
        :is-active="activeWireSourceId === node.id"
        @start-wire="(p) => emit('start-wire', { node, port: p })"
        @complete-wire="(p) => emit('complete-wire', { node, port: p })"
      />
      <PortHandle
        position="bottom"
        :is-active="activeWireSourceId === node.id"
        @start-wire="(p) => emit('start-wire', { node, port: p })"
        @complete-wire="(p) => emit('complete-wire', { node, port: p })"
      />
      <PortHandle
        position="left"
        :is-active="activeWireSourceId === node.id"
        @start-wire="(p) => emit('start-wire', { node, port: p })"
        @complete-wire="(p) => emit('complete-wire', { node, port: p })"
      />
    </template>

    <!-- Dropzone indicator when dragging an image over this card -->
    <div
      v-if="isDragOver"
      class="absolute inset-0 z-30 bg-emerald-950/80 border-2 border-dashed border-emerald-400 rounded flex flex-col items-center justify-center text-emerald-300 font-mono text-xs pointer-events-none animate-pulse"
    >
      <span class="text-xl mb-1">📥</span>
      <span>Solte a imagem para injetar neste bloco!</span>
    </div>

    <!-- Top Dashed Group Label (e.g. — no Finder —) -->
    <div
      v-if="node.groupLabel"
      class="absolute -top-5 left-0 text-[11px] text-slate-400 font-mono tracking-wide pointer-events-none whitespace-nowrap"
    >
      — {{ node.groupLabel }} —
    </div>

    <!-- Specialized Dynamic Node Content -->
    <NodeRenderer
      :node="node"
      :is-selected="isSelected"
      @upload="(payload) => emit('upload-media', payload)"
    />
  </div>
</template>
