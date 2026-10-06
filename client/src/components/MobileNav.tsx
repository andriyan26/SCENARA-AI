import React from 'react';
import { LayoutDashboard, Film, Plus, FolderKanban, User } from 'lucide-react';

interface MobileNavProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ currentPage, onNavigate }) => {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 glass-panel border-t border-white/10 px-4 py-2 flex items-center justify-around">
      <button
        onClick={() => onNavigate('dashboard')}
        className={`flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${
          currentPage === 'dashboard' ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <LayoutDashboard className="w-5 h-5" />
        <span>Dasbor</span>
      </button>

      <button
        onClick={() => onNavigate('projects')}
        className={`flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${
          currentPage === 'projects' ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Film className="w-5 h-5" />
        <span>Proyek</span>
      </button>

      {/* Prominent Center Create Button */}
      <button
        onClick={() => onNavigate('create')}
        title="Buat Video Baru"
        className="flex items-center justify-center -mt-5 w-12 h-12 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/40 active:scale-95 transition-transform"
      >
        <Plus className="w-6 h-6 stroke-[2.5]" />
      </button>

      <button
        onClick={() => onNavigate('assets')}
        className={`flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${
          currentPage === 'assets' ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <FolderKanban className="w-5 h-5" />
        <span>Aset</span>
      </button>

      <button
        onClick={() => onNavigate('settings')}
        className={`flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${
          currentPage === 'settings' ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <User className="w-5 h-5" />
        <span>Profil</span>
      </button>
    </nav>
  );
};
