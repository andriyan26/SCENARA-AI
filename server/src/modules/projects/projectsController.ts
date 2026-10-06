import { Router, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { query, queryRow, withTransaction } from '../../database/db.js';
import { AuthRequest, authMiddleware } from '../../middleware/auth.js';
import { AIDirector } from '../../ai/director.js';

export const projectsRouter = Router();
const director = new AIDirector();

// List all user projects with scene count
projectsRouter.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id || 'user-admin-default';
    const projects: any[] = await query(
      `SELECT p.*,
        (SELECT COUNT(*) FROM scenes s WHERE s.project_id = p.id) as scene_count,
        (SELECT COUNT(*) FROM characters c WHERE c.project_id = p.id) as character_count
       FROM projects p
       WHERE p.user_id = ?
       ORDER BY p.updated_at DESC`,
      [userId]
    );

    return res.json({ projects });
  } catch (err: any) {
    console.error('List projects error:', err);
    return res.status(500).json({ error: err.message });
  }
});

// Get single project with all studio assets
projectsRouter.get('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const project: any = await queryRow('SELECT * FROM projects WHERE id = ?', [id]);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const settings = await queryRow('SELECT * FROM project_settings WHERE project_id = ?', [id]);
    const script = await queryRow('SELECT * FROM scripts WHERE project_id = ? ORDER BY version DESC LIMIT 1', [id]);
    const characters = await query('SELECT * FROM characters WHERE project_id = ? ORDER BY created_at ASC', [id]);
    const scenes = await query('SELECT * FROM scenes WHERE project_id = ? ORDER BY scene_number ASC', [id]);
    const storyboards = await query('SELECT * FROM storyboards WHERE project_id = ? ORDER BY created_at ASC', [id]);
    const exports = await query('SELECT * FROM exports WHERE project_id = ? ORDER BY created_at DESC', [id]);
    const audioAssets = await query('SELECT * FROM audio_assets WHERE project_id = ?', [id]);

    return res.json({
      project,
      settings,
      script,
      characters,
      scenes,
      storyboards,
      exports,
      audioAssets
    });
  } catch (err: any) {
    console.error('Get project error:', err);
    return res.status(500).json({ error: err.message });
  }
});

// Create project through AI Director Wizard
projectsRouter.post('/create-wizard', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id || 'user-admin-default';
    const {
      title,
      idea,
      projectType = 'short_film',
      genre = 'drama',
      targetDurationSeconds = 120,
      aspectRatio = '16:9',
      visualStyle = 'Sinematik',
      voiceStyle = 'Narator Emosional & Dialog',
      musicStyle = 'Orkestra Sinematik',
      language = 'Indonesian',
    } = req.body;

    if (!idea || idea.trim().length === 0) {
      return res.status(400).json({ error: 'Silakan berikan ide cerita atau konsep skenario untuk Sutradara AI.' });
    }

    const result = await director.planAndCreateProject(userId, {
      title,
      idea,
      projectType,
      genre,
      targetDurationSeconds: Number(targetDurationSeconds) || 120,
      aspectRatio,
      visualStyle,
      voiceStyle,
      musicStyle,
      language,
    });

    return res.status(201).json({
      success: true,
      projectId: result.projectId,
      plan: result.plan
    });
  } catch (err: any) {
    console.error('Create project wizard error:', err);
    return res.status(500).json({ error: err.message });
  }
});

// Update project
projectsRouter.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, status, thumbnail_url, final_video_url } = req.body;

    await query(
      `UPDATE projects 
       SET title = COALESCE(?, title),
           description = COALESCE(?, description),
           status = COALESCE(?, status),
           thumbnail_url = COALESCE(?, thumbnail_url),
           final_video_url = COALESCE(?, final_video_url),
           updated_at = NOW()
       WHERE id = ?`,
      [title, description, status, thumbnail_url, final_video_url, id]
    );

    const updated = await queryRow('SELECT * FROM projects WHERE id = ?', [id]);
    return res.json({ project: updated });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Delete project
projectsRouter.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await withTransaction(async (conn) => {
      await conn.query('DELETE FROM storyboards WHERE project_id = ?', [id]);
      await conn.query('DELETE FROM scenes WHERE project_id = ?', [id]);
      await conn.query('DELETE FROM characters WHERE project_id = ?', [id]);
      await conn.query('DELETE FROM scripts WHERE project_id = ?', [id]);
      await conn.query('DELETE FROM project_settings WHERE project_id = ?', [id]);
      await conn.query('DELETE FROM exports WHERE project_id = ?', [id]);
      await conn.query('DELETE FROM projects WHERE id = ?', [id]);
    });
    return res.json({ success: true, message: 'Project deleted' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Duplicate project
projectsRouter.post('/:id/duplicate', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const project: any = await queryRow('SELECT * FROM projects WHERE id = ?', [id]);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    const newId = uuidv4();
    await withTransaction(async (conn) => {
      await conn.query(
        `INSERT INTO projects (id, user_id, title, description, project_type, genre, target_duration_seconds, aspect_ratio, resolution, language, status, thumbnail_url, final_video_url)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          newId,
          project.user_id,
          `${project.title} (Copy)`,
          project.description,
          project.project_type,
          project.genre,
          project.target_duration_seconds,
          project.aspect_ratio,
          project.resolution,
          project.language,
          project.status,
          project.thumbnail_url,
          project.final_video_url,
        ]
      );

      // Copy scenes
      const scenes: any[] = await query('SELECT * FROM scenes WHERE project_id = ?', [id]);
      for (const sc of scenes) {
        await conn.query(
          `INSERT INTO scenes (id, project_id, scene_number, title, description, duration_seconds, location, time_of_day, mood, camera_angle, camera_movement, visual_prompt, dialogue, narration, status, video_url, thumbnail_url)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            uuidv4(),
            newId,
            sc.scene_number,
            sc.title,
            sc.description,
            sc.duration_seconds,
            sc.location,
            sc.time_of_day,
            sc.mood,
            sc.camera_angle,
            sc.camera_movement,
            sc.visual_prompt,
            sc.dialogue,
            sc.narration,
            sc.status,
            sc.video_url,
            sc.thumbnail_url,
          ]
        );
      }
    });

    return res.json({ success: true, duplicatedProjectId: newId });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Repurpose Project (Section 75: TikTok, YouTube Shorts, 15s teaser, 30s promo)
projectsRouter.post('/:id/repurpose', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { targetFormat = '9:16', targetDuration = 30, repurposeType = 'shorts' } = req.body;

    const project: any = await queryRow('SELECT * FROM projects WHERE id = ?', [id]);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    const newProjectId = uuidv4();
    const title = `${project.title} [${repurposeType.toUpperCase()} - ${targetDuration}s]`;

    // Clone selected highlight scenes
    const originalScenes: any[] = await query('SELECT * FROM scenes WHERE project_id = ? ORDER BY scene_number ASC', [id]);
    const countToKeep = Math.max(2, Math.min(originalScenes.length, Math.round(targetDuration / 10)));
    const selectedScenes = originalScenes.slice(0, countToKeep);

    await withTransaction(async (conn) => {
      await conn.query(
        `INSERT INTO projects (id, user_id, title, description, project_type, genre, target_duration_seconds, aspect_ratio, resolution, language, status, thumbnail_url, final_video_url)
         VALUES (?, ?, ?, ?, 'social_media', ?, ?, ?, '1080p', ?, 'completed', ?, ?)`,
        [
          newProjectId,
          project.user_id,
          title,
          `Repurposed cut for vertical social media from "${project.title}"`,
          project.genre,
          targetDuration,
          targetFormat,
          project.language,
          project.thumbnail_url,
          project.final_video_url,
        ]
      );

      for (let i = 0; i < selectedScenes.length; i++) {
        const sc = selectedScenes[i];
        await conn.query(
          `INSERT INTO scenes (id, project_id, scene_number, title, description, duration_seconds, location, time_of_day, mood, camera_angle, camera_movement, visual_prompt, dialogue, narration, status, video_url, thumbnail_url)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'completed', ?, ?)`,
          [
            uuidv4(),
            newProjectId,
            i + 1,
            sc.title,
            sc.description,
            Math.round(targetDuration / selectedScenes.length),
            sc.location,
            sc.time_of_day,
            sc.mood,
            sc.camera_angle,
            sc.camera_movement,
            sc.visual_prompt,
            sc.dialogue,
            sc.narration,
            sc.video_url,
            sc.thumbnail_url,
          ]
        );
      }
    });

    return res.json({ success: true, repurposedProjectId: newProjectId });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});
