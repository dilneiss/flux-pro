import { describe, it, expect } from 'vitest';
import { MARKETPLACE_PRESETS } from '../src/constants/marketplacePresets.js';

describe('Marketplace SaaS Presets Integrity', () => {
  it('contains 5 high-converting niche templates with complete data', () => {
    expect(MARKETPLACE_PRESETS).toHaveLength(5);

    MARKETPLACE_PRESETS.forEach((preset) => {
      expect(preset.id).toBeTruthy();
      expect(preset.name).toBeTruthy();
      expect(preset.price).toContain('R$');
      expect(preset.category).toBeTruthy();
      expect(preset.nodes.length).toBeGreaterThanOrEqual(3);
      expect(preset.edges.length).toBeGreaterThanOrEqual(2);
      expect(preset.scenes.length).toBeGreaterThanOrEqual(3);

      // Verify each edge connects valid nodes
      const nodeIds = preset.nodes.map((n) => n.id);
      preset.edges.forEach((edge) => {
        expect(nodeIds).toContain(edge.from);
        expect(nodeIds).toContain(edge.to);
        expect(['top', 'right', 'bottom', 'left']).toContain(edge.fromPort);
        expect(['top', 'right', 'bottom', 'left']).toContain(edge.toPort);
      });

      // Verify scenes have sequential timestamps
      preset.scenes.forEach((scene) => {
        expect(typeof scene.startTime).toBe('number');
        expect(typeof scene.zoom).toBe('number');
      });
    });
  });
});
