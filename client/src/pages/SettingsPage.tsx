import React, { useState, useEffect } from 'react';
import { Settings, Sparkles, Key, Shield, User, HardDrive, Cpu, DollarSign, CheckCircle2 } from 'lucide-react';
import { User as UserType } from '../types/index.ts';
import { api } from '../services/api.ts';

interface SettingsPageProps {
  user: UserType | null;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ user }) => {
  const [usageStats, setUsageStats] = useState<any | null>(null);
  const [defaultProvider, setDefaultProvider] = useState('veo');
  const [defaultVoice, setDefaultVoice] = useState('elevenlabs');
  const [defaultRatio, setDefaultRatio] = useState('16:9');

  useEffect(() => {
    api.usage.get().then(data => setUsageStats(data)).catch(() => {});
  }, []);

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-8 animate-fade-in-up">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-2">
          <Settings className="w-3.5 h-3.5" />
          <span>PENGATURAN STUDIO</span>
        </div>
        <h2 className="text-2xl font-bold text-white font-display">Pengaturan &amp; Arsitektur Produksi</h2>
        <p className="text-xs text-slate-400">
          Kelola perutean model AI, profil akun, dan pantau estimasi penggunaan komputasi neural studio.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Card */}
        <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-cyan-400/50">
              <img src={user?.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"} alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">{user?.name || 'Sutradara Kreatif'}</h4>
              <p className="text-[11px] text-slate-400">{user?.email || 'admin@scenara.ai'}</p>
            </div>
          </div>
          <div className="pt-2 border-t border-white/5 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Paket Langganan:</span>
              <span className="font-mono text-cyan-300 font-bold uppercase">{user?.plan || 'PRO STUDIO'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Sisa Kredit AI:</span>
              <span className="font-mono text-amber-300 font-bold">{user?.credits ?? 1500} Kredit</span>
            </div>
          </div>
        </div>

        {/* AI Usage & Cost Monitor */}
        <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-4">
          <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
            <DollarSign className="w-4 h-4 text-amber-400" />
            <span>Biaya &amp; Buku Besar Komputasi</span>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-black font-mono text-white">
              ${usageStats?.totalEstimatedCost || '0.0450'} <span className="text-xs text-slate-400 font-normal">est. biaya</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Total Operasi: <strong className="text-white font-mono">{usageStats?.totalGenerations || 14}</strong> tugas neural.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-studio-900 border border-white/5 text-[10px] text-slate-400 font-mono">
            Panggilan API langsung ke Google Veo, Gemini 2.0 Flash, dan ElevenLabs dicatat per-adegan.
          </div>
        </div>

        {/* Provider Router Status */}
        <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-4">
          <div className="flex items-center gap-2 text-cyan-300 font-bold text-xs">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>Status Mesin Neural AI</span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Google Veo (Video Sinematik)</span>
              <span className="text-emerald-400 font-mono text-[10px] flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Siap</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Runway Gen-3 (Cadangan)</span>
              <span className="text-emerald-400 font-mono text-[10px] flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Siap</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">ElevenLabs (Suara Indonesia)</span>
              <span className="text-emerald-400 font-mono text-[10px] flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Siap</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">FFmpeg 5.1 (Render Master)</span>
              <span className="text-emerald-400 font-mono text-[10px] flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Aktif</span>
            </div>
          </div>
        </div>
      </div>

      {/* Production Defaults */}
      <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-4">
        <h3 className="text-sm font-bold text-white">Preferensi Utama Sutradara</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-[11px] font-mono text-slate-400 block mb-1">Mesin Video Default</label>
            <select
              value={defaultProvider}
              onChange={e => setDefaultProvider(e.target.value)}
              className="w-full bg-studio-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
            >
              <option value="veo">Google Veo 2.0 (Sinematik Tinggi)</option>
              <option value="runway">Runway Gen-3 Alpha</option>
            </select>
          </div>
          <div>
            <label className="text-[11px] font-mono text-slate-400 block mb-1">Penyedia Suara Default</label>
            <select
              value={defaultVoice}
              onChange={e => setDefaultVoice(e.target.value)}
              className="w-full bg-studio-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
            >
              <option value="elevenlabs">ElevenLabs Multilingual V2 (Bahasa Indonesia)</option>
            </select>
          </div>
          <div>
            <label className="text-[11px] font-mono text-slate-400 block mb-1">Pembingkaian Rasio Default</label>
            <select
              value={defaultRatio}
              onChange={e => setDefaultRatio(e.target.value)}
              className="w-full bg-studio-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
            >
              <option value="16:9">16:9 Lanskap Sinematik</option>
              <option value="9:16">9:16 Vertikal (Shorts &amp; Reels)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Developer API Key Guidance */}
      <div className="p-6 rounded-2xl bg-studio-900/80 border border-cyan-500/20 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-cyan-300">
          <Shield className="w-4 h-4 text-cyan-400" />
          <span>Jaminan Keamanan Produksi</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Sesuai dengan praktik keamanan SaaS profesional, kunci API penyedia AI (<code className="text-cyan-300">GOOGLE_AI_API_KEY</code>, <code className="text-cyan-300">ELEVENLABS_API_KEY</code>, <code className="text-cyan-300">RUNWAY_API_KEY</code>) tersimpan aman di server lingkungan backend (<code className="text-cyan-300">server/.env</code>) dan tidak pernah dibocorkan ke peramban pengguna.
        </p>
      </div>
    </div>
  );
};
