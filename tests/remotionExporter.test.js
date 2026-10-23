import { describe, it, expect } from 'vitest';
import { generateRemotionTsx } from '../src/utils/remotionExporter.js';
import { DEFAULT_META, DEFAULT_NODES, DEFAULT_EDGES, DEFAULT_SCENES } from '../src/constants/defaultData.js';

describe('Remotion Exporter (.tsx) Generator', () => {
  it('generates production-grade Remotion TypeScript composition', () => {
    const code = generateRemotionTsx({
      meta: DEFAULT_META,
      nodes: DEFAULT_NODES,
      edges: DEFAULT_EDGES,
      scenes: DEFAULT_SCENES
    });

    expect(code).toBeTruthy();
    expect(code).toContain("from 'remotion';");
    expect(code).toContain('useCurrentFrame');
    expect(code).toContain('interpolate');
    expect(code).toContain('export const CircuitFlowVideo: React.FC');
    expect(code).toContain('export const RemotionRoot: React.FC');
    expect(code).toContain('Easing.bezier(0.22, 1, 0.36, 1)');
    expect(code).toContain('pulseOffset');
    expect(code).toContain('3840'); // 4K width
    expect(code).toContain('2160'); // 4K height
  });
});
