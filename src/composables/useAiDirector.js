import { ref } from 'vue';
import { NODE_CATALOG } from '@/constants/catalog';
import { DEFAULT_AI_PROMPT } from '@/constants/defaultData';
import { solveAutoLayout } from '@/utils/autoLayoutSolver';

export function parseScriptToGraph(scriptText) {
  const lines = scriptText
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

  if (!lines.length) return null;

  const validTypes = NODE_CATALOG.map((c) => c.type);
  const rawNodes = [];
  const rawEdges = [];

  lines.forEach((line, idx) => {
    const [leftPart, rightPart] = line.split('|').map((s) => s?.trim() || '');
    let type = 'chip';
    let title = leftPart;

    if (leftPart.includes(':')) {
      const parts = leftPart.split(':');
      const prefix = parts[0].trim().toLowerCase();
      if (validTypes.includes(prefix)) {
        type = prefix;
        title = parts.slice(1).join(':').trim();
      }
    }

    const id = 'n_ai_' + idx;
    const variant = idx === 0 ? 'amber' : idx % 2 === 1 ? 'cyan' : 'emerald';

    rawNodes.push({
      id,
      type,
      variant,
      groupLabel: `etapa 0${idx + 1}`,
      title: title || `Bloco 0${idx + 1}`,
      subtitle: rightPart || 'Fluxo automatizado',
      badge: '[ok]',
      content: rightPart || 'Gerado pelo IA Director',
      mediaUrl:
        type === 'media'
          ? 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80'
          : '',
      x: 0,
      y: 0,
      w: 432
    });

    if (idx > 0) {
      // Connect sequential steps
      rawEdges.push({
        id: 'e_ai_' + idx,
        from: 'n_ai_' + (idx - 1),
        fromPort: 'right',
        to: id,
        toPort: 'left',
        label: `passo ${idx}`,
        color: idx === 1 ? 'amber' : 'cyan',
        animated: true
      });
    }
  });

  // For 4 items (like the default script), organize into 2 paired columns:
  // Col 0: Step 0 (top) -> Step 1 (bottom)
  // Col 1: Step 2 (top) -> Step 3 (bottom)
  // With Step 1 connecting to Step 2!
  if (rawNodes.length === 4) {
    rawEdges[0].fromPort = 'bottom';
    rawEdges[0].toPort = 'top';

    rawEdges[1].fromPort = 'right';
    rawEdges[1].toPort = 'left';

    rawEdges[2].fromPort = 'bottom';
    rawEdges[2].toPort = 'top';
  }

  // Run solveAutoLayout to compute optimal, collision-free geometry below the header!
  const layout = solveAutoLayout(rawNodes, rawEdges, {
    startX: 96,
    startY: 120,
    gapX: 144,
    gapY: 96
  });

  // Generate smooth scenes centered on each node with spotlight focus!
  const newScenes = layout.nodes.map((node, idx) => ({
    name: `etapa-0${idx + 1}`,
    title: node.title,
    subtitle: node.subtitle || 'Explicação visual conectada',
    x: Math.round(-node.x * 1.15 + 360),
    y: Math.round(-node.y * 1.15 + 160),
    zoom: 1.15,
    startTime: Number((idx * 4.5).toFixed(1)),
    activeNodeIds: [node.id]
  }));

  return { nodes: layout.nodes, edges: layout.edges, scenes: newScenes };
}

export function useAiDirector() {
  const aiPromptText = ref(DEFAULT_AI_PROMPT);

  const generateGraph = () => {
    return parseScriptToGraph(aiPromptText.value);
  };

  return {
    aiPromptText,
    generateGraph
  };
}
