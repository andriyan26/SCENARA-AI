import React, { useState } from 'react';
import { Film, Sparkles, ArrowRight, Lock, Mail, User as UserIcon, Loader2, Clapperboard } from 'lucide-react';
import { api } from '../services/api.ts';
import { User } from '../types/index.ts';

interface AuthPageProps {
  onSuccess: (user: User) => void;
  onBackToHome: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onSuccess, onBackToHome }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLogin) {
        const res = await api.auth.login(email, password);
        onSuccess(res.user);
      } else {
        const res = await api.auth.register(name, email, password);
        onSuccess(res.user);
      }
    } catch (err: any) {
      setError(err.message || 'Autentikasi gagal. Silakan periksa kembali email dan kata sandi Anda.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await api.auth.login('admin@scenara.ai', 'admin123');
      onSuccess(res.user);
    } catch (err: any) {
      setError(err.message || 'Masuk demo gagal.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-studio-950 flex flex-col justify-center items-center p-6 relative overflow-hidden film-grain">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-gradient-to-tr from-cyan-500/20 via-blue-500/10 to-transparent blur-3xl pointer-events-none rounded-full" />

      {/* Brand Header */}
      <div className="mb-8 text-center cursor-pointer" onClick={onBackToHome}>
        <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 items-center justify-center shadow-xl shadow-cyan-500/20 mb-3">
          <Film className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-2xl font-black tracking-wider text-white font-display">
          SCENARA <span className="text-cyan-400">AI</span>
        </h1>
        <p className="text-xs text-slate-400 font-mono tracking-widest uppercase">
          Portal Akses Studio
        </p>
      </div>

      {/* Main Auth Card */}
      <div className="w-full max-w-md glass-panel border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl relative z-10">
        {/* Tab Toggle */}
        <div className="flex bg-studio-900 p-1 rounded-xl mb-6 border border-white/5">
          <button
            type="button"
            onClick={() => { setIsLogin(true); setError(null); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              isLogin ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Masuk Akun
          </button>
          <button
            type="button"
            onClick={() => { setIsLogin(false); setError(null); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              !isLogin ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Daftar Studio Baru
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="text-[11px] font-mono text-slate-400 block mb-1.5">Nama Lengkap</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  placeholder="contoh: Andrian Pratama"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-studio-900 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-[11px] font-mono text-slate-400 block mb-1.5">Alamat Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                placeholder="sutradara@studio.ai"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-studio-900 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-mono text-slate-400 block mb-1.5">Kata Sandi</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-studio-900 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin text-white" />
            ) : (
              <>
                <span>{isLogin ? 'Masuk ke Studio Produksi' : 'Daftar & Mulai Produksi Film'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Studio Login */}
        <div className="mt-6 pt-5 border-t border-white/10 text-center">
          <p className="text-[11px] text-slate-400 mb-2">Ingin langsung mencoba tanpa mendaftar?</p>
          <button
            type="button"
            onClick={handleQuickDemoLogin}
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl bg-studio-900/90 hover:bg-studio-800 text-cyan-300 border border-cyan-500/30 text-xs font-semibold flex items-center justify-center gap-2 transition-all hover:border-cyan-400"
          >
            <Clapperboard className="w-4 h-4 text-cyan-400" />
            <span>Masuk Instan Studio Demo (1-Klik)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
