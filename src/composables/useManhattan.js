import { estimateNodeHeight } from '@/constants/catalog';

/**
 * Calculates the exact (x, y) coordinates for a node's port.
 * @param {Object} node - Node object with { x, y, w, type, content }
 * @param {'top' | 'right' | 'bottom' | 'left'} [port='right']
 * @returns {{ x: number, y: number }}
 */
export function getPortCoords(node, port = 'right') {
  if (!node) return { x: 0, y: 0 };
  const h = estimateNodeHeight(node);
  const w = node.w || 384;

  switch (port) {
    case 'top':
      return { x: node.x + w / 2, y: node.y };
    case 'bottom':
      return { x: node.x + w / 2, y: node.y + h };
    case 'left':
      return { x: node.x, y: node.y + h / 2 };
    case 'right':
    default:
      return { x: node.x + w, y: node.y + h / 2 };
  }
}

/**
 * Computes an orthogonal Manhattan path between two ports.
 * Supports horizontal, vertical, and mixed port orientations.
 * @param {Object} edge - Edge with { from, fromPort, to, toPort }
 * @param {(id: string) => Object | undefined} getNodeById
 * @returns {string} SVG Path string
 */
export function computeSmartManhattanPath(edge, getNodeById) {
  const sourceNode = getNodeById(edge.from);
  const targetNode = getNodeById(edge.to);

  if (!sourceNode || !targetNode) return '';

  const p1 = getPortCoords(sourceNode, edge.fromPort || 'right');
  const p2 = getPortCoords(targetNode, edge.toPort || 'left');

  const fromPort = edge.fromPort || 'right';
  const toPort = edge.toPort || 'left';

  // Vertical orientation: connecting top to bottom or bottom to top
  if ((fromPort === 'bottom' && toPort === 'top') || (fromPort === 'top' && toPort === 'bottom')) {
    const midY = (p1.y + p2.y) / 2;
    return `M ${p1.x} ${p1.y} L ${p1.x} ${midY} L ${p2.x} ${midY} L ${p2.x} ${p2.y}`;
  }

  // Same side ports (e.g. bottom to bottom)
  if (fromPort === 'bottom' && toPort === 'bottom') {
    const maxY = Math.max(p1.y, p2.y) + 36;
    return `M ${p1.x} ${p1.y} L ${p1.x} ${maxY} L ${p2.x} ${maxY} L ${p2.x} ${p2.y}`;
  }

  if (fromPort === 'top' && toPort === 'top') {
    const minY = Math.min(p1.y, p2.y) - 36;
    return `M ${p1.x} ${p1.y} L ${p1.x} ${minY} L ${p2.x} ${minY} L ${p2.x} ${p2.y}`;
  }

  // Mixed horizontal/vertical (e.g., right to top)
  if ((fromPort === 'right' || fromPort === 'left') && (toPort === 'top' || toPort === 'bottom')) {
    return `M ${p1.x} ${p1.y} L ${p2.x} ${p1.y} L ${p2.x} ${p2.y}`;
  }

  if ((fromPort === 'top' || fromPort === 'bottom') && (toPort === 'right' || toPort === 'left')) {
    return `M ${p1.x} ${p1.y} L ${p1.x} ${p2.y} L ${p2.x} ${p2.y}`;
  }

  // Standard horizontal Manhattan (right to left, etc.)
  const midX = (p1.x + p2.x) / 2;
  return `M ${p1.x} ${p1.y} L ${midX} ${p1.y} L ${midX} ${p2.y} L ${p2.x} ${p2.y}`;
}

/**
 * Computes an orthogonal path for a wire currently being dragged by the mouse.
 * @param {Object} activeWire - { fromId, fromPort, mouseX, mouseY }
 * @param {(id: string) => Object | undefined} getNodeById
 * @returns {string} SVG Path string
 */
export function computeLiveWirePath(activeWire, getNodeById) {
  if (!activeWire) return '';
  const sourceNode = getNodeById(activeWire.fromId);
  if (!sourceNode) return '';

  const p1 = getPortCoords(sourceNode, activeWire.fromPort);
  const p2 = { x: activeWire.mouseX, y: activeWire.mouseY };

  if (activeWire.fromPort === 'bottom' || activeWire.fromPort === 'top') {
    const midY = (p1.y + p2.y) / 2;
    return `M ${p1.x} ${p1.y} L ${p1.x} ${midY} L ${p2.x} ${midY} L ${p2.x} ${p2.y}`;
  }

  const midX = (p1.x + p2.x) / 2;
  return `M ${p1.x} ${p1.y} L ${midX} ${p1.y} L ${midX} ${p2.y} L ${p2.x} ${p2.y}`;
}

/**
 * Computes the midpoint along the edge for placing the label.
 * @param {Object} edge
 * @param {(id: string) => Object | undefined} getNodeById
 * @returns {{ x: number, y: number }}
 */
export function getEdgeMidpoint(edge, getNodeById) {
  const sourceNode = getNodeById(edge.from);
  const targetNode = getNodeById(edge.to);
  if (!sourceNode || !targetNode) return { x: 0, y: 0 };

  const p1 = getPortCoords(sourceNode, edge.fromPort || 'right');
  const p2 = getPortCoords(targetNode, edge.toPort || 'left');

  return {
    x: (p1.x + p2.x) / 2,
    y: (p1.y + p2.y) / 2
  };
}
