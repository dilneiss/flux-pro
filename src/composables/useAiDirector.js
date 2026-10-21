import { ref } from 'vue';
import { NODE_CATALOG } from '@/constants/catalog';
import { DEFAULT_AI_PROMPT } from '@/constants/defaultData';

export function parseScriptToGraph(scriptText) {
  const lines = scriptText
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

  if (!lines.length) return null;

  const validTypes = NODE_CATALOG.map((c) => c.type);
  const newNodes = [];
  const newEdges = [];
  const newScenes = [];

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
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const x = 96 + col * 552;
    const y = 72 + row * 312;

    const variant = idx === 0 ? 'amber' : idx % 2 === 1 ? 'cyan' : 'emerald';

    newNodes.push({
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
      x,
      y,
      w: 432
    });

    if (idx > 0) {
      newEdges.push({
        id: 'e_ai_' + idx,
        from: 'n_ai_' + (idx - 1),
        fromPort: col === 1 ? 'right' : 'bottom',
        to: id,
        toPort: col === 1 ? 'left' : 'top',
        label: `passo ${idx}`,
        color: idx === 1 ? 'amber' : 'cyan',
        animated: true
      });
    }

    newScenes.push({
      name: `etapa-0${idx + 1}`,
      title: title || `Etapa 0${idx + 1}`,
      subtitle: rightPart || 'Explicação visual conectada',
      x: -x + 280,
      y: -y + 140,
      zoom: 1.15
    });
  });

  return { nodes: newNodes, edges: newEdges, scenes: newScenes };
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
