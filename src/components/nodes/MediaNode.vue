<script setup>
const props = defineProps({
  node: {
    type: Object,
    required: true
  },
  isSelected: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['upload']);

const onFileInput = (e) => {
  const file = e.target.files?.[0];
  if (file) {
    emit('upload', { file, node: props.node });
  }
};
</script>

<template>
  <div class="overflow-hidden rounded">
    <div class="relative bg-black aspect-video flex items-center justify-center overflow-hidden group/img">
      <img
        v-if="node.mediaUrl"
        :src="node.mediaUrl"
        alt="Preview"
        draggable="false"
        class="w-full h-full object-cover transition-transform duration-300 group-hover/img:scale-105 pointer-events-none"
      />
      <div v-else class="text-slate-500 text-xs flex flex-col items-center p-4 text-center">
        <span class="text-2xl mb-1">📋</span>
        <span>Selecione este card e aperte <b class="text-cyan-300">Ctrl+V</b> para colar uma imagem aqui dentro!</span>
      </div>

      <!-- Quick hint badge when selected -->
      <div
        v-if="isSelected"
        class="absolute top-2 right-2 bg-cyan-500 text-slate-950 font-bold px-2 py-0.5 rounded text-[10px] shadow"
      >
        Pronto para Ctrl+V
      </div>

      <div
        v-if="node.badge"
        class="absolute bottom-2 left-2 bg-black/85 border border-slate-700 px-2 py-0.5 rounded text-[10px] text-emerald-400 font-mono"
      >
        {{ node.badge }}
      </div>
    </div>

    <div class="p-2.5 bg-[#121720] flex items-center justify-between border-t border-slate-800">
      <div>
        <div class="text-xs font-bold text-white">{{ node.title }}</div>
        <div class="text-[11px] text-cyan-400 font-mono">▶ {{ node.subtitle }}</div>
      </div>
      <label
        class="cursor-pointer bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded text-[10px] border border-slate-700 transition"
      >
        Upload
        <input type="file" accept="image/*" class="hidden" @change="onFileInput" />
      </label>
    </div>
  </div>
</template>
