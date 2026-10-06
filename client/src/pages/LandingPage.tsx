import React from 'react';
import { 
  Film, 
  Sparkles, 
  ArrowRight, 
  Play, 
  Clapperboard, 
  Layers, 
  Wand2, 
  Volume2, 
  Music, 
  SlidersHorizontal,
  CheckCircle2,
  Tv,
  Smartphone,
  Video,
  MonitorPlay
} from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
  onExploreDemo: () => void;
  onLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart, onExploreDemo, onLogin }) => {
  return (
    <div className="min-h-screen bg-studio-950 text-white selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Navigation */}
      <header className="sticky top-0 z-50 glass-panel border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Film className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-display font-extrabold text-xl tracking-wider text-white">
                SCENARA <span className="text-cyan-400">AI</span>
              </span>
              <p className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">
                Dari Naskah Menjadi Layar Bioskop
              </p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-300">
            <a href="#how-it-works" className="hover:text-cyan-400 transition-colors">Cara Kerja</a>
            <a href="#features" className="hover:text-cyan-400 transition-colors">Sutradara AI</a>
            <a href="#formats" className="hover:text-cyan-400 transition-colors">Format Produksi</a>
            <a href="#showcase" className="hover:text-cyan-400 transition-colors">Film Contoh</a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={onLogin}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white transition-colors"
            >
              Masuk Akun
            </button>
            <button
              onClick={onStart}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-semibold shadow-lg shadow-cyan-500/30 transition-all hover:scale-105"
            >
              Mulai Membuat Video
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 px-6 overflow-hidden film-grain">
        {/* Cinematic glow backdrop */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-cyan-500/20 via-purple-500/20 to-transparent blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-6">
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
            <span>STUDIO PEMBUATAN FILM &amp; VIDEO BERBASIS KECERDASAN BUATAN</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 font-display leading-[1.1]">
            Ubah Cerita Anda Menjadi <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">Video Sinematik.</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            SCENARA AI mengubah ide mentah dan skenario Anda menjadi karya film utuh dengan Sutradara AI pintar yang merancang, memvisualisasikan, mengisi suara bahasa Indonesia, mengaransemen musik, dan mengedit setiap adegan.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button
              onClick={onStart}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-sm font-bold shadow-xl shadow-cyan-500/30 flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95"
            >
              <span>Buat Video Pertama Anda</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onExploreDemo}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-studio-900/80 hover:bg-studio-800 text-slate-200 text-sm font-semibold border border-white/10 flex items-center justify-center gap-2 transition-colors"
            >
              <Play className="w-4 h-4 fill-current text-cyan-400" />
              <span>Jelajahi Demo Film ("Titik Balik")</span>
            </button>
          </div>

          {/* Cinematic Hero Video Card */}
          <div className="relative max-w-4xl mx-auto rounded-2xl p-1 bg-gradient-to-b from-cyan-500/30 via-white/10 to-transparent shadow-2xl">
            <div className="relative rounded-2xl overflow-hidden aspect-video bg-black flex items-center justify-center group cursor-pointer" onClick={onExploreDemo}>
              <video
                src="/storage/videos/master_preview.mp4"
                poster="/storage/storyboards/scene_3.jpg"
                className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700"
                autoPlay
                muted
                loop
                playsInline
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-left">
                <span className="text-[11px] font-mono text-cyan-300 uppercase tracking-widest">
                  Potongan Master Unggulan • Durasi 02:00 • 8 Adegan Sinematik
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
                  TITIK BALIK (THE BREAKTHROUGH) — Film Pendek Sinematik
                </h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Production Flow: 5 Steps */}
      <section id="how-it-works" className="py-20 px-6 border-t border-white/10 bg-studio-950/60">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-4xl font-extrabold font-display text-white mb-3">
              Dari Ide Menjadi Film Final dalam 5 Langkah Mulus
            </h2>
            <p className="text-sm text-slate-400 max-w-lg mx-auto">
              Bukan sekadar generator prompt biasa. Ini adalah studio otonom dengan kontinuitas karakter dan arahan artistik profesional.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              { num: '01', title: 'Tulis & Berimajinasi', desc: 'Masukkan prompt ide, premis cerita singkat, atau naskah Anda.' },
              { num: '02', title: 'Sutradara AI Merancang', desc: 'AI menyusun struktur Babak 1-3, alokasi durasi, dan rincian adegan.' },
              { num: '03', title: 'Generasi Sinematik', desc: 'Google Veo merender visual; pengisi suara Indonesia menghidupkan dialog.' },
              { num: '04', title: 'Garis Waktu & Suara', desc: 'Padukan musik orkestra, foley efek suara lingkungan, dan ritme timeline.' },
              { num: '05', title: 'Ekspor Master Sinema', desc: 'FFmpeg mengompilasi video final Anda dengan kebebasan rasio aspek.' },
            ].map((step, idx) => (
              <div key={idx} className="glass-card p-5 rounded-2xl border border-white/5 relative flex flex-col">
                <span className="text-3xl font-extrabold font-mono text-cyan-400/40 mb-3">{step.num}</span>
                <h3 className="text-sm font-bold text-white mb-2">{step.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core AI Features */}
      <section id="features" className="py-20 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-4xl font-extrabold font-display text-white mb-3">
              Paket Lengkap Studio Kreatif AI
            </h2>
            <p className="text-sm text-slate-400 max-w-lg mx-auto">
              Setiap tahapan pembuatan film profesional diorkestrasi oleh kecerdasan buatan tingkat lanjut.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Clapperboard, title: 'Sutradara AI Pintar', desc: 'Merancang daftar shot, pergerakan kamera, tensi emosi dramatis, dan menjamin konsistensi visual tokoh.' },
              { icon: Wand2, title: 'Asisten Naskah Sinema', desc: 'Menulis format skenario standar industri perfilman lengkap dengan pembagian babak dan polesan dialog.' },
              { icon: Layers, title: 'Papan Cerita Sinematik', desc: 'Menghasilkan keyframe visual artistik untuk setiap adegan sebelum merender video final.' },
              { icon: Video, title: 'Mesin Video Google Veo', desc: 'Merender visual definisi tinggi dengan simulasi lensa anamorphic dan kontrol pergerakan kamera sinematik.' },
              { icon: Volume2, title: 'Studio Suara Bahasa Indonesia', desc: 'Dialog tokoh dan narasi puitis dengan ekspresi dan intonasi alami khas bahasa Indonesia.' },
              { icon: Music, title: 'Musik Adaptif & Tata Suara SFX', desc: 'Kurasi aransemen orkestra sinematik yang selaras dengan suasana adegan serta foley audio presisi.' },
            ].map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="glass-card p-6 rounded-2xl border border-white/5 hover:border-cyan-500/30 transition-all">
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{f.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Production Formats */}
      <section id="formats" className="py-20 px-6 border-t border-white/10 bg-studio-950/60">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-4xl font-extrabold font-display text-white mb-3">
              Produksi Segala Format yang Anda Bayangkan
            </h2>
            <p className="text-sm text-slate-400 max-w-lg mx-auto">
              Dari hook cepat 15 detik hingga film pendek berdurasi panjang, dengan adaptasi multi-rasio 1 klik.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { name: 'Film Pendek', icon: Film, duration: '2 - 10 Menit' },
              { name: 'Video YouTube', icon: MonitorPlay, duration: '90s - 5 Menit' },
              { name: 'Reels & TikTok', icon: Smartphone, duration: '15s - 60s' },
              { name: 'Iklan Komersial', icon: Tv, duration: '30s - 60s' },
              { name: 'Trailer Film', icon: Video, duration: '60s - 90s' },
              { name: 'Video Edukasi', icon: Clapperboard, duration: '2 - 5 Menit' },
            ].map((fmt, i) => {
              const Icon = fmt.icon;
              return (
                <div key={i} className="glass-card p-4 rounded-xl border border-white/5 text-center flex flex-col items-center justify-center gap-2 hover:border-cyan-500/30 transition-all">
                  <Icon className="w-6 h-6 text-cyan-400" />
                  <span className="text-xs font-bold text-white">{fmt.name}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{fmt.duration}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Showcase Demo */}
      <section id="showcase" className="py-20 px-6 border-t border-white/10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-cyan-500/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
            <h2 className="text-2xl sm:text-4xl font-extrabold font-display text-white mb-4">
              Kisah Anda Siap Diwujudkan Menjadi Film Sinematik.
            </h2>
            <p className="text-sm text-slate-300 max-w-xl mx-auto mb-8 leading-relaxed font-light">
              Rasakan kehebatan Sutradara AI otonom. Tulis naskah Anda, saksikan adegan storyboard terbentuk, dan ekspor film master berkualitas tinggi dalam hitungan menit.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={onStart}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-sm font-bold shadow-xl shadow-cyan-500/30 flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95"
              >
                <span>Mulai Menyutradarai dengan AI</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={onExploreDemo}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-studio-900 hover:bg-studio-800 text-slate-200 text-sm font-semibold border border-white/10 transition-colors"
              >
                Lihat Showcase Film "Titik Balik"
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/10 text-center text-xs text-slate-400 font-mono">
        <p>© 2026 SCENARA AI. Hak cipta dilindungi. “Dari Naskah Menjadi Layar Bioskop.”</p>
      </footer>
    </div>
  );
};
