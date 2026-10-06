import React, { useState } from 'react';
import { 
  Plus, 
  Film, 
  Clock, 
  Sparkles, 
  Search, 
  Play, 
  MoreVertical, 
  Copy, 
  Trash2, 
  ArrowUpRight,
  FolderOpen,
  Calendar,
  Layers,
  ChevronRight
} from 'lucide-react';
import { Project, User } from '../types/index.ts';

interface DashboardPageProps {
  user: User | null;
  projects: Project[];
  onOpenProject: (projectId: string) => void;
  onCreateProject: () => void;
  onDuplicateProject: (projectId: string) => void;
  onDeleteProject: (projectId: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  user,
  projects,
  onOpenProject,
  onCreateProject,
  onDuplicateProject,
  onDeleteProject
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('all');

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedTypeFilter === 'all' || p.project_type === selectedTypeFilter;
    return matchesSearch && matchesType;
  });

  const totalDuration = projects.reduce((acc, p) => acc + (p.target_duration_seconds || 0), 0);
  const totalScenes = projects.reduce((acc, p) => acc + (p.scene_count || 8), 0);

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-7xl mx-auto animate-fade-in-up">
      {/* Welcome Banner */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-studio-900 via-studio-850 to-studio-900 border border-white/10 shadow-2xl overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-gradient-to-l from-cyan-500/10 via-purple-500/10 to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-3">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>STUDIO PRODUKSI FILM AI</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-display mb-2">
            Selamat datang kembali, <span className="text-cyan-400">{user?.name || 'Sutradara'}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mb-6 font-light leading-relaxed">
            Siap mewujudkan narasi berikutnya ke layar bioskop? Ubah setiap ide, skenario, atau pemikiran menjadi film sinematik utuh bersama Sutradara AI terintegrasi.
          </p>
          <button
            onClick={onCreateProject}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold shadow-lg shadow-cyan-500/30 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Buat Proyek Video Baru</span>
          </button>
        </div>
      </div>

      {/* Production Analytics Stats (Section 28) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Total Proyek',
            value: projects.length,
            subtext: `${projects.filter(p => p.status === 'completed').length} film selesai`,
            icon: Film,
            color: 'text-cyan-400',
            bg: 'bg-cyan-500/10 border-cyan-500/20'
          },
          {
            label: 'Adegan Dihasilkan',
            value: totalScenes,
            subtext: 'Klip definisi tinggi',
            icon: Layers,
            color: 'text-blue-400',
            bg: 'bg-blue-500/10 border-blue-500/20'
          },
          {
            label: 'Total Durasi Film',
            value: `${Math.floor(totalDuration / 60)}m ${totalDuration % 60}d`,
            subtext: 'Garis waktu sinematik',
            icon: Clock,
            color: 'text-purple-400',
            bg: 'bg-purple-500/10 border-purple-500/20'
          },
          {
            label: 'Kredit AI Tersedia',
            value: user?.credits ?? 1500,
            subtext: 'Google Veo & ElevenLabs',
            icon: Sparkles,
            color: 'text-amber-400',
            bg: 'bg-amber-500/10 border-amber-500/20'
          },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="glass-card p-5 rounded-2xl border border-white/5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-slate-400 font-medium">{stat.label}</span>
                <div className={`p-2 rounded-xl border ${stat.bg} ${stat.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-white font-mono mb-1">{stat.value}</div>
              <p className="text-[11px] text-slate-400">{stat.subtext}</p>
            </div>
          );
        })}
      </div>

      {/* Projects Section Header & Search */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white font-display">Proyek Terbaru</h2>
            <p className="text-xs text-slate-400">Kelola dan lanjutkan penyuntingan karya film Anda</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Search Bar */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Cari proyek video..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-studio-900 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 text-xs">
          {[
            { id: 'all', label: 'Semua Proyek' },
            { id: 'short_film', label: 'Film Pendek' },
            { id: 'social_media', label: 'Medsos & Reels' },
            { id: 'cinematic', label: 'Sinematik' },
            { id: 'advertisement', label: 'Iklan & Komersial' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setSelectedTypeFilter(f.id)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                selectedTypeFilter === f.id
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm'
                  : 'bg-studio-900/60 text-slate-400 border-white/5 hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="glass-card p-12 rounded-3xl border border-white/5 text-center">
            <div className="w-16 h-16 rounded-2xl bg-studio-900 border border-white/10 flex items-center justify-center mx-auto mb-4 text-slate-500">
              <FolderOpen className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">Belum ada karya film.</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mb-6">
              Buat proyek video pertama Anda dan wujudkan ide cerita dengan sutradara, suara, dan musik otomatis.
            </p>
            <button
              onClick={onCreateProject}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold shadow-lg shadow-cyan-500/25 inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Buat Proyek Video</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map(project => (
              <div
                key={project.id}
                className="glass-card rounded-2xl border border-white/10 overflow-hidden flex flex-col group hover:border-cyan-500/40 transition-all"
              >
                {/* Thumbnail & Badges */}
                <div 
                  onClick={() => onOpenProject(project.id)}
                  className="relative aspect-video bg-studio-950 overflow-hidden cursor-pointer"
                >
                  <img
                    src={project.thumbnail_url || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80'}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-studio-950 via-transparent to-black/30" />
                  
                  {/* Aspect Ratio & Duration Tag */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[10px] font-mono text-cyan-300 border border-white/10">
                      {project.aspect_ratio || '16:9'}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[10px] font-mono text-white border border-white/10">
                      {Math.floor((project.target_duration_seconds || 120) / 60)}:{String((project.target_duration_seconds || 120) % 60).padStart(2, '0')}
                    </span>
                  </div>

                  {/* Status Indicator */}
                  <div className="absolute top-3 right-3">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold uppercase ${
                      project.status === 'completed'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {project.status === 'completed' ? 'Selesai' : 'Diproses'}
                    </span>
                  </div>

                  {/* Play Hover Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                    <div className="w-12 h-12 rounded-full bg-cyan-500 text-black flex items-center justify-center shadow-lg shadow-cyan-500/50 transform group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 fill-current translate-x-0.5" />
                    </div>
                  </div>
                </div>

                {/* Content Body */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono uppercase text-cyan-400">
                        {project.project_type === 'short_film' ? 'FILM PENDEK' : project.project_type?.replace('_', ' ') || 'FILM PENDEK'}
                      </span>
                      <span className="text-slate-600">•</span>
                      <span className="text-[10px] text-slate-400">{project.scene_count || 8} Adegan</span>
                    </div>

                    <h3 
                      onClick={() => onOpenProject(project.id)}
                      className="text-sm font-bold text-white hover:text-cyan-400 cursor-pointer transition-colors line-clamp-1"
                    >
                      {project.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                      {project.description || 'Struktur narasi diarahkan oleh Sutradara AI.'}
                    </p>
                  </div>

                  {/* Card Bottom Actions */}
                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                    <button
                      onClick={() => onOpenProject(project.id)}
                      className="flex items-center gap-1.5 text-xs font-semibold text-cyan-300 hover:text-white transition-colors"
                    >
                      <span>Buka Studio</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onDuplicateProject(project.id)}
                        title="Duplikasi Proyek"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteProject(project.id)}
                        title="Hapus Proyek"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
