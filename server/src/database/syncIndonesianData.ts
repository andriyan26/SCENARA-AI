import { query } from './db.js';

export async function syncAllIndonesianData() {
  console.log('🔄 Menyelaraskan seluruh data database ke 100% Bahasa Indonesia...');

  // 1. Perbarui semua Proyek
  await query(
    `UPDATE projects
     SET description = 'Kisah perjuangan seorang pemuda perantau di Jakarta menghadapi puluhan penolakan wawancara kerja, hingga ia membuktikan keahlian inovasinya di hadapan dewan direksi.',
         language = 'Indonesian',
         thumbnail_url = '/storage/storyboards/scene_3.jpg',
         final_video_url = '/storage/videos/master_preview.mp4'
     WHERE id IN ('demo-last-chance-project', 'a25a336c-b140-4f14-88b9-4420075ef4f9')`
  );

  await query(
    `UPDATE projects
     SET description = 'Ketika dihadapkan pada rintangan besar yang menguji jiwa, tekad pantang menyerah mengubah perjuangan sunyi menjadi karya kemenangan yang gemilang.',
         language = 'Indonesian',
         thumbnail_url = '/storage/storyboards/scene_8.jpg',
         final_video_url = '/storage/videos/scene_8.mp4'
     WHERE id = '9fe058c5-2c09-43e8-990d-05e0e4baba8a'`
  );

  // 2. Data 8 Adegan Sinematik 100% Bahasa Indonesia
  const indonesianScenes = [
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
      dialogue: null,
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
      dialogue: null,
      narration: "Berjalan di antara ribuan langkah terburu-buru, mencari satu pintu yang terbuka untuk membuktikan kemampuan diri.",
      thumb: "/storage/storyboards/scene_2.jpg",
      video: "/storage/videos/scene_2.mp4"
    },
    {
      num: 3,
      title: "Pintu Masuk Ruang Evaluasi",
      desc: "Andrian berdiri tepat di depan pintu kaca buram ruang dewan direksi, siap melangkah masuk menghadapi panel penilai.",
      duration: 15,
      loc: "Lobi & Koridor Pintu Eksekutif Gedung Kaca",
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
      dialogue: null,
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
      dialogue: null,
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

  // Perbarui adegan untuk kedua proyek aktif
  const projectIds = ['demo-last-chance-project', 'a25a336c-b140-4f14-88b9-4420075ef4f9'];
  for (const pid of projectIds) {
    for (const sc of indonesianScenes) {
      await query(
        `UPDATE scenes
         SET title = ?,
             description = ?,
             duration_seconds = ?,
             location = ?,
             time_of_day = ?,
             mood = ?,
             camera_angle = ?,
             camera_movement = ?,
             visual_prompt = ?,
             dialogue = ?,
             narration = ?,
             thumbnail_url = ?,
             video_url = ?,
             status = 'completed'
         WHERE project_id = ? AND scene_number = ?`,
        [
          sc.title,
          sc.desc,
          sc.duration,
          sc.loc,
          sc.time,
          sc.mood,
          sc.cam_angle,
          sc.cam_move,
          sc.prompt,
          sc.dialogue,
          sc.narration,
          sc.thumb,
          sc.video,
          pid,
          sc.num
        ]
      );

      // Sinkronkan juga storyboards prompt dan image_url
      await query(
        `UPDATE storyboards
         SET image_url = ?,
             prompt = ?
         WHERE project_id = ? AND image_url LIKE ?`,
        [sc.thumb, sc.prompt, pid, `%scene_${sc.num}%`]
      );
    }
  }

  // 3. Karakter Konsisten 100% Bahasa Indonesia
  await query(
    `UPDATE characters
     SET description = 'Lulusan baru ilmu komputer dari daerah yang berjuang di Jakarta demi membanggakan keluarga dan mewujudkan mimpinya.',
         personality = 'Tangguh, reflektif, gigih, berani menghadapi tekanan besar di bawah situasi genting.',
         appearance = 'Pemuda Indonesia, rambut hitam bergelombang rapi, tatapan mata cokelat tajam penuh tekad, kacamata bulat.',
         clothing = 'Jas blazer biru dongker pas badan yang disetrika rapi, kemeja putih bersih berkerah tegak, sepatu pantofel hitam formal.',
         reference_image_url = '/storage/characters/andrian_pratama.jpg',
         voice_id = 'Antoni Pratama'
     WHERE name = 'Andrian Pratama'`
  );

  await query(
    `UPDATE characters
     SET description = 'Pemimpin eksekutif senior perusahaan teknologi terkemuka. Cerdas, berwibawa, tajam menilai potensi sejati seseorang.',
         personality = 'Karismatik, lugas, visioner, adil, tulus mengayomi talenta muda berdaya juang tinggi.',
         appearance = 'Wanita karir anggun berwibawa, rambut bob hitam rapi sebahu, kacamata bingkai ramping elegan, senyum hangat.',
         clothing = 'Setelan blazer abu-abu arang modern dengan blus sutra krem gading, arloji titanium minimalis.',
         reference_image_url = '/storage/storyboards/scene_4.jpg',
         voice_id = 'Aulia Kirana'
     WHERE name = 'Maya Kusuma'`
  );

  console.log('✅ Seluruh data database berhasil diselaraskan ke 100% Bahasa Indonesia!');
}

if (process.argv[1] && process.argv[1].endsWith('syncIndonesianData.ts')) {
  syncAllIndonesianData()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
