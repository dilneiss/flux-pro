import { estimateNodeHeight } from '../constants/catalog.js';

export const GRID = 24;

/**
 * Calculates the exact (x, y) coordinates for a node's magnetic port.
 * Uses real DOM measurements if available, with robust fallback.
 *
 * @param {Object} node - Node object with { x, y, w, type, content }
 * @param {'top' | 'right' | 'bottom' | 'left'} [port='right']
 * @returns {{ x: number, y: number }}
 */
export function getPortCoords(node, port = 'right') {
  if (!node) return { x: 0, y: 0 };
  let h = node.customHeight || estimateNodeHeight(node);
  let w = node.w || 384;

  if (!node.customHeight && typeof document !== 'undefined') {
    const el = document.getElementById(`node-${node.id}`);
    if (el && el.offsetHeight > 0) {
      h = el.offsetHeight;
      w = el.offsetWidth || w;
    }
  }

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
 * Calculates the optimal, most natural port pairing between two nodes
 * based on their relative geometric positions on the canvas.
 *
 * @param {Object} sourceNode
 * @param {Object} targetNode
 * @returns {{ fromPort: 'top'|'right'|'bottom'|'left', toPort: 'top'|'right'|'bottom'|'left' }}
 */
export function getOptimalEdgePorts(sourceNode, targetNode) {
  if (!sourceNode || !targetNode) return { fromPort: 'right', toPort: 'left' };

  const srcW = sourceNode.w || 384;
  const srcH = sourceNode.customHeight || estimateNodeHeight(sourceNode);
  const tgtW = targetNode.w || 384;
  const tgtH = targetNode.customHeight || estimateNodeHeight(targetNode);

  const srcCenter = { x: sourceNode.x + srcW / 2, y: sourceNode.y + srcH / 2 };
  const tgtCenter = { x: targetNode.x + tgtW / 2, y: targetNode.y + tgtH / 2 };

  const dx = tgtCenter.x - srcCenter.x;
  const dy = tgtCenter.y - srcCenter.y;

  // Preference for clean horizontal pipeline between columns
  if (Math.abs(dx) >= Math.abs(dy) * 0.7 || Math.abs(dx) > srcW * 0.6) {
    if (dx > 0) {
      return { fromPort: 'right', toPort: 'left' };
    } else {
      return { fromPort: 'left', toPort: 'right' };
    }
  }

  // Mostly vertical stacked in the same column
  if (dy > 0) {
    return { fromPort: 'bottom', toPort: 'top' };
  } else {
    return { fromPort: 'top', toPort: 'bottom' };
  }
}

/**
 * Robust 90° Manhattan Orthogonal Router with multi-lane track offsets.
 * Strictly guarantees clean horizontal and vertical PCB trace segments,
 * separates parallel tracks into dedicated lanes, and routes through open corridors.
 *
 * @param {Object} edge - Edge with { from, fromPort, to, toPort }
 * @param {(id: string) => Object | undefined} getNodeById
 * @param {number} [edgeIndex=0] - Index of the edge to calculate lane offset
 * @returns {string} SVG Path string
 */
export function computeSmartManhattanPath(edge, getNodeById, edgeIndex = 0) {
  const sourceNode = getNodeById(edge.from);
  const targetNode = getNodeById(edge.to);

  if (!sourceNode || !targetNode) return '';

  const fromPort = edge.fromPort || 'right';
  const toPort = edge.toPort || 'left';

  const p1 = getPortCoords(sourceNode, fromPort);
  const p2 = getPortCoords(targetNode, toPort);

  const STUB = 24;
  const laneOffset = typeof edgeIndex === 'number' ? ((edgeIndex % 3) - 1) * 24 : 0;

  // 1. Same-direction vertical loops (bottom -> bottom, top -> top)
  if (fromPort === 'bottom' && toPort === 'bottom') {
    const maxY = Math.max(p1.y, p2.y) + STUB * 1.5 + Math.abs(laneOffset);
    return `M ${p1.x} ${p1.y} L ${p1.x} ${maxY} L ${p2.x} ${maxY} L ${p2.x} ${p2.y}`;
  }

  if (fromPort === 'top' && toPort === 'top') {
    const minY = Math.min(p1.y, p2.y) - STUB * 1.5 - Math.abs(laneOffset);
    return `M ${p1.x} ${p1.y} L ${p1.x} ${minY} L ${p2.x} ${minY} L ${p2.x} ${p2.y}`;
  }

  // 2. Same-direction horizontal loops (right -> right, left -> left)
  if (fromPort === 'right' && toPort === 'right') {
    const maxX = Math.max(p1.x, p2.x) + STUB * 1.5 + Math.abs(laneOffset);
    return `M ${p1.x} ${p1.y} L ${maxX} ${p1.y} L ${maxX} ${p2.y} L ${p2.x} ${p2.y}`;
  }

  if (fromPort === 'left' && toPort === 'left') {
    const minX = Math.min(p1.x, p2.x) - STUB * 1.5 - Math.abs(laneOffset);
    return `M ${p1.x} ${p1.y} L ${minX} ${p1.y} L ${minX} ${p2.y} L ${p2.x} ${p2.y}`;
  }

  // 3. Opposing vertical ports (bottom -> top, top -> bottom)
  if ((fromPort === 'bottom' && toPort === 'top') || (fromPort === 'top' && toPort === 'bottom')) {
    if ((fromPort === 'bottom' && p1.y <= p2.y) || (fromPort === 'top' && p1.y >= p2.y)) {
      // Natural forward flow
      const midY = (p1.y + p2.y) / 2;
      return `M ${p1.x} ${p1.y} L ${p1.x} ${midY} L ${p2.x} ${midY} L ${p2.x} ${p2.y}`;
    } else {
      // Backwards vertical flow: requires lateral bypass with lane offset
      const stepY = fromPort === 'bottom' ? p1.y + STUB : p1.y - STUB;
      const bypassX = Math.max(p1.x, p2.x) + 48 + Math.abs(laneOffset);
      const stepY2 = toPort === 'top' ? p2.y - STUB : p2.y + STUB;
      return `M ${p1.x} ${p1.y} L ${p1.x} ${stepY} L ${bypassX} ${stepY} L ${bypassX} ${stepY2} L ${p2.x} ${stepY2} L ${p2.x} ${p2.y}`;
    }
  }

  // 4. Opposing horizontal ports (right -> left, left -> right)
  if ((fromPort === 'right' && toPort === 'left') || (fromPort === 'left' && toPort === 'right')) {
    if ((fromPort === 'right' && p1.x <= p2.x) || (fromPort === 'left' && p1.x >= p2.x)) {
      // Natural forward flow with multi-lane track offset through the central corridor
      const midX = (p1.x + p2.x) / 2 + laneOffset;
      return `M ${p1.x} ${p1.y} L ${midX} ${p1.y} L ${midX} ${p2.y} L ${p2.x} ${p2.y}`;
    } else {
      // Backwards horizontal flow: requires vertical bypass through open corridor
      const stepX = fromPort === 'right' ? p1.x + STUB : p1.x - STUB;
      const bypassY = Math.max(p1.y, p2.y) + 48 + Math.abs(laneOffset);
      const stepX2 = toPort === 'left' ? p2.x - STUB : p2.x + STUB;
      return `M ${p1.x} ${p1.y} L ${stepX} ${p1.y} L ${stepX} ${bypassY} L ${stepX2} ${bypassY} L ${stepX2} ${p2.y} L ${p2.x} ${p2.y}`;
    }
  }

  // 5. Perpendicular (Right/Left -> Top/Bottom)
  if (fromPort === 'right' || fromPort === 'left') {
    const isRight = fromPort === 'right';
    const midX = Math.round((p1.x + p2.x) / 2) + laneOffset;

    if (toPort === 'top') {
      if (p2.y >= p1.y) {
        // Target is below: exit horizontal to p2.x, then vertical into top port
        return `M ${p1.x} ${p1.y} L ${p2.x} ${p1.y} L ${p2.x} ${p2.y}`;
      } else {
        // Target is above: route vertical leg through midX corridor
        const safeX = isRight && p2.x > p1.x ? midX : (isRight ? p1.x + STUB : p1.x - STUB);
        const stepY = p2.y - STUB;
        return `M ${p1.x} ${p1.y} L ${safeX} ${p1.y} L ${safeX} ${stepY} L ${p2.x} ${stepY} L ${p2.x} ${p2.y}`;
      }
    } else { // toPort === 'bottom'
      if (p2.y <= p1.y) {
        // Target is above: exit horizontal to p2.x, then vertical into bottom port
        return `M ${p1.x} ${p1.y} L ${p2.x} ${p1.y} L ${p2.x} ${p2.y}`;
      } else {
        // Target is below: route vertical leg through midX corridor
        const safeX = isRight && p2.x > p1.x ? midX : (isRight ? p1.x + STUB : p1.x - STUB);
        const stepY = p2.y + STUB;
        return `M ${p1.x} ${p1.y} L ${safeX} ${p1.y} L ${safeX} ${stepY} L ${p2.x} ${stepY} L ${p2.x} ${p2.y}`;
      }
    }
  }

  // 6. Perpendicular (Top/Bottom -> Right/Left)
  if (fromPort === 'top' || fromPort === 'bottom') {
    const isBottom = fromPort === 'bottom';
    const midY = Math.round((p1.y + p2.y) / 2);

    if (toPort === 'left') {
      if (p2.x >= p1.x) {
        // Target is to the right: exit vertical to p2.y, then horizontal into left port
        return `M ${p1.x} ${p1.y} L ${p1.x} ${p2.y} L ${p2.x} ${p2.y}`;
      } else {
        // Target is to the left: route horizontal leg through midY corridor
        const safeY = isBottom && p2.y > p1.y ? midY : (isBottom ? p1.y + STUB : p1.y - STUB);
        const stepX = p2.x - STUB;
        return `M ${p1.x} ${p1.y} L ${p1.x} ${safeY} L ${stepX} ${safeY} L ${stepX} ${p2.y} L ${p2.x} ${p2.y}`;
      }
    } else { // toPort === 'right'
      if (p2.x <= p1.x) {
        // Target is to the left: exit vertical to p2.y, then horizontal into right port
        return `M ${p1.x} ${p1.y} L ${p1.x} ${p2.y} L ${p2.x} ${p2.y}`;
      } else {
        // Target is to the right: route horizontal leg through midY corridor
        const safeY = isBottom && p2.y > p1.y ? midY : (isBottom ? p1.y + STUB : p1.y - STUB);
        const stepX = p2.x + STUB;
        return `M ${p1.x} ${p1.y} L ${p1.x} ${safeY} L ${stepX} ${safeY} L ${stepX} ${p2.y} L ${p2.x} ${p2.y}`;
      }
    }
  }

  // Default fallback: 90° Manhattan step with lane offset
  const midX = (p1.x + p2.x) / 2 + laneOffset;
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
 * Specifically prevents vertical collision with target node top borders and groupLabels,
 * and offsets badges across parallel lanes.
 *
 * @param {Object} edge
 * @param {(id: string) => Object | undefined} getNodeById
 * @param {number} [edgeIndex=0]
 * @returns {{ x: number, y: number }}
 */
export function getEdgeMidpoint(edge, getNodeById, edgeIndex = 0) {
  const sourceNode = getNodeById(edge.from);
  const targetNode = getNodeById(edge.to);
  if (!sourceNode || !targetNode) return { x: 0, y: 0 };

  const fromPort = edge.fromPort || 'right';
  const toPort = edge.toPort || 'left';

  const p1 = getPortCoords(sourceNode, fromPort);
  const p2 = getPortCoords(targetNode, toPort);

  const laneOffset = typeof edgeIndex === 'number' ? ((edgeIndex % 3) - 1) * 24 : 0;

  // Vertical connection (bottom -> top):
  // Position badge at 35% of the distance from the top source port,
  // ensuring it never collides with the destination node's top border or groupLabel!
  if (fromPort === 'bottom' && toPort === 'top') {
    const midY = Math.round(p1.y + (p2.y - p1.y) * 0.35);
    const midX = Math.round((p1.x + p2.x) / 2);
    return { x: midX, y: midY };
  }

  // Reverse vertical (top -> bottom):
  if (fromPort === 'top' && toPort === 'bottom') {
    const midY = Math.round(p1.y + (p2.y - p1.y) * 0.65);
    const midX = Math.round((p1.x + p2.x) / 2);
    return { x: midX, y: midY };
  }

  // Horizontal connection with lane offset:
  if ((fromPort === 'right' && toPort === 'left') || (fromPort === 'left' && toPort === 'right')) {
    const midX = Math.round((p1.x + p2.x) / 2) + laneOffset;
    const midY = Math.round((p1.y + p2.y) / 2);
    return { x: midX, y: midY };
  }

  // Perpendicular connections (Right/Left -> Top/Bottom)
  if (fromPort === 'right' || fromPort === 'left') {
    const midX = Math.round((p1.x + p2.x) / 2) + laneOffset;
    return {
      x: midX,
      y: Math.round((p1.y + p2.y) / 2)
    };
  }

  // Perpendicular connections (Top/Bottom -> Right/Left)
  if (fromPort === 'top' || fromPort === 'bottom') {
    const midY = Math.round((p1.y + p2.y) / 2);
    return {
      x: Math.round((p1.x + p2.x) / 2),
      y: midY
    };
  }

  return {
    x: Math.round((p1.x + p2.x) / 2),
    y: Math.round((p1.y + p2.y) / 2)
  };
}
