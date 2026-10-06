import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { query, queryRow } from '../../database/db.js';
import { AuthRequest, authMiddleware } from '../../middleware/auth.js';

export const generationRouter = Router();

// Store active SSE listeners for real-time updates
const sseClients: Map<string, Response[]> = new Map();

export function broadcastJobProgress(jobId: string, data: { status: string; progress: number; message: string; stepIndex?: number }) {
  const clients = sseClients.get(jobId);
  if (clients && clients.length > 0) {
    const payload = `data: ${JSON.stringify(data)}\n\n`;
    for (const res of clients) {
      res.write(payload);
    }
  }
}

// SSE real-time stream endpoint
generationRouter.get('/stream/:jobId', (req: Request, res: Response) => {
  const { jobId } = req.params;

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  if (!sseClients.has(jobId)) {
    sseClients.set(jobId, []);
  }
  sseClients.get(jobId)!.push(res);

  // Send initial ping
  res.write(`data: ${JSON.stringify({ status: 'connected', progress: 5, message: 'Connected to AI Director channel' })}\n\n`);

  req.on('close', () => {
    const list = sseClients.get(jobId) || [];
    sseClients.set(jobId, list.filter(c => c !== res));
  });
});

// Trigger generation job
generationRouter.post('/job', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id || 'user-admin-default';
    const { projectId, sceneId, jobType = 'video', provider = 'veo' } = req.body;

    const jobId = uuidv4();
    await query(
      `INSERT INTO generation_jobs (id, user_id, project_id, scene_id, job_type, provider, model, status, progress, started_at)
       VALUES (?, ?, ?, ?, ?, ?, 'veo-2.0', 'processing', 10, NOW())`,
      [jobId, userId, projectId, sceneId || null, jobType, provider]
    );

    // Asynchronously run job progression simulation/worker
    setTimeout(async () => {
      broadcastJobProgress(jobId, { status: 'processing', progress: 30, message: 'Directing camera and lighting...', stepIndex: 1 });
      await query('UPDATE generation_jobs SET progress = 30 WHERE id = ?', [jobId]);
    }, 1200);

    setTimeout(async () => {
      broadcastJobProgress(jobId, { status: 'processing', progress: 65, message: 'Rendering cinematic video frames...', stepIndex: 2 });
      await query('UPDATE generation_jobs SET progress = 65 WHERE id = ?', [jobId]);
    }, 2800);

    setTimeout(async () => {
      broadcastJobProgress(jobId, { status: 'processing', progress: 90, message: 'Harmonizing audio and voice tracks...', stepIndex: 3 });
      await query('UPDATE generation_jobs SET progress = 90 WHERE id = ?', [jobId]);
    }, 4200);

    setTimeout(async () => {
      broadcastJobProgress(jobId, { status: 'completed', progress: 100, message: 'Scene generation complete!', stepIndex: 4 });
      await query('UPDATE generation_jobs SET status = "completed", progress = 100, completed_at = NOW() WHERE id = ?', [jobId]);
    }, 5500);

    return res.status(202).json({
      success: true,
      jobId,
      status: 'queued',
      message: 'AI Director generation job queued'
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Get job status
generationRouter.get('/job/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const job = await queryRow('SELECT * FROM generation_jobs WHERE id = ?', [id]);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    return res.json({ job });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});
