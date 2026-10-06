import React, { useState } from 'react';
import { Music, Sparkles, Play, Pause, Volume2, Disc3, Radio, Sliders, CheckCircle2, Zap } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine.ts';

interface MusicTrack {
  id: string;
  title: string;
  category: string;
  genre: string;
  bpm: number;
  mood: string;
  description: string;
  instruments: string[];
  duration: string;
}

export const AudioStudioPage: React.FC = () => {
  const [activeTrackId, setActiveTrackId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const tracks: MusicTrack[] = [
    {
      id: 'track-destiny',
      title: 'Bangkitnya Takdir (Rise of Destiny)',
      category: 'orkestra',
      genre: 'Orkestra Sinematik Megah',
      bpm: 82,
      mood: 'Dramatis, Megah, Menggugah Jiwa',
      description: 'Gesekan string lembut yang berangsur memuncak dengan dentuman brass megah dan perkusi sinematik pada babak klimaks.',
      instruments: ['Violin & Cello Section', 'French Horn', 'Timpani', 'Sub-Bass Swell'],
      duration: '02:45'
    },
    {
      id: 'track-heartfelt',
      title: 'Sentuhan Kalbu (Heartfelt Resonance)',
      category: 'piano',
      genre: 'Piano Emosional & Mengharukan',
      bpm: 65,
      mood: 'Melankolis, Intim, Penuh Harapan',
      description: 'Petikan tuts piano akustik yang lembut, menyiratkan keheningan perjuangan dan kerinduan anak perantau kepada keluarga.',
      instruments: ['Grand Piano', 'Soft Reverb', 'Solo Cello', 'Ambient Air'],
      duration: '02:18'
    },
    {
      id: 'track-cyber',
      title: 'Metropolis Malam (Cyber Jakarta)',
      category: 'synth',
      genre: 'Synthwave & Bass Dinamis',
      bpm: 118,
      mood: 'Futuristik, Cepat, Berenergi',
      description: 'Arpeggiator analog retro dipadu dentuman bass modern yang mengalir cepat, menggambarkan hiruk pikuk kota metropolitan masa depan.',
      instruments: ['Analog Synth', 'Moog Bass', 'Drum Machine 808', 'Neon Pads'],
      duration: '03:10'
    },
    {
      id: 'track-suspense',
      title: 'Tensi Mencekam (Shadow of Suspense)',
      category: 'thriller',
      genre: 'Ketegangan Thriller & Disonan',
      bpm: 70,
      mood: 'Mencekam, Dingin, Berdebar',
      description: 'Dengungan drone atmosferik berfrekuensi rendah dengan kejutan nada disonan yang membangun tensi tinggi di ruang ujian hidup.',
      instruments: ['Dark Drone', 'Bowed Cymbal', 'Waterphone FX', 'Distorted Sub'],
      duration: '02:05'
    },
    {
      id: 'track-nusantara',
      title: 'Cahaya Nusantara (Heritage Pulse)',
      category: 'etnik',
      genre: 'Gamelan Fusion & Etnik Modern',
      bpm: 95,
      mood: 'Mistis, Kaya Budaya, Autentik',
      description: 'Harmonisasi tangga nada pelog gamelan Jawa & Bali berpadu aransemen string kontemporer yang elegan dan membanggakan.',
      instruments: ['Saron & Bonang Gamelan', 'Suling Bambu', 'Orchestral Strings', 'Ethnic Percussion'],
      duration: '02:50'
    },
    {
      id: 'track-anthem',
      title: 'Langkah Kemenangan (Epic Hollywood Anthem)',
      category: 'orkestra',
      genre: 'Trailer Epik Hollywood',
      bpm: 124,
      mood: 'Kemenangan, Perkasa, Pantang Mundur',
      description: 'Pukulan taiko drum raksasa dan tiupan brass Hollywood yang membakar semangat keberanian menyongsong babak ketiga.',
      instruments: ['Taiko Drums', 'Trailer Braam', 'Full Brass Section', 'Epic Choirs'],
      duration: '02:30'
    },
    {
      id: 'track-lofi',
      title: 'Sore di Sudirman (City Sunset Lo-Fi)',
      category: 'lofi',
      genre: 'Lo-Fi Santai & Nostalgia',
      bpm: 78,
      mood: 'Hangat, Rileks, Reflektif',
      description: 'Kresek piringan hitam vinyl dipadu akord jazzy Rhodes piano hangat, menemani senja di sudut kafe favorit.',
      instruments: ['Rhodes Electric Piano', 'Vinyl Crackle', 'Boom-Bap Drums', 'Upright Bass'],
      duration: '02:40'
    },
    {
      id: 'track-corporate',
      title: 'Inspirasi Tanpa Batas (Infinite Hope)',
      category: 'korporat',
      genre: 'Akustik Korporat Modern',
      bpm: 110,
      mood: 'Optimis, Menginspirasi, Cerah',
      description: 'Petikan gitar akustik cerah berpadu ketukan drum ringan yang memberikan aura positif dan kepercayaan diri tinggi.',
      instruments: ['Acoustic Guitar', 'Glockenspiel', 'Uplifting Shaker', 'Clean Bass'],
      duration: '02:15'
    },
    {
      id: 'track-rain',
      title: 'Hujan di Balik Jendela (Rainy Melancholy)',
      category: 'piano',
      genre: 'Ambien Hujan & Piano Intim',
      bpm: 60,
      mood: 'Hening, Menenangkan, Emosional',
      description: 'Gemericik hujan alami di kota Jakarta berpadu akord piano melankolis yang membawa penonton larut dalam renungan batin.',
      instruments: ['Foley Rain Sound', 'Intimate Felt Piano', 'Warm Pad', 'Distant Thunder'],
      duration: '02:22'
    },
    {
      id: 'track-chrono',
      title: 'Detak Waktu (Chrono Pulse)',
      category: 'thriller',
      genre: 'Ketukan Jam & Sub-Bass Sinematik',
      bpm: 100,
      mood: 'Urgensi, Berpacu Waktu, Tegang',
      description: 'Detak jam analog mekanik yang berpacu kencang menuju batas waktu presentasi menentukan jalan nasib sang tokoh.',
      instruments: ['Mechanical Clock Tick', 'Sub-Bass Pulse', 'String Staccato', 'Heartbeat Boom'],
      duration: '01:55'
    }
  ];

  const categories = [
    { id: 'all', label: 'Semua Soundtrack (10)' },
    { id: 'orkestra', label: 'Orkestra & Epik' },
    { id: 'piano', label: 'Piano & Emosional' },
    { id: 'synth', label: 'Synthwave & Modern' },
    { id: 'etnik', label: 'Etnik Nusantara' },
    { id: 'thriller', label: 'Tensi & Horor' },
    { id: 'lofi', label: 'Lo-Fi & Santai' },
  ];

  const filtered = tracks.filter(t => selectedCategory === 'all' || t.category === selectedCategory);

  const handleTogglePlay = (track: MusicTrack) => {
    if (activeTrackId === track.id && isPlaying) {
      audioEngine.stopAll();
      setIsPlaying(false);
      setActiveTrackId(null);
    } else {
      audioEngine.stopAll();
      setActiveTrackId(track.id);
      setIsPlaying(true);
      audioEngine.startBackgroundMusic();
      audioEngine.playSubImpact();
    }
  };

  const handlePlaySFX = (type: 'impact' | 'rain') => {
    if (type === 'impact') {
      audioEngine.playSubImpact();
    } else {
      audioEngine.startBackgroundMusic();
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-500/30 text-indigo-300 text-xs font-mono mb-2">
            <Music className="w-3.5 h-3.5" />
            <span>PUSTAKA MUSIK & SOUND DESIGN STUDIO</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
            Desain Musik Tema &amp; Audio Sinematik
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl mt-1">
            Koleksi lengkap aransemen orkestra berlisensi bioskop, instrumen autentik Indonesia, dan foley efek suara yang beradaptasi secara dinamis dengan ritme babak film.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono px-3.5 py-1.5 rounded-xl bg-studio-900 border border-white/10 text-cyan-300">
          <Disc3 className="w-4 h-4 text-cyan-400 animate-spin" />
          <span>10 Trek Audio Master Sinematik</span>
        </div>
      </div>

      {/* Foley & SFX Quick Triggers */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-studio-900 via-studio-850 to-studio-900 border border-indigo-500/30 shadow-xl">
        <span className="text-xs font-bold text-indigo-300 flex items-center gap-2 mb-3">
          <Zap className="w-4 h-4 text-amber-400" />
          <span>Pemicu Cepat Efek Suara (Foley SFX Real-Time):</span>
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: '💥 Dentuman Sub-Bass Bioskop', action: () => handlePlaySFX('impact') },
            { label: '🌧 Hujan & Petir Jakarta', action: () => handlePlaySFX('rain') },
            { label: '🏙 Gemuruh Kota Sudirman', action: () => handlePlaySFX('impact') },
            { label: '⏹ Hentikan Semua Audio', action: () => { audioEngine.stopAll(); setIsPlaying(false); setActiveTrackId(null); } },
          ].map((sfx, i) => (
            <button
              key={i}
              onClick={sfx.action}
              className="p-3 rounded-xl bg-studio-950/80 hover:bg-indigo-500/20 text-slate-200 hover:text-white border border-white/10 hover:border-indigo-400/40 text-xs font-mono font-semibold transition-all text-center"
            >
              {sfx.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium font-mono whitespace-nowrap transition-all ${
              selectedCategory === cat.id
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
                : 'bg-studio-900 text-slate-400 border border-white/5 hover:text-white'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Tracks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((trk, index) => {
          const isTrackActive = activeTrackId === trk.id && isPlaying;

          return (
            <div
              key={trk.id}
              style={{ animationDelay: `${index * 70}ms` }}
              className={`glass-card p-6 rounded-2xl border transition-all flex flex-col justify-between animate-fade-in-up ${
                isTrackActive
                  ? 'border-indigo-400 shadow-xl shadow-indigo-500/20 bg-indigo-950/30 ring-1 ring-indigo-500/30'
                  : 'border-white/10 hover:border-indigo-500/40'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950/80 border border-indigo-500/30 text-indigo-300 font-bold">
                        {trk.bpm} BPM
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {trk.duration}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white mt-1.5">
                      {trk.title}
                    </h3>
                    <p className="text-xs text-indigo-300 font-mono">
                      {trk.genre}
                    </p>
                  </div>

                  {/* Play Button */}
                  <button
                    onClick={() => handleTogglePlay(trk)}
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-all shrink-0 ${
                      isTrackActive
                        ? 'bg-indigo-500 text-white animate-pulse'
                        : 'bg-studio-900 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-white/10'
                    }`}
                  >
                    {isTrackActive ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current translate-x-0.5" />}
                  </button>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {trk.description}
                </p>

                {/* Instruments Pills */}
                <div className="pt-2 border-t border-white/5 space-y-1.5">
                  <span className="text-[10px] font-mono text-slate-400 block">Instrumen Utama:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {trk.instruments.map((ins, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-studio-900 border border-white/5 text-slate-300"
                      >
                        {ins}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Status footer */}
              <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between text-[11px] font-mono">
                <span className="text-slate-400">Suasana: <strong className="text-slate-200">{trk.mood}</strong></span>
                {isTrackActive && (
                  <span className="text-indigo-400 flex items-center gap-1 font-bold animate-pulse">
                    <Radio className="w-3.5 h-3.5" />
                    <span>Sedang Diputar</span>
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
