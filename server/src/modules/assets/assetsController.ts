import { Router, Response } from 'express';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { query, queryRow } from '../../database/db.js';
import { AuthRequest, authMiddleware } from '../../middleware/auth.js';
import { config } from '../../config/env.js';

export const assetsRouter = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let dest = 'videos';
    if (file.mimetype.startsWith('image/')) dest = 'thumbnails';
    else if (file.mimetype.startsWith('audio/')) dest = 'audio';
    cb(null, path.join(config.storagePath, dest));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `asset-${uuidv4()}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB limit
});

assetsRouter.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id || 'user-admin-default';
    const assets = await query('SELECT * FROM assets WHERE user_id = ? ORDER BY created_at DESC', [userId]);
    return res.json({ assets });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

assetsRouter.post('/upload', authMiddleware, upload.single('file'), async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const userId = req.user?.id || 'user-admin-default';
    const { projectId } = req.body;
    const fileId = uuidv4();
    let type = 'document';
    let folder = 'videos';

    if (req.file.mimetype.startsWith('image/')) {
      type = 'image';
      folder = 'thumbnails';
    } else if (req.file.mimetype.startsWith('audio/')) {
      type = 'audio';
      folder = 'audio';
    } else if (req.file.mimetype.startsWith('video/')) {
      type = 'video';
      folder = 'videos';
    }

    const fileUrl = `/storage/${folder}/${req.file.filename}`;

    await query(
      `INSERT INTO assets (id, user_id, project_id, name, type, file_url, mime_type, size, metadata)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        fileId,
        userId,
        projectId || null,
        req.file.originalname,
        type,
        fileUrl,
        req.file.mimetype,
        req.file.size,
        JSON.stringify({ originalName: req.file.originalname })
      ]
    );

    const asset = await queryRow('SELECT * FROM assets WHERE id = ?', [fileId]);
    return res.status(201).json({ asset });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

assetsRouter.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await query('DELETE FROM assets WHERE id = ?', [id]);
    return res.json({ success: true, message: 'Asset deleted' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});
