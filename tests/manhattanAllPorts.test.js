import { describe, it, expect } from 'vitest';
import { computeSmartManhattanPath } from '../src/composables/useManhattan.js';

describe('Manhattan Router 16 Directional Port Pairs', () => {
  const nodeA = { id: 'na', x: 100, y: 100, w: 200, type: 'chip', content: '' };
  const nodeB = { id: 'nb', x: 500, y: 400, w: 200, type: 'terminal', content: '' };

  const getNodeById = (id) => {
    if (id === 'na') return nodeA;
    if (id === 'nb') return nodeB;
    return undefined;
  };

  const ports = ['top', 'right', 'bottom', 'left'];

  // Test all 4x4 = 16 directional pairs
  ports.forEach((fromPort) => {
    ports.forEach((toPort) => {
      it(`computes valid 90° Manhattan path from ${fromPort} to ${toPort}`, () => {
        const edge = {
          id: `e_${fromPort}_${toPort}`,
          from: 'na',
          fromPort,
          to: 'nb',
          toPort
        };

        const path = computeSmartManhattanPath(edge, getNodeById);
        expect(path).toBeTruthy();
        expect(path.startsWith('M ')).toBe(true);

        // Parse path commands: every command must be M or L
        const commands = path.match(/[ML]/g);
        expect(commands?.length).toBeGreaterThanOrEqual(3); // At least M and 2 L segments

        // Extract coordinate pairs (e.g. M 200 100 L 200 250 L 500 250 L 500 400)
        const segments = path.replace(/[ML]/g, '').trim().split(/\s+/).map(Number);
        const points = [];
        for (let i = 0; i < segments.length; i += 2) {
          points.push({ x: segments[i], y: segments[i + 1] });
        }

        // Verify that every segment between consecutive points is strictly horizontal or strictly vertical!
        for (let i = 0; i < points.length - 1; i++) {
          const p1 = points[i];
          const p2 = points[i + 1];
          const isHorizontal = p1.y === p2.y;
          const isVertical = p1.x === p2.x;
          expect(
            isHorizontal || isVertical,
            `Diagonal segment found between (${p1.x}, ${p1.y}) and (${p2.x}, ${p2.y}) in path: ${path}`
          ).toBe(true);
        }
      });
    });
  });
});
