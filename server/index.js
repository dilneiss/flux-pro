import express from 'express';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import projectsRouter from './routes/projects.js';
import uploadRouter from './routes/upload.js';
import aiRouter from './routes/ai.js';
import renderRouter from './routes/render.js';
import ttsRouter from './routes/tts.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '25mb' }));

// Static uploads directory
const uploadsDir = path.resolve(__dirname, 'storage/uploads');
app.use('/uploads', express.static(uploadsDir));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    name: 'CircuitFlow Studio Engine API',
    version: '2.0.0',
    timestamp: new Date().toISOString()
  });
});

// Mount modular routes
app.use('/api/projects', projectsRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/ai', aiRouter);
app.use('/api/render', renderRouter);
app.use('/api/tts', ttsRouter);

app.listen(PORT, () => {
  console.log(`[CircuitFlow Server] API running on http://localhost:${PORT}`);
});

export default app;
