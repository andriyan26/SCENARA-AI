import React, { useState } from 'react';
import { DownloadCloud, Film, Play, CheckCircle2, Share2, Eye, Calendar, Clock, MonitorPlay, ExternalLink } from 'lucide-react';
import { VideoPlayer } from '../components/VideoPlayer.tsx';

interface ExportItem {
  id: string;
  title: string;
  format: string;
  resolution: string;
  aspectRatio: '16:9' | '9:16' | '1:1' | '4:5';
  durationSeconds: number;
  fileSizeMb: number;
  date: string;
  videoUrl: string;
  thumbnailUrl: string;
}

export const ExportsPage: React.FC = () => {
  const [exportsList] = useState<ExportItem[]>([
    {
      id: 'exp-1',
      title: 'Titik Balik (The Breakthrough) — Master Bioskop',
      format: 'MP4 / H.264 High Profile',
      resolution: '1080p FHD (1920x1080)',
      aspectRatio: '16:9',
      durationSeconds: 120,
      fileSizeMb: 15.4,
      date: '06 Oktober 2026',
      videoUrl: '/storage/videos/master_preview.mp4',
      thumbnailUrl: '/storage/storyboards/scene_3.jpg'
    },
    {
      id: 'exp-2',
      title: 'Titik Balik (The Breakthrough) — Potongan Vertikal Shorts',
      format: 'MP4 / H.264 Vertical',
      resolution: '1080x1920 (9:16)',
      aspectRatio: '9:16',
      durationSeconds: 60,
      fileSizeMb: 8.2,
      date: '06 Oktober 2026',
      videoUrl: '/storage/videos/master_preview.mp4',
      thumbnailUrl: '/storage/characters/andrian_pratama.jpg'
    },
    {
      id: 'exp-3',
      title: 'Titik Balik (The Breakthrough) — Teaser Sinematik Senja',
      format: 'MP4 / ProRes 422 Cinema',
      resolution: '4K Cinema (3840x2160)',
      aspectRatio: '16:9',
      durationSeconds: 45,
      fileSizeMb: 18.0,
      date: '06 Oktober 2026',
      videoUrl: '/storage/videos/scene_8.mp4',
      thumbnailUrl: '/storage/storyboards/scene_8.jpg'
    }
  ]);

  const [activePreview, setActivePreview] = useState<ExportItem | null>(null);

  const handleDownload = (item: ExportItem) => {
    const a = document.createElement('a');
    a.href = item.videoUrl;
    a.download = `${item.title.replace(/\s+/g, '_')}.mp4`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleShare = (item: ExportItem) => {
    navigator.clipboard?.writeText(window.location.origin + item.videoUrl);
    alert(`Tautan video "${item.title}" berhasil disalin ke clipboard!`);
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-2">
            <DownloadCloud className="w-3.5 h-3.5" />
            <span>ARSIP HASIL EKSPOR MASTER</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
            Pusat Unduhan &amp; Hasil Ekspor Film
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl mt-1">
            Daftar lengkap berkas video final yang telah selesai dirender oleh FFmpeg dan mesin Google Veo. Siap ditonton langsung atau diunduh ke perangkat Anda.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono px-3.5 py-1.5 rounded-xl bg-studio-900 border border-white/10 text-emerald-400">
          <CheckCircle2 className="w-4 h-4" />
          <span>Semua Berkas Siap Diunduh</span>
        </div>
      </div>

      {/* Main Preview Player if an item is selected */}
      {activePreview && (
        <div className="glass-panel p-6 rounded-3xl border border-cyan-500/30 shadow-2xl space-y-4 animate-fade-in-up">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <MonitorPlay className="w-5 h-5 text-cyan-400" />
              <span>Pratinjau Layar Penuh: {activePreview.title}</span>
            </div>
            <button
              onClick={() => setActivePreview(null)}
              className="text-xs font-mono text-slate-400 hover:text-white px-2.5 py-1 rounded-lg bg-studio-900 border border-white/10"
            >
              Tutup Pratinjau
            </button>
          </div>

          <div className="max-w-4xl mx-auto">
            <VideoPlayer
              src={activePreview.videoUrl}
              poster={activePreview.thumbnailUrl}
              title={activePreview.title}
              aspectRatio={activePreview.aspectRatio}
            />
          </div>
        </div>
      )}

      {/* Grid of Exported Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exportsList.map((item, idx) => (
          <div
            key={item.id}
            style={{ animationDelay: `${idx * 100}ms` }}
            className="glass-card rounded-2xl border border-white/10 overflow-hidden flex flex-col justify-between hover:border-cyan-500/40 transition-all group animate-fade-in-up"
          >
            <div>
              {/* Thumbnail with quick Play overlay */}
              <div className="relative aspect-video bg-black overflow-hidden group cursor-pointer" onClick={() => setActivePreview(item)}>
                <img
                  src={item.thumbnailUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 flex items-center justify-center transition-colors">
                  <div className="w-12 h-12 rounded-full bg-cyan-500/90 text-black flex items-center justify-center shadow-xl shadow-cyan-500/40 group-hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 fill-current translate-x-0.5" />
                  </div>
                </div>
                <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-black/80 backdrop-blur border border-white/10 text-[10px] font-mono text-cyan-300">
                  {item.resolution}
                </div>
                <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono text-white">
                  {Math.floor(item.durationSeconds / 60)}m {item.durationSeconds % 60}s
                </div>
              </div>

              {/* Information */}
              <div className="p-5 space-y-3">
                <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                  {item.title}
                </h3>

                <div className="space-y-1 text-xs text-slate-400 font-mono">
                  <div className="flex justify-between">
                    <span>Format:</span>
                    <span className="text-slate-200">{item.format}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ukuran Berkas:</span>
                    <span className="text-cyan-300 font-bold">{item.fileSizeMb} MB</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tanggal Ekspor:</span>
                    <span className="text-slate-200">{item.date}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-5 pt-0 grid grid-cols-2 gap-2">
              <button
                onClick={() => handleShare(item)}
                className="py-2.5 rounded-xl bg-studio-900 hover:bg-studio-800 text-slate-300 text-xs font-semibold border border-white/10 flex items-center justify-center gap-1.5 transition-colors"
              >
                <Share2 className="w-3.5 h-3.5 text-purple-400" />
                <span>Bagikan</span>
              </button>
              <button
                onClick={() => handleDownload(item)}
                className="py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold shadow-md shadow-cyan-500/20 flex items-center justify-center gap-1.5 transition-all hover:scale-105 active:scale-95"
              >
                <DownloadCloud className="w-3.5 h-3.5" />
                <span>Unduh MP4</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
