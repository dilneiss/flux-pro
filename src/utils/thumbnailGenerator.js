/**
 * CircuitFlow Studio v5.0 - High-Resolution 1920x1080 YouTube Thumbnail Generator
 * Generates broadcast-grade YouTube/Shorts cover PNG directly on the client canvas.
 */

export function generateThumbnailPng({ meta, currentScene, nodes = [], canvasTheme = 'theme-pcb' }) {
  const canvas = document.createElement('canvas');
  canvas.width = 1920;
  canvas.height = 1080;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // 1. Dark Cyberpunk Gradient Background
  const bgGrad = ctx.createRadialGradient(960, 540, 100, 960, 540, 1100);
  bgGrad.addColorStop(0, '#101623');
  bgGrad.addColorStop(0.6, '#090c12');
  bgGrad.addColorStop(1, '#040608');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1920, 1080);

  // 2. PCB Circuit Grid Dots
  ctx.fillStyle = 'rgba(6, 182, 212, 0.12)';
  for (let x = 60; x < 1920; x += 60) {
    for (let y = 60; y < 1080; y += 60) {
      ctx.beginPath();
      ctx.arc(x, y, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // 3. Neon Glow Ambience
  const cyanGlow = ctx.createRadialGradient(1400, 360, 50, 1400, 360, 600);
  cyanGlow.addColorStop(0, 'rgba(6, 182, 212, 0.25)');
  cyanGlow.addColorStop(1, 'transparent');
  ctx.fillStyle = cyanGlow;
  ctx.fillRect(0, 0, 1920, 1080);

  const amberGlow = ctx.createRadialGradient(400, 750, 50, 400, 750, 550);
  amberGlow.addColorStop(0, 'rgba(245, 158, 11, 0.22)');
  amberGlow.addColorStop(1, 'transparent');
  ctx.fillStyle = amberGlow;
  ctx.fillRect(0, 0, 1920, 1080);

  // 4. Studio Brand Tag
  ctx.fillStyle = '#06b6d4';
  ctx.font = 'bold 28px "JetBrains Mono", monospace';
  ctx.fillText('⚡ CIRCUITFLOW STUDIO v5.0 — BROADCAST ENGINE', 120, 140);

  // Category Pill
  ctx.fillStyle = 'rgba(6, 182, 212, 0.18)';
  ctx.fillRect(120, 175, 260, 40);
  ctx.strokeStyle = '#06b6d4';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(120, 175, 260, 40);
  ctx.fillStyle = '#a5f3fc';
  ctx.font = 'bold 18px "JetBrains Mono", monospace';
  ctx.fillText(`PROJETO / ${meta?.slug?.toUpperCase() || 'REA'}`, 140, 201);

  // 5. Main Hero Title (Crisp, High-Impact Typography)
  const title = currentScene?.title || meta?.project || 'ENGENHARIA REVERSA & ARQUITETURA';
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 76px "Inter", sans-serif';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
  ctx.shadowBlur = 25;

  // Wrap title if long
  const words = title.split(' ');
  let line1 = '';
  let line2 = '';
  words.forEach(w => {
    if ((line1 + w).length < 24) line1 += w + ' ';
    else line2 += w + ' ';
  });

  ctx.fillText(line1.trim() || title, 120, 310);
  if (line2.trim()) {
    ctx.fillStyle = '#38bdf8';
    ctx.fillText(line2.trim(), 120, 400);
  }

  // 6. Subtitle
  ctx.fillStyle = '#94a3b8';
  ctx.font = '500 32px "Inter", sans-serif';
  ctx.shadowBlur = 0;
  const subtitle = currentScene?.subtitle || 'Automação Visual & Fluxo Completo a 60 FPS';
  ctx.fillText(subtitle, 120, line2.trim() ? 465 : 380);

  // 7. Render Mock Cards Representation of the Flow
  const cardNodes = nodes.slice(0, 3);
  cardNodes.forEach((node, idx) => {
    const cardX = 120 + idx * 560;
    const cardY = 580;
    const cardW = 500;
    const cardH = 340;

    // Card Glass Background
    ctx.fillStyle = 'rgba(16, 22, 33, 0.92)';
    ctx.fillRect(cardX, cardY, cardW, cardH);

    // Glowing Border
    ctx.strokeStyle = idx === 0 ? '#f59e0b' : idx === 1 ? '#06b6d4' : '#10b981';
    ctx.lineWidth = 3;
    ctx.strokeRect(cardX, cardY, cardW, cardH);

    // Card Header Bar
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(cardX, cardY, cardW, 46);

    ctx.fillStyle = '#e2e8f0';
    ctx.font = 'bold 18px "JetBrains Mono", monospace';
    ctx.fillText(node.groupLabel ? `— ${node.groupLabel} —` : `ETAPA 0${idx + 1}`, cardX + 20, cardY + 30);

    // Badge
    ctx.fillStyle = idx === 0 ? '#fbbf24' : '#67e8f9';
    ctx.font = 'bold 15px "JetBrains Mono", monospace';
    ctx.fillText(node.badge || '[ok]', cardX + cardW - 120, cardY + 30);

    // Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px "Inter", sans-serif';
    ctx.fillText(node.title.slice(0, 30), cardX + 24, cardY + 95);

    // Subtitle
    ctx.fillStyle = '#38bdf8';
    ctx.font = '16px "JetBrains Mono", monospace';
    ctx.fillText(node.subtitle.slice(0, 42), cardX + 24, cardY + 130);

    // Content lines preview
    ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
    ctx.fillRect(cardX + 20, cardY + 155, cardW - 40, 155);

    ctx.fillStyle = idx === 0 ? '#fef08a' : '#a5f3fc';
    ctx.font = '16px "JetBrains Mono", monospace';
    const lines = (node.content || '> Inicializando processo...').split('\n').slice(0, 4);
    lines.forEach((l, lIdx) => {
      ctx.fillText(l.slice(0, 38), cardX + 36, cardY + 195 + lIdx * 30);
    });
  });

  // 8. Trigger PNG Download
  const link = document.createElement('a');
  link.download = `circuitflow-thumbnail-${meta?.slug || 'video'}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}
