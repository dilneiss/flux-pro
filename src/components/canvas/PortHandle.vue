<script setup>
defineProps({
  position: {
    type: String,
    required: true,
    validator: (v) => ['top', 'right', 'bottom', 'left'].includes(v)
  },
  isActive: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['start-wire', 'complete-wire']);
</script>

<template>
  <div
    :class="[
      'port-handle transition-all',
      isActive ? 'active-port ring-2 ring-cyan-300' : '',
      position === 'top' ? '-top-1.5 left-1/2 -translate-x-1/2' : '',
      position === 'right' ? 'top-1/2 -right-1.5 -translate-y-1/2' : '',
      position === 'bottom' ? '-bottom-1.5 left-1/2 -translate-x-1/2' : '',
      position === 'left' ? 'top-1/2 -left-1.5 -translate-y-1/2' : ''
    ]"
    :title="`Arraste para conectar pela porta ${position}`"
    @mousedown.stop="emit('start-wire', position)"
    @mouseup.stop="emit('complete-wire', position)"
  />
</template>
