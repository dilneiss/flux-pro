<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useCanvas } from '@/composables/useCanvas';
import { useGraph } from '@/composables/useGraph';
import { useScenes } from '@/composables/useScenes';
import { useAiDirector } from '@/composables/useAiDirector';
import { useShortcuts } from '@/composables/useShortcuts';
import { useScreenRecorder } from '@/composables/useScreenRecorder';
import { useElevenLabs } from '@/composables/useElevenLabs';
import { useKeyframePlayback } from '@/composables/useKeyframePlayback';
import { soundFX } from '@/utils/soundFX';
import { useSpeechNarration } from '@/composables/useSpeechNarration';
import { useAutoProducer } from '@/composables/useAutoProducer';
import ClosedCaptionsBar from '@/components/layout/ClosedCaptionsBar.vue';
import CountdownOverlay from '@/components/layout/CountdownOverlay.vue';
import { generateThumbnailPng } from '@/utils/thumbnailGenerator';
import {
  DEFAULT_META,
  DEFAULT_NODES,
  DEFAULT_EDGES,
  DEFAULT_SCENES
} from '@/constants/defaultData';

import TmuxTopBar from '@/components/layout/TmuxTopBar.vue';
import TmuxBottomBar from '@/components/layout/TmuxBottomBar.vue';
import SceneHeader from '@/components/layout/SceneHeader.vue';
import LeftSidebar from '@/components/sidebar/LeftSidebar.vue';
import InfiniteCanvas from '@/components/canvas/InfiniteCanvas.vue';
import RightInspector from '@/components/inspector/RightInspector.vue';

// Feature Modals
import MarketplaceModal from '@/components/marketplace/MarketplaceModal.vue';
import AudioSyncModal from '@/components/audio/AudioSyncModal.vue';
import RenderProgressModal from '@/components/render/RenderProgressModal.vue';

// Project Metadata & Theme
const presentationMeta = ref({ ...DEFAULT_META });
const canvasTheme = ref('theme-pcb');

// Modals State
const isMarketplaceOpen = ref(false);
const isAudioSyncOpen = ref(false);
const isRenderOpen = ref(false);
const isSpotlightActive = ref(false);
const isAudioEnabled = ref(true);
const isCrtFilterActive = ref(false);
const isProgressiveReveal = ref(false);
const isMicroDriftActive = ref(false);
const isBgmActive = ref(false);
const isGhostCursorActive = ref(true);
const aspectRatio = ref('16:9');
const activeNodeIds = computed(() => {
  if (isPresenting.value) {
    if (currentScene.value?.activeNodeIds?.length) {
      return currentScene.value.activeNodeIds;
    }
    return null;
  }

  if (!isSpotlightActive.value) return null;

  if (selectedNode.value) {
    const activeSet = new Set([selectedNode.value.id]);
    edges.value.forEach((e) => {
      if (e.from === selectedNode.value.id) activeSet.add(e.to);
      if (e.to === selectedNode.value.id) activeSet.add(e.from);
    });
    return Array.from(activeSet);
  }

  return null;
});

const targetFocusedNode = computed(() => {
  const id = currentScene.value?.activeNodeIds?.[0];
  return id ? getNodeById(id) : selectedNode.value || nodes.value[0];
});

// Core Composables
const {
  camera,
  isDraggingCanvas,
  startPan,
  pan,
  endPan,
  onWheel,
  resetCamera,
  focusNode
} = useCanvas();

const {
  nodes,
  edges,
  selectedNode,
  selectedEdge,
  activeWire,
  draggingNode,
  getNodeById,
  selectNode,
  selectEdge,
  clearSelection,
  startDragNode,
  dragNode,
  endDragNode,
  startWire,
  updateLiveWire,
  completeWire,
  cancelWire,
  addNode,
  duplicateSelectedNode,
  deleteSelectedNode,
  deleteSelectedEdge,
  autoLayout,
  undo,
  redo
} = useGraph(DEFAULT_NODES, DEFAULT_EDGES);

const {
  scenes,
  currentSceneIndex,
  currentScene,
  isPresenting,
  isLiveRecording,
  activateScene,
  nextScene,
  prevScene,
  captureKeyframe,
  removeScene,
  toggleLiveRecording,
  togglePresenting
} = useScenes(DEFAULT_SCENES);
const keyframePlayback = useKeyframePlayback(scenes, currentSceneIndex, activateScene);
const speechEngine = useSpeechNarration();
const screenRecorder = useScreenRecorder();

const autoProducer = useAutoProducer(
  scenes,
  currentSceneIndex,
  activateScene,
  camera,
  isPresenting,
  speechEngine,
  screenRecorder
);

const handleToggleAudio = () => {
  isAudioEnabled.value = soundFX.toggle();
  speechEngine.isSpeechEnabled.value = isAudioEnabled.value;
};

const revealedNodeIds = computed(() => {
  if (!isProgressiveReveal.value) return null;
  const set = new Set();
  for (let i = 0; i <= currentSceneIndex.value && i < scenes.value.length; i++) {
    const sc = scenes.value[i];
    if (sc?.activeNodeIds) {
      sc.activeNodeIds.forEach(id => set.add(id));
    }
  }
  return set;
});

const handleLoadProject = (data) => {
  if (data.nodes) nodes.value = data.nodes;
  if (data.edges) edges.value = data.edges;
  if (data.scenes) scenes.value = data.scenes;
  if (data.meta) presentationMeta.value = { ...data.meta };
  if (data.canvasTheme) canvasTheme.value = data.canvasTheme;
  soundFX.playChime();
  activateScene(0, camera);
};

const handleSpeakScene = (scene) => {
  const text = scene.narrationText || scene.title;
  soundFX.playConnectBeep();
  speechEngine.speak(text);
};

const handleToggleBgm = () => {
  isBgmActive.value = soundFX.toggleBgm();
};

const handleToggleAspectRatio = () => {
  aspectRatio.value = aspectRatio.value === '16:9' ? '9:16' : '16:9';
  soundFX.playConnectBeep(1100, 1400);
};

const handleGenerateThumbnail = () => {
  soundFX.playChime();
  generateThumbnailPng({
    meta: presentationMeta.value,
    currentScene: currentScene.value,
    nodes: nodes.value,
    canvasTheme: canvasTheme.value
  });
};
const { aiPromptText, generateGraph } = useAiDirector();

// In-Browser MediaRecorder Screen Recording
const handleToggleRecordScreen = async () => {
  if (screenRecorder.isRecording.value) {
    screenRecorder.stopRecording();
    keyframePlayback.stopPlayback();
    isPresenting.value = false;
  } else {
    isPresenting.value = true;
    const started = await screenRecorder.startRecording();
    if (!started) {
      isPresenting.value = false;
    }
  }
};

// ElevenLabs Audio Synchronization
const elevenLabs = useElevenLabs();
elevenLabs.bindAudioToScenes(scenes, (idx) => {
  activateScene(idx, camera);
});

// Chroma / PiP Toggle
const handleToggleChroma = () => {
  canvasTheme.value =
    canvasTheme.value === 'theme-pip-alpha' ? 'theme-pcb' : 'theme-pip-alpha';
};

// Marketplace: Load Preset with 1-click
const handleLoadPreset = (preset) => {
  nodes.value = JSON.parse(JSON.stringify(preset.nodes));
  edges.value = JSON.parse(JSON.stringify(preset.edges));
  scenes.value = JSON.parse(JSON.stringify(preset.scenes));
  presentationMeta.value = { ...preset.meta };
  if (preset.theme) canvasTheme.value = preset.theme;
  activateScene(0, camera);
};

// Live Presenter mode: if recording, clicking a node adds camera keyframe
const handleNodeDragStart = (e, node) => {
  startDragNode(e, node, camera.value);

  if (isLiveRecording.value) {
    focusNode(node);
    scenes.value.push({
      name: node.groupLabel || node.type,
      title: node.title,
      subtitle: node.subtitle || 'Foco gravado ao vivo',
      x: Math.round(camera.value.x),
      y: Math.round(camera.value.y),
      zoom: camera.value.zoom,
      startTime: Number((scenes.value.length * 4.0).toFixed(1))
    });
    currentSceneIndex.value = scenes.value.length - 1;
  }
};

// Canvas Pan / Node Drag coordination
const handlePanMove = (e) => {
  if (isDraggingCanvas.value) {
    pan(e);
  }
};

const handlePanEnd = () => {
  endDragNode();
  endPan();
  cancelWire();
};

// Connect ports
const handleStartWire = ({ node, port }) => {
  startWire(node, port);
};

const handleCompleteWire = ({ node, port }) => {
  completeWire(node, port);
};

// Add Node from Catalog
const handleAddNode = ({ type, variant, coords = null }) => {
  let spawnCoords = coords;
  if (!spawnCoords) {
    const rect = document.getElementById('infinite-canvas-viewport')?.getBoundingClientRect();
    const w = rect ? rect.width : 1200;
    const h = rect ? rect.height : 800;
    const centerX = Math.round((w / 2 - camera.value.x) / camera.value.zoom / 24) * 24;
    const centerY = Math.round((h / 2 - camera.value.y) / camera.value.zoom / 24) * 24;
    spawnCoords = { x: centerX, y: centerY };
  }
  const newNode = addNode(type, variant, camera.value, spawnCoords);
  if (newNode) selectNode(newNode);
};

// AI Director Generation
const handleGenerateGraph = () => {
  const result = generateGraph();
  if (result) {
    nodes.value = result.nodes;
    edges.value = result.edges;
    scenes.value = result.scenes;
    activateScene(0, camera);
  }
};

// Image Upload handler with backend API fallback
const handleUploadMedia = async ({ file, node }) => {
  try {
    const formData = new FormData();
    formData.append('image', file);
    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });
    if (res.ok) {
      const data = await res.json();
      node.mediaUrl = data.url;
      node.badge = '[ok] upload';
      return;
    }
  } catch {
    // Fallback to local object URL if offline/API unavailable
  }
  node.mediaUrl = URL.createObjectURL(file);
  node.badge = '[ok] local';
};

const handleDropFile = ({ file, node }) => {
  node.type = 'media';
  handleUploadMedia({ file, node });
};

// Paste from Clipboard (Ctrl+V)
const handlePasteImage = (blobUrl, file) => {
  if (selectedNode.value) {
    if (!['media', 'browser'].includes(selectedNode.value.type)) {
      selectedNode.value.type = 'media';
    }
    selectedNode.value.mediaUrl = blobUrl;
    selectedNode.value.badge = '[ok] colado';
    if (file) handleUploadMedia({ file, node: selectedNode.value });
    return;
  }

  // Create new media node at canvas center
  const newNode = addNode('media', 'cinema', camera.value);
  newNode.mediaUrl = blobUrl;
  newNode.title = 'Captura Colada (Ctrl+V)';
  newNode.badge = '[ok] clipboard';
  if (file) handleUploadMedia({ file, node: newNode });
};

// Keyboard Shortcuts Integration
useShortcuts({
  onNextScene: () => nextScene(camera),
  onPrevScene: () => prevScene(camera),
  onTogglePlay: () => keyframePlayback.togglePlayback(camera),
  onEscape: () => {
    if (autoProducer.isAutoProducing.value) {
      autoProducer.cancelAutoProduce();
    } else if (screenRecorder.isRecording.value) {
      screenRecorder.stopRecording();
      keyframePlayback.stopPlayback();
      isPresenting.value = false;
    } else if (isPresenting.value) {
      isPresenting.value = false;
    }
  },
  onDeleteSelected: () => {
    if (selectedNode.value) deleteSelectedNode();
    else if (selectedEdge.value) deleteSelectedEdge();
  },
  onUndo: undo,
  onRedo: redo,
  onPasteImage: handlePasteImage,
  onDuplicate: duplicateSelectedNode
});
onMounted(() => {
  window.addEventListener('mouseup', handlePanEnd);
});

onUnmounted(() => {
  window.removeEventListener('mouseup', handlePanEnd);
});
</script>

<template>
  <div class="h-screen w-screen flex overflow-hidden bg-[#090b0e] text-slate-200">
    <!-- Left Dock / Sidebar -->
    <LeftSidebar
      v-if="!isPresenting"
      :scenes="scenes"
      :current-scene-index="currentSceneIndex"
      :is-live-recording="isLiveRecording"
      :ai-prompt-text="aiPromptText"
      :canvas-theme="canvasTheme"
      :presentation-meta="presentationMeta"
      :nodes="nodes"
      :edges="edges"
      @auto-layout="autoLayout"
      @add-node="handleAddNode"
      @activate-scene="(idx) => activateScene(idx, camera)"
      @capture-keyframe="() => captureKeyframe(camera.value, selectedNode)"
      @remove-scene="(idx) => removeScene(idx, camera)"
      @toggle-live-recording="toggleLiveRecording"
      @update:ai-prompt-text="(val) => (aiPromptText = val)"
      @update:canvas-theme="(val) => (canvasTheme = val)"
      @generate-graph="handleGenerateGraph"
      @open-render-modal="isRenderOpen = true"
      @load-project="handleLoadProject"
      @speak-scene="handleSpeakScene"
      @undo="undo"
      @redo="redo"
      @generate-thumbnail="handleGenerateThumbnail"
    />
    <!-- Main Workspace -->
    <main class="flex-1 flex flex-col relative overflow-hidden">
      <!-- TMUX Top Bar -->
      <TmuxTopBar
        :presentation-meta="presentationMeta"
        :camera-zoom="camera.zoom"
        :is-presenting="isPresenting"
        :is-recording-screen="screenRecorder.isRecording.value"
        :recording-duration-formatted="screenRecorder.formatDuration(screenRecorder.recordingDuration.value)"
        :canvas-theme="canvasTheme"
        :is-spotlight-active="isSpotlightActive"
        :is-audio-enabled="isAudioEnabled"
        :is-crt-filter-active="isCrtFilterActive"
        :is-progressive-reveal="isProgressiveReveal"
        :is-micro-drift-active="isMicroDriftActive"
        :is-auto-producing="autoProducer.isAutoProducing.value"
        :is-bgm-active="isBgmActive"
        :is-ghost-cursor-active="isGhostCursorActive"
        :aspect-ratio="aspectRatio"
        @auto-layout="autoLayout"
        @reset-camera="resetCamera"
        @toggle-presenting="togglePresenting"
        @toggle-record-screen="handleToggleRecordScreen"
        @open-marketplace="isMarketplaceOpen = true"
        @open-audio-sync="isAudioSyncOpen = true"
        @toggle-chroma="handleToggleChroma"
        @toggle-spotlight="isSpotlightActive = !isSpotlightActive"
        @toggle-audio="handleToggleAudio"
        @toggle-crt="isCrtFilterActive = !isCrtFilterActive"
        @toggle-progressive-reveal="isProgressiveReveal = !isProgressiveReveal"
        @toggle-micro-drift="isMicroDriftActive = !isMicroDriftActive"
        @start-auto-produce="autoProducer.startAutoProduce"
        @toggle-bgm="handleToggleBgm"
        @toggle-ghost-cursor="isGhostCursorActive = !isGhostCursorActive"
        @toggle-aspect-ratio="handleToggleAspectRatio"
        @generate-thumbnail="handleGenerateThumbnail"
      />

      <!-- Scene Header (Narrative HUD) -->
      <SceneHeader
        :current-scene="currentScene"
        :current-scene-index="currentSceneIndex"
        :slug="presentationMeta.slug"
      />

      <!-- Infinite Canvas -->
      <InfiniteCanvas
        :camera="camera"
        :nodes="nodes"
        :edges="edges"
        :selected-node="selectedNode"
        :selected-edge="selectedEdge"
        :active-wire="activeWire"
        :dragging-node="draggingNode"
        :is-dragging-canvas="isDraggingCanvas"
        :is-presenting="isPresenting"
        :canvas-theme="canvasTheme"
        :get-node-by-id="getNodeById"
        :is-spotlight-active="isSpotlightActive"
        :active-node-ids="activeNodeIds"
        :is-progressive-reveal="isProgressiveReveal"
        :revealed-node-ids="revealedNodeIds"
        :is-crt-filter-active="isCrtFilterActive"
        :is-micro-drift-active="isMicroDriftActive"
        :is-ghost-cursor-active="isGhostCursorActive"
        :target-focused-node="targetFocusedNode"
        :aspect-ratio="aspectRatio"
        @start-pan="startPan"
        @pan="handlePanMove"
        @end-pan="handlePanEnd"
        @wheel="onWheel"
        @node-drag-start="handleNodeDragStart"
        @node-select="selectNode"
        @edge-select="selectEdge"
        @clear-selection="clearSelection"
        @start-wire="handleStartWire"
        @update-wire="updateLiveWire"
        @complete-wire="handleCompleteWire"
        @cancel-wire="cancelWire"
        @drop-file="handleDropFile"
        @upload-media="handleUploadMedia"
        @drop-node="handleAddNode"
      />

      <!-- TMUX Bottom Bar -->
      <TmuxBottomBar
        :slug="presentationMeta.slug"
        :current-scene-index="currentSceneIndex"
        :total-scenes="scenes.length"
        :node-count="nodes.length"
        :edge-count="edges.length"
        @prev-scene="() => prevScene(camera)"
        @next-scene="() => nextScene(camera)"
        :is-playing-keyframes="keyframePlayback.isPlayingKeyframes.value"
        @toggle-play="() => keyframePlayback.togglePlayback(camera)"
      />
    </main>

    <!-- Right Property Inspector (shows when a node or edge is selected) -->
    <RightInspector
      v-if="!isPresenting && (selectedNode || selectedEdge)"
      :selected-node="selectedNode"
      :selected-edge="selectedEdge"
      @delete-node="deleteSelectedNode"
      @duplicate-node="duplicateSelectedNode"
      @focus-node="focusNode"
      @delete-edge="deleteSelectedEdge"
      @close="clearSelection"
    />

    <!-- Advanced Feature Modals -->
    <MarketplaceModal
      :is-open="isMarketplaceOpen"
      @close="isMarketplaceOpen = false"
      @load-preset="handleLoadPreset"
    />

    <AudioSyncModal
      :is-open="isAudioSyncOpen"
      :scenes="scenes"
      :eleven-labs="elevenLabs"
      @close="isAudioSyncOpen = false"
      @activate-scene="(idx) => activateScene(idx, camera)"
    />

    <RenderProgressModal
      :is-open="isRenderOpen"
      :project="{ meta: presentationMeta, nodes, edges, scenes }"
      @close="isRenderOpen = false"
    />

    <!-- Closed Captions Broadcast Bar (Visible during presentation & auto-producing) -->
    <ClosedCaptionsBar
      v-if="isPresenting"
      :caption="autoProducer.currentCaption.value || (speechEngine.isSpeaking.value ? speechEngine.currentSpokenText.value : currentScene?.narrationText || '')"
      :current-word-index="speechEngine.currentWordIndex.value"
      :is-vertical-format="aspectRatio === '9:16'"
    />

    <!-- 3... 2... 1... Auto-Producer Countdown Overlay -->
    <CountdownOverlay
      :active="autoProducer.autoProducePhase.value === 'countdown'"
      :number="autoProducer.countdownNumber.value"
      @cancel="autoProducer.cancelAutoProduce"
    />

    <!-- Floating Recording HUD (discreet pill during live 60fps recording) -->
    <div
      v-if="screenRecorder.isRecording.value"
      class="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#0c1017]/95 border border-rose-500/60 shadow-[0_0_35px_rgba(244,63,94,0.4)] px-5 py-2.5 rounded-full flex items-center gap-4 backdrop-blur-md font-mono text-xs text-white"
    >
      <!-- Live Recording Dot + Timer -->
      <div class="flex items-center gap-2">
        <span class="w-3 h-3 rounded-full bg-rose-500 animate-pulse"></span>
        <span class="font-bold text-rose-300">REC {{ screenRecorder.formatDuration(screenRecorder.recordingDuration.value) }}</span>
        <span class="px-1.5 py-0.5 rounded bg-rose-950/80 border border-rose-700/60 text-rose-200 text-[10px] font-bold">60 FPS</span>
      </div>

      <div class="h-4 w-px bg-slate-700"></div>

      <!-- Keyframe status -->
      <div class="text-[11px] text-slate-300">
        Keyframe <span class="text-cyan-400 font-bold">{{ currentSceneIndex + 1 }}</span>/{{ scenes.length }}
      </div>

      <!-- Play / Pause automated keyframe presentation -->
      <button
        @click="keyframePlayback.togglePlayback(camera)"
        class="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] flex items-center gap-1 transition"
        title="Play / Pause Apresentação (Barra de Espaço)"
      >
        <span>{{ keyframePlayback.isPlayingKeyframes.value ? '⏸ Pausar' : '▶ Play (Espaço)' }}</span>
      </button>

      <!-- Stop and Download WebM -->
      <button
        @click="handleToggleRecordScreen"
        class="px-3.5 py-1 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-bold text-[11px] shadow-lg flex items-center gap-1.5 transition"
      >
        <span>⏹</span>
        <span>Parar e Baixar .webm</span>
      </button>
    </div>
  </div>
</template>
