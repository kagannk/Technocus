"use client";

import { useState } from 'react';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success('Mesajınız başarıyla iletildi. En kısa sürede dönüş yapacağız!');
      (e.target as HTMLFormElement).reset();
    }, 1000);
  };

  return (
    <div className="py-12">
      <div className="text-center space-y-4 mb-16">
        <h1 className="text-4xl md:text-5xl font-black text-white">İletişime Geçin</h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto">
          Sorularınız, teknik destek talepleriniz veya kurumsal teklifleriniz için bize ulaşın.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div className="bg-navy-800 border border-navy-700 rounded-3xl p-8 shadow-2xl relative">
          <h2 className="text-2xl font-bold text-white mb-6">Mesaj Gönderin</h2>
          <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Ad Soyad</label>
                <input required type="text" className="w-full bg-navy-900 border border-navy-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-electric-default focus:ring-1 focus:ring-electric-default" placeholder="Örn: Yılmaz Kağan" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">E-posta Adresi</label>
                <input required type="email" className="w-full bg-navy-900 border border-navy-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-electric-default focus:ring-1 focus:ring-electric-default" placeholder="ornek@email.com" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Konu</label>
              <select className="w-full bg-navy-900 border border-navy-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-electric-default focus:ring-1 focus:ring-electric-default">
                <option>Sipariş Durumu</option>
                <option>İade ve Değişim</option>
                <option>Teknik Destek</option>
                <option>Ar-Ge Sponsorluk</option>
                <option>Diğer</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Mesajınız</label>
              <textarea required rows={5} className="w-full bg-navy-900 border border-navy-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-electric-default focus:ring-1 focus:ring-electric-default resize-none" placeholder="Mesajınızı buraya yazabilirsiniz..."></textarea>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gradient-to-r from-electric-default to-cyan-500 hover:from-electric-hover hover:to-cyan-400 text-white font-bold py-4 rounded-xl shadow-[0_5px_15px_rgba(59,130,246,0.3)] transition-all disabled:opacity-70 flex justify-center items-center"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              ) : 'Mesajı Gönder'}
            </button>
          </form>
        </div>

        {/* Info & Map */}
        <div className="space-y-8">
          <div className="bg-navy-800/50 border border-navy-700 rounded-3xl p-8">
            <h2 className="text-xl font-bold text-white mb-6">İletişim Bilgileri</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-electric-default/10 flex items-center justify-center shrink-0 border border-electric-default/20">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-electric-default" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </div>
                <div>
                  <h4 className="font-bold text-white">Merkez Ofis ve Depo</h4>
                  <p className="text-slate-400 text-sm mt-1">Levent, İstanbul / Türkiye</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center shrink-0 border border-cyan-500/20">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
                <div>
                  <h4 className="font-bold text-white">Email Desteği</h4>
                  <p className="text-slate-400 text-sm mt-1">info@technocus.example<br/>destek@technocus.example</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center shrink-0 border border-purple-500/20">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                </div>
                <div>
                  <h4 className="font-bold text-white">Telefon</h4>
                  <p className="text-slate-400 text-sm mt-1">+90 (212) 555 0123<br/>Hafta içi 09:00 - 18:00</p>
                </div>
              </div>
            </div>
          </div>

          {/* Fake Map Embed */}
          <div className="h-64 bg-navy-800 rounded-3xl border border-navy-700 overflow-hidden relative group">
             <div className="absolute inset-0 bg-[url('https://maps.wikimedia.org/osm-intl/12/2361/1547.png')] bg-cover bg-center grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"></div>
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-red-500 rounded-full flex items-center justify-center animate-bounce shadow-[0_0_15px_rgba(239,68,68,0.8)] border-4 border-white z-10">
               <span className="w-3 h-3 bg-white rounded-full"></span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
