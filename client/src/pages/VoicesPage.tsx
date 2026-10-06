import React, { useState } from 'react';
import { Mic2, Sparkles, Volume2, Play, Square, User, Filter, CheckCircle2, Sliders } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine.ts';

interface VoiceTalent {
  id: string;
  name: string;
  gender: 'male' | 'female';
  ageGroup: string;
  category: string;
  style: string;
  sampleText: string;
  avatar: string;
  pitch: number;
  rate: number;
  description: string;
}

export const VoicesPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const [customText, setCustomText] = useState('Di balik setiap tantangan hidup, selalu ada harapan yang menunggu untuk diperjuangkan.');
  const [selectedVoiceForCustom, setSelectedVoiceForCustom] = useState<string>('voice-budi');

  const voiceTalents: VoiceTalent[] = [
    {
      id: 'voice-budi',
      name: 'Budi Santoso',
      gender: 'male',
      ageGroup: '45-50 Tahun (Dewasa)',
      category: 'dokumenter',
      style: 'Narator Puitis & Hangat',
      sampleText: 'Setiap perjalanan bermula dalam kesunyian, di saat mimpi-mimpi kita diuji oleh waktu.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      pitch: 0.88,
      rate: 0.95,
      description: 'Vokal pria dewasa dengan timbre hangat, teduh, dan berwibawa. Sangat cocok untuk narasi film dokumenter dan kisah hidup mendalam.'
    },
    {
      id: 'voice-siti',
      name: 'Siti Rahma',
      gender: 'female',
      ageGroup: '40-45 Tahun (Dewasa)',
      category: 'drama',
      style: 'Lembut, Empatik & Mengharukan',
      sampleText: 'Jangan pernah menyerah, anakku. Doa ibu selalu menyertai setiap langkah kakimu.',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
      pitch: 1.15,
      rate: 0.92,
      description: 'Suara wanita dengan kelembutan emosional tinggi. Memberikan kedalaman rasa pada adegan dramatis dan monolog batin yang menyentuh hati.'
    },
    {
      id: 'voice-antoni',
      name: 'Antoni Pratama',
      gender: 'male',
      ageGroup: '23-28 Tahun (Muda)',
      category: 'protagonis',
      style: 'Tokoh Utama Dinamis & Penuh Tekad',
      sampleText: 'Mereka boleh meragukan kemampuan saya, tapi mereka tidak akan pernah bisa memadamkan tekad ini!',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
      pitch: 0.95,
      rate: 1.02,
      description: 'Suara pemuda modern yang energetik, pantang menyerah, dan penuh tekad. Sangat pas untuk karakter protagonis muda di film layar lebar.'
    },
    {
      id: 'voice-maya',
      name: 'Maya Kusuma',
      gender: 'female',
      ageGroup: '35-40 Tahun (Dewasa)',
      category: 'korporat',
      style: 'Pemimpin Karismatik & Berwibawa',
      sampleText: 'Karya Anda telah membuktikan dedikasi dan kualitas sejati. Selamat bergabung di tim kepemimpinan kami.',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
      pitch: 1.05,
      rate: 0.98,
      description: 'Vokal tegas, jernih, dan berwibawa tinggi. Karakter eksekutif senior, direktur kreatif, dan pembicara profesional berpengaruh.'
    },
    {
      id: 'voice-reza',
      name: 'Reza Mahendra',
      gender: 'male',
      ageGroup: '30-35 Tahun',
      category: 'trailer',
      style: 'Bariton Berat & Trailer Bioskop',
      sampleText: 'Ketika batas takdir dipertaruhkan, hanya satu pilihan yang tersisa: menembus batas malam!',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
      pitch: 0.82,
      rate: 0.90,
      description: 'Resonansi vokal rendah yang menggetarkan dada. Sangat kuat untuk trailer film bioskop, teaser epik, dan adegan penuh ketegangan.'
    },
    {
      id: 'voice-putri',
      name: 'Putri Ayu',
      gender: 'female',
      ageGroup: '20-25 Tahun (Muda)',
      category: 'medsos',
      style: 'Ceria, Ramah & Konten Kreator',
      sampleText: 'Halo semuanya! Hari ini aku bakal tunjukin rahasia membuat video sinematik sekelas bioskop hanya dalam 2 menit!',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      pitch: 1.22,
      rate: 1.08,
      description: 'Intonasi ceria, renyah, dan bersahabat. Ideal untuk konten YouTube Shorts, Reels, TikTok, dan video penjelasan produk komersial modern.'
    },
    {
      id: 'voice-dimas',
      name: 'Dimas Danendra',
      gender: 'male',
      ageGroup: '32-38 Tahun',
      category: 'korporat',
      style: 'Pembawa Berita & Korporat Formal',
      sampleText: 'Inovasi ini membuka babak baru bagi masa depan industri kreatif dan teknologi tanah air.',
      avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=300&q=80',
      pitch: 0.92,
      rate: 0.96,
      description: 'Artikulasi sempurna standar penyiaran nasional. Cocok untuk video profil perusahaan, edukasi resmi, dan laporan komersial.'
    },
    {
      id: 'voice-dewi',
      name: 'Dewi Lestari',
      gender: 'female',
      ageGroup: '45-50 Tahun',
      category: 'drama',
      style: 'Ibu Bijaksana & Narasi Melodius',
      sampleText: 'Ingatlah selalu, rumah ini akan selalu menjadi tempatmu pulang, apa pun yang terjadi di luar sana.',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
      pitch: 1.08,
      rate: 0.90,
      description: 'Suara keibuan yang tenang dan menyejukkan sanubari. Menguatkan pesan moral keluarga, kenangan masa kecil, dan nilai kemanusiaan.'
    },
    {
      id: 'voice-fajar',
      name: 'Fajar Nusantara',
      gender: 'male',
      ageGroup: '26-30 Tahun',
      category: 'medsos',
      style: 'Podcaster Santai & Percakapan Alami',
      sampleText: 'Gue rasa yang bikin kita terus bertahan itu bukan karena segalanya gampang, tapi karena kita percaya sama tujuan kita.',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80',
      pitch: 0.97,
      rate: 1.00,
      description: 'Gaya bicara natural santai seperti mengobrol hangat di warung kopi. Sangat memikat untuk segmen podcast dan vlog otentik.'
    },
    {
      id: 'voice-aulia',
      name: 'Aulia Kirana',
      gender: 'female',
      ageGroup: '28-32 Tahun',
      category: 'dokumenter',
      style: 'Artistik, Puitis & Teatrikal',
      sampleText: 'Di antara helai waktu yang gugur, ada bait-bait rindu yang tertulis dalam sunyinya hembusan angin malam.',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
      pitch: 1.18,
      rate: 0.92,
      description: 'Sentuhan intonasi sastra klasik nusantara yang mendalam. Sempurna untuk pembacaan puisi, film seni alternatif, dan narasi filosofis.'
    },
    {
      id: 'voice-garry',
      name: 'Garry Kurniawan',
      gender: 'male',
      ageGroup: '30-35 Tahun',
      category: 'trailer',
      style: 'Vokal Menggelegar Tensi Aksi',
      sampleText: 'Beri aba-aba sekarang juga! Semua tim bersiap di posisi masing-masing dalam hitungan tiga!',
      avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=300&q=80',
      pitch: 0.85,
      rate: 1.05,
      description: 'Karakter militer atau komandan laga dengan nada tegas tanpa kompromi. Membangun ketegangan di adegan aksi dan kejar-kejaran seru.'
    },
    {
      id: 'voice-nadia',
      name: 'Nadia Safitri',
      gender: 'female',
      ageGroup: '21-25 Tahun (Muda)',
      category: 'protagonis',
      style: 'Percakapan Kasual & Drama Modern',
      sampleText: 'Kalau kita nggak mulai dari sekarang, kapan lagi kita bakal punya kesempatan untuk wujudin mimpi ini bareng-bareng?',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
      pitch: 1.20,
      rate: 1.04,
      description: 'Artikulasi segar khas generasi muda metropolitan. Cocok untuk dialog persahabatan, romansa asmara, dan dinamika kampus.'
    }
  ];

  const categories = [
    { id: 'all', label: 'Semua Pengisi Suara (12)' },
    { id: 'protagonis', label: 'Tokoh Utama' },
    { id: 'dokumenter', label: 'Dokumenter & Narasi' },
    { id: 'drama', label: 'Drama & Emosional' },
    { id: 'trailer', label: 'Trailer & Aksi' },
    { id: 'korporat', label: 'Korporat & Formal' },
    { id: 'medsos', label: 'Medsos & Kreator' },
  ];

  const filteredVoices = voiceTalents.filter(v => activeCategory === 'all' || v.category === activeCategory);

  const handlePlayVoice = (talent: VoiceTalent) => {
    if (playingVoiceId === talent.id) {
      audioEngine.stopAll();
      setPlayingVoiceId(null);
      return;
    }

    setPlayingVoiceId(talent.id);
    audioEngine.speak(talent.sampleText, {
      gender: talent.gender
    });

    // Reset visual play state after a few seconds
    setTimeout(() => {
      setPlayingVoiceId(null);
    }, 4500);
  };

  const handlePlayCustomText = () => {
    if (!customText.trim()) return;
    const talent = voiceTalents.find(v => v.id === selectedVoiceForCustom) || voiceTalents[0];
    setPlayingVoiceId(talent.id);
    audioEngine.speak(customText, {
      gender: talent.gender
    });
    setTimeout(() => {
      setPlayingVoiceId(null);
    }, 5000);
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in-up">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-2">
            <Mic2 className="w-3.5 h-3.5" />
            <span>STUDIO PENGISI SUARA ORANG ASLI</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
            Pengisi Suara Bahasa Indonesia (Voice Talents)
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl mt-1">
            Koleksi pengisi suara manusia dengan karakter vokal autentik, intonasi emosional asli Indonesia, dan artikulasi sinematik berkualitas tinggi.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono px-3.5 py-1.5 rounded-xl bg-studio-900 border border-white/10 text-emerald-400">
          <CheckCircle2 className="w-4 h-4" />
          <span>12 Profil Vokal Indonesia Aktif</span>
        </div>
      </div>

      {/* Live Custom Text Tester Box */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-studio-900 via-studio-850 to-studio-900 border border-cyan-500/30 shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span className="text-xs font-bold text-cyan-300 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Studio Pengujian Suara Langsung (Ketik Kalimat Apa Saja):</span>
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400 font-mono">Pilih Aktor Suara:</span>
            <select
              value={selectedVoiceForCustom}
              onChange={e => setSelectedVoiceForCustom(e.target.value)}
              className="bg-studio-950 border border-white/20 rounded-lg px-3 py-1 text-xs text-white focus:outline-none focus:border-cyan-400"
            >
              {voiceTalents.map(v => (
                <option key={v.id} value={v.id}>
                  {v.name} ({v.gender === 'male' ? 'Pria' : 'Wanita'} - {v.style})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={customText}
            onChange={e => setCustomText(e.target.value)}
            placeholder="Tulis kalimat apa saja dalam bahasa Indonesia untuk didengar suaranya..."
            className="flex-1 px-4 py-2.5 bg-studio-950 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-medium"
          />
          <button
            onClick={handlePlayCustomText}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all hover:scale-105 active:scale-95 shrink-0"
          >
            <Volume2 className="w-4 h-4" />
            <span>Ucapkan Kalimat Ini</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium font-mono whitespace-nowrap transition-all ${
              activeCategory === cat.id
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'bg-studio-900 text-slate-400 border border-white/5 hover:text-white'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* 12 Voice Talents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVoices.map((talent, index) => {
          const isPlaying = playingVoiceId === talent.id;

          return (
            <div
              key={talent.id}
              style={{ animationDelay: `${index * 80}ms` }}
              className={`glass-card p-5 rounded-2xl border transition-all flex flex-col justify-between group animate-fade-in-up ${
                isPlaying 
                  ? 'border-cyan-400 shadow-xl shadow-cyan-500/15 bg-cyan-950/20' 
                  : 'border-white/10 hover:border-cyan-500/30'
              }`}
            >
              <div className="space-y-4">
                {/* Header with Avatar & Details */}
                <div className="flex items-center gap-3.5">
                  <div className="relative w-14 h-14 rounded-2xl overflow-hidden border border-white/20 shrink-0 group-hover:scale-105 transition-transform">
                    <img src={talent.avatar} alt={talent.name} className="w-full h-full object-cover" />
                    <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-black ${
                      talent.gender === 'male' ? 'bg-cyan-400' : 'bg-pink-400'
                    }`} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-white truncate group-hover:text-cyan-300 transition-colors">
                        {talent.name}
                      </h4>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/60 border border-white/10 text-slate-300">
                        {talent.gender === 'male' ? 'Pria' : 'Wanita'}
                      </span>
                    </div>
                    <div className="text-[11px] font-mono text-cyan-400 truncate mt-0.5">
                      {talent.style}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                      🇮🇩 Bahasa Indonesia • {talent.ageGroup}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-300 leading-relaxed">
                  {talent.description}
                </p>

                {/* Sample Quote Box */}
                <div className="p-3 rounded-xl bg-studio-900/90 border border-white/5 text-[11px] text-slate-300 italic relative overflow-hidden">
                  <div className="text-slate-400 text-[10px] not-italic font-mono mb-1">Sampel Dialog:</div>
                  “{talent.sampleText}”
                </div>
              </div>

              {/* Play & Preview Button */}
              <div className="pt-4 mt-4 border-t border-white/5">
                <button
                  onClick={() => handlePlayVoice(talent)}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    isPlaying
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-md'
                      : 'bg-studio-900 hover:bg-cyan-500 hover:text-black text-white border border-white/10 hover:border-cyan-400'
                  }`}
                >
                  {isPlaying ? (
                    <>
                      <Square className="w-3.5 h-3.5 fill-current" />
                      <span>Hentikan Suara</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Dengarkan Karakter Suara</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
