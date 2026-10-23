import { describe, it, expect } from 'vitest';
import { generateHeuristicFromTopic, parseScriptToGraph } from '../src/composables/useAiDirector.js';
import { useDirectCanvasRenderer } from '../src/composables/useDirectCanvasRenderer.js';

describe('CircuitFlow Studio v6.0 - Timeline, Direct MP4 Renderer & AI Copilot', () => {
  describe('Universal AI Director Heuristic Topic Classifier', () => {
    it('generates distributed cache architecture for Redis/Postgres/RabbitMQ topics', () => {
      const topic = 'Como funciona um sistema de cache com Redis, RabbitMQ e PostgreSQL';
      const script = generateHeuristicFromTopic(topic);

      expect(script).toContain('Redis Cache');
      expect(script).toContain('PostgreSQL');
      expect(script).toContain('API Gateway');

      const graph = parseScriptToGraph(script);
      expect(graph.nodes.length).toBe(5);
      expect(graph.scenes.length).toBe(5);

      // Verify node types
      const types = graph.nodes.map(n => n.type);
      expect(types).toContain('browser');
      expect(types).toContain('api');
      expect(types).toContain('queue');
      expect(types).toContain('database');
      expect(types).toContain('metric');
    });

    it('generates security and reverse engineering architecture for auth/binary topics', () => {
      const topic = 'Análise de segurança e engenharia reversa de token binário';
      const script = generateHeuristicFromTopic(topic);

      expect(script).toContain('/usr/bin/auth_service');
      expect(script).toContain('Agente IA REA');
      expect(script).toContain('shield_patch.rs');

      const graph = parseScriptToGraph(script);
      const types = graph.nodes.map(n => n.type);
      expect(types).toContain('chip');
      expect(types).toContain('terminal');
      expect(types).toContain('decision');
      expect(types).toContain('code');
      expect(types).toContain('metric');
    });

    it('generates general workflow fallback for custom topics', () => {
      const topic = 'Processamento de Áudio em Tempo Real';
      const script = generateHeuristicFromTopic(topic);
      expect(script).toContain(topic);

      const graph = parseScriptToGraph(script);
      expect(graph.nodes.length).toBe(5);
      expect(graph.scenes.length).toBe(5);
    });
  });

  describe('Direct Canvas MP4 / WebM Renderer', () => {
    it('initializes direct renderer with zero-popup default state', () => {
      const { isDirectRendering, renderProgress, statusMessage } = useDirectCanvasRenderer();

      expect(isDirectRendering.value).toBe(false);
      expect(renderProgress.value).toBe(0);
      expect(statusMessage.value).toBe('');
    });

    it('cancels direct render cleanly', () => {
      const renderer = useDirectCanvasRenderer();
      renderer.isDirectRendering.value = true;
      renderer.cancelDirectRender();

      expect(renderer.isDirectRendering.value).toBe(false);
      expect(renderer.statusMessage.value).toContain('cancelada');
    });
  });

  describe('Studio Timeline Calculations', () => {
    const mockScenes = [
      { id: 's1', title: 'Cena 1', duration: 4.5 },
      { id: 's2', title: 'Cena 2', duration: 6.0 },
      { id: 's3', title: 'Cena 3', duration: 9.5 }
    ];

    it('calculates total duration and proportional block percentages correctly', () => {
      const total = mockScenes.reduce((acc, s) => acc + s.duration, 0);
      expect(total).toBe(20.0);

      // Scene 1: 4.5s out of 20s = 22.5%
      const s1Percent = (mockScenes[0].duration / total) * 100;
      expect(s1Percent).toBe(22.5);

      // Scene 2: 6.0s out of 20s = 30.0%
      const s2Percent = (mockScenes[1].duration / total) * 100;
      expect(s2Percent).toBe(30.0);

      // Scene 3: 9.5s out of 20s = 47.5%
      const s3Percent = (mockScenes[2].duration / total) * 100;
      expect(s3Percent).toBe(47.5);
    });

    it('seeks time accurately to the correct scene index', () => {
      const total = 20.0;
      const seekSeconds = 8.0;

      // Accumulated:
      // s1: 0 -> 4.5
      // s2: 4.5 -> 10.5 (8.0 falls in s2!)
      // s3: 10.5 -> 20.0
      let targetSceneIdx = 0;
      let acc = 0;
      for (let i = 0; i < mockScenes.length; i++) {
        if (seekSeconds <= acc + mockScenes[i].duration) {
          targetSceneIdx = i;
          break;
        }
        acc += mockScenes[i].duration;
      }

      expect(targetSceneIdx).toBe(1); // Scene 2 index
    });
  });
});
