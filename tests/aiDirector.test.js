import { describe, it, expect } from 'vitest';
import { parseScriptToGraph } from '../src/composables/useAiDirector.js';

describe('useAiDirector Script Parser', () => {
  const sampleScript = `chip: /Applications/Photoshop.app | Binário Proprietário Original
terminal: Engenharia Reversa via REA | Investigando máscaras PSD
code: artcraft_psd_parser.rs | Reimplementação limpa em Rust
media: ArtCraft Studio Aberto | Compatível com PSD a 60fps`;

  it('parses structured script into nodes, edges and scenes', () => {
    const result = parseScriptToGraph(sampleScript);
    expect(result).not.toBeNull();
    expect(result.nodes).toHaveLength(4);
    expect(result.edges).toHaveLength(3);
    expect(result.scenes).toHaveLength(4);

    // Node 0
    expect(result.nodes[0].type).toBe('chip');
    expect(result.nodes[0].title).toBe('/Applications/Photoshop.app');
    expect(result.nodes[0].subtitle).toBe('Binário Proprietário Original');

    // Node 1
    expect(result.nodes[1].type).toBe('terminal');
    expect(result.nodes[1].title).toBe('Engenharia Reversa via REA');

    // Node 2
    expect(result.nodes[2].type).toBe('code');

    // Node 3
    expect(result.nodes[3].type).toBe('media');

    // Check sequential edges
    expect(result.edges[0].from).toBe('n_ai_0');
    expect(result.edges[0].to).toBe('n_ai_1');
    expect(result.edges[1].from).toBe('n_ai_1');
    expect(result.edges[1].to).toBe('n_ai_2');
    expect(result.edges[2].from).toBe('n_ai_2');
    expect(result.edges[2].to).toBe('n_ai_3');

    // Check generated scenes
    expect(result.scenes[0].name).toBe('etapa-01');
    expect(result.scenes[0].title).toBe('/Applications/Photoshop.app');
  });

  it('handles empty or blank script gracefully', () => {
    const result = parseScriptToGraph('');
    expect(result).toBeNull();
  });
});
