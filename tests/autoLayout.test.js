import { describe, it, expect } from 'vitest';
import { solveAutoLayout, GRID } from '../src/utils/autoLayoutSolver.js';
import { DEFAULT_NODES, DEFAULT_EDGES } from '../src/constants/defaultData.js';
import { estimateNodeHeight } from '../src/constants/catalog.js';

describe('Auto-Layout Solver Collision-Free Guarantees', () => {
  it('organizes the reference graph with ZERO collisions and generous corridors', () => {
    const { nodes, edges } = solveAutoLayout(DEFAULT_NODES, DEFAULT_EDGES);

    // 1. Check all coordinates are snapped to 24px grid
    nodes.forEach((n) => {
      expect(n.x % GRID).toBe(0);
      expect(n.y % GRID).toBe(0);
    });

    // 2. Pairwise bounding box collision test (AABB check):
    // For every pair of nodes (i, j), their rectangles must NOT intersect!
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i];
        const b = nodes[j];

        const aRight = a.x + (a.w || 384);
        const aBottom = a.y + estimateNodeHeight(a);
        const bRight = b.x + (b.w || 384);
        const bBottom = b.y + estimateNodeHeight(b);

        // Check for overlap with margin
        const overlapX = a.x < bRight && aRight > b.x;
        const overlapY = a.y < bBottom && aBottom > b.y;

        const collides = overlapX && overlapY;
        expect(
          collides,
          `COLLISION DETECTED between "${a.title}" [x:${a.x}..${aRight}, y:${a.y}..${aBottom}] and "${b.title}" [x:${b.x}..${bRight}, y:${b.y}..${bBottom}]`
        ).toBe(false);
      }
    }

    // 3. Verify n1 (caminho) and n2 (Finder) are in the same column, n1 on top of n2
    const n1 = nodes.find((n) => n.id === 'n1');
    const n2 = nodes.find((n) => n.id === 'n2');
    expect(n1.x).toBe(n2.x);
    expect(n2.y).toBeGreaterThan(n1.y);

    // 4. Verify n3 (Claude Code terminal) is to the right of n1 and n2
    const n3 = nodes.find((n) => n.id === 'n3');
    expect(n3.x).toBeGreaterThan(n1.x + n1.w);

    // 5. Verify n4 and n5 are in Column 2 to the right of n3
    const n4 = nodes.find((n) => n.id === 'n4');
    const n5 = nodes.find((n) => n.id === 'n5');
    expect(n5.x).toBeGreaterThan(n3.x + n3.w);
    expect(n4.x).toBe(n5.x);
    expect(n4.y).toBeGreaterThan(n5.y);

    // 6. Verify edge port orientations were automatically perfected
    const e1 = edges.find((e) => e.from === 'n1' && e.to === 'n2');
    expect(e1.fromPort).toBe('bottom');
    expect(e1.toPort).toBe('top');

    const e5 = edges.find((e) => e.from === 'n5' && e.to === 'n4');
    expect(e5.fromPort).toBe('bottom');
    expect(e5.toPort).toBe('top');

    const e3 = edges.find((e) => e.from === 'n2' && e.to === 'n3');
    expect(e3.fromPort).toBe('right');
    expect(e3.toPort).toBe('left');
  });

  it('handles arbitrary nodes without edges cleanly', () => {
    const rawNodes = [
      { id: '1', type: 'chip', w: 600, x: 0, y: 0 },
      { id: '2', type: 'terminal', w: 450, x: 0, y: 0 },
      { id: '3', type: 'finder', w: 350, x: 0, y: 0 }
    ];

    const { nodes } = solveAutoLayout(rawNodes, []);
    expect(nodes).toHaveLength(3);
    expect(nodes[0].x).toBe(nodes[1].x); // Stacked
    expect(nodes[1].y).toBeGreaterThan(nodes[0].y);
  });
});
