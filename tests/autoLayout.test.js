import { describe, it, expect } from 'vitest';
import { useGraph, GRID } from '../src/composables/useGraph.js';

describe('Auto-Layout Algorithm', () => {
  it('arranges nodes in multi-column flow snapped to GRID', () => {
    const initialNodes = [
      { id: '1', type: 'chip', w: 400, x: 0, y: 0, content: '' },
      { id: '2', type: 'terminal', w: 450, x: 0, y: 0, content: '' },
      { id: '3', type: 'finder', w: 350, x: 0, y: 0, content: '' },
      { id: '4', type: 'code', w: 380, x: 0, y: 0, content: '' },
      { id: '5', type: 'database', w: 330, x: 0, y: 0, content: '' },
      { id: '6', type: 'media', w: 380, x: 0, y: 0, content: '' }
    ];

    const { nodes, autoLayout } = useGraph(initialNodes, []);
    autoLayout(3);

    // Verify all nodes are snapped to GRID (24px)
    nodes.value.forEach((node) => {
      expect(node.x % GRID).toBe(0);
      expect(node.y % GRID).toBe(0);
    });

    // Check that nodes in the same column have different Y positions (no direct stacking)
    const col0 = [nodes.value[0], nodes.value[3]];
    expect(col0[1].y).toBeGreaterThan(col0[0].y);

    const col1 = [nodes.value[1], nodes.value[4]];
    expect(col1[1].y).toBeGreaterThan(col1[0].y);
  });
});
