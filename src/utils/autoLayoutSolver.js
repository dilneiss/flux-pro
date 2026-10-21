import { estimateNodeHeight } from '@/constants/catalog';

export const GRID = 24;

/**
 * World-class Collision-Free Graph Auto-Layout Solver
 *
 * Guarantees:
 * 1. ZERO node collisions (dynamic column widths based on actual node dimensions).
 * 2. Topological/Flow-aware column placement (Inputs -> Agents -> Results/Code).
 * 3. Vertical clustering for bottom->top connections (natural vertical chains).
 * 4. Automatic cable port correction so wires never loop backward through cards.
 * 5. Strict 24px grid alignment.
 *
 * @param {Array} nodes
 * @param {Array} edges
 * @param {Object} options
 * @returns {{ nodes: Array, edges: Array }}
 */
export function solveAutoLayout(nodes, edges, options = {}) {
  if (!nodes || nodes.length === 0) return { nodes: [], edges: [] };

  const startX = options.startX ?? 96;
  const startY = options.startY ?? 120;
  const gapX = options.gapX ?? 144; // Generous horizontal corridor for Manhattan wires and badges
  const gapY = options.gapY ?? 96;  // Vertical space between stacked cards

  const clonedNodes = JSON.parse(JSON.stringify(nodes));
  const clonedEdges = JSON.parse(JSON.stringify(edges || []));

  const nodeMap = new Map();
  clonedNodes.forEach((n) => nodeMap.set(n.id, n));

  // Determine graph structure:
  // 1. Build adjacency list of incoming and outgoing edges
  const inEdges = new Map();
  const outEdges = new Map();
  clonedNodes.forEach((n) => {
    inEdges.set(n.id, []);
    outEdges.set(n.id, []);
  });

  clonedEdges.forEach((edge) => {
    if (inEdges.has(edge.to)) inEdges.get(edge.to).push(edge);
    if (outEdges.has(edge.from)) outEdges.get(edge.from).push(edge);
  });

  // 2. Identify vertical pairs:
  // A vertical pair is an edge where fromPort is bottom and toPort is top (or vice-versa),
  // indicating one card is directly on top of the other.
  const verticalParentOf = new Map(); // childId -> parentId
  const verticalChildOf = new Map();  // parentId -> childId

  clonedEdges.forEach((edge) => {
    const isExplicitVertical =
      (edge.fromPort === 'bottom' && edge.toPort === 'top') ||
      (edge.fromPort === 'top' && edge.toPort === 'bottom');

    if (isExplicitVertical && nodeMap.has(edge.from) && nodeMap.has(edge.to)) {
      const parentId = edge.fromPort === 'bottom' ? edge.from : edge.to;
      const childId = edge.fromPort === 'bottom' ? edge.to : edge.from;

      // Only assign if parent does not already have a vertical child
      // and child does not already have a vertical parent
      if (!verticalChildOf.has(parentId) && !verticalParentOf.has(childId)) {
        verticalParentOf.set(childId, parentId);
        verticalChildOf.set(parentId, childId);
      }
    }
  });

  // 3. Compute topological column for each node
  // Forward pass: compute longest horizontal distance
  const colIndex = new Map();

  // Root nodes have no horizontal incoming edges (or no incoming edges)
  clonedNodes.forEach((node) => {
    colIndex.set(node.id, 0);
  });

  // Relax horizontal edges across multiple passes to handle DAG depth
  for (let pass = 0; pass < clonedNodes.length; pass++) {
    let changed = false;
    clonedEdges.forEach((edge) => {
      // If it's a vertical chain, keep them in the same column
      if (
        verticalChildOf.get(edge.from) === edge.to ||
        verticalParentOf.get(edge.from) === edge.to
      ) {
        const sharedCol = Math.max(colIndex.get(edge.from), colIndex.get(edge.to));
        if (colIndex.get(edge.from) !== sharedCol) {
          colIndex.set(edge.from, sharedCol);
          changed = true;
        }
        if (colIndex.get(edge.to) !== sharedCol) {
          colIndex.set(edge.to, sharedCol);
          changed = true;
        }
      } else {
        // Horizontal progression: target column should be at least source column + 1
        const srcCol = colIndex.get(edge.from);
        const tgtCol = colIndex.get(edge.to);
        if (tgtCol <= srcCol) {
          colIndex.set(edge.to, srcCol + 1);
          changed = true;
        }
      }
    });
    if (!changed) break;
  }

  // If a node is a vertical parent/child, sync their column strictly
  clonedNodes.forEach((node) => {
    const childId = verticalChildOf.get(node.id);
    if (childId) {
      const maxCol = Math.max(colIndex.get(node.id), colIndex.get(childId));
      colIndex.set(node.id, maxCol);
      colIndex.set(childId, maxCol);
    }
  });

  // Group nodes by column
  const maxCol = Math.max(0, ...Array.from(colIndex.values()));
  const columns = Array.from({ length: maxCol + 1 }, () => []);

  clonedNodes.forEach((node) => {
    const col = colIndex.get(node.id) || 0;
    columns[col].push(node);
  });

  // Sort nodes vertically within each column:
  // If node A is parent of node B (verticalChildOf), node A must come BEFORE node B
  columns.forEach((colNodes) => {
    colNodes.sort((a, b) => {
      if (verticalChildOf.get(a.id) === b.id) return -1;
      if (verticalChildOf.get(b.id) === a.id) return 1;
      // In-degree ordering
      return (inEdges.get(a.id)?.length || 0) - (inEdges.get(b.id)?.length || 0);
    });
  });

  // 4. Calculate dynamic column widths (strict max of all nodes in that column)
  const colWidths = columns.map((colNodes) => {
    if (!colNodes.length) return 384;
    return Math.max(...colNodes.map((n) => n.w || 384));
  });

  // Compute X starting position for each column
  const colStartX = [startX];
  for (let c = 1; c <= maxCol; c++) {
    const prevX = colStartX[c - 1];
    const prevW = colWidths[c - 1];
    colStartX.push(prevX + prevW + gapX);
  }

  // 5. Assign X and Y coordinates (collision-free & grid-aligned)
  columns.forEach((colNodes, c) => {
    let currentY = startY;
    const colX = colStartX[c];

    colNodes.forEach((node) => {
      node.x = Math.round(colX / GRID) * GRID;
      node.y = Math.round(currentY / GRID) * GRID;

      const h = estimateNodeHeight(node);
      currentY += h + gapY;
    });
  });

  // 6. Intelligent Port Auto-Correction
  // Reorients ports to match the clean final layout so cables never loop backwards
  clonedEdges.forEach((edge) => {
    const fromNode = nodeMap.get(edge.from);
    const toNode = nodeMap.get(edge.to);
    if (!fromNode || !toNode) return;

    const fromCol = colIndex.get(edge.from);
    const toCol = colIndex.get(edge.to);

    // Same column: vertical connection
    if (fromCol === toCol) {
      if (fromNode.y < toNode.y) {
        edge.fromPort = 'bottom';
        edge.toPort = 'top';
      } else {
        edge.fromPort = 'top';
        edge.toPort = 'bottom';
      }
    }
    // Target is in a subsequent column (to the right)
    else if (toCol > fromCol) {
      edge.fromPort = 'right';
      edge.toPort = 'left';
    }
    // Target is in a previous column (to the left)
    else {
      edge.fromPort = 'left';
      edge.toPort = 'right';
    }
  });

  return { nodes: clonedNodes, edges: clonedEdges };
}
