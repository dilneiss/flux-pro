import { Router } from 'express';

const router = Router();

/**
 * POST /api/tts/with-timestamps
 * Simulates or proxies ElevenLabs with-timestamps TTS endpoint
 * Returns audio timing alignments mapped directly to scenes.
 */
router.post('/with-timestamps', (req, res) => {
  try {
    const { scenes = [], voiceId = '21m00Tcm4TlvDq8ikWAM' } = req.body;

    let currentTime = 0;
    const timestamps = scenes.map((scene, idx) => {
      const startTime = Number(currentTime.toFixed(2));
      const fullText = `${scene.title} ${scene.subtitle || ''}`;
      const wordCount = fullText.trim().split(/\s+/).filter(Boolean).length;
      const duration = Number(Math.max(3.2, wordCount * 0.45 + 1.2).toFixed(2));
      currentTime += duration;

      return {
        sceneIndex: idx,
        sceneName: scene.name,
        title: scene.title,
        startTime,
        duration,
        endTime: Number((startTime + duration).toFixed(2))
      };
    });

    res.json({
      success: true,
      voiceId,
      totalDuration: Number(currentTime.toFixed(2)),
      timestamps,
      message: 'Timestamps sincronizados para automação de câmera'
    });
  } catch (err) {
    res.status(500).json({ error: 'TTS alignment failed', details: err.message });
  }
});

export default router;
