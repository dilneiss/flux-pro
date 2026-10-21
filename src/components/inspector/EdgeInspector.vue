<script setup>
defineProps({
  edge: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['delete-edge']);
</script>

<template>
  <div class="space-y-3 font-sans text-xs">
    <!-- Header -->
    <div class="flex items-center justify-between border-b border-slate-800 pb-2">
      <span class="text-xs font-bold uppercase text-amber-400 font-mono">Editar Conexão (Trilha)</span>
      <button
        @click="emit('delete-edge')"
        class="text-xs text-rose-400 hover:text-rose-300 font-mono"
      >
        🗑 Remover Fio
      </button>
    </div>

    <!-- Label -->
    <div>
      <label class="text-[10px] text-slate-400 block mb-1 font-mono">Texto no Meio da Linha</label>
      <input
        v-model="edge.label"
        placeholder="ex: ligação, pasta local, API..."
        class="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
      />
    </div>

    <!-- Color selector -->
    <div>
      <label class="text-[10px] text-slate-400 block mb-1 font-mono">Cor da Ligação</label>
      <div class="grid grid-cols-2 gap-2 text-xs font-mono">
        <button
          @click="edge.color = 'amber'"
          :class="edge.color === 'amber' ? 'ring-2 ring-amber-400 font-bold' : 'opacity-80'"
          class="py-1.5 bg-amber-950 text-amber-300 rounded border border-amber-800 transition"
        >
          Laranja (Original)
        </button>

        <button
          @click="edge.color = 'cyan'"
          :class="edge.color === 'cyan' ? 'ring-2 ring-cyan-400 font-bold' : 'opacity-80'"
          class="py-1.5 bg-cyan-950 text-cyan-300 rounded border border-cyan-800 transition"
        >
          Ciano (Novo)
        </button>

        <button
          @click="edge.color = 'emerald'"
          :class="edge.color === 'emerald' ? 'ring-2 ring-emerald-400 font-bold' : 'opacity-80'"
          class="py-1.5 bg-emerald-950 text-emerald-300 rounded border border-emerald-800 transition"
        >
          Esmeralda (Nativo)
        </button>

        <button
          @click="edge.color = 'purple'"
          :class="edge.color === 'purple' ? 'ring-2 ring-purple-400 font-bold' : 'opacity-80'"
          class="py-1.5 bg-purple-950 text-purple-300 rounded border border-purple-800 transition"
        >
          Roxo (Lógica)
        </button>
      </div>
    </div>

    <!-- Ports -->
    <div class="grid grid-cols-2 gap-2 font-mono">
      <div>
        <label class="text-[10px] text-slate-400 block mb-1">Porta Saída</label>
        <select
          v-model="edge.fromPort"
          class="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
        >
          <option value="top">Topo</option>
          <option value="right">Direita</option>
          <option value="bottom">Baixo</option>
          <option value="left">Esquerda</option>
        </select>
      </div>

      <div>
        <label class="text-[10px] text-slate-400 block mb-1">Porta Entrada</label>
        <select
          v-model="edge.toPort"
          class="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
        >
          <option value="top">Topo</option>
          <option value="right">Direita</option>
          <option value="bottom">Baixo</option>
          <option value="left">Esquerda</option>
        </select>
      </div>
    </div>

    <!-- Animated Pulse Toggle -->
    <div class="flex items-center justify-between pt-2 border-t border-slate-800">
      <span class="text-[11px] text-slate-300 font-mono">Pulso Elétrico Animado</span>
      <button
        @click="edge.animated = !edge.animated"
        :class="edge.animated ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'"
        class="px-2 py-0.5 rounded text-[10px] font-mono transition"
      >
        {{ edge.animated ? 'ATIVO' : 'DESLIGADO' }}
      </button>
    </div>
  </div>
</template>
