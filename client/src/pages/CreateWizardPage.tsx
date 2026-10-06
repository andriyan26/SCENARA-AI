import React, { useState } from 'react';
import { 
  Clapperboard, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Tv, 
  Smartphone, 
  Film, 
  MonitorPlay, 
  Megaphone, 
  GraduationCap, 
  Package, 
  Sliders, 
  Clock, 
  Palette, 
  Mic2, 
  Music, 
  Check, 
  Layers
} from 'lucide-react';
import { api } from '../services/api.ts';
import { AIProgressModal } from '../components/AIProgressModal.tsx';

interface CreateWizardPageProps {
  onProjectCreated: (projectId: string) => void;
  onCancel: () => void;
}

export const CreateWizardPage: React.FC<CreateWizardPageProps> = ({ onProjectCreated, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isPlanning, setIsPlanning] = useState(false);
  const [planningProgress, setPlanningProgress] = useState(10);
  const [planningMessage, setPlanningMessage] = useState('Menganalisis visi kreatif & tema cerita...');

  // Form State
  const [projectType, setProjectType] = useState('short_film');
  const [title, setTitle] = useState('');
  const [idea, setIdea] = useState('');
  const [durationSec, setDurationSec] = useState(120); // 2 minutes default
  const [customDurationInput, setCustomDurationInput] = useState('02:00');
  const [visualStyle, setVisualStyle] = useState('Sinematik');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16' | '1:1' | '4:5'>('16:9');
  const [voiceOption, setVoiceOption] = useState('Both');
  const [musicOption, setMusicOption] = useState('Orkestra Sinematik');
  const [genre, setGenre] = useState('drama');
  const [language, setLanguage] = useState('Indonesian');

  // Calculate live dynamic scene breakdown based on durationSec (Section 11 & 69)
  const calculateSceneBreakdown = (totalSec: number) => {
    let count = 4;
    if (totalSec <= 15) count = 2;
    else if (totalSec <= 30) count = 3;
    else if (totalSec <= 60) count = 5;
    else if (totalSec <= 90) count = 6;
    else if (totalSec <= 120) count = 8;
    else if (totalSec <= 180) count = 10;
    else if (totalSec <= 300) count = 12;
    else count = Math.min(18, Math.max(12, Math.round(totalSec / 20)));

    const base = Math.floor(totalSec / count);
    let rem = totalSec - (base * count);
    const scenes: number[] = [];
    for (let i = 0; i < count; i++) {
      let d = base;
      if (rem > 0) { d += 1; rem--; }
      scenes.push(d);
    }
    return { count, scenes };
  };

  const sceneBreakdown = calculateSceneBreakdown(durationSec);

  const sampleIdeas = [
    'Film pendek 2 menit tentang perjuangan seorang anak muda di Jakarta yang berkali-kali gagal wawancara kerja, hingga akhirnya menciptakan prototipe aplikasi revolusioner dan meraih masa depannya.',
    'Iklan komersial 30 detik berenergi tinggi untuk jam tangan titanium minimalis dengan pantulan neon kota metropolitan dan tata suara detik jam yang memukau.',
    'Trailer dokumenter fiksi ilmiah 60 detik tentang stasiun penelitian dasar laut terdalam di Indonesia yang menangkap gelombang sinyal misterius.',
  ];

  const handleCustomDurationChange = (val: string) => {
    setCustomDurationInput(val);
    const parts = val.split(':').map(p => parseInt(p, 10));
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      setDurationSec(parts[0] * 60 + parts[1]);
    } else if (parts.length === 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
      setDurationSec(parts[0] * 3600 + parts[1] * 60 + parts[2]);
    }
  };

  const handleLaunchDirector = async () => {
    if (!idea.trim()) {
      alert('Silakan tuliskan deskripsi ide atau cerita film Anda terlebih dahulu.');
      return;
    }

    setIsPlanning(true);
    setPlanningProgress(15);
    setPlanningMessage('Sutradara AI sedang menganalisis struktur babak & alur narasi...');

    // Simulate real-time progress steps while request is in flight
    const timer1 = setTimeout(() => {
      setPlanningProgress(35);
      setPlanningMessage('Menyusun memori tokoh & token konsistensi visual karakter...');
    }, 1200);

    const timer2 = setTimeout(() => {
      setPlanningProgress(60);
      setPlanningMessage('Menghitung pembagian durasi per adegan & menyusun papan cerita...');
    }, 2800);

    const timer3 = setTimeout(() => {
      setPlanningProgress(85);
      setPlanningMessage('Mengorkestrasi suara narasi bahasa Indonesia & tata suara sinematik...');
    }, 4500);

    try {
      const res = await api.projects.createWizard({
        title: title.trim() || undefined,
        idea,
        projectType,
        genre,
        targetDurationSeconds: durationSec,
        aspectRatio,
        visualStyle,
        voiceStyle: voiceOption,
        musicStyle: musicOption,
        language,
      });

      setPlanningProgress(100);
      setPlanningMessage('Paket produksi selesai! Memasuki ruang kerja studio...');
      setTimeout(() => {
        onProjectCreated(res.projectId);
      }, 700);
    } catch (err: any) {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      setIsPlanning(false);
      alert(err.message || 'Pembuatan proyek gagal. Silakan coba lagi.');
    }
  };

  return (
    <div className="min-h-screen bg-studio-950 p-6 lg:p-10 max-w-5xl mx-auto flex flex-col justify-between">
      {/* Real-time Agentic Progress Modal */}
      <AIProgressModal
        isOpen={isPlanning}
        progressPercent={planningProgress}
        currentStepMessage={planningMessage}
      />

      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between pb-6 mb-8 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400">
              <Clapperboard className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-white font-display">
                Buat Video Bersama Sutradara AI
              </h1>
              <p className="text-xs text-slate-400 font-mono">
                Langkah {currentStep} dari 7 • Panduan Produksi Film Sinematik
              </p>
            </div>
          </div>

          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-xl bg-studio-900 hover:bg-studio-800 text-slate-400 hover:text-white text-xs font-semibold border border-white/10 transition-colors"
          >
            Batal
          </button>
        </div>

        {/* Wizard Step Progress Tracker */}
        <div className="grid grid-cols-7 gap-2 mb-10">
          {[
            'Format', 'Ide Cerita', 'Durasi', 'Visual', 'Rasio', 'Suara', 'Musik'
          ].map((st, i) => {
            const stepNum = i + 1;
            const isDone = currentStep > stepNum;
            const isCurr = currentStep === stepNum;

            return (
              <div 
                key={i} 
                onClick={() => { if (stepNum < currentStep) setCurrentStep(stepNum); }}
                className={`cursor-pointer text-center group`}
              >
                <div className={`h-1.5 rounded-full mb-2 transition-all ${
                  isDone ? 'bg-cyan-500' : isCurr ? 'bg-gradient-to-r from-cyan-400 to-blue-500 shadow-md shadow-cyan-500/50' : 'bg-studio-800'
                }`} />
                <span className={`text-[10px] font-mono block truncate ${
                  isCurr ? 'text-cyan-300 font-bold' : isDone ? 'text-slate-300' : 'text-slate-400'
                }`}>
                  {st}
                </span>
              </div>
            );
          })}
        </div>

        {/* ================= STEP 1: FORMAT ================= */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-2xl font-bold text-white font-display mb-1">
                Format video apa yang ingin Anda buat?
              </h2>
              <p className="text-xs text-slate-400">
                Pilih format produksi naratif. Sutradara AI akan menyesuaikan struktur babak dan tempo adegan.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { id: 'short_film', label: 'Film Pendek', icon: Film, desc: 'Penceritaan sinematik dengan babak & perkembangan karakter' },
                { id: 'social_media', label: 'Konten Sosial & Reels', icon: Smartphone, desc: 'Hook cepat 3 detik dengan retensi vertikal tinggi' },
                { id: 'cinematic', label: 'Video Sinematik', icon: Tv, desc: 'Fidelitas visual tinggi dengan komposisi dramatis' },
                { id: 'advertisement', label: 'Iklan Komersial', icon: Megaphone, desc: 'Pemaparan masalah, solusi, dan ajakan bertindak (CTA)' },
                { id: 'educational', label: 'Video Edukasi', icon: GraduationCap, desc: 'Penjelasan konsep informatif dan mudah dipahami' },
                { id: 'product_video', label: 'Video Produk', icon: Package, desc: 'Sorotan keunggulan produk dan estetika premium' },
                { id: 'presentation', label: 'Video YouTube', icon: MonitorPlay, desc: 'Penceritaan naratif panjang dengan visual b-roll memikat' },
                { id: 'custom', label: 'Proyek Kustom', icon: Sliders, desc: 'Parameter penyutradaraan bebas sesuai imajinasi Anda' },
              ].map(item => {
                const Icon = item.icon;
                const isSel = projectType === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setProjectType(item.id)}
                    className={`p-4 rounded-2xl border cursor-pointer flex flex-col justify-between transition-all ${
                      isSel 
                        ? 'bg-cyan-500/15 border-cyan-400 shadow-lg shadow-cyan-500/10 scale-[1.02]' 
                        : 'bg-studio-900/60 border-white/5 hover:border-white/20 hover:bg-studio-850'
                    }`}
                  >
                    <Icon className={`w-6 h-6 mb-3 ${isSel ? 'text-cyan-400' : 'text-slate-400'}`} />
                    <div>
                      <h4 className="text-xs font-bold text-white mb-1">{item.label}</h4>
                      <p className="text-[10px] text-slate-400 leading-snug">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= STEP 2: CERITAKAN IDE ANDA ================= */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-2xl font-bold text-white font-display mb-1">
                Ceritakan ide atau konsep skenario Anda
              </h2>
              <p className="text-xs text-slate-400">
                Anda dapat menulis ide sederhana 2 kalimat, sinopsis lengkap, atau menempelkan skrip yang sudah ada.
              </p>
            </div>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Judul Proyek (Opsional, Sutradara AI akan memberi judul otomatis jika kosong)"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 bg-studio-900 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />

              <textarea
                rows={6}
                required
                placeholder="Jelaskan ide film Anda secara rinci... (contoh: 'Film pendek 2 menit tentang seorang pemuda di Jakarta yang berjuang menghadapi ujian kehidupan, pantang menyerah, hingga menemukan titik baliknya...')"
                value={idea}
                onChange={e => setIdea(e.target.value)}
                className="w-full p-4 bg-studio-900 border border-white/10 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 leading-relaxed"
              />
            </div>

            {/* Quick Inspirations */}
            <div>
              <span className="text-[11px] font-mono text-slate-400 block mb-2">
                Butuh inspirasi ide? Klik salah satu konsep sinematik di bawah:
              </span>
              <div className="space-y-2">
                {sampleIdeas.map((sm, i) => (
                  <div
                    key={i}
                    onClick={() => setIdea(sm)}
                    className="p-3 rounded-xl bg-studio-900/60 hover:bg-studio-850 border border-white/5 hover:border-cyan-500/30 text-[11px] text-slate-300 cursor-pointer transition-colors"
                  >
                    “{sm}”
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= STEP 3: PILIH TARGET DURASI ================= */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-2xl font-bold text-white font-display mb-1">
                Pilih Target Durasi Film
              </h2>
              <p className="text-xs text-slate-400">
                Durasi menentukan jumlah pembagian adegan, alokasi detik, kepadatan narasi suara, dan penyusunan akhir.
              </p>
            </div>

            {/* Duration Pills */}
            <div className="space-y-4">
              <div>
                <span className="text-[11px] font-mono text-cyan-400 block mb-2">VIDEO SINGKAT</span>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { sec: 10, label: '10 dtk' },
                    { sec: 15, label: '15 dtk' },
                    { sec: 30, label: '30 dtk' },
                    { sec: 60, label: '60 dtk' },
                  ].map(d => (
                    <button
                      key={d.sec}
                      onClick={() => setDurationSec(d.sec)}
                      className={`py-3 rounded-xl border text-xs font-mono font-bold transition-all ${
                        durationSec === d.sec
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-md shadow-cyan-500/10'
                          : 'bg-studio-900/60 border-white/10 text-slate-400 hover:text-white'
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[11px] font-mono text-purple-400 block mb-2">KONTEN &amp; FILM PENDEK</span>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { sec: 90, label: '90 dtk' },
                    { sec: 120, label: '2 mnt (120 dtk)' },
                    { sec: 180, label: '3 mnt' },
                    { sec: 300, label: '5 mnt' },
                  ].map(d => (
                    <button
                      key={d.sec}
                      onClick={() => setDurationSec(d.sec)}
                      className={`py-3 rounded-xl border text-xs font-mono font-bold transition-all ${
                        durationSec === d.sec
                          ? 'bg-purple-500/20 border-purple-400 text-purple-300 shadow-md shadow-purple-500/10'
                          : 'bg-studio-900/60 border-white/10 text-slate-400 hover:text-white'
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Duration Input */}
              <div className="p-4 rounded-xl bg-studio-900/80 border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">Durasi Kustom</span>
                  <p className="text-[10px] text-slate-400 font-mono">Format waktu: MM:SS atau HH:MM:SS</p>
                </div>
                <input
                  type="text"
                  placeholder="02:00"
                  value={customDurationInput}
                  onChange={e => handleCustomDurationChange(e.target.value)}
                  className="w-28 px-3 py-1.5 bg-studio-950 border border-white/20 rounded-lg text-xs font-mono text-center text-cyan-300 focus:outline-none focus:border-cyan-400 font-bold"
                />
              </div>
            </div>

            {/* LIVE DURATION BREAKDOWN CALCULATOR */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-studio-900 via-studio-850 to-studio-900 border border-cyan-500/30">
              <div className="flex items-center gap-2 mb-2 text-xs font-bold text-cyan-300">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span>Alokasi Distribusi Adegan oleh Sutradara AI:</span>
              </div>
              <p className="text-xs text-slate-300 mb-3">
                Target Durasi Akhir: <strong className="text-white font-mono">{durationSec} Detik</strong> ({Math.floor(durationSec / 60)}m {durationSec % 60}s). Sutradara AI akan menyusun <strong className="text-cyan-300 font-mono">{sceneBreakdown.count} adegan sinematik</strong> dan menjahitnya menjadi satu film utuh yang selaras.
              </p>

              {/* Scene duration bars visualization */}
              <div className="flex gap-1.5 overflow-x-auto pb-1">
                {sceneBreakdown.scenes.map((dur, idx) => (
                  <div
                    key={idx}
                    className="flex-1 min-w-[50px] p-2 rounded-lg bg-cyan-950/60 border border-cyan-500/20 text-center"
                  >
                    <span className="text-[9px] text-slate-400 block font-mono">SC {String(idx + 1).padStart(2, '0')}</span>
                    <span className="text-[11px] font-bold text-cyan-300 font-mono">{dur}s</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= STEP 4: GAYA VISUAL ================= */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-2xl font-bold text-white font-display mb-1">
                Gaya Visual &amp; Atmosfer Film
              </h2>
              <p className="text-xs text-slate-400">
                Menentukan gradasi warna (color grading), pencahayaan sinematik, dan parameter visual Google Veo.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { name: 'Sinematik', desc: 'Lensa anamorphic, kontras dramatis berbobot, butiran film 35mm yang kaya' },
                { name: 'Realistis', desc: 'Pencahayaan alami harian, foley otentik, tekstur visual seperti nyata' },
                { name: 'Dokumenter', desc: 'Kamera genggam observasional yang intim, pencahayaan natural apa adanya' },
                { name: 'Anime Sinematik', desc: 'Gaya animasi Makoto Shinkai, gradasi langit kaya, pencahayaan emosional' },
                { name: '3D Hiperrealistis', desc: 'Estetika Unreal Engine 5, bayangan volumetrik dan refleksi fotorealistis' },
                { name: 'Fantasi Magis', desc: 'Kabut lembut bernuansa dongeng, golden hour magis, pendar cahaya lembut' },
                { name: 'Sci-Fi Cyberpunk', desc: 'Pantulan lampu neon, aspal basah malam hari, sentuhan teknologi industrial' },
                { name: 'Horor & Thriller', desc: 'Pencahayaan rendah (low-key), nuansa kehijauan-biru dingin, tensi mencekam' },
                { name: 'Komersial Modern', desc: 'Pencahayaan studio bersih berenergi tinggi, estetika produk mewah dan tajam' },
              ].map(st => (
                <div
                  key={st.name}
                  onClick={() => setVisualStyle(st.name)}
                  className={`p-4 rounded-2xl border cursor-pointer flex flex-col justify-between transition-all ${
                    visualStyle === st.name
                      ? 'bg-cyan-500/15 border-cyan-400 shadow-md shadow-cyan-500/10'
                      : 'bg-studio-900/60 border-white/5 hover:border-white/20'
                  }`}
                >
                  <span className="text-xs font-bold text-white mb-1">{st.name}</span>
                  <p className="text-[10px] text-slate-400 leading-snug">{st.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= STEP 5: ASPEK RASIO ================= */}
        {currentStep === 5 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-2xl font-bold text-white font-display mb-1">
                Rasio Aspek &amp; Pembingkaian Kamera
              </h2>
              <p className="text-xs text-slate-400">
                Pilih format rasio utama film. Anda dapat mengadaptasikannya ke rasio platform lain dengan 1 klik nanti.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { id: '16:9', label: '16:9 Sinematik Horizontal', desc: 'Standar Bioskop, YouTube Layar Lebar, TV' },
                { id: '9:16', label: '9:16 Vertikal Penuh', desc: 'TikTok, Instagram Reels, YouTube Shorts' },
                { id: '1:1', label: '1:1 Kotak Persegi', desc: 'Feed Instagram & Iklan Multiplatform' },
                { id: '4:5', label: '4:5 Potret Sosial', desc: 'Format Optimal Feed Portret Instagram' },
              ].map(ar => (
                <div
                  key={ar.id}
                  onClick={() => setAspectRatio(ar.id as any)}
                  className={`p-5 rounded-2xl border cursor-pointer text-center flex flex-col items-center justify-center gap-3 transition-all ${
                    aspectRatio === ar.id
                      ? 'bg-cyan-500/15 border-cyan-400 shadow-lg shadow-cyan-500/10 scale-105'
                      : 'bg-studio-900/60 border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className={`border-2 border-dashed rounded flex items-center justify-center font-mono text-[10px] text-slate-400 ${
                    ar.id === '16:9' ? 'w-16 h-9' :
                    ar.id === '9:16' ? 'w-9 h-16' :
                    ar.id === '1:1' ? 'w-12 h-12' : 'w-10 h-14'
                  }`}>
                    {ar.id}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white mb-0.5">{ar.label}</h4>
                    <p className="text-[10px] text-slate-400">{ar.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= STEP 6: SUARA & NARASI ================= */}
        {currentStep === 6 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-2xl font-bold text-white font-display mb-1">
                Mesin Suara &amp; Pengisi Suara (Voice-Over)
              </h2>
              <p className="text-xs text-slate-400">
                Didukung suara bahasa Indonesia ElevenLabs &amp; Web Speech. Tentukan bagaimana suara dihadirkan di setiap adegan.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { id: 'Both', label: 'Narator + Dialog Karakter', desc: 'Narasi puitis sinematik dipadu dialog langsung antar tokoh' },
                { id: 'Narrator', label: 'Hanya Suara Narator', desc: 'Penuturan cerita mendalam dari suara latar di sepanjang film' },
                { id: 'Character Dialogue', label: 'Hanya Dialog Karakter', desc: 'Fokus penuh pada percakapan otentik antar karakter cerita' },
                { id: 'No Voice', label: 'Tanpa Suara (Hanya Musik)', desc: 'Penceritaan murni visual tanpa ucapan suara' },
              ].map(v => (
                <div
                  key={v.id}
                  onClick={() => setVoiceOption(v.id)}
                  className={`p-4 rounded-2xl border cursor-pointer flex flex-col justify-between transition-all ${
                    voiceOption === v.id
                      ? 'bg-cyan-500/15 border-cyan-400 shadow-md shadow-cyan-500/10'
                      : 'bg-studio-900/60 border-white/5 hover:border-white/20'
                  }`}
                >
                  <Mic2 className={`w-5 h-5 mb-3 ${voiceOption === v.id ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <div>
                    <h4 className="text-xs font-bold text-white mb-1">{v.label}</h4>
                    <p className="text-[10px] text-slate-400 leading-snug">{v.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Language Selection */}
            <div className="p-4 rounded-xl bg-studio-900/80 border border-white/10 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white block">Bahasa Dialog &amp; Subtitle</span>
                <p className="text-[10px] text-slate-400">Pengisi suara dan teks layar akan diproduksi dalam bahasa ini</p>
              </div>
              <select
                value={language}
                onChange={e => setLanguage(e.target.value)}
                className="bg-studio-950 border border-white/20 rounded-lg px-3 py-1.5 text-xs text-cyan-300 font-bold focus:outline-none focus:border-cyan-400"
              >
                <option value="Indonesian">🇮🇩 Bahasa Indonesia (Utama)</option>
                <option value="English">English (US)</option>
              </select>
            </div>
          </div>
        )}

        {/* ================= STEP 7: MUSIK & TATA SUARA ================= */}
        {currentStep === 7 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-2xl font-bold text-white font-display mb-1">
                Lagu Tema &amp; Aransemen Musik Sinematik
              </h2>
              <p className="text-xs text-slate-400">
                Pilih identitas bunyi film Anda. Mesin audio akan menggabungkan musik tema dan efek suara SFX ke garis waktu.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { id: 'Orkestra Sinematik', label: 'Orkestra Sinematik', mood: 'Gesekan string, brass megah, crescendo dramatis berbobot' },
                { id: 'Piano Emosional', label: 'Piano Emosional', mood: 'Melodi lembut melankolis menyentuh sanubari' },
                { id: 'Trailer Epik', label: 'Trailer Epik Berenergi', mood: 'Dentuman drum raksasa, tensi memuncak yang membakar semangat' },
                { id: 'Synthwave Cyberpunk', label: 'Synthwave Futuristik', mood: 'Synthesizer analog retro, ketukan bass ritmis modern' },
                { id: 'Ketegangan & Horor', label: 'Ketegangan & Horor', mood: 'Dengungan drone atmosferik dan kejutan bunyi mencekam' },
                { id: 'Inspiratif Korporat', label: 'Inspiratif Modern', mood: 'Petikan akustik cerah dan nada optimis penuh harapan' },
                { id: 'Lo-Fi Santai', label: 'Lo-Fi Santai', mood: 'Bunyi piringan hitam hangat dan nada melow menenangkan' },
                { id: 'None', label: 'Tanpa Musik (Alami)', mood: 'Hanya foley suasana lingkungan natural di setiap adegan' },
              ].map(m => (
                <div
                  key={m.id}
                  onClick={() => setMusicOption(m.id)}
                  className={`p-4 rounded-2xl border cursor-pointer flex flex-col justify-between transition-all ${
                    musicOption === m.id
                      ? 'bg-cyan-500/15 border-cyan-400 shadow-md shadow-cyan-500/10'
                      : 'bg-studio-900/60 border-white/5 hover:border-white/20'
                  }`}
                >
                  <Music className={`w-5 h-5 mb-3 ${musicOption === m.id ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <div>
                    <h4 className="text-xs font-bold text-white mb-1">{m.label}</h4>
                    <p className="text-[10px] text-slate-400 leading-snug">{m.mood}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation Buttons */}
      <div className="pt-8 border-t border-white/10 flex items-center justify-between mt-8">
        {currentStep > 1 ? (
          <button
            onClick={() => setCurrentStep(prev => prev - 1)}
            className="px-5 py-2.5 rounded-xl bg-studio-900 hover:bg-studio-800 text-slate-300 text-xs font-semibold border border-white/10 flex items-center gap-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Sebelumnya</span>
          </button>
        ) : <div />}

        {currentStep < 7 ? (
          <button
            onClick={() => {
              if (currentStep === 2 && !idea.trim()) {
                alert('Silakan tuliskan deskripsi ide cerita Anda sebelum lanjut ke langkah berikutnya.');
                return;
              }
              setCurrentStep(prev => prev + 1);
            }}
            className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-all"
          >
            <span>Langkah Berikutnya</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleLaunchDirector}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white text-xs font-bold shadow-xl shadow-cyan-500/30 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            <span>Mulai Produksi Sutradara AI (Buat Proyek)</span>
          </button>
        )}
      </div>
    </div>
  );
};
