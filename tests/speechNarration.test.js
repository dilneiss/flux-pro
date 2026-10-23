import { describe, it, expect } from 'vitest';
import { useSpeechNarration } from '../src/composables/useSpeechNarration.js';

describe('useSpeechNarration Engine', () => {
  it('estimates duration accurately based on word count', () => {
    const { estimateDuration } = useSpeechNarration();

    // Empty text
    expect(estimateDuration('')).toBe(4);

    // Short phrase (~10 words)
    const phrase = 'Tudo começa apontando o executável que queremos entender no sistema.';
    const duration = estimateDuration(phrase);
    expect(duration).toBeGreaterThanOrEqual(4.5);
    expect(duration).toBeLessThanOrEqual(7.0);

    // Longer paragraph
    const paragraph = 'Com os padrões decodificados, reimplementamos uma versão própria em TypeScript rodando a sessenta frames por segundo com total controle sobre o fluxo e sem dependências externas.';
    const longDuration = estimateDuration(paragraph);
    expect(longDuration).toBeGreaterThan(duration);
  });

  it('initializes with enabled state and speech parameters', () => {
    const engine = useSpeechNarration();
    expect(engine.isSpeechEnabled.value).toBe(true);
    expect(engine.isSpeaking.value).toBe(false);
    expect(engine.speechRate.value).toBeGreaterThan(0.9);
    expect(typeof engine.speak).toBe('function');
    expect(typeof engine.cancel).toBe('function');
  });
});
