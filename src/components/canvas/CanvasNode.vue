<script setup>
import { ref, computed } from 'vue';
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
  },
  isSpotlightActive: {
    type: Boolean,
    default: false
  },
  activeNodeIds: {
    type: Array,
    default: null
  },
  camera: {
    type: Object,
    default: () => ({ x: 0, y: 0, zoom: 1 })
  }
});

const emit = defineEmits([
  'drag-start',
  'drag-end',
  'select',
  'start-wire',
  'complete-wire',
  'drop-file',
  'upload-media',
  'resize-end'
]);

const isDragOver = ref(false);
const isResizing = ref(false);

const onDropFile = (e) => {
  isDragOver.value = false;
  const file = e.dataTransfer?.files?.[0];
  if (file && file.type.startsWith('image/')) {
    emit('drop-file', { file, node: props.node });
  }
};

const onMouseDown = (e) => {
  if (e.target.closest('button, input, select, textarea, a, .port-handle, .resize-handle')) return;
  emit('drag-start', e, props.node);
};

const onMouseUp = () => {
  if (props.activeWireSourceId && props.activeWireSourceId !== props.node.id) {
    emit('complete-wire', { node: props.node, port: 'left' });
  }
  emit('drag-end');
};

// Interactive Canvas Resize Engine (Right, Left, Bottom, Bottom-Right Corner)
const startResize = (e, direction) => {
  e.stopPropagation();
  e.preventDefault();

  isResizing.value = true;
  const startClientX = e.clientX;
  const startClientY = e.clientY;
  const startWidth = props.node.w || 384;
  const startLeft = props.node.x;

  const el = document.getElementById(`node-${props.node.id}`);
  const startHeight = props.node.customHeight || (el ? el.offsetHeight : 160);
  const zoom = props.camera?.zoom || 1;

  const onResizeMove = (moveEvt) => {
    moveEvt.preventDefault();
    if (moveEvt.buttons === 0) {
      cleanup();
      return;
    }

    // Width (Right handle or bottom-right corner)
    if (direction === 'right' || direction === 'bottom-right') {
      const deltaX = (moveEvt.clientX - startClientX) / zoom;
      const newWidth = Math.max(240, Math.min(1200, Math.round((startWidth + deltaX) / 24) * 24));
      props.node.w = newWidth;
    }
    // Width (Left handle or bottom-left corner)
    else if (direction === 'left' || direction === 'bottom-left') {
      const deltaX = (moveEvt.clientX - startClientX) / zoom;
      const newWidth = Math.max(240, Math.min(1200, Math.round((startWidth - deltaX) / 24) * 24));
      const deltaW = newWidth - startWidth;
      props.node.x = Math.round((startLeft - deltaW) / 24) * 24;
      props.node.w = newWidth;
    }

    // Height (Bottom handle, bottom-right or bottom-left corner)
    if (direction === 'bottom' || direction === 'bottom-right' || direction === 'bottom-left') {
      const deltaY = (moveEvt.clientY - startClientY) / zoom;
      const newHeight = Math.max(88, Math.min(1200, Math.round((startHeight + deltaY) / 24) * 24));
      props.node.customHeight = newHeight;
    }
  };

  const cleanup = () => {
    window.removeEventListener('mousemove', onResizeMove);
    window.removeEventListener('mouseup', cleanup);
    window.removeEventListener('blur', cleanup);
    isResizing.value = false;
    emit('resize-end', props.node);
  };

  window.addEventListener('mousemove', onResizeMove, { passive: false });
  window.addEventListener('mouseup', cleanup);
  window.addEventListener('blur', cleanup);
};

const isDimmed = computed(() => {
  if (!props.isSpotlightActive || !props.activeNodeIds) return false;
  return !props.activeNodeIds.includes(props.node.id) && !props.isSelected;
});

const isFocused = computed(() => {
  if (!props.isSpotlightActive || !props.activeNodeIds) return false;
  return props.activeNodeIds.includes(props.node.id);
});
</script>

<template>
  <div
    :id="`node-${node.id}`"
    :style="{
      left: `${node.x}px`,
      top: `${node.y}px`,
      width: `${node.w || 384}px`,
      minHeight: node.customHeight ? `${node.customHeight}px` : undefined
    }"
    :class="[
      'node-card absolute z-10 rounded bg-[#10141c]/95 select-none cursor-move',
      node.type === 'chip' ? 'ic-pins' : '',
      isSelected
        ? 'ring-2 ring-cyan-400 shadow-[0_0_35px_rgba(6,182,212,0.35)] opacity-100 z-20'
        : isDragOver
        ? 'ring-2 ring-emerald-400 bg-emerald-950/40 border-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.3)] opacity-100'
        : isDimmed
        ? 'opacity-25 saturate-50 brightness-50 transition-all duration-500 border border-slate-800 hover:opacity-100 hover:saturate-100 hover:brightness-100'
        : isFocused
        ? 'opacity-100 ring-2 ring-cyan-400/70 shadow-[0_0_30px_rgba(6,182,212,0.25)] transition-all duration-500 border border-slate-700/80'
        : 'border border-slate-700/80 shadow-2xl hover:border-slate-500/80 transition-all duration-500'
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

    <!-- Interactive Resize Handles (shown when card is selected) -->
    <!-- Interactive Resize Handles (positioned strictly away from the 4 center ports) -->
    <template v-if="isSelected && !isPresenting">
      <!-- Right Handle (Upper section of right border, leaving center port 100% free) -->
      <div
        class="resize-handle absolute top-2 -right-2 w-4 h-7 cursor-ew-resize z-40 group/rhandle flex items-center justify-center select-none"
        title="Arraste para redimensionar largura"
        @mousedown.stop="startResize($event, 'right')"
      >
        <div class="w-1.5 h-5 rounded-full bg-cyan-400 group-hover/rhandle:bg-white group-hover/rhandle:h-6 group-hover/rhandle:shadow-[0_0_10px_#06b6d4] transition-all"></div>
      </div>

      <!-- Left Handle (Upper section of left border, leaving center port 100% free) -->
      <div
        class="resize-handle absolute top-2 -left-2 w-4 h-7 cursor-ew-resize z-40 group/lhandle flex items-center justify-center select-none"
        title="Arraste para redimensionar largura"
        @mousedown.stop="startResize($event, 'left')"
      >
        <div class="w-1.5 h-5 rounded-full bg-cyan-400 group-hover/lhandle:bg-white group-hover/lhandle:h-6 group-hover/lhandle:shadow-[0_0_10px_#06b6d4] transition-all"></div>
      </div>

      <!-- Bottom Handle (Offset to the right, leaving center bottom port 100% free) -->
      <div
        class="resize-handle absolute -bottom-2 right-8 w-8 h-4 cursor-ns-resize z-40 group/bhandle flex items-center justify-center select-none"
        title="Arraste para redimensionar altura"
        @mousedown.stop="startResize($event, 'bottom')"
      >
        <div class="h-1.5 w-6 rounded-full bg-cyan-400 group-hover/bhandle:bg-white group-hover/bhandle:w-8 group-hover/bhandle:shadow-[0_0_10px_#06b6d4] transition-all"></div>
      </div>

      <!-- Bottom-Right Corner Handle (Universal multi-axis resize) -->
      <div
        class="resize-handle absolute -bottom-2 -right-2 w-5 h-5 cursor-nwse-resize z-40 flex items-center justify-center group/crhandle select-none"
        title="Arraste para redimensionar largura e altura"
        @mousedown.stop="startResize($event, 'bottom-right')"
      >
        <div class="w-3.5 h-3.5 rounded bg-cyan-400 border border-slate-950 group-hover/crhandle:scale-125 group-hover/crhandle:bg-white group-hover/crhandle:shadow-[0_0_12px_#06b6d4] transition-all flex items-center justify-center">
          <span class="text-[8px] text-slate-950 font-bold leading-none">⤡</span>
        </div>
      </div>

      <!-- Bottom-Left Corner Handle -->
      <div
        class="resize-handle absolute -bottom-2 -left-2 w-4 h-4 cursor-nesw-resize z-40 flex items-center justify-center group/blhandle select-none"
        title="Arraste para redimensionar"
        @mousedown.stop="startResize($event, 'bottom-left')"
      >
        <div class="w-2.5 h-2.5 rounded-sm bg-cyan-400/80 border border-slate-950 group-hover/blhandle:scale-125 group-hover/blhandle:bg-white transition-all"></div>
      </div>

      <!-- Real-time Dimension Badge during Resize -->
      <div
        v-if="isResizing"
        class="absolute -top-7 right-0 z-50 px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-400 text-[10px] font-mono font-bold shadow-lg pointer-events-none animate-pulse"
      >
        {{ node.w }}px × {{ node.customHeight ? `${node.customHeight}px` : 'auto' }}
      </div>
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
