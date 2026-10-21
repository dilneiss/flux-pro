<script setup>
defineProps({
  edge: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['delete-edge', 'close']);

const colors = [
  { id: 'amber', name: 'Laranja (Original)', border: 'border-amber-500', bg: 'bg-amber-950/40', text: 'text-amber-300', dot: 'bg-amber-400' },
  { id: 'cyan', name: 'Ciano (Novo)', border: 'border-cyan-400', bg: 'bg-cyan-950/40', text: 'text-cyan-300', dot: 'bg-cyan-400' },
  { id: 'emerald', name: 'Esmeralda (Nativo)', border: 'border-emerald-400', bg: 'bg-emerald-950/40', text: 'text-emerald-300', dot: 'bg-emerald-400' },
  { id: 'purple', name: 'Roxo (Lógica)', border: 'border-purple-400', bg: 'bg-purple-950/40', text: 'text-purple-300', dot: 'bg-purple-400' }
];

const ports = [
  { id: 'top', label: '↑ Topo' },
  { id: 'right', label: '→ Direita' },
  { id: 'bottom', label: '↓ Baixo' },
  { id: 'left', label: '← Esquerda' }
];

const labelPresets = ['fluxo', 'pasta local', 'o Camera Hub', 'copia caminho', 'MCP ▸ REA', 'runtime'];
</script>

<template>
  <div class="space-y-4 font-mono text-xs select-none">
    <!-- Header -->
    <div class="flex items-center justify-between border-b border-slate-800 pb-3">
      <div class="flex items-center gap-2">
        <span class="w-6 h-6 rounded bg-slate-800 flex items-center justify-center text-xs text-amber-400 font-bold shrink-0">
          ⚡
        </span>
        <div>
          <div class="text-xs font-bold text-white">Conexão (Trilha)</div>
          <div class="text-[10px] text-slate-500 font-sans">#{{ edge.id }}</div>
        </div>
      </div>

      <div class="flex items-center gap-1.5">
        <button
          @click="emit('delete-edge')"
          class="p-1.5 rounded hover:bg-rose-950/50 text-slate-400 hover:text-rose-400 transition"
          title="Remover Fio (Del)"
        >
          🗑
        </button>
        <button
          @click="emit('close')"
          class="p-1.5 rounded hover:bg-slate-800 text-slate-500 hover:text-white transition text-sm ml-1"
          title="Fechar Painel"
        >
          ✕
        </button>
      </div>
    </div>

    <!-- 1. TEXTO / RÓTULO NA LINHA -->
    <div class="p-3 bg-[#0e131d] border border-slate-800/80 rounded-lg space-y-2">
      <label class="text-[10px] text-slate-400 uppercase font-bold block">Texto no Meio da Linha</label>
      <input
        v-model="edge.label"
        placeholder="Texto informativo..."
        class="w-full bg-slate-900 border border-slate-700/80 rounded px-2.5 py-1.5 text-xs text-white font-bold focus:outline-none focus:border-cyan-500 font-mono transition"
      />
      <!-- Quick Presets -->
      <div class="flex items-center gap-1 flex-wrap pt-0.5">
        <button
          v-for="p in labelPresets"
          :key="p"
          @click="edge.label = p"
          :class="edge.label === p ? 'border-cyan-400 text-cyan-300' : 'border-slate-800 text-slate-500 hover:text-slate-300'"
          class="px-1.5 py-0.5 rounded bg-slate-900 border text-[9px] transition"
        >
          {{ p }}
        </button>
      </div>
    </div>

    <!-- 2. COR DA LIGAÇÃO ELÉTRICA -->
    <div class="p-3 bg-[#0e131d] border border-slate-800/80 rounded-lg space-y-2">
      <label class="text-[10px] text-slate-400 uppercase font-bold block">Cor da Ligação</label>
      <div class="grid grid-cols-2 gap-1.5">
        <button
          v-for="c in colors"
          :key="c.id"
          @click="edge.color = c.id"
          :class="[
            edge.color === c.id
              ? `${c.bg} ${c.border} ${c.text} ring-1 ${c.border} font-bold shadow-[0_0_10px_rgba(0,0,0,0.4)]`
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
          ]"
          class="p-2 rounded border text-left flex items-center gap-2 transition"
        >
          <span class="w-2 h-2 rounded-full shrink-0" :class="c.dot"></span>
          <span class="text-[10px] truncate">{{ c.name }}</span>
        </button>
      </div>
    </div>

    <!-- 3. PORTAS DIRECIONAIS -->
    <div class="p-3 bg-[#0e131d] border border-slate-800/80 rounded-lg space-y-2.5">
      <div class="grid grid-cols-2 gap-2">
        <div>
          <label class="text-[10px] text-slate-400 uppercase font-bold block mb-1">Porta Saída</label>
          <select
            v-model="edge.fromPort"
            class="w-full bg-slate-900 border border-slate-700/80 rounded px-2 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
          >
            <option v-for="p in ports" :key="p.id" :value="p.id">{{ p.label }}</option>
          </select>
        </div>

        <div>
          <label class="text-[10px] text-slate-400 uppercase font-bold block mb-1">Porta Entrada</label>
          <select
            v-model="edge.toPort"
            class="w-full bg-slate-900 border border-slate-700/80 rounded px-2 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
          >
            <option v-for="p in ports" :key="p.id" :value="p.id">{{ p.label }}</option>
          </select>
        </div>
      </div>
    </div>

    <!-- 4. PULSO ELÉTRICO ANIMADO -->
    <div class="p-3 bg-[#0e131d] border border-slate-800/80 rounded-lg flex items-center justify-between">
      <div>
        <div class="text-xs font-bold text-white">Pulso Elétrico 60fps</div>
        <div class="text-[10px] text-slate-500 font-sans">Animação contínua da corrente</div>
      </div>

      <button
        @click="edge.animated = !edge.animated"
        :class="
          edge.animated
            ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_10px_#06b6d4]'
            : 'bg-slate-800 text-slate-400'
        "
        class="px-3 py-1 rounded text-[10px] font-bold transition font-mono"
      >
        {{ edge.animated ? 'ATIVO' : 'DESLIGADO' }}
      </button>
    </div>
  </div>
</template>
