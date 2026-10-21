<script setup>
defineProps({
  type: {
    type: String,
    required: true
  },
  variant: {
    type: String,
    default: 'default'
  }
});
</script>

<template>
  <div class="w-full h-16 rounded bg-[#0b0e14] border border-slate-800 overflow-hidden relative select-none pointer-events-none text-[9px] font-mono shadow-inner flex flex-col justify-between p-1.5 transition-all group-hover:border-slate-700">
    <!-- 01. CHIP PCB -->
    <template v-if="type === 'chip'">
      <div
        class="h-full w-full rounded p-1.5 flex flex-col justify-between border-l-2 relative bg-[#10141c]"
        :class="variant === 'emerald' ? 'border-emerald-400 text-emerald-300' : variant === 'cyan' ? 'border-cyan-400 text-cyan-300' : 'border-amber-400 text-amber-300'"
      >
        <!-- IC Metallic Pins -->
        <div class="absolute -left-1 top-1 bottom-1 w-0.5 bg-gradient-to-b from-slate-500 via-slate-300 to-slate-500"></div>
        <div class="absolute -right-1 top-1 bottom-1 w-0.5 bg-gradient-to-b from-slate-500 via-slate-300 to-slate-500"></div>

        <div class="flex items-center justify-between text-[7px] text-slate-500">
          <span>PATH / BIN</span>
          <span class="px-1 rounded bg-slate-900 border border-slate-800 text-cyan-400">{{ variant || 'alvo' }}</span>
        </div>
        <div class="font-bold truncate text-[10px]">/usr/bin/target.app</div>
      </div>
    </template>

    <!-- 02. TERMINAL IA -->
    <template v-else-if="type === 'terminal'">
      <div class="h-full w-full rounded flex flex-col justify-between bg-[#0a0d13] border border-slate-800/80 p-1">
        <div class="flex items-center justify-between text-[7px] pb-1 border-b border-slate-800">
          <div class="flex items-center gap-1">
            <span class="text-slate-400">agente</span>
            <span class="bg-amber-950/80 text-amber-300 border border-amber-800/60 px-1 rounded">Claude Code</span>
          </div>
          <span class="text-emerald-400">● ativo</span>
        </div>
        <div class="text-slate-300 text-[8px] truncate leading-tight">> Analise o executável e gere o patch...</div>
      </div>
    </template>

    <!-- 03. FINDER -->
    <template v-else-if="type === 'finder'">
      <div class="h-full w-full rounded flex flex-col justify-between bg-[#0c1017] border border-slate-800 p-1">
        <div class="flex items-center gap-1 pb-1 border-b border-slate-800 text-[7px] text-slate-400">
          <span class="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
          <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span class="ml-1 text-slate-300 font-semibold truncate">📁 Applications</span>
        </div>
        <div class="bg-blue-600/30 text-white px-1.5 py-0.5 rounded text-[8px] flex items-center justify-between">
          <span class="truncate">🟣 Elgato Camera Hub</span>
          <span class="text-[7px] opacity-70">App</span>
        </div>
      </div>
    </template>

    <!-- 04. MEDIA / VÍDEO -->
    <template v-else-if="type === 'media'">
      <div class="h-full w-full rounded bg-black/90 border border-slate-800 flex items-center justify-center relative overflow-hidden group-hover:border-emerald-500/50">
        <div class="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-300 text-[9px] shadow-[0_0_8px_rgba(16,185,129,0.3)]">
          ▶
        </div>
        <div class="absolute bottom-1 left-1 bg-black/80 text-[7px] text-emerald-400 px-1 rounded border border-slate-800">
          60 fps nativo
        </div>
        <div class="absolute top-1 right-1 text-[7px] text-slate-400">
          16:9
        </div>
      </div>
    </template>

    <!-- 05. CÓDIGO -->
    <template v-else-if="type === 'code'">
      <div class="h-full w-full rounded bg-[#090c10] border border-slate-800 p-1 flex flex-col justify-between">
        <div class="flex items-center justify-between text-[7px] pb-1 border-b border-slate-800">
          <span class="text-purple-300 font-bold">driver.rs</span>
          <span class="text-emerald-400 bg-emerald-950/60 px-1 rounded">diff</span>
        </div>
        <div class="text-[8px] font-mono leading-tight space-y-0.5" :class="variant === 'asm' ? 'text-amber-300' : 'text-emerald-300'">
          <div>+ fn native_loop() {</div>
          <div class="text-cyan-300 pl-2">prompter.scroll(60);</div>
        </div>
      </div>
    </template>

    <!-- 06. BANCO DE DADOS -->
    <template v-else-if="type === 'database'">
      <div class="h-full w-full rounded bg-[#0c0f17] border border-indigo-900/60 p-1 flex flex-col justify-between">
        <div class="flex items-center justify-between text-[7px] text-indigo-300 pb-1 border-b border-indigo-900/40">
          <span>🗄 PostgreSQL</span>
          <span class="text-indigo-400">schema</span>
        </div>
        <div class="flex items-center justify-between bg-slate-900/80 px-1 py-0.5 rounded text-[8px]">
          <span class="text-amber-300">🔑 id</span>
          <span class="text-indigo-400">UUID</span>
        </div>
      </div>
    </template>

    <!-- 07. API / WEBHOOK -->
    <template v-else-if="type === 'api'">
      <div class="h-full w-full rounded bg-[#0b0e13] border border-slate-800 p-1 flex flex-col justify-between">
        <div class="flex items-center gap-1 pb-1 border-b border-slate-800">
          <span class="bg-amber-500 text-slate-950 font-bold px-1 rounded text-[7px]">POST</span>
          <span class="text-white text-[8px] truncate">/v1/render</span>
        </div>
        <div class="text-amber-200 text-[8px] truncate">{ "fps": 60, "status": 200 }</div>
      </div>
    </template>

    <!-- 08. MOBILE -->
    <template v-else-if="type === 'mobile'">
      <div class="h-full w-full rounded-lg bg-[#0b0e14] border border-slate-700 p-1 flex flex-col justify-between">
        <div class="flex items-center justify-between text-[7px] text-emerald-400">
          <span>📱 iPhone</span>
          <span class="w-4 h-1 bg-black rounded-full"></span>
          <span>9:41</span>
        </div>
        <div class="bg-emerald-900/40 border border-emerald-700/60 text-emerald-200 text-[8px] px-1 py-0.5 rounded ml-2 truncate">
          Olá! Roteiro pronto?
        </div>
      </div>
    </template>

    <!-- 09. BROWSER -->
    <template v-else-if="type === 'browser'">
      <div class="h-full w-full rounded bg-[#0c1017] border border-slate-800 p-1 flex flex-col justify-between">
        <div class="flex items-center gap-1 bg-black/60 px-1 py-0.5 rounded text-[7px] text-cyan-300 truncate">
          <span>🔒</span>
          <span class="truncate">circuitflow.io/studio</span>
        </div>
        <div class="text-white text-[8px] font-bold truncate">Painel Multi-Tenant</div>
      </div>
    </template>

    <!-- 10. MÉTRICA -->
    <template v-else-if="type === 'metric'">
      <div class="h-full w-full rounded bg-gradient-to-br from-[#111823] to-[#0b0e14] border border-slate-800 p-1.5 flex flex-col justify-between">
        <div class="flex items-center justify-between text-[7px] text-slate-400">
          <span>FPS NATIVO</span>
          <span class="text-emerald-400 font-bold">+142%</span>
        </div>
        <div class="text-sm font-bold text-white leading-none">60.0 FPS</div>
        <div class="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
          <div class="bg-cyan-400 h-full w-4/5 shadow-[0_0_6px_#06b6d4]"></div>
        </div>
      </div>
    </template>

    <!-- 11. FILA / QUEUE -->
    <template v-else-if="type === 'queue'">
      <div class="h-full w-full rounded bg-[#12161f] border border-slate-800 p-1 flex flex-col justify-between">
        <div class="flex items-center justify-between text-[7px] text-amber-400 font-bold">
          <span>⚡ RabbitMQ</span>
          <span class="text-slate-400">4 workers</span>
        </div>
        <div class="grid grid-cols-3 gap-1">
          <span class="bg-amber-500/20 text-amber-300 text-[7px] text-center rounded py-0.5">#1</span>
          <span class="bg-amber-500/20 text-amber-300 text-[7px] text-center rounded py-0.5">#2</span>
          <span class="bg-amber-500/20 text-amber-300 text-[7px] text-center rounded py-0.5">#3</span>
        </div>
      </div>
    </template>

    <!-- 12. HARDWARE -->
    <template v-else-if="type === 'hardware'">
      <div class="h-full w-full rounded bg-[#10141d] border border-slate-800 p-1 flex flex-col justify-between">
        <div class="flex items-center justify-between text-[7px] text-cyan-300">
          <span>🎛 Stream Deck</span>
          <span class="text-slate-400">USB</span>
        </div>
        <div class="grid grid-cols-4 gap-0.5">
          <div class="bg-cyan-500/30 border border-cyan-400 h-3 rounded flex items-center justify-center text-[7px] text-white">●</div>
          <div class="bg-slate-900 border border-slate-700 h-3 rounded"></div>
          <div class="bg-slate-900 border border-slate-700 h-3 rounded"></div>
          <div class="bg-slate-900 border border-slate-700 h-3 rounded"></div>
        </div>
      </div>
    </template>

    <!-- 13. DECISÃO -->
    <template v-else-if="type === 'decision'">
      <div class="h-full w-full rounded bg-[#14121d] border-l-2 border-purple-500 p-1.5 flex flex-col justify-between">
        <div class="flex items-center justify-between text-[7px] text-purple-300 font-bold">
          <span>◇ ROTEADOR</span>
          <span class="bg-purple-950 px-1 rounded">guard</span>
        </div>
        <div class="text-[8px] text-white font-bold truncate">Se binário ▸ Recompilar</div>
      </div>
    </template>

    <!-- 14. COMPARATIVO -->
    <template v-else-if="type === 'compare'">
      <div class="h-full w-full rounded bg-[#0c0f15] border border-slate-800 grid grid-cols-2 divide-x divide-slate-800 text-[7px] overflow-hidden">
        <div class="p-1 text-slate-400 truncate">
          <div class="text-amber-400 font-bold">❌ 20 min</div>
          <span>Lento</span>
        </div>
        <div class="p-1 bg-cyan-950/20 text-slate-200 truncate">
          <div class="text-cyan-400 font-bold">✔ 60 fps</div>
          <span>Nativo</span>
        </div>
      </div>
    </template>

    <!-- 15. CALLOUT -->
    <template v-else>
      <div class="h-full w-full rounded bg-amber-950/20 border border-amber-500/50 p-1.5 flex flex-col justify-between">
        <div class="flex items-center justify-between text-[7px] text-amber-300 font-bold">
          <span>⚠ Evidência</span>
          <span class="text-amber-400">audit</span>
        </div>
        <div class="text-[8px] text-slate-300 truncate">Código auditado com sucesso</div>
      </div>
    </template>
  </div>
</template>
