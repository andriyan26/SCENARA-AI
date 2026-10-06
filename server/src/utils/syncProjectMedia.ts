import { getDbPool } from '../database/db.js';

async function syncMedia() {
  const pool = getDbPool();
  console.log('--- SYNCING PROJECT MEDIA TO DATABASE ---');

  const sceneUpdates = [
    {
      num: 1,
      title: 'Ambang Batas Sunyi',
      thumb: '/storage/storyboards/scene_1.jpg',
      video: '/storage/videos/scene_1.mp4',
      mood: 'Melankolis, Kontemplatif',
      cam_angle: 'Medium Close-up ke Tatapan Layar',
      cam_move: 'Slow Dolly In',
      prompt: 'Cinematic 35mm film shot of a 24-year-old Indonesian man sitting on a mattress, looking at glowing laptop screen with quiet sorrow, soft dawn blue light through wooden blinds, moody anamorphic bokeh, 4k.',
      narration: 'Setiap perjalanan besar selalu bermula dalam hening, di saat mimpi diuji antara padam atau membara.'
    },
    {
      num: 2,
      title: 'Arus Perjuangan Kota',
      thumb: '/storage/storyboards/scene_2.jpg',
      video: '/storage/videos/scene_2.mp4',
      mood: 'Dinamis, Menegangkan, Penuh Tekad',
      cam_angle: 'Bidikan Rendah (Low Angle Tracking)',
      cam_move: 'Dynamic Steadicam Tracking',
      prompt: 'Cinematic tracking shot in bustling Jakarta financial district, skyscraper glass reflections, young Indonesian professional in navy suit holding brown envelope walking against rushing crowd, anamorphic flare, photorealistic.',
      narration: 'Berjalan di antara ribuan langkah terburu-buru, mencari satu pintu yang terbuka untuk membuktikan kemampuan diri.'
    },
    {
      num: 3,
      title: 'Pintu Masuk Ruang Evaluasi',
      thumb: '/storage/storyboards/scene_3.jpg',
      video: '/storage/videos/scene_3.mp4',
      mood: 'Tegang, Mengintimidasi, Presisi',
      cam_angle: 'Bidikan Sejajar Mata ke Gagang Pintu Kaca',
      cam_move: 'Static Precision beralih ke Slow Push-In',
      prompt: 'Cinematic 35mm film shot of a 24-year-old Indonesian young man with neat hair and round glasses in a navy blue suit standing right before a modern frosted glass boardroom door with chrome handles about to push it open, reflection visible on polished marble floor, tense atmospheric lighting, Jakarta corporate headquarters.',
      dialogue: 'Kandidat nomor urut 12, Saudara Andrian Pratama, silakan masuk ke ruang panel evaluasi.',
      narration: 'Di balik pintu kaca ini, seluruh perjuangan dan pengorbanan dipertaruhkan. Tarik napas, dan langkahkan kaki.'
    },
    {
      num: 4,
      title: 'Ujian di Meja Keputusan',
      thumb: '/storage/storyboards/scene_4.jpg',
      video: '/storage/videos/scene_4.mp4',
      mood: 'Fokus Mendalam, Kharismatik, Elektrik',
      cam_angle: 'Over The Shoulder ke Tatapan Direktur',
      cam_move: 'Subtle Handheld Micro-movement',
      prompt: 'Cinematic film still, photorealistic. Inside a sleek modern Jakarta corporate boardroom with floor-to-ceiling glass windows. A confident 24-year-old Indonesian male tech applicant with neat short black hair and glasses presenting passionately with hand gestures to a boardroom evaluation panel and executive director.',
      dialogue: 'Saya mungkin belum memiliki puluhan tahun portofolio, namun tidak ada yang akan berjuang lebih gigih dan berdedikasi daripada saya.',
      narration: 'Keyakinan adalah senjata terkuat ketika dunia meragukan kemampuanmu.'
    },
    {
      num: 5,
      title: 'Badai Keteguhan di JPO Sudirman',
      thumb: '/storage/storyboards/scene_5.jpg',
      video: '/storage/videos/scene_5.mp4',
      mood: 'Resiliensi, Puitis, Menembus Hujan',
      cam_angle: 'Sudut Lebar Refleksi Kaca Basah',
      cam_move: 'Slow Motion Dutch Angle ke Push-In',
      prompt: 'Cinematic film still, photorealistic masterpiece, 8k. Night time drizzle and rain in Jakarta on an iconic pedestrian overpass bridge (JPO). A handsome 24-year-old Indonesian young man with glasses, holding an umbrella, looking out thoughtfully over the bustling highway filled with red tail lights and golden headlights. Reflections of vibrant city neon lights on wet asphalt.',
      narration: 'Ketika satu pintu tertutup rapat di hadapanmu, jangan pernah berbalik arah. Bangun pintumu sendiri.'
    },
    {
      num: 6,
      title: 'Merakit Terobosan Larut Malam',
      thumb: '/storage/storyboards/scene_6.jpg',
      video: '/storage/videos/scene_6.mp4',
      mood: 'Fokus Mutlak, Cahaya Terminal Neon',
      cam_angle: 'Extreme Macro Refleksi Kacamata',
      cam_move: 'Circular Orbital Push-In',
      prompt: 'Cinematic film still, photorealistic masterpiece, 8k. Late night 02:00 AM inside an artisan Jakarta specialty coffee roastery workspace. A dedicated 24-year-old Indonesian male programmer with round glasses working intensely on an ultra-thin laptop with code reflection on lenses.',
      narration: 'Di kegelapan jam dua dini hari, ketika kota tertidur lelap, sebuah mahakarya baru dilahirkan dari ketekunan.'
    },
    {
      num: 7,
      title: 'Kemenangan Sejati di Nusa Tech',
      thumb: '/storage/storyboards/scene_7.jpg',
      video: '/storage/videos/scene_7.mp4',
      mood: 'Penuh Euforia, Kemenangan Emosional',
      cam_angle: 'Sudut Rendah Simetris ke Jabat Tangan',
      cam_move: 'Steadicam Gliding Arc Shot',
      prompt: 'Cinematic film still, photorealistic, 8k. Bright morning sunlight pouring into a prestigious Jakarta open-plan tech headquarters. A smiling 24-year-old Indonesian male tech talent in smart casual blazer shaking hands firmly with a distinguished senior founder as creative teammates applaud with pride.',
      dialogue: 'Selamat bergabung dengan tim kami, Andrian. Solusimu mengubah segalanya.',
      narration: 'Kerja keras yang konsisten tidak akan pernah mengingkari takdir indahnya.'
    },
    {
      num: 8,
      title: 'Babak Baru Kejayaan (Puncak Horizon)',
      thumb: '/storage/storyboards/scene_8.jpg',
      video: '/storage/videos/scene_8.mp4',
      mood: 'Puncak Kejayaan, Mega-Sinematik',
      cam_angle: 'Sudut Ekstrem Lebar Udara (Aerial Horizon)',
      cam_move: 'Majestic Slow Pull-Back ke Langit Senja',
      prompt: 'Cinematic film still, photorealistic masterpiece, 8k. Golden hour sunset overlooking the breathtaking panoramic skyline of Jakarta from a high skyscraper rooftop terrace. A handsome 24-year-old Indonesian young man standing against the glass railing, holding a smartphone to his ear, smiling with deep emotion and a tear of joy on his cheek as he talks to his mother.',
      dialogue: 'Ibu... anakmu berhasil. Kita tidak perlu khawatir lagi sekarang.',
      narration: 'Harapan bukanlah kepastian tanpa usaha. Harapan adalah keberanian untuk melangkah sekali lagi.'
    }
  ];

  // 1. Update all projects
  await pool.execute(`
    UPDATE projects 
    SET thumbnail_url = '/storage/storyboards/scene_3.jpg',
        final_video_url = '/storage/videos/master_preview.mp4'
  `);
  console.log('✓ Projects updated with master thumbnail and master video URL');

  // 2. Update characters
  await pool.execute(`
    UPDATE characters
    SET reference_image_url = '/storage/characters/andrian_pratama.jpg',
        name = 'Andrian Pratama',
        appearance = 'Pemuda Indonesia 24 tahun, wajah tegas ramah berkarakter, berkacamata kawat bulat, mengenakan setelan jas biru navy rapi di atas kemeja putih.'
  `);
  console.log('✓ Characters updated with authentic Indonesian portrait');

  // 3. Update scenes
  for (const sc of sceneUpdates) {
    await pool.execute(`
      UPDATE scenes
      SET title = ?,
          thumbnail_url = ?,
          video_url = ?,
          mood = ?,
          camera_angle = ?,
          camera_movement = ?,
          visual_prompt = ?,
          narration = COALESCE(?, narration),
          dialogue = COALESCE(?, dialogue)
      WHERE scene_number = ?
    `, [
      sc.title,
      sc.thumb,
      sc.video,
      sc.mood,
      sc.cam_angle,
      sc.cam_move,
      sc.prompt,
      sc.narration || null,
      sc.dialogue || null,
      sc.num
    ]);

    // Also update storyboards table
    await pool.execute(`
      UPDATE storyboards
      SET image_url = ?,
          prompt = ?
      WHERE scene_id IN (SELECT id FROM scenes WHERE scene_number = ?)
    `, [
      sc.thumb,
      sc.prompt,
      sc.num
    ]);
  }
  console.log('✓ All 8 scenes & storyboards updated in database!');

  // Check sample
  const [rows]: any = await pool.execute(`SELECT scene_number, title, thumbnail_url, video_url FROM scenes ORDER BY scene_number ASC`);
  console.log('Current database scenes:', rows);

  process.exit(0);
}

syncMedia().catch(err => {
  console.error('Failed to sync media:', err);
  process.exit(1);
});
