import { describe, it, expect } from 'vitest';
import { useElevenLabs } from '../src/composables/useElevenLabs.js';

describe('ElevenLabs Timestamps & Speech Alignment', () => {
  const sampleScenes = [
    { name: 'intro', title: 'Apresentação do Sistema', subtitle: 'Visão geral da arquitetura' },
    { name: 'code', title: 'Reimplementação do Driver de Áudio em Rust', subtitle: 'Compilação nativa com zero dependências externas' },
    { name: 'bench', title: '60 FPS Estáveis', subtitle: 'Conclusão e métricas finais' }
  ];

  it('calculates sequential speech timestamps based on text cadence', () => {
    const { autoAssignTimestampsFromScenes, duration } = useElevenLabs();
    const updated = autoAssignTimestampsFromScenes([...sampleScenes]);

    expect(updated[0].startTime).toBe(0);
    expect(updated[1].startTime).toBeGreaterThan(0);
    expect(updated[2].startTime).toBeGreaterThan(updated[1].startTime);
    expect(duration.value).toBeGreaterThan(updated[2].startTime);
  });

  it('updates audio playback state and tracks duration', () => {
    const { isPlaying, currentTime, duration, seekTo } = useElevenLabs();
    expect(isPlaying.value).toBe(false);
    expect(currentTime.value).toBe(0);
    expect(duration.value).toBe(0);
  });
});
