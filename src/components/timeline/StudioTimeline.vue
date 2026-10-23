<template>
  <div
    v-if="isOpen"
    class="border-t border-slate-800/90 bg-[#090c12]/95 backdrop-blur-md flex flex-col shrink-0 font-mono select-none shadow-[0_-10px_30px_rgba(0,0,0,0.8)] z-30 transition-all duration-300"
    style="height: 168px;"
  >
    <!-- Top Control Toolbar -->
    <div class="h-8 px-4 bg-[#0d1118] border-b border-slate-800/80 flex items-center justify-between text-xs text-slate-300">
      <div class="flex items-center gap-3">
        <span class="text-cyan-400 font-bold text-[11px] flex items-center gap-1.5">
          <span>🎞</span> STUDIO TIMELINE (MULTI-TRACK)
        </span>

        <!-- Play / Pause Button -->
        <button
          @click="emit('toggle-play')"
          class="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[10px] font-bold border border-slate-700 flex items-center gap-1 transition"
        >
          <span>{{ isPlaying ? '⏸' : '▶' }}</span>
          <span>{{ isPlaying ? 'Pausar' : 'Play' }}</span>
        </button>

        <!-- Time Readout -->
        <div class="text-[11px] font-bold">
          <span class="text-white">{{ formatTime(currentPlaybackTime) }}</span>
          <span class="text-slate-600"> / </span>
          <span class="text-slate-400">{{ formatTime(totalDuration) }}</span>
        </div>
      </div>

      <div class="flex items-center gap-2 text-[10px] text-slate-400">
        <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-cyan-400"></span> Cenas</span>
        <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-emerald-400"></span> Narração</span>
        <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-amber-400"></span> Eventos</span>
        <button
          @click="emit('toggle-open')"
          class="ml-2 text-slate-500 hover:text-slate-300 font-bold text-sm px-1.5"
          title="Minimizar Timeline"
        >
          ✕
        </button>
      </div>
    </div>

    <!-- Timeline Workspace Area -->
    <div
      ref="timelineAreaRef"
      @click="onTimelineClick"
      class="flex-1 relative overflow-x-auto overflow-y-hidden cursor-pointer bg-[#07090e] p-2 flex flex-col justify-between"
    >
      <!-- Time Ruler with Markers -->
      <div class="h-4 border-b border-slate-800/80 relative text-[9px] text-slate-500 pointer-events-none">
        <div
          v-for="marker in rulerMarkers"
          :key="marker.time"
          :style="{ left: `${marker.percent}%` }"
          class="absolute -top-0.5 -translate-x-1/2 flex flex-col items-center"
        >
          <span>{{ formatTime(marker.time) }}</span>
          <div class="w-px h-1.5 bg-slate-700 mt-0.5"></div>
        </div>
      </div>

      <!-- Playhead Needle (Runs smoothly across the tracks) -->
      <div
        :style="{ left: `${playheadPercent}%` }"
        class="absolute top-0 bottom-0 w-0.5 bg-cyan-400 shadow-[0_0_12px_#06b6d4] z-40 pointer-events-none transition-[left] duration-75"
      >
        <div class="w-2.5 h-2.5 bg-cyan-400 rotate-45 -ml-1 -top-1 absolute shadow"></div>
      </div>

      <!-- Track 1: Câmera & Cenas -->
      <div class="h-8 flex items-center gap-1 my-0.5 relative">
        <div
          v-for="(scene, idx) in scenes"
          :key="idx"
          @click.stop="emit('activate-scene', idx)"
          :style="{ width: `${getSceneWidthPercent(scene)}%` }"
          :class="[
            'h-full rounded px-2 flex items-center justify-between text-[10px] font-bold border transition-all truncate group',
            currentSceneIndex === idx
              ? 'bg-cyan-950/80 border-cyan-400 text-cyan-200 shadow-[0_0_12px_rgba(6,182,212,0.25)] ring-1 ring-cyan-400'
              : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
          ]"
        >
          <div class="flex items-center gap-1.5 truncate">
            <span class="text-cyan-400 font-mono">#{{ String(idx + 1).padStart(2, '0') }}</span>
            <span class="truncate">{{ scene.title || scene.name }}</span>
          </div>
          <span class="text-[9px] text-slate-500 font-mono shrink-0 ml-1">
            {{ scene.duration || 5 }}s
          </span>
        </div>
      </div>

      <!-- Track 2: Narração & Waveform -->
      <div class="h-7 flex items-center gap-1 my-0.5 relative">
        <div
          v-for="(scene, idx) in scenes"
          :key="idx"
          :style="{ width: `${getSceneWidthPercent(scene)}%` }"
          class="h-full rounded bg-[#0b1219] border border-emerald-950/80 px-2 flex items-center justify-between overflow-hidden"
        >
          <!-- Simulated Audio Waveform bars -->
          <div class="flex items-center gap-0.5 h-4 opacity-75">
            <span
              v-for="bar in 8"
              :key="bar"
              :style="{ height: `${25 + ((bar * 17) % 75)}%` }"
              class="w-1 bg-emerald-400/80 rounded-full"
            ></span>
          </div>

          <span class="text-[9px] text-emerald-300 font-mono truncate">
            {{ scene.audioUrl ? '🎵 MP3 Anexado' : `${countWords(scene.narrationText)} palavras` }}
          </span>
        </div>
      </div>

      <!-- Track 3: Eventos & Pacotes de Dados -->
      <div class="h-6 flex items-center gap-1 my-0.5 relative">
        <div
          v-for="(scene, idx) in scenes"
          :key="idx"
          :style="{ width: `${getSceneWidthPercent(scene)}%` }"
          class="h-full rounded bg-[#101318] border border-amber-950/60 px-1.5 flex items-center gap-2 overflow-hidden text-[9px]"
        >
          <span class="px-1 py-0.2 rounded bg-amber-500/15 border border-amber-500/30 text-amber-300 whitespace-nowrap">
            ⌨ Typewriter
          </span>
          <span class="px-1 py-0.2 rounded bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 whitespace-nowrap">
            ⚡ Data Packet
          </span>
          <span class="px-1 py-0.2 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 whitespace-nowrap">
            🏷 Badge [ok]
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';

const props = defineProps({
  scenes: {
    type: Array,
    required: true
  },
  currentSceneIndex: {
    type: Number,
    required: true
  },
  isOpen: {
    type: Boolean,
    default: true
  },
  isPlaying: {
    type: Boolean,
    default: false
  },
  currentPlaybackTime: {
    type: Number,
    default: 0
  }
});

const emit = defineEmits([
  'seek-time',
  'activate-scene',
  'toggle-open',
  'toggle-play'
]);

const timelineAreaRef = ref(null);

const totalDuration = computed(() => {
  if (!props.scenes.length) return 20;
  return props.scenes.reduce((acc, s) => acc + (s.duration || 5), 0);
});

const playheadPercent = computed(() => {
  if (totalDuration.value <= 0) return 0;
  return Math.min(100, Math.max(0, (props.currentPlaybackTime / totalDuration.value) * 100));
});

const getSceneWidthPercent = (scene) => {
  if (totalDuration.value <= 0) return 100 / props.scenes.length;
  return ((scene.duration || 5) / totalDuration.value) * 100;
};

const rulerMarkers = computed(() => {
  const dur = totalDuration.value;
  const count = Math.max(4, Math.min(10, Math.floor(dur / 5)));
  const step = dur / count;
  const list = [];
  for (let i = 0; i <= count; i++) {
    const t = Number((i * step).toFixed(1));
    list.push({
      time: t,
      percent: (t / dur) * 100
    });
  }
  return list;
});

const formatTime = (secs = 0) => {
  const m = Math.floor(secs / 60);
  const s = (secs % 60).toFixed(1);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(4, '0')}`;
};

const countWords = (text = '') => {
  if (!text) return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
};

const onTimelineClick = (e) => {
  if (!timelineAreaRef.value) return;
  const rect = timelineAreaRef.value.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const ratio = Math.max(0, Math.min(1, clickX / rect.width));
  const targetSeconds = ratio * totalDuration.value;

  emit('seek-time', targetSeconds);

  // Determine corresponding scene
  let accumulated = 0;
  for (let i = 0; i < props.scenes.length; i++) {
    const dur = props.scenes[i].duration || 5;
    if (targetSeconds <= accumulated + dur || i === props.scenes.length - 1) {
      emit('activate-scene', i);
      break;
    }
    accumulated += dur;
  }
};
</script>
