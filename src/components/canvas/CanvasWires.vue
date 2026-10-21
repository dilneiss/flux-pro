<script setup>
import {
  computeSmartManhattanPath,
  computeLiveWirePath,
  getEdgeMidpoint,
  getPortCoords
} from '@/composables/useManhattan';

const props = defineProps({
  edges: {
    type: Array,
    required: true
  },
  selectedEdge: {
    type: Object,
    default: null
  },
  activeWire: {
    type: Object,
    default: null
  },
  getNodeById: {
    type: Function,
    required: true
  }
});

const emit = defineEmits(['select-edge']);

const getEdgeColor = (color) => {
  switch (color) {
    case 'amber':
      return { main: '#f59e0b', shadow: '#78350f', pulse: '#fde68a' };
    case 'emerald':
      return { main: '#10b981', shadow: '#064e3b', pulse: '#6ee7b7' };
    case 'purple':
      return { main: '#a855f7', shadow: '#581c87', pulse: '#d8b4fe' };
    case 'cyan':
    default:
      return { main: '#06b6d4', shadow: '#164e63', pulse: '#a5f3fc' };
  }
};
</script>

<template>
  <svg class="w-full h-full absolute inset-0 pointer-events-none z-0">
    <defs>
      <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>

    <!-- Existing Connections -->
    <g
      v-for="edge in edges"
      :key="edge.id"
      class="pointer-events-auto cursor-pointer group"
      @click.stop="emit('select-edge', edge)"
    >
      <!-- Invisible thick hit area for easy selection -->
      <path
        :d="computeSmartManhattanPath(edge, getNodeById)"
        stroke="transparent"
        stroke-width="18"
        fill="none"
      />

      <!-- Shadow Trace -->
      <path
        :d="computeSmartManhattanPath(edge, getNodeById)"
        :stroke="getEdgeColor(edge.color).shadow"
        stroke-width="3"
        fill="none"
        stroke-linejoin="round"
      />

      <!-- Main Wire Line -->
      <path
        :d="computeSmartManhattanPath(edge, getNodeById)"
        :stroke="getEdgeColor(edge.color).main"
        :stroke-width="selectedEdge?.id === edge.id ? '3.5' : '1.8'"
        fill="none"
        stroke-linejoin="round"
        class="transition-[stroke-width]"
      />

      <!-- Animated Electrical Pulse -->
      <path
        v-if="edge.animated !== false"
        :d="computeSmartManhattanPath(edge, getNodeById)"
        :stroke="getEdgeColor(edge.color).pulse"
        stroke-width="2.6"
        fill="none"
        class="cable-animated"
        filter="url(#glow-cyan)"
      />

      <!-- Solder Pads at connection points -->
      <circle
        :cx="getPortCoords(getNodeById(edge.from), edge.fromPort).x"
        :cy="getPortCoords(getNodeById(edge.from), edge.fromPort).y"
        r="4"
        :fill="getEdgeColor(edge.color).main"
      />
      <circle
        :cx="getPortCoords(getNodeById(edge.to), edge.toPort).x"
        :cy="getPortCoords(getNodeById(edge.to), edge.toPort).y"
        r="4"
        :fill="getEdgeColor(edge.color).main"
      />

      <!-- Label Badge at Edge Midpoint -->
      <g
        v-if="edge.label"
        :transform="`translate(${getEdgeMidpoint(edge, getNodeById).x}, ${getEdgeMidpoint(edge, getNodeById).y})`"
      >
        <rect
          x="-52"
          y="-12"
          width="104"
          height="24"
          rx="5"
          fill="#0b0e14"
          :stroke="selectedEdge?.id === edge.id ? '#ffffff' : getEdgeColor(edge.color).main"
          stroke-width="1.3"
        />
        <text
          x="0"
          y="4"
          text-anchor="middle"
          fill="#f1f5f9"
          font-size="10"
          font-weight="bold"
          font-family="JetBrains Mono, monospace"
        >
          {{ edge.label }}
        </text>
      </g>
    </g>

    <!-- Active Wire being pulled by mouse -->
    <path
      v-if="activeWire"
      :d="computeLiveWirePath(activeWire, getNodeById)"
      stroke="#22d3ee"
      stroke-width="2.5"
      stroke-dasharray="6 6"
      fill="none"
    />
  </svg>
</template>
