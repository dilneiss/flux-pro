import { ref } from 'vue';
import { NODE_TEMPLATES, estimateNodeHeight } from '@/constants/catalog';

export const GRID = 24;

export function useGraph(initialNodes = [], initialEdges = []) {
  const nodes = ref(JSON.parse(JSON.stringify(initialNodes)));
  const edges = ref(JSON.parse(JSON.stringify(initialEdges)));

  const selectedNode = ref(null);
  const selectedEdge = ref(null);

  // Active wire being pulled from a port handle
  const activeWire = ref(null); // { fromId, fromPort, mouseX, mouseY }

  // Node dragging state
  const draggingNode = ref(null);
  const dragOffset = ref({ x: 0, y: 0 });

  // Undo/Redo history stack
  const history = ref([]);
  const historyIndex = ref(-1);

  const saveHistory = () => {
    // Trim future history if branching
    if (historyIndex.value < history.value.length - 1) {
      history.value = history.value.slice(0, historyIndex.value + 1);
    }
    history.value.push({
      nodes: JSON.parse(JSON.stringify(nodes.value)),
      edges: JSON.parse(JSON.stringify(edges.value))
    });
    if (history.value.length > 30) history.value.shift();
    historyIndex.value = history.value.length - 1;
  };

  // Initial history save
  saveHistory();

  const undo = () => {
    if (historyIndex.value > 0) {
      historyIndex.value--;
      const state = history.value[historyIndex.value];
      nodes.value = JSON.parse(JSON.stringify(state.nodes));
      edges.value = JSON.parse(JSON.stringify(state.edges));
      selectedNode.value = null;
      selectedEdge.value = null;
    }
  };

  const redo = () => {
    if (historyIndex.value < history.value.length - 1) {
      historyIndex.value++;
      const state = history.value[historyIndex.value];
      nodes.value = JSON.parse(JSON.stringify(state.nodes));
      edges.value = JSON.parse(JSON.stringify(state.edges));
      selectedNode.value = null;
      selectedEdge.value = null;
    }
  };

  const getNodeById = (id) => nodes.value.find((n) => n.id === id);
  const getEdgeById = (id) => edges.value.find((e) => e.id === id);

  const selectNode = (node) => {
    selectedNode.value = node;
    selectedEdge.value = null;
  };

  const selectEdge = (edge) => {
    selectedEdge.value = edge;
    selectedNode.value = null;
  };

  const clearSelection = () => {
    selectedNode.value = null;
    selectedEdge.value = null;
  };

  const startDragNode = (e, node, camera) => {
    selectNode(node);
    draggingNode.value = node;
    dragOffset.value = {
      x: (e.clientX - camera.x) / camera.zoom - node.x,
      y: (e.clientY - camera.y) / camera.zoom - node.y
    };
  };

  const dragNode = (e, camera) => {
    if (!draggingNode.value) return;
    const rawX = (e.clientX - camera.x) / camera.zoom - dragOffset.value.x;
    const rawY = (e.clientY - camera.y) / camera.zoom - dragOffset.value.y;
    draggingNode.value.x = Math.round(rawX / GRID) * GRID;
    draggingNode.value.y = Math.round(rawY / GRID) * GRID;
  };

  const endDragNode = () => {
    if (draggingNode.value) {
      draggingNode.value = null;
      saveHistory();
    }
  };

  const startWire = (node, port, initialCoords) => {
    activeWire.value = {
      fromId: node.id,
      fromPort: port,
      mouseX: initialCoords ? initialCoords.x : node.x + (node.w || 384),
      mouseY: initialCoords ? initialCoords.y : node.y + 60
    };
  };

  const updateLiveWire = (worldCoords) => {
    if (activeWire.value) {
      activeWire.value.mouseX = worldCoords.x;
      activeWire.value.mouseY = worldCoords.y;
    }
  };

  const completeWire = (targetNode, targetPort = 'left') => {
    if (!activeWire.value) return;
    if (activeWire.value.fromId === targetNode.id) {
      activeWire.value = null;
      return;
    }

    // Check if an edge between these two already exists
    const exists = edges.value.some(
      (e) =>
        e.from === activeWire.value.fromId &&
        e.to === targetNode.id &&
        e.fromPort === activeWire.value.fromPort &&
        e.toPort === targetPort
    );

    if (!exists) {
      const newEdge = {
        id: 'e_' + Date.now(),
        from: activeWire.value.fromId,
        fromPort: activeWire.value.fromPort,
        to: targetNode.id,
        toPort: targetPort,
        label: 'fluxo',
        color: 'cyan',
        animated: true
      };
      edges.value.push(newEdge);
      selectedEdge.value = newEdge;
      selectedNode.value = null;
      saveHistory();
    }

    activeWire.value = null;
  };

  const cancelWire = () => {
    activeWire.value = null;
  };

  const addNode = (type, variant, camera) => {
    const id = 'n_' + Date.now();
    const tpl = NODE_TEMPLATES[type] || NODE_TEMPLATES.chip;

    const baseX = camera
      ? Math.round((160 - camera.x) / camera.zoom / GRID) * GRID
      : 192;
    const baseY = camera
      ? Math.round((140 - camera.y) / camera.zoom / GRID) * GRID
      : 96;

    const offsetIndex = nodes.value.length % 5;
    const newNode = {
      id,
      type,
      variant: variant || 'cyan',
      groupLabel: `${type} (${variant || 'default'})`,
      x: baseX + offsetIndex * 72,
      y: baseY + offsetIndex * 48,
      ...JSON.parse(JSON.stringify(tpl))
    };

    nodes.value.push(newNode);
    selectNode(newNode);
    saveHistory();
    return newNode;
  };

  const duplicateSelectedNode = () => {
    if (!selectedNode.value) return null;
    const copy = JSON.parse(JSON.stringify(selectedNode.value));
    copy.id = 'n_' + Date.now();
    copy.title = copy.title + ' (Cópia)';
    copy.x += 48;
    copy.y += 48;
    nodes.value.push(copy);
    selectNode(copy);
    saveHistory();
    return copy;
  };

  const deleteSelectedNode = () => {
    if (!selectedNode.value) return;
    const id = selectedNode.value.id;
    nodes.value = nodes.value.filter((n) => n.id !== id);
    edges.value = edges.value.filter((e) => e.from !== id && e.to !== id);
    selectedNode.value = null;
    saveHistory();
  };

  const deleteSelectedEdge = () => {
    if (!selectedEdge.value) return;
    edges.value = edges.value.filter((e) => e.id !== selectedEdge.value.id);
    selectedEdge.value = null;
    saveHistory();
  };

  /**
   * Automatic collision-free layout
   * Organizes nodes into a multi-column flow with guaranteed clearances.
   */
  const autoLayout = (cols = 3) => {
    if (!nodes.value.length) return;

    const colWidths = [440, 500, 440, 440];
    const startX = 72;
    const startY = 48;
    const gapX = 96;
    const gapY = 64;

    const colHeights = Array(cols).fill(startY);

    nodes.value.forEach((node, idx) => {
      const col = idx % cols;
      let x = startX;
      for (let c = 0; c < col; c++) {
        x += (colWidths[c] || 440) + gapX;
      }

      node.x = Math.round(x / GRID) * GRID;
      node.y = Math.round(colHeights[col] / GRID) * GRID;

      const nodeHeight = estimateNodeHeight(node);
      colHeights[col] += nodeHeight + gapY;
    });

    saveHistory();
  };

  return {
    nodes,
    edges,
    selectedNode,
    selectedEdge,
    activeWire,
    draggingNode,
    dragOffset,
    getNodeById,
    getEdgeById,
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
  };
}
