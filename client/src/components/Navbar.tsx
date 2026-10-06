import React from 'react';
import { Film, Sparkles, Plus, Settings, User as UserIcon, LogOut, Clapperboard } from 'lucide-react';
import { User } from '../types/index.ts';

interface NavbarProps {
  user: User | null;
  onNavigate: (page: string) => void;
  currentPage: string;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ user, onNavigate, currentPage, onLogout }) => {
  const navShortcuts = [
    { id: 'dashboard', label: 'Dasbor' },
    { id: 'projects', label: 'Proyek' },
    { id: 'characters', label: 'Karakter' },
    { id: 'voices', label: 'Suara AI' },
    { id: 'audio', label: 'Musik & SFX' },
    { id: 'templates', label: 'Templat' },
    { id: 'assets', label: 'Aset' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/10 px-4 lg:px-8 py-2.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo & Tagline */}
        <div 
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-3 cursor-pointer group shrink-0"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/25 group-hover:scale-105 transition-transform">
            <Film className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-extrabold text-lg sm:text-xl tracking-wider text-white">
                SCENARA <span className="text-cyan-400">AI</span>
              </span>
              <span className="text-[9px] tracking-widest uppercase px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-mono font-bold">
                STUDIO PRO
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium hidden md:block">
              Dari Naskah Menjadi Layar Bioskop.
            </p>
          </div>
        </div>

        {/* Center Navigation Shortcuts */}
        <nav className="hidden xl:flex items-center gap-1 bg-studio-900/80 p-1 rounded-xl border border-white/5">
          {navShortcuts.map(nav => (
            <button
              key={nav.id}
              onClick={() => onNavigate(nav.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                currentPage === nav.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              {nav.label}
            </button>
          ))}
        </nav>

        {/* Right Action Bar */}
        <div className="flex items-center gap-2.5">
          {/* AI Credits Pill */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-studio-900/90 border border-amber-500/30 text-amber-300 text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>{user?.credits ?? 1500} Kredit</span>
          </div>

          {/* Create Video Primary CTA */}
          <button
            onClick={() => onNavigate('create')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold shadow-lg shadow-cyan-500/25 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden sm:inline">Buat Video Baru</span>
            <span className="sm:hidden">Buat</span>
          </button>

          {/* FITUR PENGATURAN DI ATAS (Prominent Top Settings Button) */}
          <button
            onClick={() => onNavigate('settings')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
              currentPage === 'settings'
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-md shadow-cyan-500/20 font-bold'
                : 'bg-studio-900 hover:bg-studio-800 text-slate-300 border-white/10 hover:border-cyan-500/30 hover:text-white'
            }`}
            title="Pengaturan Studio & Arsitektur AI"
          >
            <Settings className="w-3.5 h-3.5 text-cyan-400" />
            <span>Pengaturan</span>
          </button>

          {/* User Profile / Menu */}
          <div className="flex items-center gap-1.5 pl-2 border-l border-white/10">
            <div 
              onClick={() => onNavigate('settings')}
              title="Profil Sutradara"
              className="w-8 h-8 rounded-full overflow-hidden border border-cyan-500/40 cursor-pointer hover:ring-2 hover:ring-cyan-400 transition-all shrink-0"
            >
              <img 
                src={user?.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"} 
                alt="Avatar" 
                className="w-full h-full object-cover"
              />
            </div>
            {onLogout && (
              <button 
                onClick={onLogout}
                title="Keluar Akun"
                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
