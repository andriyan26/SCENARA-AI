import { query } from '../database/db.js';

async function migrateRichMedia() {
  console.log('🔄 Updating database with local video URLs and 12 Indonesian Voice Talents...');

  // 1. Update Project final video URL
  await query(
    `UPDATE projects SET 
      final_video_url = '/storage/videos/master_preview.mp4',
      thumbnail_url = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1280&q=80',
      title = 'Titik Balik (The Breakthrough)',
      description = 'Kisah perjuangan pemuda Indonesia menghadapi penolakan hingga menciptakan terobosan inovasi masa depan.'
    WHERE id = 'a25a336c-b140-4f14-88b9-4420075ef4f9' OR id = 'demo-last-chance-project'`
  );

  // 2. Update scenes 1 to 8 with local video files
  const sceneVideos = [
    { num: 1, video: '/storage/videos/scene_1.mp4' },
    { num: 2, video: '/storage/videos/scene_2.mp4' },
    { num: 3, video: '/storage/videos/scene_3.mp4' },
    { num: 4, video: '/storage/videos/scene_4.mp4' },
    { num: 5, video: '/storage/videos/scene_5.mp4' },
    { num: 6, video: '/storage/videos/scene_6.mp4' },
    { num: 7, video: '/storage/videos/scene_7.mp4' },
    { num: 8, video: '/storage/videos/scene_8.mp4' },
  ];

  for (const sv of sceneVideos) {
    await query(
      `UPDATE scenes SET video_url = ? WHERE scene_number = ?`,
      [sv.video, sv.num]
    );
  }

  // 3. Clear and reseed 12 diverse Indonesian Voice Talents
  await query(`DELETE FROM voices`);

  const indonesianVoices = [
    {
      id: 'voice-budi',
      name: 'Budi Santoso',
      gender: 'male',
      accent: 'Indonesian Warm Neutral',
      style: 'Narator Hangat & Puitis Dokumenter',
      sample_url: '/storage/audio/voice_sample.wav',
      description: 'Suara pria dewasa dengan timbre hangat, teduh, dan berwibawa. Sangat cocok untuk narasi film dokumenter dan kisah hidup mendalam.',
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      category: 'Dokumenter & Narasi'
    },
    {
      id: 'voice-siti',
      name: 'Siti Rahma',
      gender: 'female',
      accent: 'Indonesian Empathic',
      style: 'Lembut, Empatik & Mengharukan',
      sample_url: '/storage/audio/voice_sample.wav',
      description: 'Suara wanita dengan kelembutan emosional tinggi. Memberikan kedalaman rasa pada adegan dramatis dan monolog batin.',
      avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
      category: 'Drama & Emosional'
    },
    {
      id: 'voice-antoni',
      name: 'Antoni Pratama',
      gender: 'male',
      accent: 'Indonesian Dynamic Youth',
      style: 'Tokoh Utama Dinamis & Penuh Semangat',
      sample_url: '/storage/audio/voice_sample.wav',
      description: 'Suara pemuda modern yang energetik, pantang menyerah, dan penuh tekad. Sangat pas untuk karakter protagonis muda.',
      avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      category: 'Protagonis Muda'
    },
    {
      id: 'voice-maya',
      name: 'Maya Kusuma',
      gender: 'female',
      accent: 'Indonesian Authoritative',
      style: 'Pemimpin Karismatik & Berwibawa',
      sample_url: '/storage/audio/voice_sample.wav',
      description: 'Vokal tegas, jernih, dan elegan. Karakter eksekutif senior, direktur kreatif, dan pembicara profesional berpengaruh.',
      avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      category: 'Korporat & Kepemimpinan'
    },
    {
      id: 'voice-reza',
      name: 'Reza Mahendra',
      gender: 'male',
      accent: 'Indonesian Deep Bass',
      style: 'Suara Bariton Berat & Trailer Bioskop',
      sample_url: '/storage/audio/voice_sample.wav',
      description: 'Resonansi vokal rendah yang menggetarkan dada. Sangat kuat untuk trailer film aksi, pembuka epik, dan kalimat misterius.',
      avatar_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
      category: 'Trailer & Aksi'
    },
    {
      id: 'voice-putri',
      name: 'Putri Ayu',
      gender: 'female',
      accent: 'Indonesian Bright Modern',
      style: 'Ceria, Ramah & Konten Medsos',
      sample_url: '/storage/audio/voice_sample.wav',
      description: 'Intonasi lincah dan bersahabat. Ideal untuk konten YouTube Shorts, Reels, TikTok, dan video penjelasan ramah konsumen.',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      category: 'Kreator & Medsos'
    },
    {
      id: 'voice-dimas',
      name: 'Dimas Danendra',
      gender: 'male',
      accent: 'Indonesian Formal Broadcast',
      style: 'Pembawa Berita & Korporat Formal',
      sample_url: '/storage/audio/voice_sample.wav',
      description: 'Artikulasi sempurna standar penyiaran nasional. Cocok untuk video profil perusahaan, edukasi resmi, dan laporan komersial.',
      avatar_url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&q=80',
      category: 'Penyiaran & Edukasi'
    },
    {
      id: 'voice-dewi',
      name: 'Dewi Lestari',
      gender: 'female',
      accent: 'Indonesian Melodious Motherly',
      style: 'Suara Ibu Bijaksana & Narasi Melodius',
      sample_url: '/storage/audio/voice_sample.wav',
      description: 'Suara keibuan yang tenang dan menyejukkan hati. Cocok untuk pesan moral keluarga, kenangan masa kecil, dan nilai kehidupan.',
      avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
      category: 'Keluarga & Nilai Moral'
    },
    {
      id: 'voice-fajar',
      name: 'Fajar Nusantara',
      gender: 'male',
      accent: 'Indonesian Casual Urban',
      style: 'Podcaster Santai & Percakapan Alami',
      sample_url: '/storage/audio/voice_sample.wav',
      description: 'Gaya bicara natural seperti sedang mengobrol di warung kopi. Sangat memikat untuk segmen wawancara dan vlog otentik.',
      avatar_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80',
      category: 'Podcast & Cerita Santai'
    },
    {
      id: 'voice-aulia',
      name: 'Aulia Kirana',
      gender: 'female',
      accent: 'Indonesian Poetic Theatrical',
      style: 'Artistik, Puitis & Teatrikal',
      sample_url: '/storage/audio/voice_sample.wav',
      description: 'Sentuhan intonasi sastra klasik Indonesia. Sempurna untuk pembacaan puisi, film seni alternatif, dan narasi filosofis.',
      avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
      category: 'Sastra & Seni Sinema'
    },
    {
      id: 'voice-garry',
      name: 'Garry Kurniawan',
      gender: 'male',
      accent: 'Indonesian High Impact',
      style: 'Vokal Menggelegar Tensi Aksi',
      sample_url: '/storage/audio/voice_sample.wav',
      description: 'Karakter militer atau petualang laga dengan nada tegas tanpa kompromi. Membangun ketegangan di adegan klimaks pertempuran.',
      avatar_url: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=200&q=80',
      category: 'Laga & Tensi Tinggi'
    },
    {
      id: 'voice-nadia',
      name: 'Nadia Safitri',
      gender: 'female',
      accent: 'Indonesian Young Contemporary',
      style: 'Percakapan Kasual & Drama Modern',
      sample_url: '/storage/audio/voice_sample.wav',
      description: 'Artikulasi segar generasi muda metropolitan. Cocok untuk dialog persahabatan, asmara, dan dinamika mahasiswa.',
      avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
      category: 'Romansa & Drama Muda'
    }
  ];

  for (const v of indonesianVoices) {
    await query(
      `INSERT INTO voices (id, name, provider, provider_voice_id, gender, language, style, preview_url) 
       VALUES (?, ?, 'elevenlabs', ?, ?, 'id-ID', ?, ?)`,
      [v.id, v.name, v.id, v.gender, v.style, v.sample_url]
    );
  }

  console.log('✅ Rich Media migration finished successfully!');
}

migrateRichMedia().then(() => process.exit(0)).catch(err => {
  console.error('Migration error:', err);
  process.exit(1);
});
