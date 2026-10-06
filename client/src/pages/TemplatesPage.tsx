import React from 'react';
import { Sparkles, Video, Film, Tv, Megaphone, Smartphone, Clapperboard, ArrowRight } from 'lucide-react';

interface TemplatesPageProps {
  onUseTemplate: (template: { title: string; idea: string; projectType: string; duration: number; visualStyle: string }) => void;
}

export const TemplatesPage: React.FC<TemplatesPageProps> = ({ onUseTemplate }) => {
  const templates = [
    {
      id: 'movie_trailer',
      name: 'Trailer Film Blockbuster',
      type: 'cinematic',
      duration: 90,
      visualStyle: 'Sinematik',
      icon: Film,
      desc: 'Potongan adegan menegangkan berbobot tinggi dengan crescendo brass orkestra dan narasi suara dramatis.',
      prompt: 'Cuplikan mendebarkan film thriller psikologis tentang seorang peneliti laut dalam yang menemukan struktur misterius di palung samudra Indonesia.'
    },
    {
      id: 'yt_shorts',
      name: 'Konten Viral Reels & Shorts',
      type: 'social_media',
      duration: 30,
      visualStyle: 'Modern Dinamis',
      icon: Smartphone,
      desc: 'Hook visual cepat 3 detik, format vertikal 9:16, gerakan dinamis, dan narasi suara tajam memikat penonton.',
      prompt: '3 penemuan ilmiah luar biasa di alam semesta yang menentang hukum fisika modern dan mengejutkan para ilmuwan.'
    },
    {
      id: 'product_ad',
      name: 'Iklan Produk Mewah',
      type: 'advertisement',
      duration: 45,
      visualStyle: 'Komersial Modern',
      icon: Megaphone,
      desc: 'Pengambilan gambar makro ekstrem, orbit kamera 360 derajat halus, dan musik latar atmosferik elegan.',
      prompt: 'Sorotan sinematik produk jam tangan mekanik mewah berbahan titanium kelas dirgantara dengan presisi gerakan jarum yang memukau.'
    },
    {
      id: 'drama_short',
      name: 'Film Pendek Drama Sinematik',
      type: 'short_film',
      duration: 120,
      visualStyle: 'Sinematik Anamorphic',
      icon: Clapperboard,
      desc: 'Struktur emosional 3 babak, perkembangan karakter mendalam, dialog menyentuh hati, dan penyelesaian katarsis.',
      prompt: 'Kisah drama mengharukan tentang perjuangan dua saudara yang merajut kembali impian masa kecil mereka di tengah hiruk pikuk kota metropolitan.'
    },
    {
      id: 'tech_explainer',
      name: 'Video Penjelasan Visi Teknologi',
      type: 'educational',
      duration: 60,
      visualStyle: '3D Hiperrealistis',
      icon: Tv,
      desc: 'Penjabaran narasi yang lugas dan terstruktur, visual futuristik berkelas, dan suara narator berwibawa.',
      prompt: 'Bagaimana kecerdasan buatan generatif merevolusi cara manusia menciptakan karya sinema dan seni kreatif masa depan.'
    },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in-up">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>TEMPLAT PRODUKSI</span>
        </div>
        <h2 className="text-2xl font-bold text-white font-display">Templat Proyek Sinematik</h2>
        <p className="text-xs text-slate-400">
          Mulai produksi film Anda dengan cepat menggunakan tempo, rasio aspek, tata suara, dan struktur adegan yang siap pakai.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map(tpl => {
          const Icon = tpl.icon;
          return (
            <div
              key={tpl.id}
              className="glass-card p-6 rounded-2xl border border-white/10 flex flex-col justify-between hover:border-cyan-500/30 transition-all group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-mono text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
                    Durasi {tpl.duration} dtk
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white mb-1.5">{tpl.name}</h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">{tpl.desc}</p>
                <div className="p-3 rounded-xl bg-studio-900 border border-white/5 text-[11px] text-slate-400 italic">
                  “{tpl.prompt}”
                </div>
              </div>

              <button
                onClick={() => onUseTemplate({
                  title: tpl.name,
                  idea: tpl.prompt,
                  projectType: tpl.type,
                  duration: tpl.duration,
                  visualStyle: tpl.visualStyle
                })}
                className="mt-6 w-full py-2.5 rounded-xl bg-studio-900 hover:bg-cyan-500 hover:text-black text-white text-xs font-bold border border-white/10 hover:border-cyan-400 flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <span>Gunakan Templat Ini</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
