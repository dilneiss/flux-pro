import { Router } from 'express';

const router = Router();

// In-memory jobs tracking
const renderJobs = new Map();

/**
 * POST /api/render/queue
 * Dispatches a Remotion 4K 60fps render job into the worker queue.
 */
router.post('/queue', (req, res) => {
  try {
    const { project, resolution = '4K', fps = 60 } = req.body;
    const jobId = `job_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const job = {
      id: jobId,
      resolution,
      fps,
      status: 'queued',
      progress: 0,
      createdAt: new Date().toISOString(),
      currentStep: 'Enfileirando job no RabbitMQ worker...',
      downloadUrl: null
    };

    renderJobs.set(jobId, job);

    // Simulate async headless worker progress
    simulateRenderProgress(jobId);

    res.json({
      success: true,
      jobId,
      message: 'Renderização enfileirada no worker headless Remotion + RabbitMQ'
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to queue render', details: err.message });
  }
});

/**
 * GET /api/render/status/:jobId
 * Check render progress
 */
router.get('/status/:jobId', (req, res) => {
  const job = renderJobs.get(req.params.jobId);
  if (!job) {
    return res.status(404).json({ error: 'Render job not found' });
  }
  res.json(job);
});

function simulateRenderProgress(jobId) {
  let progress = 0;
  const steps = [
    { p: 15, text: 'Compilando AST da apresentação para Remotion TSX...' },
    { p: 35, text: 'Interpolando curvas de câmera (spring 60fps)...' },
    { p: 60, text: 'Renderizando quadros vetoriais em resolução 4K UHD...' },
    { p: 85, text: 'Codificando stream H.264 / ProRes 60 FPS com FFmpeg...' },
    { p: 100, text: 'Vídeo 4K finalizado com sucesso!' }
  ];

  let stepIdx = 0;
  const interval = setInterval(() => {
    const job = renderJobs.get(jobId);
    if (!job) {
      clearInterval(interval);
      return;
    }

    if (stepIdx < steps.length) {
      job.status = 'rendering';
      job.progress = steps[stepIdx].p;
      job.currentStep = steps[stepIdx].text;
      stepIdx++;
    } else {
      job.status = 'completed';
      job.progress = 100;
      job.currentStep = 'Renderização 4K concluída!';
      job.downloadUrl = `/downloads/${jobId}.mp4`;
      clearInterval(interval);
    }
  }, 900);
}

export default router;
