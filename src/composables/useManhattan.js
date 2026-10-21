import { estimateNodeHeight } from '@/constants/catalog';

/**
 * Calculates the exact (x, y) coordinates for a node's magnetic port.
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
      return { x: Math.round(node.x + w / 2), y: Math.round(node.y) };
    case 'bottom':
      return { x: Math.round(node.x + w / 2), y: Math.round(node.y + h) };
    case 'left':
      return { x: Math.round(node.x), y: Math.round(node.y + h / 2) };
    case 'right':
    default:
      return { x: Math.round(node.x + w), y: Math.round(node.y + h / 2) };
  }
}

/**
 * Robust 90° Manhattan Orthogonal Router supporting all 16 directional port pairs.
 * Strictly guarantees clean horizontal and vertical PCB trace segments.
 *
 * @param {Object} edge - Edge with { from, fromPort, to, toPort }
 * @param {(id: string) => Object | undefined} getNodeById
 * @returns {string} SVG Path string
 */
export function computeSmartManhattanPath(edge, getNodeById) {
  const sourceNode = getNodeById(edge.from);
  const targetNode = getNodeById(edge.to);

  if (!sourceNode || !targetNode) return '';

  const fromPort = edge.fromPort || 'right';
  const toPort = edge.toPort || 'left';

  const p1 = getPortCoords(sourceNode, fromPort);
  const p2 = getPortCoords(targetNode, toPort);

  const STUB = 24;

  // 1. Same-direction vertical loops (bottom -> bottom, top -> top)
  if (fromPort === 'bottom' && toPort === 'bottom') {
    const maxY = Math.max(p1.y, p2.y) + STUB * 1.5;
    return `M ${p1.x} ${p1.y} L ${p1.x} ${maxY} L ${p2.x} ${maxY} L ${p2.x} ${p2.y}`;
  }

  if (fromPort === 'top' && toPort === 'top') {
    const minY = Math.min(p1.y, p2.y) - STUB * 1.5;
    return `M ${p1.x} ${p1.y} L ${p1.x} ${minY} L ${p2.x} ${minY} L ${p2.x} ${p2.y}`;
  }

  // 2. Same-direction horizontal loops (right -> right, left -> left)
  if (fromPort === 'right' && toPort === 'right') {
    const maxX = Math.max(p1.x, p2.x) + STUB * 1.5;
    return `M ${p1.x} ${p1.y} L ${maxX} ${p1.y} L ${maxX} ${p2.y} L ${p2.x} ${p2.y}`;
  }

  if (fromPort === 'left' && toPort === 'left') {
    const minX = Math.min(p1.x, p2.x) - STUB * 1.5;
    return `M ${p1.x} ${p1.y} L ${minX} ${p1.y} L ${minX} ${p2.y} L ${p2.x} ${p2.y}`;
  }

  // 3. Opposing vertical ports (bottom -> top, top -> bottom)
  if ((fromPort === 'bottom' && toPort === 'top') || (fromPort === 'top' && toPort === 'bottom')) {
    if ((fromPort === 'bottom' && p1.y <= p2.y) || (fromPort === 'top' && p1.y >= p2.y)) {
      // Natural forward flow
      const midY = (p1.y + p2.y) / 2;
      return `M ${p1.x} ${p1.y} L ${p1.x} ${midY} L ${p2.x} ${midY} L ${p2.x} ${p2.y}`;
    } else {
      // Backwards vertical flow: requires lateral bypass
      const stepY = fromPort === 'bottom' ? p1.y + STUB : p1.y - STUB;
      const bypassX = Math.max(p1.x, p2.x) + 48;
      const stepY2 = toPort === 'top' ? p2.y - STUB : p2.y + STUB;
      return `M ${p1.x} ${p1.y} L ${p1.x} ${stepY} L ${bypassX} ${stepY} L ${bypassX} ${stepY2} L ${p2.x} ${stepY2} L ${p2.x} ${p2.y}`;
    }
  }

  // 4. Opposing horizontal ports (right -> left, left -> right)
  if ((fromPort === 'right' && toPort === 'left') || (fromPort === 'left' && toPort === 'right')) {
    if ((fromPort === 'right' && p1.x <= p2.x) || (fromPort === 'left' && p1.x >= p2.x)) {
      // Natural forward flow
      const midX = (p1.x + p2.x) / 2;
      return `M ${p1.x} ${p1.y} L ${midX} ${p1.y} L ${midX} ${p2.y} L ${p2.x} ${p2.y}`;
    } else {
      // Backwards horizontal flow: requires vertical bypass
      const stepX = fromPort === 'right' ? p1.x + STUB : p1.x - STUB;
      const bypassY = Math.max(p1.y, p2.y) + 48;
      const stepX2 = toPort === 'left' ? p2.x - STUB : p2.x + STUB;
      return `M ${p1.x} ${p1.y} L ${stepX} ${p1.y} L ${stepX} ${bypassY} L ${stepX2} ${bypassY} L ${stepX2} ${p2.y} L ${p2.x} ${p2.y}`;
    }
  }

  // 5. Perpendicular (Right/Left -> Top/Bottom)
  if (fromPort === 'right' || fromPort === 'left') {
    const stubX = fromPort === 'right' ? p1.x + STUB : p1.x - STUB;
    if ((toPort === 'top' && p2.y >= p1.y) || (toPort === 'bottom' && p2.y <= p1.y)) {
      return `M ${p1.x} ${p1.y} L ${p2.x} ${p1.y} L ${p2.x} ${p2.y}`;
    } else {
      const stepY = toPort === 'top' ? p2.y - STUB : p2.y + STUB;
      return `M ${p1.x} ${p1.y} L ${stubX} ${p1.y} L ${stubX} ${stepY} L ${p2.x} ${stepY} L ${p2.x} ${p2.y}`;
    }
  }

  // 6. Perpendicular (Top/Bottom -> Right/Left)
  if (fromPort === 'top' || fromPort === 'bottom') {
    const stubY = fromPort === 'bottom' ? p1.y + STUB : p1.y - STUB;
    if ((toPort === 'left' && p2.x >= p1.x) || (toPort === 'right' && p2.x <= p1.x)) {
      return `M ${p1.x} ${p1.y} L ${p1.x} ${p2.y} L ${p2.x} ${p2.y}`;
    } else {
      const stepX = toPort === 'left' ? p2.x - STUB : p2.x + STUB;
      return `M ${p1.x} ${p1.y} L ${p1.x} ${stubY} L ${stepX} ${stubY} L ${stepX} ${p2.y} L ${p2.x} ${p2.y}`;
    }
  }

  // Default fallback: 90° Manhattan step
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
    x: Math.round((p1.x + p2.x) / 2),
    y: Math.round((p1.y + p2.y) / 2)
  };
}
