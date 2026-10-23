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
      'port-handle-hitbox absolute z-50 flex items-center justify-center cursor-crosshair group/port select-none',
      position === 'top' ? '-top-3 left-1/2 -translate-x-1/2 w-8 h-6' : '',
      position === 'right' ? 'top-1/2 -right-3 -translate-y-1/2 w-6 h-8' : '',
      position === 'bottom' ? '-bottom-3 left-1/2 -translate-x-1/2 w-8 h-6' : '',
      position === 'left' ? 'top-1/2 -left-3 -translate-y-1/2 w-6 h-8' : ''
    ]"
    :title="`Arraste para conectar pela porta ${position}`"
    @mousedown.stop="emit('start-wire', position)"
    @mouseup.stop="emit('complete-wire', position)"
  >
    <!-- Visual Magnetic Port LED -->
    <div
      :class="[
        'w-3 h-3 rounded-full bg-[#0f172a] border-2 border-cyan-400 transition-all duration-150',
        isActive
          ? 'ring-2 ring-cyan-300 shadow-[0_0_12px_#06b6d4] scale-125 bg-cyan-400 border-white'
          : 'opacity-40 group-hover/port:opacity-100 group-hover/port:scale-125 group-hover/port:bg-cyan-400 group-hover/port:border-white group-hover/port:shadow-[0_0_12px_#06b6d4]'
      ]"
    />
  </div>
</template>
