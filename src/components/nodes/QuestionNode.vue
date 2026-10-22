<script setup>
import { computed } from 'vue';

const props = defineProps({
  node: {
    type: Object,
    required: true
  }
});

const branches = computed(() => {
  const raw = props.node.content || '';
  if (!raw.trim()) {
    return [
      { label: 'Sim', desc: 'Caminho Primário', active: true, color: 'emerald' },
      { label: 'Não', desc: 'Caminho Alternativo', active: false, color: 'rose' }
    ];
  }

  return raw.split('\n').filter(Boolean).map((line, idx) => {
    const isHighlighted = line.trim().startsWith('*');
    const cleanLine = line.replace(/^\*/, '').trim();
    let [label, desc] = cleanLine.includes('➔')
      ? cleanLine.split('➔').map(s => s.trim())
      : cleanLine.includes('->')
      ? cleanLine.split('->').map(s => s.trim())
      : [cleanLine, 'Caminho ' + (idx + 1)];

    const colorMap = ['emerald', 'rose', 'amber', 'cyan', 'purple'];
    const color = colorMap[idx % colorMap.length];

    return {
      label,
      desc: desc || '',
      active: isHighlighted,
      color
    };
  });
});
</script>

<template>
  <div class="overflow-hidden rounded-xl border border-fuchsia-500/40 bg-[#120d1c] shadow-[0_0_25px_rgba(217,70,239,0.15)] font-mono">
    <!-- Top Header -->
    <div class="bg-gradient-to-r from-fuchsia-950/80 via-purple-950/70 to-[#120d1c] px-3.5 py-2 border-b border-fuchsia-800/40 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <span class="w-5 h-5 rounded bg-fuchsia-500/20 border border-fuchsia-400/60 flex items-center justify-center text-xs text-fuchsia-300 font-bold shadow-[0_0_8px_rgba(217,70,239,0.3)]">
          🔀
        </span>
        <div>
          <span class="text-[9px] uppercase tracking-wider text-fuchsia-400/90 font-bold block leading-none">
            {{ node.subtitle || 'PERGUNTA / ROTEADOR' }}
          </span>
        </div>
      </div>
      <span class="text-[10px] px-2 py-0.5 rounded bg-fuchsia-950 border border-fuchsia-700/60 text-fuchsia-300 font-bold">
        {{ node.badge || 'Decisão' }}
      </span>
    </div>

    <!-- Question Title -->
    <div class="p-3 bg-[#0d0914] border-b border-slate-800/80">
      <div class="text-sm font-bold text-white tracking-tight flex items-start gap-1.5 leading-snug">
        <span class="text-fuchsia-400">❓</span>
        <span>{{ node.title }}</span>
      </div>
    </div>

    <!-- Multi-Branch Paths List -->
    <div class="p-2.5 bg-[#0f0b17] space-y-2">
      <div class="text-[9px] uppercase text-slate-500 font-bold flex items-center justify-between px-1">
        <span>Caminhos & Condições:</span>
        <span class="text-fuchsia-400/80">{{ branches.length }} saídas</span>
      </div>

      <div class="space-y-1.5">
        <div
          v-for="(b, i) in branches"
          :key="i"
          :class="[
            'p-2 rounded-lg border transition-all flex items-center justify-between text-xs',
            b.active
              ? 'bg-fuchsia-950/40 border-fuchsia-400/80 shadow-[0_0_12px_rgba(217,70,239,0.2)] text-white'
              : 'bg-slate-900/80 border-slate-800/90 hover:border-slate-700 text-slate-300'
          ]"
        >
          <!-- Left Label with Colored Indicator -->
          <div class="flex items-center gap-2 truncate pr-2">
            <span
              class="w-2 h-2 rounded-full shrink-0"
              :class="
                b.color === 'emerald'
                  ? 'bg-emerald-400 shadow-[0_0_6px_#10b981]'
                  : b.color === 'rose'
                  ? 'bg-rose-400 shadow-[0_0_6px_#f43f5e]'
                  : b.color === 'amber'
                  ? 'bg-amber-400 shadow-[0_0_6px_#f59e0b]'
                  : b.color === 'cyan'
                  ? 'bg-cyan-400 shadow-[0_0_6px_#06b6d4]'
                  : 'bg-purple-400 shadow-[0_0_6px_#a855f7]'
              "
            ></span>
            <span class="font-bold text-white text-[11px] truncate">{{ b.label }}</span>
          </div>

          <!-- Arrow and Destination Path Note -->
          <div class="flex items-center gap-1.5 shrink-0 text-[10px]">
            <span class="text-fuchsia-400">➔</span>
            <span class="text-slate-400 font-sans truncate max-w-[140px]">{{ b.desc }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
