import { describe, it, expect } from 'vitest';
import {
  getPortCoords,
  computeSmartManhattanPath,
  getEdgeMidpoint,
  computeLiveWirePath,
  getOptimalEdgePorts
} from '../src/composables/useManhattan.js';

describe('useManhattan Path Routing', () => {
  const nodeA = { id: 'na', x: 100, y: 100, w: 200, type: 'chip', content: '' };
  const nodeB = { id: 'nb', x: 500, y: 300, w: 200, type: 'code', content: '' };

  const getNodeById = (id) => {
    if (id === 'na') return nodeA;
    if (id === 'nb') return nodeB;
    return undefined;
  };

  it('calculates port coordinates correctly for all 4 positions', () => {
    // top
    const top = getPortCoords(nodeA, 'top');
    expect(top.x).toBe(100 + 200 / 2);
    expect(top.y).toBe(100);

    // right
    const right = getPortCoords(nodeA, 'right');
    expect(right.x).toBe(100 + 200);
    expect(right.y).toBeGreaterThan(100);

    // bottom
    const bottom = getPortCoords(nodeA, 'bottom');
    expect(bottom.x).toBe(100 + 200 / 2);
    expect(bottom.y).toBeGreaterThan(100);

    // left
    const left = getPortCoords(nodeA, 'left');
    expect(left.x).toBe(100);
    expect(left.y).toBeGreaterThan(100);
  });

  it('computes valid horizontal orthogonal Manhattan path', () => {
    const edge = {
      id: 'e1',
      from: 'na',
      fromPort: 'right',
      to: 'nb',
      toPort: 'left'
    };

    const path = computeSmartManhattanPath(edge, getNodeById);
    expect(path).toMatch(/^M \d+(\.\d+)? \d+(\.\d+)? L \d+(\.\d+)? \d+(\.\d+)?/);
    expect(path).toContain('L');
  });

  it('computes valid vertical orthogonal Manhattan path', () => {
    const edge = {
      id: 'e2',
      from: 'na',
      fromPort: 'bottom',
      to: 'nb',
      toPort: 'top'
    };

    const path = computeSmartManhattanPath(edge, getNodeById);
    expect(path).toContain('M');
    expect(path).toContain('L');
  });

  it('computes edge midpoint for labels', () => {
    const edge = {
      id: 'e1',
      from: 'na',
      fromPort: 'right',
      to: 'nb',
      toPort: 'left'
    };

    const mid = getEdgeMidpoint(edge, getNodeById);
    expect(mid.x).toBeGreaterThan(100);
    expect(mid.y).toBeGreaterThan(50);
  });

  it('computes live dragging wire path', () => {
    const activeWire = {
      fromId: 'na',
      fromPort: 'right',
      mouseX: 400,
      mouseY: 250
    };

    const path = computeLiveWirePath(activeWire, getNodeById);
    expect(path).toMatch(/^M \d+/);
    expect(path).toContain('400 250');
  });

  it('calculates optimal edge ports dynamically based on relative position', () => {
    // Target to the right
    const rightOptimal = getOptimalEdgePorts(nodeA, nodeB);
    expect(rightOptimal.fromPort).toBe('right');
    expect(rightOptimal.toPort).toBe('left');

    // Target to the left
    const leftOptimal = getOptimalEdgePorts(nodeB, nodeA);
    expect(leftOptimal.fromPort).toBe('left');
    expect(leftOptimal.toPort).toBe('right');

    // Target directly below
    const nodeBelow = { id: 'nc', x: 100, y: 400, w: 200, type: 'chip' };
    const belowOptimal = getOptimalEdgePorts(nodeA, nodeBelow);
    expect(belowOptimal.fromPort).toBe('bottom');
    expect(belowOptimal.toPort).toBe('top');

    // Target directly above
    const aboveOptimal = getOptimalEdgePorts(nodeBelow, nodeA);
    expect(aboveOptimal.fromPort).toBe('top');
    expect(aboveOptimal.toPort).toBe('bottom');
  });
});
