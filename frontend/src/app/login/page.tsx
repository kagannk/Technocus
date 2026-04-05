"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const loginEmail = formData.email.toLowerCase();
      const formParams = new URLSearchParams();
      formParams.append('username', loginEmail);
      formParams.append('password', formData.password);

      const data = await apiFetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formParams.toString()
      });

      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user_name', data.full_name || 'Kullanıcı');
      if (data.is_admin) localStorage.setItem('role', 'admin');
      
      toast.success('Başarıyla giriş yaptınız!');
      
      // Redirect based on role or just home
      setTimeout(() => {
        window.location.href = '/'; 
      }, 500);

    } catch (err: any) {
      toast.error(err.message || 'E-posta veya şifre hatalı.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center -mt-10">
      <div className="w-full max-w-md bg-navy-800 rounded-2xl border border-navy-700 p-8 shadow-2xl relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-electric-default/20 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl"></div>

        <div className="relative z-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-white mb-2">Hoş Geldiniz</h1>
            <p className="text-slate-400">Alışverişe devam etmek için giriş yapın.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">E-posta Adresi</label>
              <input 
                type="email"
                required
                className="w-full bg-navy-900 border border-navy-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-electric-default focus:ring-1 focus:ring-electric-default transition-all shadow-inner"
                placeholder="ornek@email.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-semibold text-slate-300">Şifre</label>
                <Link href="/forgot-password" className="text-xs font-semibold text-electric-default hover:underline">Şifremi Unuttum</Link>
              </div>
              <input 
                type="password"
                required
                className="w-full bg-navy-900 border border-navy-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-electric-default focus:ring-1 focus:ring-electric-default transition-all shadow-inner"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-electric-default hover:bg-electric-hover text-white font-bold py-3.5 rounded-lg shadow-[0_5px_15px_rgba(59,130,246,0.4)] transition-all flex justify-center items-center mt-6 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              ) : 'Giriş Yap'}
            </button>
          </form>

          <div className="mt-6 flex items-center justify-between">
            <span className="border-b border-navy-600 flex-1"></span>
            <span className="text-xs font-semibold text-slate-500 uppercase px-4">VEYA</span>
            <span className="border-b border-navy-600 flex-1"></span>
          </div>

          <button 
            type="button"
            className="w-full mt-6 bg-navy-700 hover:bg-navy-600 border border-navy-600 text-white font-medium py-3 rounded-lg transition-all flex justify-center items-center gap-3 shadow-inner"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/><path d="M1 1h22v22H1z" fill="none"/></svg>
            Google ile Giriş Yap
          </button>

          <div className="mt-8 text-center text-sm text-slate-400">
            Hesabınız yok mu? <Link href="/register" className="font-bold text-electric-default hover:underline">Hemen Kayıt Olun</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
