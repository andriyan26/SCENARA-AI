import { Router, Response } from 'express';
import { query, queryRow } from '../../database/db.js';
import { AuthRequest, authMiddleware } from '../../middleware/auth.js';

export const usageRouter = Router();

usageRouter.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id || 'user-admin-default';
    const user: any = await queryRow('SELECT credits, plan FROM users WHERE id = ?', [userId]);
    const history = await query(
      `SELECT * FROM ai_usage WHERE user_id = ? ORDER BY created_at DESC LIMIT 50`,
      [userId]
    );

    const stats: any = await queryRow(
      `SELECT 
         COUNT(*) as total_generations,
         COALESCE(SUM(estimated_cost), 0) as total_estimated_cost
       FROM ai_usage
       WHERE user_id = ?`,
      [userId]
    );

    return res.json({
      credits: user?.credits || 1500,
      plan: user?.plan || 'pro_studio',
      totalGenerations: stats?.total_generations || 0,
      totalEstimatedCost: parseFloat(stats?.total_estimated_cost || '0').toFixed(4),
      history,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});
