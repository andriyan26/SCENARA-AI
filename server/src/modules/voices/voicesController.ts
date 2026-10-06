import { Router, Response } from 'express';
import { query } from '../../database/db.js';
import { AuthRequest, authMiddleware } from '../../middleware/auth.js';
import { AIRouter } from '../../ai/router.js';

export const voicesRouter = Router();
const routerAi = AIRouter.getInstance();

// List voices
voicesRouter.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const voices = await query('SELECT * FROM voices ORDER BY created_at ASC');
    return res.json({ voices });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Synthesize voice preview / dialogue
voicesRouter.post('/generate', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { text, voiceId = 'pNInz6obpgDQGcFmaJgB', language = 'en-US' } = req.body;
    if (!text) return res.status(400).json({ error: 'Text prompt is required' });

    const voiceProvider = routerAi.getVoiceProvider();
    const result = await voiceProvider.generateVoice({
      text,
      voiceId,
      language
    });

    return res.json({ success: true, audioUrl: result.audioUrl, duration: result.duration });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});
