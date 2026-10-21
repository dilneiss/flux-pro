<script setup>
import { computed } from 'vue';
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
  'select',
  'start-wire',
  'complete-wire',
  'drop-file',
  'upload-media'
]);

const onDropFile = (e) => {
  const file = e.dataTransfer?.files?.[0];
  if (file && file.type.startsWith('image/')) {
    emit('drop-file', { file, node: props.node });
  }
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
        : 'border border-slate-700/80 shadow-2xl hover:border-slate-500/80'
    ]"
    @mousedown.stop="emit('drag-start', $event, node)"
    @mouseup.stop="emit('complete-wire', { node, port: 'left' })"
    @dragover.prevent
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
