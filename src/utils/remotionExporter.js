/**
 * Production-Grade Remotion (.tsx) Component Exporter
 * Generates an executable Remotion 4K/60fps React TypeScript component
 * with camera interpolation (x, y, zoom), Manhattan SVG wires, and nodes.
 */

import { computeSmartManhattanPath } from '@/composables/useManhattan';

export function generateRemotionTsx(project) {
  const meta = project.meta || { project: 'apresentacao', slug: 'cf', author: 'viktorkav' };
  const nodes = project.nodes || [];
  const edges = project.edges || [];
  const scenes = project.scenes || [];
  const fps = 60;

  // Calculate scene frame windows (4 seconds = 240 frames per scene if no custom timing)
  let totalFrames = 0;
  const sceneTimeline = scenes.map((scene, idx) => {
    const startTimeSec = typeof scene.startTime === 'number' ? scene.startTime : idx * 4.0;
    const startFrame = Math.round(startTimeSec * fps);
    const durationFrames = 240; // 4s transition + hold
    totalFrames = Math.max(totalFrames, startFrame + durationFrames);
    return {
      index: idx,
      name: scene.name,
      title: scene.title,
      subtitle: scene.subtitle,
      x: scene.x || 96,
      y: scene.y || 72,
      zoom: scene.zoom || 1.0,
      startFrame,
      endFrame: startFrame + durationFrames
    };
  });

  if (totalFrames === 0) totalFrames = 960; // 16s fallback

  // Pre-calculate SVG Manhattan wire paths for each edge
  const getNodeById = (id) => nodes.find((n) => n.id === id);
  const edgesWithPaths = edges.map((edge, index) => {
    const pathD = computeSmartManhattanPath(edge, getNodeById, index);
    return { ...edge, pathD };
  });

  return `// =========================================================================
// CircuitFlow Studio v3.2 — Remotion 60fps Composition
// Gerado automaticamente para renderização 4K via Remotion CLI
// =========================================================================

import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
  Composition
} from 'remotion';

// Metadados do Projeto
export const PROJECT_META = ${JSON.stringify(meta, null, 2)};

// Roteiro de Câmera (Keyframes)
export const SCENES = ${JSON.stringify(sceneTimeline, null, 2)};

// Nós Estruturais (Nodes)
export const NODES = ${JSON.stringify(nodes, null, 2)};

// Conexões Ortogonais (Trilhas Manhattan SVG)
export const EDGES = ${JSON.stringify(edgesWithPaths, null, 2)};

/**
 * Componente Principal Remotion — 60 FPS Nativo
 */
export const CircuitFlowVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // 1. Interpolação Cinemática de Câmera (x, y, zoom)
  let cameraX = SCENES[0]?.x ?? 96;
  let cameraY = SCENES[0]?.y ?? 72;
  let cameraZoom = SCENES[0]?.zoom ?? 0.9;

  for (let i = 0; i < SCENES.length - 1; i++) {
    const curr = SCENES[i];
    const next = SCENES[i + 1];

    if (frame >= curr.startFrame && frame <= next.startFrame) {
      const transitionFrames = Math.min(48, next.startFrame - curr.startFrame);
      const progress = interpolate(
        frame,
        [curr.startFrame, curr.startFrame + transitionFrames],
        [0, 1],
        {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: Easing.bezier(0.22, 1, 0.36, 1)
        }
      );

      cameraX = curr.x + (next.x - curr.x) * progress;
      cameraY = curr.y + (next.y - curr.y) * progress;
      cameraZoom = curr.zoom + (next.zoom - curr.zoom) * progress;
      break;
    } else if (frame > next.startFrame) {
      cameraX = next.x;
      cameraY = next.y;
      cameraZoom = next.zoom;
    }
  }

  // 2. Pulso Elétrico Animado a 60fps nos Cabos
  const pulseOffset = -(frame * 1.5) % 48;

  // 3. Cena ativa atual
  const activeScene = SCENES.slice().reverse().find(s => frame >= s.startFrame) || SCENES[0];

  return (
    <AbsoluteFill style={{ backgroundColor: '#090b0e', color: '#e2e8f0', fontFamily: 'monospace' }}>
      {/* Moldura Superior TMUX */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 36,
        backgroundColor: '#10141d',
        borderBottom: '1px solid #1e293b',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        fontSize: 13,
        color: '#94a3b8',
        zIndex: 50
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: '#22d3ee', fontWeight: 'bold' }}>{PROJECT_META.author}</span>
          <span>/</span>
          <span>{PROJECT_META.project}</span>
          <span>/</span>
          <span style={{ color: '#38bdf8' }}>{PROJECT_META.slug}</span>
        </div>
        <div style={{ color: '#10b981', fontWeight: 'bold' }}>● 60 FPS BROADCAST</div>
      </div>

      {/* Narrative HUD (Cabeçalho da Cena Atual) */}
      <div style={{
        position: 'absolute',
        top: 36,
        left: 0,
        right: 0,
        padding: '20px 32px 14px',
        backgroundColor: 'rgba(9, 11, 14, 0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(30, 41, 59, 0.5)',
        zIndex: 40
      }}>
        <div style={{ fontSize: 12, color: '#06b6d4' }}>~/{PROJECT_META.slug}</div>
        <h1 style={{ fontSize: 26, fontWeight: 'bold', color: '#ffffff', margin: '4px 0 2px' }}>
          {activeScene?.title}
        </h1>
        <h2 style={{ fontSize: 16, fontWeight: 'bold', color: '#22d3ee', margin: 0 }}>
          {activeScene?.subtitle}
        </h2>
      </div>

      {/* Infinite Canvas Transform World */}
      <div style={{
        position: 'absolute',
        inset: 0,
        transform: \`translate(\${cameraX}px, \${cameraY}px) scale(\${cameraZoom})\`,
        transformOrigin: '0 0'
      }}>
        {/* SVG Manhattan Cables Layer */}
        <svg style={{ position: 'absolute', inset: 0, width: 4000, height: 3000, pointerEvents: 'none' }}>
          <defs>
            <filter id="wire-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {EDGES.map(edge => {
            const isAmber = edge.color === 'amber';
            const color = isAmber ? '#f59e0b' : '#06b6d4';
            return (
              <g key={edge.id}>
                {/* Sombra */}
                <path d={edge.pathD} stroke={isAmber ? '#78350f' : '#164e63'} strokeWidth={3.5} fill="none" strokeLinejoin="round" />
                {/* Linha Principal */}
                <path d={edge.pathD} stroke={color} strokeWidth={2} fill="none" strokeLinejoin="round" />
                {/* Pulso Elétrico 60fps */}
                {edge.animated && (
                  <path
                    d={edge.pathD}
                    stroke={isAmber ? '#fde68a' : '#a5f3fc'}
                    strokeWidth={2.8}
                    fill="none"
                    strokeDasharray="8 16"
                    strokeDashoffset={pulseOffset}
                    filter="url(#wire-glow)"
                  />
                )}
              </g>
            );
          })}
        </svg>

        {/* Nodes Layer */}
        {NODES.map(node => (
          <div
            key={node.id}
            style={{
              position: 'absolute',
              left: node.x,
              top: node.y,
              width: node.w || 384,
              minHeight: node.customHeight || undefined,
              backgroundColor: '#10141c',
              border: '1px solid #334155',
              borderRadius: 8,
              boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
              overflow: 'hidden'
            }}
          >
            {/* Header */}
            <div style={{
              padding: '8px 12px',
              backgroundColor: '#161c26',
              borderBottom: '1px solid #1e293b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: 11
            }}>
              <span style={{ color: '#38bdf8', fontWeight: 'bold' }}>{node.groupLabel || node.type}</span>
              <span style={{ color: '#10b981', backgroundColor: '#064e3b', padding: '2px 6px', borderRadius: 4 }}>
                {node.badge || 'ok'}
              </span>
            </div>

            {/* Body */}
            <div style={{ padding: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 'bold', color: '#ffffff', marginBottom: 4 }}>
                {node.title}
              </div>
              {node.subtitle && (
                <div style={{ fontSize: 11, color: '#38bdf8', marginBottom: 6 }}>
                  {node.subtitle}
                </div>
              )}
              {node.content && (
                <pre style={{
                  fontSize: 11,
                  color: '#94a3b8',
                  margin: 0,
                  whiteSpace: 'pre-wrap',
                  backgroundColor: '#090b0e',
                  padding: 8,
                  borderRadius: 4
                }}>
                  {node.content}
                </pre>
              )}
            </div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// Configuração Remotion Root
export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="CircuitFlow4K"
      component={CircuitFlowVideo}
      durationInFrames={${totalFrames}}
      fps={${fps}}
      width={3840}
      height={2160}
    />
  );
};
`;
}
