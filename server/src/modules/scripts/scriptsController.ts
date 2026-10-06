import { Router, Response } from 'express';
import { query, queryRow } from '../../database/db.js';
import { AuthRequest, authMiddleware } from '../../middleware/auth.js';
import { AIRouter } from '../../ai/router.js';

export const scriptsRouter = Router();
const routerAi = AIRouter.getInstance();

scriptsRouter.get('/:projectId', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { projectId } = req.params;
    const script = await queryRow('SELECT * FROM scripts WHERE project_id = ? ORDER BY version DESC LIMIT 1', [projectId]);
    return res.json({ script });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

scriptsRouter.put('/:projectId', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { projectId } = req.params;
    const { content, title } = req.body;

    const existing: any = await queryRow('SELECT id, version FROM scripts WHERE project_id = ? ORDER BY version DESC LIMIT 1', [projectId]);
    if (existing) {
      await query(
        `UPDATE scripts SET content = ?, title = COALESCE(?, title), updated_at = NOW() WHERE id = ?`,
        [content, title, existing.id]
      );
    }

    const updated = await queryRow('SELECT * FROM scripts WHERE project_id = ? ORDER BY version DESC LIMIT 1', [projectId]);
    return res.json({ script: updated });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// AI Script Assistant (Rewrite, Make Cinematic, Tone, Dialogue, Expand, Shorten)
scriptsRouter.post('/:projectId/ai-assistant', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { projectId } = req.params;
    const { action, instruction } = req.body;

    const script: any = await queryRow('SELECT * FROM scripts WHERE project_id = ? ORDER BY version DESC LIMIT 1', [projectId]);
    if (!script) return res.status(404).json({ error: 'Script not found' });

    const llm = routerAi.getLLMProvider();
    const revisedText = await llm.assistScript(script.content, action, instruction);

    await query(
      `UPDATE scripts SET content = ?, updated_at = NOW() WHERE id = ?`,
      [revisedText, script.id]
    );

    return res.json({ success: true, updatedContent: revisedText });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});
