import React, { useState } from 'react';
import { Share2, Smartphone, Youtube, Instagram, Film, Sparkles, X, Check } from 'lucide-react';

interface RepurposeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (options: { targetFormat: string; targetDuration: number; repurposeType: string }) => void;
  currentDuration?: number;
}

export const RepurposeModal: React.FC<RepurposeModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  currentDuration = 120
}) => {
  const [selectedFormat, setSelectedFormat] = useState('9:16');
  const [selectedDuration, setSelectedDuration] = useState(30);
  const [repurposeType, setRepurposeType] = useState('shorts');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleApply = async () => {
    setIsSubmitting(true);
    await onConfirm({
      targetFormat: selectedFormat,
      targetDuration: selectedDuration,
      repurposeType,
    });
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="w-full max-w-md glass-panel border border-cyan-500/30 rounded-2xl p-6 shadow-2xl relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Ubah Format Video (Repurpose)</h3>
              <p className="text-xs text-slate-400">Adaptasi Cerdas Lintas Platform Medsos</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-300 mb-4 leading-relaxed">
          Sutradara AI akan menganalisis proyek {currentDuration} detik Anda, mengekstrak momen klimaks berbobot emosional tinggi, mengubah komposisi ke format vertikal 9:16, dan menyesuaikan tempo untuk platform media sosial.
        </p>

        {/* Target Platforms */}
        <div className="space-y-3 mb-5">
          <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
            Format &amp; Platform Sasaran
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'shorts', name: 'YT Shorts', ratio: '9:16', icon: Youtube },
              { id: 'reels', name: 'Instagram', ratio: '9:16', icon: Instagram },
              { id: 'tiktok', name: 'TikTok', ratio: '9:16', icon: Smartphone },
            ].map(p => {
              const Icon = p.icon;
              const isSel = repurposeType === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => { setRepurposeType(p.id); setSelectedFormat(p.ratio); }}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-xs font-medium transition-all ${
                    isSel 
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300' 
                      : 'bg-studio-900/60 border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{p.name}</span>
                  <span className="text-[9px] font-mono text-slate-400">{p.ratio}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Target Duration */}
        <div className="space-y-2 mb-6">
          <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
            Durasi Adaptasi
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { sec: 15, label: '15d Teaser' },
              { sec: 30, label: '30d Promo' },
              { sec: 60, label: '60d Video Pendek' },
            ].map(d => (
              <button
                key={d.sec}
                onClick={() => setSelectedDuration(d.sec)}
                className={`py-2 px-3 rounded-xl border text-xs font-mono transition-all ${
                  selectedDuration === d.sec
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold'
                    : 'bg-studio-900/60 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-xl bg-studio-900 hover:bg-studio-800 text-slate-300 text-xs font-medium border border-white/10 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleApply}
            disabled={isSubmitting}
            className="flex-1 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-semibold shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-1.5 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isSubmitting ? 'Memproses...' : 'Buat Video Adaptasi'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
