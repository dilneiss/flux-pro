import { Router } from 'express';

const router = Router();

const VALID_TYPES = [
  'chip',
  'terminal',
  'finder',
  'media',
  'code',
  'database',
  'api',
  'mobile',
  'browser',
  'metric',
  'queue',
  'hardware',
  'decision',
  'compare',
  'callout',
  'question'
];

router.post('/parse-script', (req, res) => {
  try {
    const { script } = req.body;
    if (!script || typeof script !== 'string') {
      return res.status(400).json({ error: 'script string is required' });
    }

    const lines = script
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);

    const nodes = [];
    const edges = [];
    const scenes = [];

    lines.forEach((line, idx) => {
      const [leftPart, rightPart] = line.split('|').map((s) => s?.trim() || '');
      let type = 'chip';
      let title = leftPart;

      if (leftPart.includes(':')) {
        const parts = leftPart.split(':');
        const prefix = parts[0].trim().toLowerCase();
        if (VALID_TYPES.includes(prefix)) {
          type = prefix;
          title = parts.slice(1).join(':').trim();
        }
      }

      const id = 'n_ai_' + idx;
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const x = 96 + col * 552;
      const y = 72 + row * 312;

      nodes.push({
        id,
        type,
        variant: idx === 0 ? 'amber' : idx % 2 === 1 ? 'cyan' : 'emerald',
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
        edges.push({
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

      scenes.push({
        name: `etapa-0${idx + 1}`,
        title: title || `Etapa 0${idx + 1}`,
        subtitle: rightPart || 'Explicação visual conectada',
        x: -x + 280,
        y: -y + 140,
        zoom: 1.15
      });
    });

    res.json({
      success: true,
      nodes,
      edges,
      scenes
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to parse script', details: err.message });
  }
});

export default router;
