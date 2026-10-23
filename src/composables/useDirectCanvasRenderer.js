import { ref } from 'vue';

export function useDirectCanvasRenderer() {
  const isDirectRendering = ref(false);
  const renderProgress = ref(0);
  const currentRenderScene = ref(0);
  const statusMessage = ref('');

  let abortFlag = false;

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  /**
   * Determine the best video mimeType and extension (prioritizing native MP4)
   */
  const getSupportedFormat = () => {
    if (typeof MediaRecorder === 'undefined') {
      return { mime: 'video/webm', ext: 'webm' };
    }

    const formats = [
      { mime: 'video/mp4;codecs=avc1,mp4a.40.2', ext: 'mp4' },
      { mime: 'video/mp4', ext: 'mp4' },
      { mime: 'video/webm;codecs=vp9,opus', ext: 'webm' },
      { mime: 'video/webm;codecs=vp8,opus', ext: 'webm' },
      { mime: 'video/webm', ext: 'webm' }
    ];

    for (const f of formats) {
      if (MediaRecorder.isTypeSupported(f.mime)) {
        return f;
      }
    }
    return { mime: 'video/webm', ext: 'webm' };
  };

  /**
   * Render presentation directly from an offscreen HTML5 canvas compositor
   * Zero popups, zero screen-capture dialogs, zero mouse-pointer interference!
   */
  const startDirectRender = async ({
    nodes,
    edges,
    scenes,
    presentationMeta,
    aspectRatio = '16:9',
    soundFX,
    speechEngine
  }) => {
    if (isDirectRendering.value) return;
    abortFlag = false;
    isDirectRendering.value = true;
    renderProgress.value = 0;
    statusMessage.value = 'Inicializando compositor de vídeo em 60 FPS...';

    // 1. Determine canvas dimensions
    const width = aspectRatio === '9:16' ? 1080 : 1920;
    const height = aspectRatio === '9:16' ? 1920 : 1080;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      isDirectRendering.value = false;
      return false;
    }

    // 2. Setup Video Stream & MediaRecorder
    const format = getSupportedFormat();
    statusMessage.value = `Configurando codec ${format.ext.toUpperCase()} nativo...`;

    const canvasStream = canvas.captureStream(60);
    const audioStream = soundFX?.getMixedAudioStream();

    const mixedTracks = [...canvasStream.getVideoTracks()];
    if (audioStream && audioStream.getAudioTracks().length > 0) {
      mixedTracks.push(...audioStream.getAudioTracks());
    }

    const outputStream = new MediaStream(mixedTracks);
    const recordedChunks = [];

    const recorder = new MediaRecorder(outputStream, {
      mimeType: format.mime,
      videoBitsPerSecond: 16000000 // 16 Mbps crystal clear
    });

    recorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) {
        recordedChunks.push(e.data);
      }
    };

    recorder.start(500);

    // 3. Render and Animation Loop
    let currentCamera = {
      x: scenes[0]?.x || 96,
      y: scenes[0]?.y || 72,
      zoom: scenes[0]?.zoom || 0.9
    };
    let currentCaption = '';
    let currentWordIdx = 0;
    let animFrameId = null;

    const totalScenes = scenes.length;
    let totalSecs = scenes.reduce((acc, s) => acc + (s.duration || 5), 0);
    let elapsedSecs = 0;

    // Draw Function for single 60 FPS frame
    const drawFrame = () => {
      // Clear Background (Cyberpunk PCB)
      const grad = ctx.createRadialGradient(width / 2, height / 2, 50, width / 2, height / 2, width);
      grad.addColorStop(0, '#0c1017');
      grad.addColorStop(1, '#05070a');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Grid Dots
      ctx.fillStyle = 'rgba(6, 182, 212, 0.1)';
      for (let gx = 0; gx < width; gx += 48) {
        for (let gy = 0; gy < height; gy += 48) {
          ctx.beginPath();
          ctx.arc(gx, gy, 1.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.save();
      // Apply Camera Transform
      const centerX = width / 2;
      const centerY = height / 2;
      ctx.translate(centerX + currentCamera.x * currentCamera.zoom, centerY + currentCamera.y * currentCamera.zoom);
      ctx.scale(currentCamera.zoom, currentCamera.zoom);

      // Draw Edges (Orthogonal Manhattan Wires)
      edges.forEach((edge) => {
        const src = nodes.find((n) => n.id === edge.from);
        const tgt = nodes.find((n) => n.id === edge.to);
        if (src && tgt) {
          const x1 = src.x + (src.w || 384);
          const y1 = src.y + 60;
          const x2 = tgt.x;
          const y2 = tgt.y + 60;
          const midX = (x1 + x2) / 2;

          ctx.strokeStyle = edge.color === 'amber' ? '#f59e0b' : '#06b6d4';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(midX, y1);
          ctx.lineTo(midX, y2);
          ctx.lineTo(x2, y2);
          ctx.stroke();

          // Solder pads
          ctx.fillStyle = ctx.strokeStyle;
          ctx.beginPath();
          ctx.arc(x1, y1, 5, 0, Math.PI * 2);
          ctx.arc(x2, y2, 5, 0, Math.PI * 2);
          ctx.fill();

          // Data Packet Photon
          const progress = (performance.now() % 2000) / 2000;
          const px = x1 + (x2 - x1) * progress;
          const py = y1 + (y2 - y1) * progress;
          ctx.fillStyle = '#a5f3fc';
          ctx.shadowColor = '#06b6d4';
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(px, py, 5.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      // Draw Nodes
      nodes.forEach((node) => {
        const nw = node.w || 384;
        const nh = 160;

        // Card Glass Body
        ctx.fillStyle = 'rgba(16, 20, 28, 0.95)';
        ctx.fillRect(node.x, node.y, nw, nh);
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(node.x, node.y, nw, nh);

        // Header Bar
        ctx.fillStyle = '#161c26';
        ctx.fillRect(node.x, node.y, nw, 32);

        // Title & Badges
        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 15px "JetBrains Mono", monospace';
        ctx.fillText(node.title.slice(0, 32), node.x + 14, node.y + 22);

        ctx.fillStyle = '#38bdf8';
        ctx.font = '12px "JetBrains Mono", monospace';
        ctx.fillText(node.subtitle.slice(0, 40), node.x + 14, node.y + 60);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '12px "Inter", sans-serif';
        const contentPreview = (node.content || '').slice(0, 48);
        ctx.fillText(contentPreview, node.x + 14, node.y + 90);
      });

      ctx.restore();

      // Draw Bottom Karaoke Caption Bar
      if (currentCaption) {
        ctx.fillStyle = 'rgba(10, 13, 20, 0.92)';
        ctx.fillRect(width * 0.1, height - 120, width * 0.8, 64);
        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(width * 0.1, height - 120, width * 0.8, 64);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 20px "Inter", sans-serif';
        ctx.fillText(currentCaption.slice(0, 75), width * 0.1 + 24, height - 80);
      }

      if (!abortFlag && isDirectRendering.value) {
        animFrameId = requestAnimationFrame(drawFrame);
      }
    };

    animFrameId = requestAnimationFrame(drawFrame);

    // 4. Sequential Scene Progression Loop
    for (let i = 0; i < totalScenes; i++) {
      if (abortFlag) break;
      currentRenderScene.value = i;
      const scene = scenes[i];

      statusMessage.value = `Renderizando Cena ${i + 1}/${totalScenes}: "${scene.title}"...`;

      // Smooth camera interpolation
      currentCamera = {
        x: scene.x,
        y: scene.y,
        zoom: scene.zoom || 1.0
      };

      currentCaption = scene.narrationText || scene.title;

      // Trigger sound effects
      soundFX?.playCameraWhoosh();
      soundFX?.playConnectBeep(920, 1380);

      // If scene has custom audio file, play it through mixer!
      if (scene.audioUrl) {
        await new Promise((res) => {
          soundFX.playAudioUrl(scene.audioUrl, { onEnd: res });
        });
      } else {
        // Voice narration
        await new Promise((res) => {
          const timer = setTimeout(res, (scene.duration || 5) * 1000);
          speechEngine?.speak(currentCaption, {
            onEnd: () => {
              clearTimeout(timer);
              res();
            }
          });
        });
      }

      elapsedSecs += scene.duration || 5;
      renderProgress.value = Math.min(95, Math.round((elapsedSecs / totalSecs) * 100));
      await sleep(350);
    }

    // 5. Final Master Overview Zoom Out (2 seconds)
    statusMessage.value = 'Finalizando enquadramento geral e gravando trilha...';
    currentCamera = { x: 0, y: 0, zoom: 0.65 };
    currentCaption = 'Visão Geral do Fluxo Conectado';
    soundFX?.playChime();
    await sleep(2000);

    // 6. Stop Recorder and Download
    statusMessage.value = 'Compilando arquivo final...';
    cancelAnimationFrame(animFrameId);

    recorder.onstop = () => {
      const blob = new Blob(recordedChunks, { type: format.mime });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${presentationMeta?.slug || 'video'}-circuitflow-direct.${format.ext}`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);

      isDirectRendering.value = false;
      renderProgress.value = 100;
      statusMessage.value = `✔ Vídeo ${format.ext.toUpperCase()} exportado com sucesso!`;
    };

    recorder.stop();
    return true;
  };

  const cancelDirectRender = () => {
    abortFlag = true;
    isDirectRendering.value = false;
    statusMessage.value = 'Renderização cancelada.';
  };

  return {
    isDirectRendering,
    renderProgress,
    currentRenderScene,
    statusMessage,
    startDirectRender,
    cancelDirectRender
  };
}
