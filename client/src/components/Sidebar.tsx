import React from 'react';
import { 
  LayoutDashboard, 
  Film, 
  PlusCircle, 
  Users, 
  FolderKanban, 
  Sparkles, 
  Mic2, 
  Music, 
  DownloadCloud, 
  Settings,
  Cpu
} from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  collapsed?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dasbor Studio', icon: LayoutDashboard },
    { id: 'projects', label: 'Proyek Film Saya', icon: Film },
    { id: 'create', label: 'Buat Video Baru', icon: PlusCircle, isHighlight: true },
    { id: 'characters', label: 'Studio Karakter', icon: Users },
    { id: 'voices', label: 'Pengisi Suara AI (12)', icon: Mic2 },
    { id: 'audio', label: 'Musik & Tata Suara', icon: Music },
    { id: 'templates', label: 'Templat Sinematik', icon: Sparkles },
    { id: 'assets', label: 'Pustaka Aset', icon: FolderKanban },
    { id: 'exports', label: 'Hasil Ekspor Master', icon: DownloadCloud },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 min-h-[calc(100vh-60px)] bg-studio-950/90 border-r border-white/10 p-4 shrink-0">
      {/* Studio Workspace Header */}
      <div className="px-3 py-2 mb-3">
        <p className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold">
          RUANG KERJA STUDIO
        </p>
      </div>

      {/* Nav List */}
      <div className="flex-1 space-y-1">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          if (item.isHighlight) {
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 my-2.5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/50 text-cyan-300 font-bold text-xs shadow-md shadow-cyan-500/10 hover:border-cyan-400 hover:text-white transition-all group"
              >
                <Icon className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                <span>{item.label}</span>
                <span className="ml-auto text-[9px] bg-cyan-500/30 text-cyan-200 px-1.5 py-0.5 rounded font-mono font-bold uppercase">
                  BARU
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive 
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Bottom Production Engine Status Card */}
      <div className="mt-auto p-3.5 rounded-xl bg-studio-900/90 border border-white/5 space-y-1.5">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] font-bold text-slate-200">Mesin Sutradara AI Aktif</span>
        </div>
        <p className="text-[10px] text-slate-400 leading-relaxed font-mono">
          Google Veo 2.0 &amp; ElevenLabs Indonesia terhubung penuh.
        </p>
      </div>
    </aside>
  );
};
