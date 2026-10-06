import { getDbPool } from './db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function initializeDatabase() {
  console.log('⚡ [DB] Initializing SCENARA AI database schema...');
  const pool = getDbPool();
  
  // Read and execute schema.sql
  const schemaPath = path.join(__dirname, 'schema.sql');
  const schemaSql = fs.readFileSync(schemaPath, 'utf8');

  // Split SQL commands by semicolon
  const statements = schemaSql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0);

  const connection = await pool.getConnection();
  try {
    for (const stmt of statements) {
      await connection.query(stmt);
    }
    console.log('✅ [DB] Schema tables verified and ready.');

    // Seed default admin user
    const [existingUsers]: any = await connection.query('SELECT * FROM users WHERE email = ?', ['admin@scenara.ai']);
    let adminUserId = 'user-admin-default';

    if (existingUsers.length === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await connection.query(
        `INSERT INTO users (id, name, email, password_hash, avatar_url, plan, credits)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          adminUserId,
          'Creative Director',
          'admin@scenara.ai',
          hashedPassword,
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
          'pro_studio',
          2500,
        ]
      );
      console.log('✅ [DB] Default user seeded: admin@scenara.ai (password: admin123)');
    } else {
      adminUserId = existingUsers[0].id;
    }

    // Seed default ElevenLabs voices (100% Indonesian voice talents)
    const [existingVoices]: any = await connection.query('SELECT COUNT(*) as count FROM voices');
    if (existingVoices[0].count === 0) {
      const defaultVoices = [
        { id: uuidv4(), name: 'Budi Santoso', provider_voice_id: 'budi_id_indonesia', gender: 'male', language: 'id-ID', style: 'Narator Sinematik Hangat & Puitis', preview: '/storage/audio/voice_sample.wav' },
        { id: uuidv4(), name: 'Siti Rahma', provider_voice_id: 'siti_id_indonesia', gender: 'female', language: 'id-ID', style: 'Dialog Empatik & Emosional', preview: '/storage/audio/voice_sample.wav' },
        { id: uuidv4(), name: 'Antoni Pratama', provider_voice_id: 'antoni_id_indonesia', gender: 'male', language: 'id-ID', style: 'Protagonis Muda Penuh Semangat', preview: '/storage/audio/voice_sample.wav' },
        { id: uuidv4(), name: 'Maya Kusuma', provider_voice_id: 'maya_id_indonesia', gender: 'female', language: 'id-ID', style: 'Suara Berwibawa & Penuh Kebijaksanaan', preview: '/storage/audio/voice_sample.wav' },
        { id: uuidv4(), name: 'Reza Mahendra', provider_voice_id: 'reza_id_indonesia', gender: 'male', language: 'id-ID', style: 'Trailer Teatrikal Berat & Megah', preview: '/storage/audio/voice_sample.wav' },
        { id: uuidv4(), name: 'Putri Ayu', provider_voice_id: 'putri_id_indonesia', gender: 'female', language: 'id-ID', style: 'Karakter Ceria, Segar & Dinamis', preview: '/storage/audio/voice_sample.wav' },
      ];

      for (const v of defaultVoices) {
        await connection.query(
          `INSERT INTO voices (id, user_id, name, provider, provider_voice_id, gender, language, style, preview_url)
           VALUES (?, ?, ?, 'elevenlabs', ?, ?, ?, ?, ?)`,
          [v.id, adminUserId, v.name, v.provider_voice_id, v.gender, v.language, v.style, v.preview]
        );
      }
      console.log('✅ [DB] ElevenLabs Indonesian voice catalog seeded (6 voices).');
    }

    // Seed Demo Showcase Project: "THE LAST CHANCE"
    const [existingProjects]: any = await connection.query('SELECT * FROM projects WHERE id = ? OR title = ?', ['demo-last-chance-project', 'THE LAST CHANCE']);
    if (existingProjects.length === 0) {
      const projectId = 'demo-last-chance-project';
      await connection.query(
        `INSERT INTO projects (id, user_id, title, description, project_type, genre, target_duration_seconds, aspect_ratio, resolution, language, status, thumbnail_url, final_video_url)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          projectId,
          adminUserId,
          'THE LAST CHANCE - KESEMPATAN TERAKHIR',
          'Kisah perjuangan seorang pemuda perantau di Jakarta menghadapi puluhan penolakan wawancara kerja, hingga ia membuktikan keahlian inovasinya di hadapan dewan direksi.',
          'short_film',
          'drama',
          120, // 2 minutes
          '16:9',
          '1080p',
          'Indonesian',
          'completed',
          '/storage/storyboards/scene_3.jpg',
          '/storage/videos/master_preview.mp4' // 1080p full narrative cinematic master video
        ]
      );

      // Project Settings
      await connection.query(
        `INSERT INTO project_settings (id, project_id, duration, aspect_ratio, resolution, visual_style, camera_style, color_style, language, voice_style, music_style, subtitle_enabled)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          uuidv4(),
          projectId,
          120,
          '16:9',
          '1080p',
          'Sinematik Hiperrealisme',
          'Lensa Anamorfik Sinematik 35mm',
          'Teal Sinematik & Amber Hangat',
          'Indonesian',
          'Narator Emosional & Dialog Bahasa Indonesia',
          'Orkestra Sinematik Piano & Strings',
          true
        ]
      );

      // Character Profile
      const charId = uuidv4();
      await connection.query(
        `INSERT INTO characters (id, project_id, name, age, gender, description, personality, appearance, clothing, reference_image_url, voice_id)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          charId,
          projectId,
          'Andrian Pratama',
          24,
          'Male',
          'Lulusan baru ilmu komputer dari daerah yang berjuang di Jakarta demi membanggakan keluarga dan mewujudkan mimpinya.',
          'Tangguh, reflektif, gigih, berani menghadapi tekanan besar di bawah situasi genting.',
          'Pemuda Indonesia, rambut hitam bergelombang rapi, tatapan mata cokelat tajam penuh tekad, kacamata bulat.',
          'Jas blazer biru dongker pas badan yang disetrika rapi, kemeja putih bersih berkerah tegak, sepatu pantofel hitam formal.',
          '/storage/characters/andrian_pratama.jpg',
          'Antoni Pratama'
        ]
      );

      // Script
      const scriptContent = `SCENARA SUTRADARA AI — DRAF NASKAH SKENARIO RESMI

JUDUL: THE LAST CHANCE - KESEMPATAN TERAKHIR
GENRE: DRAMA / FILM PENDEK EMOSIONAL
TARGET DURASI: 02:00 (120 DETIK)

BABAK I: BEBAN DALAM KEHENINGAN (00:00 - 00:35)
Adegan 01 - INT. KAMAR KOST ANDRIAN - FAJAR (08 detik)
Cahaya biru lembut fajar menyelinap melalui celah kisi-kisi jendela kayu. ANDRIAN (24) duduk di tepi kasur busanya, menatap nanar layar laptop yang menyala. 47 email penolakan kerja belum terbaca di kotak masuk.
NARASI (V.O.): "Mereka bilang, gelar sarjana adalah tiket menuju masa depan. Tapi tidak ada yang memberitahu berapa harga tiketnya."

Adegan 02 - EKS. KAWASAN JALAN JENDERAL SUDIRMAN, JAKARTA - PAGI (12 detik)
Deru deru lalu lintas pagi Jakarta yang bergemuruh cepat. Lautan pekerja korporat melangkah tegas menuju menara kaca pencakar langit. Andrian berjalan melawan arus massa, memegang amplop portofolio cokelat dengan erat.
KAMERA: Bidikan pelacak sudut rendah (low angle tracking), mengisolasi Andrian di tengah samudra kaum komuter.

BABAK II: UJIAN KETEGASAN (00:35 - 01:25)
Adegan 03 - INT. MENARA KORPORAT - KORIDOR PINTU EVALUASI - SIANG (15 detik)
Koridor kaca megah yang hening. Enam kandidat lain mengenakan setelan jas mewah. Andrian merapikan kerah bajunya dengan debar jantung yang kencang. Bayangannya pada pantulan kaca memperlihatkan mata yang pantang menyerah.

Adegan 04 - INT. RUANG RAPAT DIREKSI - SIANG (15 detik)
Tiga panelis penguji yang berwibawa. IBU MAYA memeriksa berkas riwayat hidupnya.
IBU MAYA: "Pengalamanmu masih sangat minim untuk posisi arsitek sistem ini, Andrian."
ANDRIAN: "Saya mungkin belum memiliki portofolio puluhan tahun, Bu. Tapi tidak ada yang akan berjuang lebih gigih dan berdedikasi dibanding saya."

Adegan 05 - EKS. JEMBATAN PENYEBERANGAN ORANG (JPO) - SENJA (18 detik)
Pantulan senja keemasan berpadu dengan gedung kaca. Rintik gerimis mulai membasahi Jakarta. Andrian berdiri di atas jembatan, menatap hamparan lampu mobil jalan tol di bawah. Pesan penolakan otomatis masuk ke ponselnya. Ia memegang pagar pembatas. Butiran air mata menyatu dengan tetesan hujan.
NARASI: "Ketika semua pintu tertutup, apakah kita akan berbalik arah... atau mulai membangun pintu kita sendiri?"

Adegan 06 - INT. KEDAI KOPI LARUT MALAM - DINI HARI (16 detik)
Lengan kemeja Andrian digulung ke atas. Baris-baris kode algoritma mengalir cepat di dua monitor laptop. Ia tidak meratapi nasib; ia sedang menciptakan prototipe inovasi masa depannya. Secangkir kopi hitam dingin di sampingnya.

BABAK III: TEROBOSAN MASA DEPAN (01:25 - 02:00)
Adegan 07 - INT. ATRIUM KANTOR NUSA TECH VENTURES - PAGI (18 detik)
Andrian mendemonstrasikan sistem karyanya secara langsung di hadapan dewan penasihat yang terpukau. Pendiri perusahaan bangkit berdiri dan mengulurkan jabat tangan erat dengan senyuman bangga.
FOUNDER: "Selamat bergabung di tim kami, Andrian. Selamat datang di rumah."

Adegan 08 - EKS. SKY GARDEN HORIZON - SENJA KEEMASAN (18 detik)
Andrian melakukan panggilan video dengan ibunya di kampung halaman. Ia mengangkat lembar surat penawaran kerja resmi dengan air mata haru membuncah di pipinya, berlatar langit Jakarta yang membara jingga keemasan.
NARASI: "Harapan bukan tentang kepastian. Harapan adalah keberanian untuk melangkah satu kali lagi."

[FADE OUT]`;

      await connection.query(
        `INSERT INTO scripts (id, project_id, title, content, ai_generated, version)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [uuidv4(), projectId, 'THE LAST CHANCE - Final Production Screenplay', scriptContent, true, 1]
      );

      // 8 Scenes matching target 120 seconds duration exactly:
      // 8 + 12 + 15 + 15 + 18 + 16 + 18 + 18 = 120 seconds!
      const demoScenes = [
        {
          num: 1,
          title: "Ambang Batas Sunyi",
          desc: "Andrian merenungkan email penolakan di kamar kost sederhananya saat fajar menyingsing.",
          duration: 8,
          loc: "Kamar Kost Sederhana, Jakarta",
          time: "Fajar 05:30",
          mood: "Melankolis, Kontemplatif",
          cam_angle: "Medium Close-up ke Tatapan Layar",
          cam_move: "Slow Dolly In",
          prompt: "Bidikan film 35mm sinematik seorang pemuda Indonesia 24 tahun duduk di tepi kasur busa, menatap layar laptop yang menyala dengan kesedihan sunyi, cahaya biru lembut fajar menembus kisi-kisi kayu, bokeh anamorfik murung, 4k.",
          narration: "Setiap perjalanan besar selalu bermula dalam hening, di saat mimpi diuji antara padam atau membara.",
          thumb: "/storage/storyboards/scene_1.jpg",
          video: "/storage/videos/scene_1.mp4"
        },
        {
          num: 2,
          title: "Arus Perjuangan Kota",
          desc: "Andrian melangkah menembus lautan pekerja pagi di Sudirman, mendekap amplop portofolio melawan arus.",
          duration: 12,
          loc: "Kawasan Bisnis Sudirman",
          time: "Pagi 08:00",
          mood: "Dinamis, Menegangkan, Penuh Tekad",
          cam_angle: "Bidikan Rendah (Low Angle Tracking)",
          cam_move: "Dynamic Steadicam Tracking",
          prompt: "Bidikan pelacak sinematik di kawasan bisnis Sudirman Jakarta, pantulan kaca gedung pencakar langit, pemuda profesional Indonesia berjas biru dongker memegang amplop cokelat berjalan melawan arus kerumunan pejalan kaki, suar lensa anamorfik, fotorealistik.",
          narration: "Berjalan di antara ribuan langkah terburu-buru, mencari satu pintu yang terbuka untuk membuktikan kemampuan diri.",
          thumb: "/storage/storyboards/scene_2.jpg",
          video: "/storage/videos/scene_2.mp4"
        },
        {
          num: 3,
          title: "Pintu Masuk Ruang Evaluasi",
          desc: "Andrian berdiri tepat di depan pintu kaca buram ruang dewan direksi, siap melangkah masuk menghadapi panel penilai.",
          duration: 15,
          loc: "Lobi & Koridor Pintu Eksekutif",
          time: "Siang 11:30",
          mood: "Tegang, Mengintimidasi, Presisi",
          cam_angle: "Bidikan Sejajar Mata ke Gagang Pintu Kaca",
          cam_move: "Static Precision beralih ke Slow Push-In",
          prompt: "Bidikan film 35mm sinematik seorang pemuda Indonesia 24 tahun berambut rapi dan berkacamata bulat mengenakan jas biru dongker berdiri tepat di depan pintu kaca buram ruang dewan direksi dengan gagang krom siap mendorongnya terbuka, pantulan marmer berkilau, pencahayaan atmosferik tegang, markas korporat Jakarta.",
          dialogue: "Kandidat nomor urut 12, Saudara Andrian Pratama, silakan masuk ke ruang panel evaluasi.",
          narration: "Di balik pintu kaca ini, seluruh perjuangan dan pengorbanan dipertaruhkan. Tarik napas, dan langkahkan kaki.",
          thumb: "/storage/storyboards/scene_3.jpg",
          video: "/storage/videos/scene_3.mp4"
        },
        {
          num: 4,
          title: "Ujian di Meja Keputusan",
          desc: "Menghadapi panel penguji direksi, Andrian memaparkan visi dan tekad pantang menyerah di hadapan Bu Maya Kusuma.",
          duration: 15,
          loc: "Ruang Rapat Eksekutif Lantai Tinggi",
          time: "Siang 13:00",
          mood: "Fokus Mendalam, Kharismatik, Elektrik",
          cam_angle: "Over The Shoulder ke Tatapan Direktur",
          cam_move: "Subtle Handheld Micro-movement",
          prompt: "Bidikan film sinematik fotorealistik di dalam ruang rapat dewan direksi modern Jakarta dengan jendela kaca besar lantai ke langit-langit. Pelamar teknologi muda Indonesia 24 tahun yang percaya diri dengan rambut hitam rapi dan kacamata mempresentasikan visi dengan gestur tangan penuh keyakinan di hadapan panel evaluasi direksi.",
          dialogue: "Saya mungkin belum memiliki puluhan tahun portofolio, namun tidak ada yang akan berjuang lebih gigih dan berdedikasi daripada saya.",
          narration: "Keyakinan adalah senjata terkuat ketika dunia meragukan kemampuanmu.",
          thumb: "/storage/storyboards/scene_4.jpg",
          video: "/storage/videos/scene_4.mp4"
        },
        {
          num: 5,
          title: "Badai Keteguhan di JPO Sudirman",
          desc: "Di jembatan penyeberangan saat gerimis malam, Andrian memandang lautan lampu Jakarta dengan resiliensi baja.",
          duration: 18,
          loc: "JPO Sudirman Jakarta",
          time: "Senja Gerimis 18:30",
          mood: "Resiliensi, Puitis, Menembus Hujan",
          cam_angle: "Sudut Lebar Refleksi Kaca Basah",
          cam_move: "Slow Motion Dutch Angle ke Push-In",
          prompt: "Bidikan film sinematik mahakarya fotorealistik 8k. Gerimis malam hari di Jakarta di jembatan penyeberangan orang (JPO) Sudirman. Pemuda Indonesia 24 tahun berkacamata memandang penuh perenungan ke arah jalan raya yang dipenuhi lautan lampu merah dan keemasan mobil. Pantulan cahaya neon kota di aspal basah.",
          narration: "Ketika satu pintu tertutup rapat di hadapanmu, jangan pernah berbalik arah. Bangun pintumu sendiri.",
          thumb: "/storage/storyboards/scene_5.jpg",
          video: "/storage/videos/scene_5.mp4"
        },
        {
          num: 6,
          title: "Merakit Terobosan Larut Malam",
          desc: "Di kedai kopi 24 jam, Andrian mengalihkan kepedihan menjadi mahakarya prototipe arsitektur cerdas.",
          duration: 16,
          loc: "Kedai Kopi Sangrai Artisan",
          time: "Dini Hari 02:00",
          mood: "Fokus Mutlak, Cahaya Terminal Neon",
          cam_angle: "Extreme Macro Refleksi Kacamata",
          cam_move: "Circular Orbital Push-In",
          prompt: "Bidikan film sinematik mahakarya fotorealistik 8k. Larut malam pukul 02:00 di ruang kerja kedai kopi artisan Jakarta. Pemrogram muda Indonesia 24 tahun dengan kacamata bulat bekerja intensif di depan laptop ultra tipis dengan pantulan baris kode di lensa kacamata.",
          narration: "Di kegelapan jam dua dini hari, ketika kota tertidur lelap, sebuah mahakarya baru dilahirkan dari ketekunan.",
          thumb: "/storage/storyboards/scene_6.jpg",
          video: "/storage/videos/scene_6.mp4"
        },
        {
          num: 7,
          title: "Kemenangan Sejati di Nusa Tech",
          desc: "Memaparkan prototipe terobosan di hadapan founder, Andrian disambut jabat tangan hangat dan tepuk tangan bangga tim.",
          duration: 18,
          loc: "Atrium Markas Teknologi Nusa Tech",
          time: "Pagi 09:30",
          mood: "Penuh Euforia, Kemenangan Emosional",
          cam_angle: "Sudut Rendah Simetris ke Jabat Tangan",
          cam_move: "Steadicam Gliding Arc Shot",
          prompt: "Bidikan film sinematik fotorealistik 8k. Cahaya matahari pagi menyinari atrium markas teknologi bergengsi di Jakarta. Talenta muda Indonesia 24 tahun berjas kasual tersenyum berjabat tangan erat dengan founder senior terhormat saat rekan kerja bertepuk tangan bangga.",
          dialogue: "Selamat bergabung dengan tim kami, Andrian. Solusimu mengubah segalanya.",
          narration: "Kerja keras yang konsisten tidak akan pernah mengingkari takdir indahnya.",
          thumb: "/storage/storyboards/scene_7.jpg",
          video: "/storage/videos/scene_7.mp4"
        },
        {
          num: 8,
          title: "Babak Baru Kejayaan (Puncak Horizon)",
          desc: "Berdiri di puncak gedung bertingkat saat senja keemasan Jakarta, Andrian menelepon ibunya dengan air mata kebahagiaan.",
          duration: 18,
          loc: "Sky Garden Rooftop Jakarta",
          time: "Senja Keemasan 17:45",
          mood: "Puncak Kejayaan, Mega-Sinematik",
          cam_angle: "Sudut Ekstrem Lebar Udara (Aerial Horizon)",
          cam_move: "Majestic Slow Pull-Back ke Langit Senja",
          prompt: "Bidikan film sinematik mahakarya fotorealistik 8k. Senja keemasan menghadap panorama cakrawala Jakarta yang menakjubkan dari teras rooftop gedung pencakar langit. Pemuda Indonesia 24 tahun berdiri bersandar di pagar kaca, memegang telepon di telinga, tersenyum haru dengan air mata kebahagiaan di pipi saat berbicara dengan ibunya.",
          dialogue: "Ibu... anakmu berhasil. Kita tidak perlu khawatir lagi sekarang.",
          narration: "Harapan bukanlah kepastian tanpa usaha. Harapan adalah keberanian untuk melangkah sekali lagi.",
          thumb: "/storage/storyboards/scene_8.jpg",
          video: "/storage/videos/scene_8.mp4"
        }
      ];

      for (const sc of demoScenes) {
        const sceneId = `demo-scene-${sc.num}`;
        await connection.query(
          `INSERT INTO scenes (id, project_id, scene_number, title, description, duration_seconds, location, time_of_day, mood, camera_angle, camera_movement, visual_prompt, dialogue, narration, status, video_url, thumbnail_url)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'completed', ?, ?)`,
          [
            sceneId,
            projectId,
            sc.num,
            sc.title,
            sc.desc,
            sc.duration,
            sc.loc,
            sc.time,
            sc.mood,
            sc.cam_angle,
            sc.cam_move,
            sc.prompt,
            sc.dialogue || null,
            sc.narration || null,
            sc.video,
            sc.thumb
          ]
        );

        // Storyboard frame
        await connection.query(
          `INSERT INTO storyboards (id, project_id, scene_id, image_url, prompt)
           VALUES (?, ?, ?, ?, ?)`,
          [uuidv4(), projectId, sceneId, sc.thumb, sc.prompt]
        );

        // Scene version
        await connection.query(
          `INSERT INTO scene_versions (id, scene_id, version_number, prompt, provider, model, video_url, status, generation_time)
           VALUES (?, ?, 1, ?, 'veo', 'veo-2.0', ?, 'completed', ?)`,
          [uuidv4(), sceneId, sc.prompt, sc.video, sc.duration]
        );
      }

      console.log('✅ [DB] Demo Showcase Project seeded: "THE LAST CHANCE" (120s, 8 scenes, characters, storyboard).');
    }

  } finally {
    connection.release();
  }
}

// Allow direct CLI execution: `node dist/database/initDb.js` or `tsx src/database/initDb.ts`
if (process.argv[1] && process.argv[1].endsWith('initDb.ts')) {
  initializeDatabase()
    .then(() => {
      console.log('🎉 Database initialization complete!');
      process.exit(0);
    })
    .catch((err) => {
      console.error('❌ Database initialization error:', err);
      process.exit(1);
    });
}
