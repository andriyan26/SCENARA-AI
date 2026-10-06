import { Router, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { query, queryRow, withTransaction } from '../../database/db.js';
import { AuthRequest, authMiddleware } from '../../middleware/auth.js';
import { AIRouter } from '../../ai/router.js';

export const scenesRouter = Router();
const routerAi = AIRouter.getInstance();

// List scenes by project
scenesRouter.get('/:projectId', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { projectId } = req.params;
    const scenes: any[] = await query('SELECT * FROM scenes WHERE project_id = ? ORDER BY scene_number ASC', [projectId]);
    
    // Attach versions to scenes
    for (const sc of scenes) {
      sc.versions = await query('SELECT * FROM scene_versions WHERE scene_id = ? ORDER BY version_number DESC', [sc.id]);
    }

    return res.json({ scenes });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Get scene details
scenesRouter.get('/detail/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const scene: any = await queryRow('SELECT * FROM scenes WHERE id = ?', [id]);
    if (!scene) return res.status(404).json({ error: 'Scene not found' });

    const versions = await query('SELECT * FROM scene_versions WHERE scene_id = ? ORDER BY version_number DESC', [id]);
    const storyboard = await queryRow('SELECT * FROM storyboards WHERE scene_id = ?', [id]);

    return res.json({ scene, versions, storyboard });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Update scene
scenesRouter.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      duration_seconds,
      location,
      time_of_day,
      mood,
      camera_angle,
      camera_movement,
      visual_prompt,
      dialogue,
      narration,
      video_url,
      thumbnail_url,
      status
    } = req.body;

    await query(
      `UPDATE scenes 
       SET title = COALESCE(?, title),
           description = COALESCE(?, description),
           duration_seconds = COALESCE(?, duration_seconds),
           location = COALESCE(?, location),
           time_of_day = COALESCE(?, time_of_day),
           mood = COALESCE(?, mood),
           camera_angle = COALESCE(?, camera_angle),
           camera_movement = COALESCE(?, camera_movement),
           visual_prompt = COALESCE(?, visual_prompt),
           dialogue = COALESCE(?, dialogue),
           narration = COALESCE(?, narration),
           video_url = COALESCE(?, video_url),
           thumbnail_url = COALESCE(?, thumbnail_url),
           status = COALESCE(?, status),
           updated_at = NOW()
       WHERE id = ?`,
      [
        title, description, duration_seconds, location, time_of_day, mood,
        camera_angle, camera_movement, visual_prompt, dialogue, narration,
        video_url, thumbnail_url, status, id
      ]
    );

    const updated = await queryRow('SELECT * FROM scenes WHERE id = ?', [id]);
    return res.json({ scene: updated });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Add new scene (100% Bahasa Indonesia)
scenesRouter.post('/:projectId', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { projectId } = req.params;
    const { title, description, duration_seconds = 15, visual_prompt } = req.body;

    const countRow: any = await queryRow('SELECT COUNT(*) as cnt FROM scenes WHERE project_id = ?', [projectId]);
    const nextNumber = (countRow?.cnt || 0) + 1;

    const id = uuidv4();
    const sceneTitle = title || `Adegan ${String(nextNumber).padStart(2, '0')}: Babak Baru Kisah`;
    const sceneDesc = description || 'Kelanjutan dinamika emosional dan visual cerita yang dirancang oleh Sutradara AI.';
    const scenePrompt = visual_prompt || 'Bidikan sinematik 35mm standar bioskop, pencahayaan volumetrik alami, fokus tajam 8k fotorealistik.';
    const videoUrl = `/storage/videos/scene_${((nextNumber - 1) % 8) + 1}.mp4`;
    const thumbUrl = `/storage/storyboards/scene_${((nextNumber - 1) % 8) + 1}.jpg`;

    await query(
      `INSERT INTO scenes (id, project_id, scene_number, title, description, duration_seconds, visual_prompt, status, video_url, thumbnail_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'completed', ?, ?)`,
      [
        id,
        projectId,
        nextNumber,
        sceneTitle,
        sceneDesc,
        duration_seconds,
        scenePrompt,
        videoUrl,
        thumbUrl
      ]
    );

    // Also insert into storyboards table
    await query(
      `INSERT INTO storyboards (id, project_id, scene_id, image_url, prompt)
       VALUES (?, ?, ?, ?, ?)`,
      [uuidv4(), projectId, id, thumbUrl, scenePrompt]
    );

    const scene = await queryRow('SELECT * FROM scenes WHERE id = ?', [id]);
    return res.status(201).json({ scene });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Delete scene
scenesRouter.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const scene: any = await queryRow('SELECT project_id, scene_number FROM scenes WHERE id = ?', [id]);
    if (!scene) return res.status(404).json({ error: 'Scene not found' });

    await withTransaction(async (conn) => {
      await conn.query('DELETE FROM scene_versions WHERE scene_id = ?', [id]);
      await conn.query('DELETE FROM storyboards WHERE scene_id = ?', [id]);
      await conn.query('DELETE FROM scenes WHERE id = ?', [id]);
      // Re-index scene numbers
      await conn.query(
        'UPDATE scenes SET scene_number = scene_number - 1 WHERE project_id = ? AND scene_number > ?',
        [scene.project_id, scene.scene_number]
      );
    });

    return res.json({ success: true, message: 'Scene removed' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Regenerate single scene (creates new version, saves in scene_versions)
scenesRouter.post('/:id/regenerate', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { prompt: customPrompt } = req.body;

    const scene: any = await queryRow('SELECT * FROM scenes WHERE id = ?', [id]);
    if (!scene) return res.status(404).json({ error: 'Scene not found' });

    const videoProvider = routerAi.getVideoProvider();
    const promptToUse = customPrompt || scene.visual_prompt || 'Cinematic movie scene';

    const result = await videoProvider.generateVideo({
      prompt: promptToUse,
      durationSeconds: scene.duration_seconds || 10,
      aspectRatio: '16:9'
    });

    // Determine next version number
    const maxVerRow: any = await queryRow('SELECT MAX(version_number) as maxVer FROM scene_versions WHERE scene_id = ?', [id]);
    const nextVersion = (maxVerRow?.maxVer || 1) + 1;

    const versionId = uuidv4();
    const newVideoUrl = result.videoUrl || scene.video_url;

    await withTransaction(async (conn) => {
      await conn.query(
        `INSERT INTO scene_versions (id, scene_id, version_number, prompt, provider, model, video_url, status, generation_time)
         VALUES (?, ?, ?, ?, ?, 'veo-2.0', ?, 'completed', ?)`,
        [versionId, id, nextVersion, promptToUse, videoProvider.name, newVideoUrl, scene.duration_seconds]
      );

      // Update active scene video
      await conn.query(
        `UPDATE scenes SET video_url = ?, status = 'completed', updated_at = NOW() WHERE id = ?`,
        [newVideoUrl, id]
      );
    });

    const updatedScene = await queryRow('SELECT * FROM scenes WHERE id = ?', [id]);
    const versions = await query('SELECT * FROM scene_versions WHERE scene_id = ? ORDER BY version_number DESC', [id]);

    return res.json({
      success: true,
      scene: updatedScene,
      versions,
      newVersionNumber: nextVersion
    });
  } catch (err: any) {
    console.error('Regenerate scene error:', err);
    return res.status(500).json({ error: err.message });
  }
});

// Select specific version
scenesRouter.post('/:id/versions/:versionId/select', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id, versionId } = req.params;
    const version: any = await queryRow('SELECT * FROM scene_versions WHERE id = ? AND scene_id = ?', [versionId, id]);
    if (!version) return res.status(404).json({ error: 'Version not found' });

    await query('UPDATE scenes SET video_url = ?, updated_at = NOW() WHERE id = ?', [version.video_url, id]);
    const updated = await queryRow('SELECT * FROM scenes WHERE id = ?', [id]);
    return res.json({ scene: updated, activeVersion: version });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// AI Scene Evaluator
scenesRouter.post('/:id/evaluate', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const scene: any = await queryRow('SELECT * FROM scenes WHERE id = ?', [id]);
    if (!scene) return res.status(404).json({ error: 'Scene not found' });

    const llm = routerAi.getLLMProvider();
    const evaluation = await llm.evaluateScene(scene.visual_prompt, scene.dialogue || '');

    return res.json({ evaluation });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});
