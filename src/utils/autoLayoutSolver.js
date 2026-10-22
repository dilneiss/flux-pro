import { estimateNodeHeight } from '@/constants/catalog';

export const GRID = 24;

/**
 * World-class Collision-Free Graph Auto-Layout Solver
 *
 * Guarantees:
 * 1. ZERO node collisions (dynamic column widths based on actual node dimensions).
 * 2. Topological/Flow-aware column placement (Inputs -> Agents -> Results/Code).
 * 3. Vertical chain integrity (nodes connected vertically bottom->top are kept strictly contiguous).
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
  const gapX = options.gapX ?? 120; // Clean horizontal corridor between columns
  const gapY = options.gapY ?? 80;  // Vertical space between stacked cards

  const clonedNodes = JSON.parse(JSON.stringify(nodes));
  const clonedEdges = JSON.parse(JSON.stringify(edges || []));

  const nodeMap = new Map();
  clonedNodes.forEach((n) => nodeMap.set(n.id, n));

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
  // An edge with fromPort: bottom and toPort: top (or vice-versa) binds two cards vertically
  const verticalParentOf = new Map(); // childId -> parentId
  const verticalChildOf = new Map();  // parentId -> childId

  clonedEdges.forEach((edge) => {
    const isExplicitVertical =
      (edge.fromPort === 'bottom' && edge.toPort === 'top') ||
      (edge.fromPort === 'top' && edge.toPort === 'bottom');

    if (isExplicitVertical && nodeMap.has(edge.from) && nodeMap.has(edge.to)) {
      const parentId = edge.fromPort === 'bottom' ? edge.from : edge.to;
      const childId = edge.fromPort === 'bottom' ? edge.to : edge.from;

      if (!verticalChildOf.has(parentId) && !verticalParentOf.has(childId)) {
        verticalParentOf.set(childId, parentId);
        verticalChildOf.set(parentId, childId);
      }
    }
  });

  // 3. Compute topological column for each node
  const colIndex = new Map();

  clonedNodes.forEach((node) => {
    colIndex.set(node.id, 0);
  });

  // Relax horizontal edges across multiple passes to compute longest DAG depth
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

  // Ensure vertical parent and child are strictly in the same column
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

  // 4. Sort nodes vertically within each column with CHAIN INTEGRITY:
  // Nodes in a vertical chain [parent, child] MUST remain strictly contiguous!
  // Standalone nodes are placed after the contiguous chains to avoid wires slicing through them.
  columns.forEach((colNodes, c) => {
    const visited = new Set();
    const orderedNodes = [];

    // First: insert complete contiguous vertical chains
    colNodes.forEach((node) => {
      if (verticalChildOf.has(node.id) && !verticalParentOf.has(node.id)) {
        let curr = node;
        while (curr && !visited.has(curr.id)) {
          visited.add(curr.id);
          orderedNodes.push(curr);
          const childId = verticalChildOf.get(curr.id);
          curr = childId ? colNodes.find((n) => n.id === childId) : null;
        }
      }
    });

    // Second: any other nodes that have connected edges
    colNodes.forEach((node) => {
      if (
        !visited.has(node.id) &&
        (inEdges.get(node.id)?.length > 0 || outEdges.get(node.id)?.length > 0)
      ) {
        visited.add(node.id);
        orderedNodes.push(node);
      }
    });

    // Third: standalone unattached nodes placed safely at the bottom
    colNodes.forEach((node) => {
      if (!visited.has(node.id)) {
        visited.add(node.id);
        orderedNodes.push(node);
      }
    });

    columns[c] = orderedNodes;
  });

  // 5. Calculate dynamic column widths (strict max of all nodes in that column)
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

  // 6. Assign X and Y coordinates (collision-free & grid-aligned)
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

  // 7. Intelligent Port Auto-Correction
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
