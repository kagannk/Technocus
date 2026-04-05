"use client";
import React from 'react';

export default function IntegrationsPage() {
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Cihaz / Yazılım Entegrasyonları</h1>
        <p className="text-sm text-slate-400">Harici servis bağlantılarınızı yönetin.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-navy-800 p-6 rounded-xl border border-navy-700 shadow-lg hover:border-blue-500/50 transition-colors group cursor-pointer">
          <div className="flex items-center justify-between mb-6">
             <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center p-3 shadow-inner">
               <img src="https://iyzico.com/assets/images/logo/iyzico-logo.svg" alt="iyzico" className="w-full h-auto" />
             </div>
             <span className="px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-[10px] tracking-widest font-black border border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.15)]">AKTİF</span>
          </div>
          <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">İyzico Ödeme Altyapısı</h3>
          <p className="text-slate-400 text-sm mb-6 leading-relaxed">Tüm kredi kartlarından güvenli ödeme almak için kurulu İyzico entegrasyonu. API keyler .env içerisinde güvenle saklanmaktadır.</p>
          <div className="text-xs font-bold text-blue-400 opacity-80 group-hover:opacity-100 flex items-center gap-1 transition-all">
            Ayarları Yönet
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </div>
        </div>

        <div className="bg-navy-800 p-6 rounded-xl border border-navy-700 shadow-lg hover:border-red-500/50 transition-colors group cursor-pointer">
          <div className="flex items-center justify-between mb-6">
             <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center p-2 shadow-inner">
               <span className="font-extrabold text-red-600 text-lg tracking-tight">ARAS</span>
             </div>
             <span className="px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-[10px] tracking-widest font-black border border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.15)]">AKTİF</span>
          </div>
          <h3 className="text-lg font-bold text-white mb-2 group-hover:text-red-400 transition-colors">Aras Kargo API</h3>
          <p className="text-slate-400 text-sm mb-6 leading-relaxed">Sipariş onaylandığında otomatik kargo barkodu üretimi ve takip numarası eşzamanlama altyapısı.</p>
          <div className="text-xs font-bold text-red-400 opacity-80 group-hover:opacity-100 flex items-center gap-1 transition-all">
            Ayarları Yönet
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </div>
        </div>

        <div className="bg-navy-800 p-6 rounded-xl border border-navy-700 shadow-lg hover:border-purple-500/50 transition-colors group cursor-pointer">
          <div className="flex items-center justify-between mb-6">
             <div className="w-14 h-14 bg-gradient-to-tr from-rose-500 via-purple-500 to-electric-default rounded-xl flex items-center justify-center p-2 shadow-inner">
               <span className="font-black text-white text-xl">n8n</span>
             </div>
             <span className="px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-[10px] tracking-widest font-black border border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.15)]">AKTİF</span>
          </div>
          <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">n8n Otomasyon</h3>
          <p className="text-slate-400 text-sm mb-6 leading-relaxed">Kargo, stok ve sipariş süreçleriniz için Webhook tabanlı akıllı iş akışı tasarım modülü.</p>
          <div className="text-xs font-bold text-purple-400 opacity-80 group-hover:opacity-100 flex items-center gap-1 transition-all">
            İş Akışlarına Git
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </div>
        </div>

        <div className="bg-navy-800 p-6 rounded-xl border border-navy-700 border-dashed opacity-60 hover:opacity-100 transition-all flex flex-col items-center justify-center min-h-[240px] cursor-pointer hover:bg-navy-700/50 hover:border-slate-500">
          <div className="w-12 h-12 rounded-full bg-navy-700 flex items-center justify-center text-slate-400 mb-4 shadow-inner">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          </div>
          <h3 className="font-bold text-white">Yeni Entegrasyon Ekle</h3>
          <p className="text-xs text-slate-500 mt-2 text-center max-w-[200px]">Paraşüt, Trendyol, Hepsiburada yakında eklenecektir.</p>
        </div>
      </div>
    </div>
  );
}
