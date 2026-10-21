<script setup>
import { ref, computed } from 'vue';
import { useCanvas } from '@/composables/useCanvas';
import { useGraph } from '@/composables/useGraph';
import { useScenes } from '@/composables/useScenes';
import { useAiDirector } from '@/composables/useAiDirector';
import { useShortcuts } from '@/composables/useShortcuts';

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

// Project Metadata & Theme
const presentationMeta = ref({ ...DEFAULT_META });
const canvasTheme = ref('theme-pcb');

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

const { aiPromptText, generateGraph } = useAiDirector();

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
      zoom: camera.value.zoom
    });
    currentSceneIndex.value = scenes.value.length - 1;
  }
};

// Canvas Pan / Node Drag coordination
const handlePanMove = (e) => {
  if (draggingNode.value) {
    dragNode(e, camera.value);
  } else if (isDraggingCanvas.value) {
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
const handleAddNode = ({ type, variant }) => {
  const newNode = addNode(type, variant, camera.value);
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
  onDeleteSelected: () => {
    if (selectedNode.value) deleteSelectedNode();
    else if (selectedEdge.value) deleteSelectedEdge();
  },
  onUndo: undo,
  onRedo: redo,
  onPasteImage: handlePasteImage,
  onDuplicate: duplicateSelectedNode
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
    />

    <!-- Main Workspace -->
    <main class="flex-1 flex flex-col relative overflow-hidden">
      <!-- TMUX Top Bar -->
      <TmuxTopBar
        :presentation-meta="presentationMeta"
        :camera-zoom="camera.zoom"
        :is-presenting="isPresenting"
        @auto-layout="autoLayout"
        @reset-camera="resetCamera"
        @toggle-presenting="togglePresenting"
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
  </div>
</template>
