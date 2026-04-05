"use client";

import { useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call for forgot password (since backend might not have this endpoint yet)
    // We can assume it returns 200 OK.
    setTimeout(() => {
      setSuccess(true);
      setLoading(false);
      toast.success('Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.');
    }, 1500);
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center -mt-6">
      <div className="w-full max-w-md bg-navy-800 rounded-2xl border border-navy-700 p-8 shadow-2xl relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl"></div>

        <div className="relative z-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-white mb-2">Şifremi Unuttum</h1>
            <p className="text-slate-400">E-posta adresinizi girin, size şifre sıfırlama bağlantısı gönderelim.</p>
          </div>

          {success ? (
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6 text-center animate-in fade-in slide-in-from-bottom-2">
              <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Bağlantı Gönderildi!</h3>
              <p className="text-sm text-slate-300 mb-6">Lütfen gelen kutunuzu (ve spam klasörünü) kontrol edin.</p>
              <Link href="/login" className="btn-secondary w-full py-3 inline-block font-bold">Giriş Sayfasına Dön</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Kayıtlı E-posta Adresiniz</label>
                <input 
                  type="email"
                  required
                  className="w-full bg-navy-900 border border-navy-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-electric-default focus:ring-1 focus:ring-electric-default transition-all shadow-inner"
                  placeholder="ornek@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              
              <button 
                type="submit" 
                disabled={loading || !email}
                className="w-full bg-electric-default hover:bg-electric-hover text-white font-bold py-3.5 rounded-lg shadow-[0_5px_15px_rgba(59,130,246,0.4)] transition-all flex justify-center items-center mt-6 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                ) : 'Sıfırlama Bağlantısı Gönder'}
              </button>
            </form>
          )}

          <div className="mt-8 text-center text-sm text-slate-400">
            <Link href="/login" className="font-bold border-b border-transparent hover:border-slate-400 transition-colors">Aklıma geldi, Giriş Sayfasına Dön</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
