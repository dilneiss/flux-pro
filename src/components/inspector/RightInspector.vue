<script setup>
import NodeInspector from './NodeInspector.vue';
import EdgeInspector from './EdgeInspector.vue';

defineProps({
  selectedNode: {
    type: Object,
    default: null
  },
  selectedEdge: {
    type: Object,
    default: null
  }
});

const emit = defineEmits([
  'delete-node',
  'duplicate-node',
  'focus-node',
  'delete-edge',
  'close'
]);
</script>

<template>
  <aside
    class="w-80 bg-[#0c0f15] border-l border-slate-800/90 p-4 flex flex-col gap-3 overflow-y-auto z-30 shadow-2xl shrink-0 font-mono select-none"
  >
    <!-- Close button for mobile or compact view -->
    <div class="flex items-center justify-end">
      <button
        @click="emit('close')"
        class="text-xs text-slate-500 hover:text-slate-300 font-mono"
        title="Fechar Painel"
      >
        ✕ Fechar
      </button>
    </div>

    <!-- Node Inspector -->
    <NodeInspector
      v-if="selectedNode"
      :node="selectedNode"
      @delete-node="emit('delete-node')"
      @duplicate-node="emit('duplicate-node')"
      @focus-node="(node) => emit('focus-node', node)"
    />

    <!-- Edge Inspector -->
    <EdgeInspector
      v-else-if="selectedEdge"
      :edge="selectedEdge"
      @delete-edge="emit('delete-edge')"
    />
  </aside>
</template>
