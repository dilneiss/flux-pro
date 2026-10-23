import { describe, it, expect } from 'vitest';
import { parseScriptToGraph } from '../src/composables/useAiDirector.js';

describe('useAiDirector 4-Part Script Parser & Narration Generator', () => {
  const sampleScript = `chip | /bin/target_auth.bin | Binário de Autenticação | Vamos iniciar a análise por este binário de segurança encontrado no servidor.
terminal | Agente IA REA | Inspeção Estática de Símbolos | O agente decompila as instruções de máquina em busca de rotas desprotegidas.
database | PostgreSQL v16 | Tabela de Licenças e Chaves | Identificamos o banco de dados onde os tokens criptografados eram validados.
code | auth_bypass_fix.rs | Patch de Blindagem em Rust | Escrevemos a correção estrita em Rust com validação assimétrica de chaves.
media | Dashboard Protegido | Produção 100% Blindada | Sistema em execução contínua com zero vulnerabilidades e latência mínima.`;

  it('parses 4-part script syntax into 5 nodes with proper types and content', () => {
    const result = parseScriptToGraph(sampleScript);

    expect(result).not.toBeNull();
    expect(result.nodes).toHaveLength(5);
    expect(result.edges).toHaveLength(4);
    expect(result.scenes).toHaveLength(5);

    // Verify types
    expect(result.nodes[0].type).toBe('chip');
    expect(result.nodes[0].title).toBe('/bin/target_auth.bin');
    expect(result.nodes[1].type).toBe('terminal');
    expect(result.nodes[2].type).toBe('database');
    expect(result.nodes[3].type).toBe('code');
    expect(result.nodes[4].type).toBe('media');
  });

  it('populates rich narrationText and computed duration in every scene', () => {
    const result = parseScriptToGraph(sampleScript);

    result.scenes.forEach((scene, idx) => {
      expect(scene.narrationText).toBeTruthy();
      expect(scene.duration).toBeGreaterThanOrEqual(4.0);
      expect(scene.activeNodeIds).toContain(result.nodes[idx].id);
      expect(scene.revealMode).toBe(true);
    });

    expect(result.scenes[0].narrationText).toContain('binário de segurança');
    expect(result.scenes[3].narrationText).toContain('validação assimétrica');
  });

  it('ensures collision-free layout coordinates', () => {
    const result = parseScriptToGraph(sampleScript);

    for (let i = 0; i < result.nodes.length; i++) {
      for (let j = i + 1; j < result.nodes.length; j++) {
        const a = result.nodes[i];
        const b = result.nodes[j];
        if (a.x === b.x) {
          // In same column: vertical distance must be >= 100
          expect(Math.abs(a.y - b.y)).toBeGreaterThanOrEqual(100);
        }
      }
    }
  });
});
