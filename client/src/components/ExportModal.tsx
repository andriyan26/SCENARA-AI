import React, { useState } from 'react';
import { DownloadCloud, CheckCircle2, Film, Loader2, Sparkles, X, FileVideo } from 'lucide-react';
import { api } from '../services/api.ts';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  projectTitle: string;
  defaultAspectRatio?: string;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  projectId,
  projectTitle,
  defaultAspectRatio = '16:9'
}) => {
  const [resolution, setResolution] = useState<'720p' | '1080p'>('1080p');
  const [aspectRatio, setAspectRatio] = useState(defaultAspectRatio);
  const [format, setFormat] = useState<'mp4' | 'webm'>('mp4');
  const [isExporting, setIsExporting] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleStartExport = async () => {
    setIsExporting(true);
    setDownloadUrl(null);
    try {
      const res = await api.exports.render(projectId, {
        resolution,
        aspectRatio,
        format,
      });
      setDownloadUrl(res.export.file_url);
    } catch (err: any) {
      alert(err.message || 'Export error');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="w-full max-w-md glass-panel border border-cyan-500/30 rounded-2xl p-6 shadow-2xl relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
              <DownloadCloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Ekspor Video Master</h3>
              <p className="text-xs text-slate-400">Penggabungan Multi-Trek Resolusi Tinggi FFmpeg</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        {downloadUrl ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8 animate-bounce" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Render Video Master Selesai!</h4>
              <p className="text-xs text-slate-400">Berkas video master resolusi tinggi Anda telah selesai dikompilasi.</p>
            </div>
            <a
              href={downloadUrl}
              download={`${projectTitle.replace(/\s+/g, '_')}_master.mp4`}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-semibold shadow-lg shadow-emerald-500/25 transition-all"
            >
              <FileVideo className="w-4 h-4" />
              <span>Unduh Video Master MP4</span>
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Resolution Selector */}
            <div>
              <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block mb-1.5">
                Resolusi Master
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: '1080p', label: '1080p FHD (1920x1080)', badge: 'Direkomendasikan' },
                  { id: '720p', label: '720p HD (1280x720)', badge: 'Render Cepat' },
                ].map(r => (
                  <button
                    key={r.id}
                    onClick={() => setResolution(r.id as any)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      resolution === r.id
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200'
                        : 'bg-studio-900/60 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="text-xs font-bold text-white">{r.id.toUpperCase()}</div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">{r.badge}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Aspect Ratio Selector */}
            <div>
              <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block mb-1.5">
                Rasio Aspek Layar
              </label>
              <div className="grid grid-cols-4 gap-2">
                {['16:9', '9:16', '1:1', '4:5'].map(ar => (
                  <button
                    key={ar}
                    onClick={() => setAspectRatio(ar)}
                    className={`py-2 px-1 text-center rounded-xl border text-xs font-mono transition-all ${
                      aspectRatio === ar
                        ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold'
                        : 'bg-studio-900/60 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    {ar}
                  </button>
                ))}
              </div>
            </div>

            {/* Render Progress or Trigger Button */}
            <div className="pt-2">
              <button
                onClick={handleStartExport}
                disabled={isExporting}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-semibold shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {isExporting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-cyan-300" />
                    <span>Menggabungkan klip &amp; mixing audio dengan FFmpeg...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-cyan-300" />
                    <span>Mulai Render &amp; Ekspor Master</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
