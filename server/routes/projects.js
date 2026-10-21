import { Router } from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const storageDir = path.resolve(__dirname, '../storage/projects');

if (!fs.existsSync(storageDir)) {
  fs.mkdirSync(storageDir, { recursive: true });
}

const router = Router();

// GET all projects
router.get('/', (req, res) => {
  try {
    const files = fs.readdirSync(storageDir).filter((f) => f.endsWith('.json'));
    const projects = files.map((file) => {
      const filePath = path.join(storageDir, file);
      const raw = fs.readFileSync(filePath, 'utf-8');
      const data = JSON.parse(raw);
      return {
        id: file.replace('.json', ''),
        meta: data.meta || {},
        updatedAt: data.updatedAt || fs.statSync(filePath).mtime,
        nodeCount: data.nodes?.length || 0,
        sceneCount: data.scenes?.length || 0
      };
    });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read projects', details: err.message });
  }
});

// GET single project
router.get('/:id', (req, res) => {
  try {
    const filePath = path.join(storageDir, `${req.params.id}.json`);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Project not found' });
    }
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read project', details: err.message });
  }
});

// POST save project
router.post('/', (req, res) => {
  try {
    const { id, meta, nodes, edges, scenes } = req.body;
    const projectId = id || `cf_${Date.now()}`;
    const filePath = path.join(storageDir, `${projectId}.json`);

    const payload = {
      id: projectId,
      meta: meta || { project: 'novo-projeto', slug: 'cf' },
      nodes: nodes || [],
      edges: edges || [],
      scenes: scenes || [],
      updatedAt: new Date().toISOString()
    };

    fs.writeFileSync(filePath, JSON.stringify(payload, null, 2), 'utf-8');
    res.json({ success: true, id: projectId, project: payload });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save project', details: err.message });
  }
});

// DELETE project
router.delete('/:id', (req, res) => {
  try {
    const filePath = path.join(storageDir, `${req.params.id}.json`);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete project', details: err.message });
  }
});

export default router;
