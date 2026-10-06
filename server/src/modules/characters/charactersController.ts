import { Router, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { query, queryRow } from '../../database/db.js';
import { AuthRequest, authMiddleware } from '../../middleware/auth.js';

export const charactersRouter = Router();

charactersRouter.get('/:projectId', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { projectId } = req.params;
    const characters = await query('SELECT * FROM characters WHERE project_id = ? ORDER BY created_at ASC', [projectId]);
    return res.json({ characters });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

charactersRouter.post('/:projectId', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { projectId } = req.params;
    const { name, age = 25, gender = 'Male', description, personality, appearance, clothing, reference_image_url, voice_id } = req.body;

    const id = uuidv4();
    await query(
      `INSERT INTO characters (id, project_id, name, age, gender, description, personality, appearance, clothing, reference_image_url, voice_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        projectId,
        name,
        age,
        gender,
        description || '',
        personality || '',
        appearance || '',
        clothing || '',
        reference_image_url || '/storage/characters/andrian_pratama.jpg',
        voice_id || 'Antoni Pratama'
      ]
    );

    const character = await queryRow('SELECT * FROM characters WHERE id = ?', [id]);
    return res.status(201).json({ character });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

charactersRouter.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, age, gender, description, personality, appearance, clothing, reference_image_url, voice_id } = req.body;

    await query(
      `UPDATE characters 
       SET name = COALESCE(?, name),
           age = COALESCE(?, age),
           gender = COALESCE(?, gender),
           description = COALESCE(?, description),
           personality = COALESCE(?, personality),
           appearance = COALESCE(?, appearance),
           clothing = COALESCE(?, clothing),
           reference_image_url = COALESCE(?, reference_image_url),
           voice_id = COALESCE(?, voice_id),
           updated_at = NOW()
       WHERE id = ?`,
      [name, age, gender, description, personality, appearance, clothing, reference_image_url, voice_id, id]
    );

    const updated = await queryRow('SELECT * FROM characters WHERE id = ?', [id]);
    return res.json({ character: updated });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

charactersRouter.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await query('DELETE FROM characters WHERE id = ?', [id]);
    return res.json({ success: true, message: 'Karakter berhasil dihapus' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// AI generate character profile (100% Bahasa Indonesia)
charactersRouter.post('/generate-profile', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { role = 'Protagonis', genre = 'Drama', descriptionHint = 'Pemuda berbakat penuh tekad' } = req.body;

    const sampleProfiles = [
      {
        name: 'Rian Sasmita',
        age: 26,
        gender: 'Male',
        description: 'Kreator independen muda berbakat Indonesia yang berjuang mewujudkan karya inovatif dengan integritas tinggi.',
        personality: 'Karismatik, pengamat teliti, teguh dalam prinsip, berdedikasi tinggi.',
        appearance: 'Pemuda Indonesia, rambut hitam bergelombang rapi, tatapan mata cokelat tajam penuh semangat.',
        clothing: 'Jaket kanvas hijau zaitun di atas kaos hitam berkerah bulat, celana jins rapi, jam tangan kulit kasual.',
        voice_id: 'Antoni Pratama',
        reference_image_url: '/storage/characters/andrian_pratama.jpg'
      },
      {
        name: 'Clara Hartono',
        age: 28,
        gender: 'Female',
        description: 'Analis inovasi teknologi dan rekan diskusi strategis yang menjadi pilar ketenangan di saat krisis.',
        personality: 'Cerdas analitis, berwibawa, pendengar yang baik, penuh empati hangat.',
        appearance: 'Wanita karir anggun, rambut diikat ekor kuda rapi, mata ekspresif tajam, senyum berwibawa.',
        clothing: 'Blus sutra warna gading dipadu blazer abu-abu arang elegan dan anting minimalis.',
        voice_id: 'Aulia Kirana',
        reference_image_url: '/storage/storyboards/scene_4.jpg'
      }
    ];

    const profile = sampleProfiles[Math.floor(Math.random() * sampleProfiles.length)];
    return res.json({ profile });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});
