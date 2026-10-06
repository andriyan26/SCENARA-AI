import mysql from 'mysql2/promise';

async function migrate() {
  console.log('🔄 [MIGRATION] Migrating database scenara_ai to 100% Bahasa Indonesia...');
  const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'scenara_ai'
  });

  const connection = await pool.getConnection();
  try {
    // 1. Reseed Voices Table to Indonesian Voices
    await connection.query('DELETE FROM voices');
    const indonesianVoices = [
      { id: 'v-budi', name: 'Budi Santoso', provider_voice_id: 'budi_id_indonesia', gender: 'male', language: 'id-ID', style: 'Narator Sinematik Hangat & Puitis', preview: '/storage/audio/voice_sample.wav' },
      { id: 'v-siti', name: 'Siti Rahma', provider_voice_id: 'siti_id_indonesia', gender: 'female', language: 'id-ID', style: 'Dialog Empatik & Emosional', preview: '/storage/audio/voice_sample.wav' },
      { id: 'v-antoni', name: 'Antoni Pratama', provider_voice_id: 'antoni_id_indonesia', gender: 'male', language: 'id-ID', style: 'Protagonis Muda Penuh Semangat', preview: '/storage/audio/voice_sample.wav' },
      { id: 'v-maya', name: 'Maya Kusuma', provider_voice_id: 'maya_id_indonesia', gender: 'female', language: 'id-ID', style: 'Suara Berwibawa & Penuh Kebijaksanaan', preview: '/storage/audio/voice_sample.wav' },
      { id: 'v-reza', name: 'Reza Mahendra', provider_voice_id: 'reza_id_indonesia', gender: 'male', language: 'id-ID', style: 'Trailer Teatrikal Berat & Megah', preview: '/storage/audio/voice_sample.wav' },
      { id: 'v-putri', name: 'Putri Ayu', provider_voice_id: 'putri_id_indonesia', gender: 'female', language: 'id-ID', style: 'Karakter Ceria, Segar & Dinamis', preview: '/storage/audio/voice_sample.wav' },
    ];

    for (const v of indonesianVoices) {
      await connection.query(
        `INSERT INTO voices (id, user_id, name, provider, provider_voice_id, gender, language, style, preview_url)
         VALUES (?, 'user-admin-default', ?, 'elevenlabs', ?, ?, ?, ?, ?)`,
        [v.id, v.name, v.provider_voice_id, v.gender, v.language, v.style, v.preview]
      );
    }
    console.log('✅ Voices reseeded to 6 Indonesian voice actors.');

    // 2. Update projects
    await connection.query(`
      UPDATE projects 
      SET title = 'Titik Balik (The Breakthrough)',
          description = 'Kisah perjuangan seorang pemuda di Jakarta yang berulang kali gagal wawancara kerja, namun menolak menyerah hingga menciptakan inovasi teknologi yang mengubah takdirnya.',
          language = 'Indonesian'
      WHERE id = 'a25a336c-b140-4f14-88b9-4420075ef4f9'
    `);

    // 3. Update scenes for project 'a25a336c-b140-4f14-88b9-4420075ef4f9'
    const sceneUpdates = [
      {
        num: 1,
        title: 'Adegan 01: Ambang Batas Sunyi',
        desc: 'Andrian duduk di tepi kasur kamarnya memandang layar laptop di tengah keheningan fajar Jakarta.',
        mood: 'Melankolis, Kontemplatif',
        camera_angle: 'Extreme Wide beralih ke Medium Push-In',
        camera_movement: 'Slow Dolly In',
        narration: 'Setiap perjalanan besar selalu bermula dalam hening, di saat mimpi diuji antara padam atau membara.',
        dialogue: null
      },
      {
        num: 2,
        title: 'Adegan 02: Arus Perjuangan Kota',
        desc: 'Melangkah membelah kerumunan sibuk kawasan perkantoran Sudirman, menggenggam erat amplop portofolio.',
        mood: 'Dinamis, Menegangkan, Penuh Tekad',
        camera_angle: 'Bidikan Rendah (Low Angle Tracking)',
        camera_movement: 'Dynamic Steadicam Tracking',
        narration: 'Berjalan di antara ribuan langkah terburu-buru, mencari satu pintu yang terbuka untuk membuktikan kemampuan diri.',
        dialogue: null
      },
      {
        num: 3,
        title: 'Adegan 03: Ujian di Ruang Keputusan',
        desc: 'Memasuki ruang dewan direksi berlantai tinggi menghadapi pertanyaan tajam tim penilai eksekutif.',
        mood: 'Tegang, Mengintimidasi, Presisi',
        camera_angle: 'Bidikan Lebar Simetris (Symmetrical Wide)',
        camera_movement: 'Static Precision Framing',
        narration: 'Ketika dunia memandang dengan keraguan, kata-kata tak lagi penting dibanding kobaran api di dalam dada.',
        dialogue: 'Mereka bertanya apakah saya punya pengalaman. Saya jawab pengalaman bisa dilatih, tapi kegigihan lahir dari jiwa.'
      },
      {
        num: 4,
        title: 'Adegan 04: Menembus Batas Malam',
        desc: 'Bekerja lembur melampaui rasa lelah di sebuah kedai kopi malam, menyempurnakan mahakarya inovasi.',
        mood: 'Hipnotis, Fokus Mendalam, Elektrik',
        camera_angle: 'Over The Shoulder ke Rack Focus Keyboard',
        camera_movement: 'Subtle Handheld Micro-movement',
        narration: 'Keahlian sejati lahir pada larut malam yang sunyi, saat tak ada seorang pun yang bertepuk tangan.',
        dialogue: null
      },
      {
        num: 5,
        title: 'Adegan 05: Titik Balik Kesuksesan',
        desc: 'Momen terobosan krusial saat rancangan terbukti berhasil dan disambut tepuk tangan dewan pimpinan.',
        mood: 'Menginspirasi, Euforia, Membanggakan',
        camera_angle: 'Medium Arc Two-Shot',
        camera_movement: 'Fluid 180-degree Arc Orbit',
        narration: 'Dan akhirnya, semesta selalu membuka jalan bagi mereka yang tak pernah lelah mengetuk pintu keberhasilan.',
        dialogue: 'Selamat bergabung di tim kami. Visi dan karya Anda persis seperti apa yang kami butuhkan.'
      },
      {
        num: 6,
        title: 'Adegan 06: Cakrawala Keemasan',
        desc: 'Memandang langit senja dari atas atap gedung pencakar langit dengan air mata bahagia dan rasa syukur.',
        mood: 'Epik, Katarsis, Megah Mengharukan',
        camera_angle: 'Close-Up Heroik meluas ke Extreme Wide Crane',
        camera_movement: 'Boom Crane Rising Shot',
        narration: 'Harapan bukan sekadar janji kemudahan, melainkan keberanian untuk melangkah satu kali lagi.',
        dialogue: 'Ibu, aku berhasil membuktikannya.'
      },
      {
        num: 7,
        title: 'Adegan 07: Kemenangan Sejati',
        desc: 'Andrian tersenyum bangga di tengah pendar sinar fajar baru, siap memimpin langkah menuju era kejayaan.',
        mood: 'Megah, Penuh Syukur, Menggetarkan Jiwa',
        camera_angle: 'Medium Close-Up ke Wide Panorama',
        camera_movement: 'Slow Orbit Cinematic',
        narration: 'Setiap tetes keringat dan doa di keheningan malam kini berbuah mahakarya nyata.',
        dialogue: null
      },
      {
        num: 8,
        title: 'Adegan 08: Babak Baru Kejayaan',
        desc: 'Langkah mantap memasuki gerbang kantor baru, menatap masa depan dengan integritas dan tekad baja.',
        mood: 'Penuh Semangat, Inspiratif, Teatrikal',
        camera_angle: 'Low Angle Heroic Tracking',
        camera_movement: 'Dynamic Forward Push',
        narration: 'Dan kisah ini bukan tentang akhir sebuah perjuangan, melainkan awal dari babak kejayaan yang sesungguhnya.',
        dialogue: 'Mari kita mulai babak baru ini bersama-sama.'
      }
    ];

    // Get scene IDs for project
    const [existingScenes]: any = await connection.query(
      'SELECT id, scene_number FROM scenes WHERE project_id = ? ORDER BY scene_number ASC',
      ['a25a336c-b140-4f14-88b9-4420075ef4f9']
    );

    for (let i = 0; i < existingScenes.length; i++) {
      const sc = existingScenes[i];
      const updateData = sceneUpdates[i % sceneUpdates.length];
      await connection.query(
        `UPDATE scenes 
         SET title = ?, description = ?, mood = ?, camera_angle = ?, camera_movement = ?, narration = ?, dialogue = ?
         WHERE id = ?`,
        [
          updateData.title,
          updateData.desc,
          updateData.mood,
          updateData.camera_angle,
          updateData.camera_movement,
          updateData.narration,
          updateData.dialogue,
          sc.id
        ]
      );
    }
    console.log(`✅ ${existingScenes.length} scenes updated with Indonesian titles, narrations, and dialogues.`);

    // 4. Update characters
    await connection.query(`
      UPDATE characters
      SET description = 'Pemuda berdaya juang tinggi yang menghadapi tekanan hidup di Jakarta dengan keyakinan, dedikasi, dan kecerdasan.',
          personality = 'Tangguh, reflektif, berani menghadapi tekanan besar, penuh kepedulian pada keluarga.',
          appearance = 'Pria muda Indonesia, rambut hitam bergelombang rapi, tatapan mata cokelat tajam penuh tekad.',
          clothing = 'Blazer biru dongker pas badan yang disetrika rapi, kemeja putih bersih berkerah tegak, celana formal hitam.',
          voice_id = 'Antoni Pratama'
      WHERE project_id = 'a25a336c-b140-4f14-88b9-4420075ef4f9' AND name = 'Andrian Pratama'
    `);

    // 5. Update screenplay script
    const indoScript = `SCENARA AI SUTRADARA — NASKAH SKENARIO RESMI

JUDUL: TITIK BALIK (THE BREAKTHROUGH)
GENRE: DRAMA INSPIRATIF | TARGET DURASI: 02:00 (120 DETIK)
BAHASA VISUAL: SINEMATIK HYPERREALISTIK | RASIO: 16:9

BABAK I: AMBANG BATAS SUNYI (00:00 - 00:30)
ADEGAN 01 - INT. KAMAR KOST ANDRIAN - FAJAR 05:30 (15d)
Cahaya biru fajar merayap pelan menembus kisi-kisi jendela kayu. ANDRIAN (24) duduk di tepi kasur busa, menatap layar laptop yang menyala di kegelapan kamar. Puluhan surat penolakan kerja belum terbaca di kotak masuk.
NARASI (V.O.): "Setiap perjalanan besar selalu bermula dalam hening, di saat mimpi diuji antara padam atau membara."

ADEGAN 02 - EXT. KAWASAN BISNIS SUDIRMAN - PAGI 08:00 (15d)
Deru kendaraan dan derap ribuan pekerja ibu kota melangkah cepat di antara gedung kaca pencakar langit. Andrian berjalan melawan arus, mendekap amplop cokelat portofolio karyanya.
KAMERA: Bidikan rendah melacak gerak (low-angle tracking shot), mengisolasi Andrian di tengah samudra manusia.
NARASI (V.O.): "Berjalan di antara ribuan langkah terburu-buru, mencari satu pintu yang terbuka untuk membuktikan kemampuan diri."

BABAK II: LABIRIN RINTANGAN & PERJUANGAN KERAS (00:30 - 01:15)
ADEGAN 03 - INT. RUANG SIDANG DIREKSI GEDUNG KACA - SIANG 11:30 (15d)
Ruang rapat mewah berlantai marmer. Tiga jajaran penguji eksekutif memandang dingin. Pimpinan penguji MAYA memeriksa berkas Andrian.
NARASI (V.O.): "Ketika dunia memandang dengan keraguan, kata-kata tak lagi penting dibanding kobaran api di dalam dada."
MAYA: "Pengalamanmu sangat minim untuk posisi ini, Andrian."
ANDRIAN: "Saya mungkin belum punya tahunan pengalaman, Bu. Tapi saya pastikan, tidak ada orang yang akan bekerja lebih gigih daripada saya."

ADEGAN 04 - INT. KEDAI KOPI MALAM - TENGAH MALAM 01:00 (15d)
Lengan kemeja Andrian tergulung rapi. Jari-jemarinya menari lincah di atas papan ketik mekanik. Ia tidak meratapi penolakan; ia merajut mahakarya prototipe perangkat lunak revolusioner. Secangkir kopi hitam mengepul di sisinya.
NARASI (V.O.): "Keahlian sejati lahir pada larut malam yang sunyi, saat tak ada seorang pun yang bertepuk tangan."

BABAK III: TITIK BALIK & PUNCAK KEJAYAAN (01:15 - 02:00)
ADEGAN 05 - INT. AULA INOVASI TEKNOLOGI - PAGI 09:30 (15d)
Andrian mendemonstrasikan sistem karyanya secara langsung di hadapan dewan komisaris. Tepuk tangan membahana. Pendiri perusahaan bangkit berdiri dan mengulurkan tangan hangat.
MAYA: "Selamat bergabung di tim kami, Andrian. Visi dan karya Anda persis seperti apa yang kami butuhkan."
NARASI (V.O.): "Dan akhirnya, semesta selalu membuka jalan bagi mereka yang tak pernah lelah mengetuk pintu keberhasilan."

ADEGAN 06 - EXT. ATAP GEDUNG PENCAKAR LANGIT - SENJA KEEMASAN (15d)
Andrian melakukan panggilan video dengan ibunya di kampung halaman. Sembari memegang surat penerimaan kerja resmi, senyum bahagia merekah di wajahnya saat matahari senja Jakarta berpendar jingga keemasan.
ANDRIAN: "Ibu, aku berhasil membuktikannya."
NARASI (V.O.): "Harapan bukan sekadar janji kemudahan, melainkan keberanian untuk melangkah satu kali lagi."

ADEGAN 07 - EXT. PANORAMA CAKRAWALA IBU KOTA - SENJA (15d)
Lampu-lampu kota mulai menyala gemerlap bagai hamparan bintang di bumi.
NARASI (V.O.): "Setiap tetes keringat dan doa di keheningan malam kini berbuah mahakarya nyata."

ADEGAN 08 - EXT. GERBANG UTAMA MENARA KANTOR - MALAM (15d)
Andrian melangkah percaya diri memasuki babak baru kehidupannya.
ANDRIAN: "Mari kita mulai babak baru ini bersama-sama."
NARASI (V.O.): "Dan kisah ini bukan tentang akhir sebuah perjuangan, melainkan awal dari babak kejayaan yang sesungguhnya."

[FADE OUT — TAMAT]`;

    await connection.query(
      'UPDATE scripts SET title = ?, content = ? WHERE project_id = ?',
      ['TITIK BALIK (THE BREAKTHROUGH) - Naskah Skenario Bioskop', indoScript, 'a25a336c-b140-4f14-88b9-4420075ef4f9']
    );
    console.log('✅ Screenplay script updated to Indonesian.');

    console.log('🎉 Migration completed successfully!');
  } finally {
    connection.release();
    await pool.end();
  }
}

migrate().catch(console.error);
