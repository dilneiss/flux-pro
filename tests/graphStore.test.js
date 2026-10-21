import { describe, it, expect } from 'vitest';
import { useGraph } from '../src/composables/useGraph.js';

describe('useGraph Store & Operations', () => {
  const initialNodes = [
    { id: 'n1', type: 'chip', title: 'Target', w: 300, x: 100, y: 100 },
    { id: 'n2', type: 'code', title: 'Code', w: 300, x: 500, y: 100 }
  ];
  const initialEdges = [
    { id: 'e1', from: 'n1', fromPort: 'right', to: 'n2', toPort: 'left', label: 'fluxo' }
  ];

  it('selects and deselects node and edge', () => {
    const graph = useGraph(initialNodes, initialEdges);
    graph.selectNode(graph.nodes.value[0]);
    expect(graph.selectedNode.value?.id).toBe('n1');
    expect(graph.selectedEdge.value).toBeNull();

    graph.selectEdge(graph.edges.value[0]);
    expect(graph.selectedEdge.value?.id).toBe('e1');
    expect(graph.selectedNode.value).toBeNull();

    graph.clearSelection();
    expect(graph.selectedNode.value).toBeNull();
    expect(graph.selectedEdge.value).toBeNull();
  });

  it('adds a new node with valid default properties', () => {
    const graph = useGraph(initialNodes, initialEdges);
    const newNode = graph.addNode('terminal', 'claude', { x: 0, y: 0, zoom: 1 });
    expect(newNode.type).toBe('terminal');
    expect(newNode.variant).toBe('claude');
    expect(graph.nodes.value).toHaveLength(3);
  });

  it('deletes selected node and its connected edges', () => {
    const graph = useGraph(initialNodes, initialEdges);
    graph.selectNode(graph.nodes.value[0]); // n1
    graph.deleteSelectedNode();

    expect(graph.nodes.value).toHaveLength(1);
    expect(graph.nodes.value[0].id).toBe('n2');
    // Edge e1 connected to n1 should be cascade removed
    expect(graph.edges.value).toHaveLength(0);
  });

  it('duplicates selected node', () => {
    const graph = useGraph(initialNodes, initialEdges);
    graph.selectNode(graph.nodes.value[0]);
    const duplicate = graph.duplicateSelectedNode();

    expect(duplicate).not.toBeNull();
    expect(duplicate.title).toContain('(Cópia)');
    expect(graph.nodes.value).toHaveLength(3);
  });

  it('connects ports via completeWire', () => {
    const graph = useGraph(initialNodes, []);
    graph.startWire(graph.nodes.value[0], 'bottom');
    graph.completeWire(graph.nodes.value[1], 'top');

    expect(graph.edges.value).toHaveLength(1);
    expect(graph.edges.value[0].from).toBe('n1');
    expect(graph.edges.value[0].to).toBe('n2');
    expect(graph.edges.value[0].fromPort).toBe('bottom');
    expect(graph.edges.value[0].toPort).toBe('top');
  });

  it('supports undo and redo', () => {
    const graph = useGraph(initialNodes, initialEdges);
    const origCount = graph.nodes.value.length;
    graph.addNode('chip', 'cyan', { x: 0, y: 0, zoom: 1 });
    expect(graph.nodes.value.length).toBe(origCount + 1);

    graph.undo();
    expect(graph.nodes.value.length).toBe(origCount);

    graph.redo();
    expect(graph.nodes.value.length).toBe(origCount + 1);
  });
});
