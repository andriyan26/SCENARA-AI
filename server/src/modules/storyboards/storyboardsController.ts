import { Router, Response } from 'express';
import { query, queryRow } from '../../database/db.js';
import { AuthRequest, authMiddleware } from '../../middleware/auth.js';

export const storyboardsRouter = Router();

storyboardsRouter.get('/:projectId', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { projectId } = req.params;
    const storyboards = await query('SELECT * FROM storyboards WHERE project_id = ? ORDER BY created_at ASC', [projectId]);
    return res.json({ storyboards });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

storyboardsRouter.post('/:sceneId/regenerate', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { sceneId } = req.params;
    const scene: any = await queryRow('SELECT * FROM scenes WHERE id = ?', [sceneId]);
    if (!scene) return res.status(404).json({ error: 'Scene not found' });

    const curatedFrames = [
      'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1506146332389-18140dc7b2fb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80',
    ];

    const randomImg = curatedFrames[Math.floor(Math.random() * curatedFrames.length)];

    await query('UPDATE storyboards SET image_url = ? WHERE scene_id = ?', [randomImg, sceneId]);
    await query('UPDATE scenes SET thumbnail_url = ? WHERE id = ?', [randomImg, sceneId]);

    const updated = await queryRow('SELECT * FROM storyboards WHERE scene_id = ?', [sceneId]);
    return res.json({ storyboard: updated });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});
