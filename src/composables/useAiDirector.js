import { ref } from 'vue';
import { NODE_CATALOG } from '@/constants/catalog';
import { DEFAULT_AI_PROMPT } from '@/constants/defaultData';
import { solveAutoLayout } from '@/utils/autoLayoutSolver';

/**
 * Parses script lines in either format:
 * Format A (4 parts): Tipo | Título | Subtítulo | Narração Falada
 * Format B (2 parts): tipo: Título | Subtítulo
 */
export function parseScriptToGraph(scriptText) {
  const lines = scriptText
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

  if (!lines.length) return null;

  const validTypes = NODE_CATALOG.map((c) => c.type);
  const rawNodes = [];
  const rawEdges = [];
  const narrations = [];

  lines.forEach((line, idx) => {
    const parts = line.split('|').map((s) => s?.trim() || '');

    let type = 'chip';
    let title = `Bloco 0${idx + 1}`;
    let subtitle = 'Fluxo automatizado';
    let narration = '';

    if (parts.length >= 4) {
      // 4-part syntax: Tipo | Título | Subtítulo | Narração
      const rawType = parts[0].toLowerCase().replace(/[^a-z0-9_-]/g, '');
      type = validTypes.includes(rawType) ? rawType : 'chip';
      title = parts[1] || title;
      subtitle = parts[2] || subtitle;
      narration = parts.slice(3).join(' | ').trim();
    } else if (parts.length >= 2) {
      // 2 or 3-part syntax
      const leftPart = parts[0];
      title = leftPart;
      subtitle = parts[1] || subtitle;
      narration = parts[2] || '';

      if (leftPart.includes(':')) {
        const colonParts = leftPart.split(':');
        const prefix = colonParts[0].trim().toLowerCase();
        if (validTypes.includes(prefix)) {
          type = prefix;
          title = colonParts.slice(1).join(':').trim();
        }
      }
    } else {
      title = parts[0];
    }

    if (!narration) {
      narration = `Nesta etapa analisamos ${title}. Os parâmetros foram processados com sucesso.`;
    }

    const id = 'n_ai_' + idx;
    const variant = idx === 0 ? 'amber' : idx % 2 === 1 ? 'cyan' : 'emerald';

    rawNodes.push({
      id,
      type,
      variant,
      groupLabel: `etapa 0${idx + 1}`,
      title: title || `Bloco 0${idx + 1}`,
      subtitle: subtitle || 'Fluxo automatizado',
      badge: '[ok]',
      content: narration || subtitle,
      mediaUrl:
        type === 'media'
          ? 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80'
          : '',
      x: 0,
      y: 0,
      w: 432
    });

    narrations.push(narration);

    if (idx > 0) {
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

  // Smart pairing for 4 nodes
  if (rawNodes.length === 4) {
    rawEdges[0].fromPort = 'bottom';
    rawEdges[0].toPort = 'top';

    rawEdges[1].fromPort = 'right';
    rawEdges[1].toPort = 'left';

    rawEdges[2].fromPort = 'bottom';
    rawEdges[2].toPort = 'top';
  }

  // Smart pairing for 5 nodes (Col 0: 2 nodes, Col 1: 2 nodes, Col 2: 1 node)
  if (rawNodes.length === 5) {
    rawEdges[0].fromPort = 'bottom';
    rawEdges[0].toPort = 'top';

    rawEdges[1].fromPort = 'right';
    rawEdges[1].toPort = 'left';

    rawEdges[2].fromPort = 'bottom';
    rawEdges[2].toPort = 'top';

    rawEdges[3].fromPort = 'right';
    rawEdges[3].toPort = 'left';
  }

  // Run solveAutoLayout to compute optimal, collision-free geometry below the header
  const layout = solveAutoLayout(rawNodes, rawEdges, {
    startX: 96,
    startY: 120,
    gapX: 144,
    gapY: 96
  });

  // Calculate cumulative timestamps for YouTube chapters
  let cumulativeTime = 0;

  // Generate smooth scenes centered on each node with spotlight focus & narration text!
  const newScenes = layout.nodes.map((node, idx) => {
    const text = narrations[idx];
    const words = text.split(/\s+/).filter(Boolean).length;
    const duration = Math.max(4.5, Number((words / 2.33 + 0.8).toFixed(1)));
    const startTime = Number(cumulativeTime.toFixed(1));
    cumulativeTime += duration;

    return {
      id: `scene_ai_${idx + 1}`,
      name: `etapa-0${idx + 1}`,
      title: node.title,
      subtitle: node.subtitle || 'Explicação visual conectada',
      x: Math.round(-node.x * 1.15 + 360),
      y: Math.round(-node.y * 1.15 + 160),
      zoom: 1.15,
      startTime,
      duration,
      narrationText: text,
      activeNodeIds: [node.id],
      revealMode: true
    };
  });

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
