import { Router, Response } from 'express';
import { query } from '../../database/db.js';
import { AuthRequest, authMiddleware } from '../../middleware/auth.js';
import { FFmpegService } from '../../video/ffmpegService.js';

export const exportsRouter = Router();

exportsRouter.post('/render', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { projectId, resolution = '1080p', aspectRatio = '16:9', format = 'mp4' } = req.body;
    if (!projectId) return res.status(400).json({ error: 'Project ID is required' });

    const renderResult = await FFmpegService.renderProject({
      projectId,
      resolution,
      aspectRatio,
      format,
    });

    return res.status(201).json({
      success: true,
      export: renderResult
    });
  } catch (err: any) {
    console.error('Render export error:', err);
    return res.status(500).json({ error: err.message });
  }
});

exportsRouter.get('/:projectId', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { projectId } = req.params;
    const exportsList = await query('SELECT * FROM exports WHERE project_id = ? ORDER BY created_at DESC', [projectId]);
    return res.json({ exports: exportsList });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});
