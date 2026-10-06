import { Router, Response } from 'express';
import { query } from '../../database/db.js';
import { AuthRequest, authMiddleware } from '../../middleware/auth.js';

export const audioRouter = Router();

const MUSIC_LIBRARY = [
  { id: 'mus-1', name: 'Rise of Destiny', genre: 'Cinematic Orchestral', mood: 'Epic, Triumphant', duration: 180, url: '/storage/audio/cinematic_theme.wav' },
  { id: 'mus-2', name: 'Whispers in the Rain', genre: 'Emotional Piano', mood: 'Melancholic, Tender', duration: 145, url: '/storage/audio/cinematic_theme.wav' },
  { id: 'mus-3', name: 'Neon Shadows', genre: 'Cyberpunk Synthwave', mood: 'Fast, Mysterious', duration: 120, url: '/storage/audio/cinematic_theme.wav' },
  { id: 'mus-4', name: 'Horizon Bloom', genre: 'Neoclassical Strings', mood: 'Uplifting, Hopeful', duration: 160, url: '/storage/audio/cinematic_theme.wav' },
  { id: 'mus-5', name: 'Deep Space Reverie', genre: 'Atmospheric Ambient', mood: 'Ethereal, Vast', duration: 210, url: '/storage/audio/cinematic_theme.wav' },
];

const SFX_LIBRARY = [
  { id: 'sfx-1', name: 'Heavy Rain & Distant Thunder', category: 'Nature', duration: 12, url: '/storage/audio/rain_thunder.wav' },
  { id: 'sfx-2', name: 'Jakarta Traffic Ambiance', category: 'City', duration: 15, url: '/storage/audio/rain_thunder.wav' },
  { id: 'sfx-3', name: 'Mechanical Keyboard Typing', category: 'Office', duration: 8, url: '/storage/audio/voice_sample.wav' },
  { id: 'sfx-4', name: 'Subway Whoosh & Rail Clatter', category: 'Transport', duration: 10, url: '/storage/audio/sub_impact.wav' },
  { id: 'sfx-5', name: 'Cinematic Sub-bass Impact', category: 'Trailer Impact', duration: 6, url: '/storage/audio/sub_impact.wav' },
  { id: 'sfx-6', name: 'Footsteps on Wet Pavement', category: 'Foley', duration: 7, url: '/storage/audio/rain_thunder.wav' },
];

audioRouter.get('/library', authMiddleware, (req: AuthRequest, res: Response) => {
  return res.json({
    music: MUSIC_LIBRARY,
    sfx: SFX_LIBRARY
  });
});

audioRouter.get('/:projectId', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { projectId } = req.params;
    const audioAssets = await query('SELECT * FROM audio_assets WHERE project_id = ? ORDER BY created_at ASC', [projectId]);
    return res.json({ audioAssets });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});
