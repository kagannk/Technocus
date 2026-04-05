"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ 
    full_name: '', 
    email: '', 
    password: '',
    confirm_password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirm_password) {
      toast.error('Şifreler birbiriyle eşleşmiyor.');
      return;
    }
    
    setLoading(true);
    
    try {
      await apiFetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          email: formData.email.toLowerCase(),
          password: formData.password,
          full_name: formData.full_name
        })
      });

      toast.success('Kayıt başarılı! Lütfen giriş yapın.');
      router.push('/login');

    } catch (err: any) {
      toast.error(err.message || 'Kayıt olurken bir hata meydana geldi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center -mt-6">
      <div className="w-full max-w-lg bg-navy-800 rounded-2xl border border-navy-700 p-8 shadow-2xl relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-cyan-500/20 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-electric-default/20 rounded-full blur-2xl"></div>

        <div className="relative z-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-white mb-2">Aramıza Katılın!</h1>
            <p className="text-slate-400">Avantajlı fiyatlar ve hızlı sipariş için üye olun.</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Ad Soyad</label>
              <input 
                type="text"
                required
                className="w-full bg-navy-900 border border-navy-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-electric-default focus:ring-1 focus:ring-electric-default transition-all shadow-inner"
                placeholder="Örn: Yılmaz Kağan"
                value={formData.full_name}
                onChange={(e) => setFormData({...formData, full_name: e.target.value})}
              />
            </div>

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
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
               <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Şifre</label>
                  <input 
                    type="password"
                    required
                    className="w-full bg-navy-900 border border-navy-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-electric-default focus:ring-1 focus:ring-electric-default transition-all shadow-inner"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
               </div>
               <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Şifre Tekrar</label>
                  <input 
                    type="password"
                    required
                    className="w-full bg-navy-900 border border-navy-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-electric-default focus:ring-1 focus:ring-electric-default transition-all shadow-inner"
                    placeholder="••••••••"
                    value={formData.confirm_password}
                    onChange={(e) => setFormData({...formData, confirm_password: e.target.value})}
                  />
               </div>
            </div>

            <div className="flex items-center gap-3 mt-4">
              <input type="checkbox" required id="terms" className="w-4 h-4 text-electric-default bg-navy-900 border-navy-600 rounded focus:ring-electric-default focus:ring-2" />
              <label htmlFor="terms" className="text-xs text-slate-400"><Link href="/terms" className="text-electric-default hover:underline">Kullanım Koşullarını</Link> ve <Link href="/privacy" className="text-electric-default hover:underline">Gizlilik Politikasını</Link> okudum, kabul ediyorum.</label>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-electric-default hover:bg-electric-hover text-white font-bold py-3.5 rounded-lg shadow-[0_5px_15px_rgba(59,130,246,0.4)] transition-all flex justify-center items-center mt-6 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              ) : 'Ücretsiz Kayıt Ol'}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-slate-400">
            Zaten hesabınız var mı? <Link href="/login" className="font-bold text-electric-default hover:underline">Giriş Yapın</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
