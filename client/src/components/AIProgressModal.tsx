import React from 'react';
import { Sparkles, CheckCircle2, Loader2, Film, Clapperboard } from 'lucide-react';

interface AIProgressModalProps {
  isOpen: boolean;
  progressPercent: number;
  currentStepMessage: string;
}

export const AIProgressModal: React.FC<AIProgressModalProps> = ({
  isOpen,
  progressPercent,
  currentStepMessage
}) => {
  if (!isOpen) return null;

  const steps = [
    { label: 'Memahami ide & premis narasi Anda', threshold: 10 },
    { label: 'Menyusun struktur narasi (Babak 1, 2, 3)', threshold: 25 },
    { label: 'Membangun profil konsistensi karakter visual', threshold: 40 },
    { label: 'Menghitung distribusi durasi & alokasi adegan', threshold: 55 },
    { label: 'Menghasilkan keyframe papan cerita sinematik', threshold: 70 },
    { label: 'Menyusun prompt visual & arahan audio', threshold: 85 },
    { label: 'Menggabungkan garis waktu & menyelesaikan proyek studio', threshold: 98 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="w-full max-w-lg glass-panel border border-cyan-500/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        {/* Glow Top Highlight */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-indigo-500 to-amber-500 animate-pulse" />

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center">
            <Clapperboard className="w-5 h-5 text-cyan-400 animate-bounce" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              Sutradara AI sedang memproduksi film Anda...
            </h3>
            <p className="text-xs text-slate-400 font-mono">Pipa Produksi Studio Sinematik</p>
          </div>
        </div>

        {/* Big Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs font-mono mb-1.5">
            <span className="text-cyan-300">{currentStepMessage}</span>
            <span className="text-white font-bold">{progressPercent}%</span>
          </div>
          <div className="w-full h-2.5 bg-studio-900 rounded-full overflow-hidden border border-white/10 p-0.5">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-full transition-all duration-300 shadow-lg shadow-cyan-500/50"
              style={{ width: `${Math.min(100, Math.max(5, progressPercent))}%` }}
            />
          </div>
        </div>

        {/* Step Checklist */}
        <div className="space-y-2.5 bg-studio-900/60 p-4 rounded-xl border border-white/5">
          {steps.map((st, i) => {
            const isCompleted = progressPercent >= st.threshold;
            const isCurrent = progressPercent < st.threshold && (i === 0 || progressPercent >= steps[i - 1].threshold);

            return (
              <div key={i} className="flex items-center gap-2.5 text-xs transition-colors">
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 text-cyan-400 animate-spin shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-white/20 shrink-0 flex items-center justify-center text-[9px] text-slate-500 font-mono">
                    {i + 1}
                  </div>
                )}
                <span className={isCompleted ? 'text-slate-300 line-through' : isCurrent ? 'text-white font-medium' : 'text-slate-500'}>
                  {st.label}
                </span>
              </div>
            );
          })}
        </div>

        <p className="mt-4 text-center text-[11px] text-slate-400 font-mono">
          ⚡ Mensintesis parameter sinematik, sudut kamera, dan pengisi suara bahasa Indonesia...
        </p>
      </div>
    </div>
  );
};
