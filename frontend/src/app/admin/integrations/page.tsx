"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function IntegrationsPage() {
  const router = useRouter();
  
  // Modal states
  const [isIyzicoModalOpen, setIsIyzicoModalOpen] = useState(false);
  const [isArasModalOpen, setIsArasModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [testing, setTesting] = useState(false);

  // Forms states
  const [iyzicoForm, setIyzicoForm] = useState({
    apiKey: 'sandbox-aKdB1729xN289sIaD012',
    secretKey: 'sandbox-sCjA9182xP091sKaD991',
    baseUrl: 'https://sandbox-api.iyzipay.com'
  });

  const [arasForm, setArasForm] = useState({
    username: 'technocus_aras_api',
    password: 'Password123!',
    customerCode: '992183172'
  });

  // Simulated active integrations list
  const [extraIntegrations, setExtraIntegrations] = useState<any[]>([
    { id: 'trendyol', name: 'Trendyol Entegrasyonu', desc: 'Ürünlerinizi Trendyol mağazanızla senkronize edin.', active: false, icon: 'T', color: 'from-orange-500 to-amber-500' },
    { id: 'hepsiburada', name: 'Hepsiburada API', desc: 'Hepsiburada siparişlerinizi panelden takip edin.', active: false, icon: 'H', color: 'from-orange-600 to-rose-500' },
    { id: 'parasut', name: 'Paraşüt Muhasebe', desc: 'Faturalarınızı otomatik olarak Paraşüt üzerinde oluşturun.', active: false, icon: 'P', color: 'from-blue-500 to-cyan-500' },
    { id: 'twilio', name: 'Twilio SMS', desc: 'Müşterilerinize kargo takip kodu SMS olarak gönderilsin.', active: false, icon: '💬', color: 'from-red-500 to-pink-500' }
  ]);

  const testConnection = (name: string) => {
    setTesting(true);
    toast.loading(`${name} sunucusuna bağlanılıyor...`);
    setTimeout(() => {
      toast.dismiss();
      toast.success(`${name} bağlantı testi başarılı!`);
      setTesting(false);
    }, 1500);
  };

  const handleSave = (name: string, closeFn: () => void) => {
    toast.success(`${name} ayarları başarıyla kaydedildi.`);
    closeFn();
  };

  const toggleExtraIntegration = (id: string) => {
    setExtraIntegrations(prev => prev.map(item => {
      if (item.id === id) {
        const nextState = !item.active;
        toast.success(`${item.name} entegrasyonu ${nextState ? 'etkinleştirildi' : 'devre dışı bırakıldı'}.`);
        return { ...item, active: nextState };
      }
      return item;
    }));
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Cihaz / Yazılım Entegrasyonları</h1>
        <p className="text-sm text-slate-400">Harici servis bağlantılarınızı yönetin.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Iyzico Card */}
        <div 
          onClick={() => setIsIyzicoModalOpen(true)}
          className="bg-navy-800 p-6 rounded-xl border border-navy-700 shadow-lg hover:border-blue-500/50 transition-colors group cursor-pointer flex flex-col justify-between min-h-[220px]"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
               <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center p-3 shadow-inner">
                 <img src="https://iyzico.com/assets/images/logo/iyzico-logo.svg" alt="iyzico" className="w-full h-auto" />
               </div>
               <span className="px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-[10px] tracking-widest font-black border border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.15)]">AKTİF</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">İyzico Ödeme Altyapısı</h3>
            <p className="text-slate-400 text-sm mb-4 leading-relaxed line-clamp-2">Tüm kredi kartlarından güvenli ödeme almak için kurulu İyzico entegrasyonu.</p>
          </div>
          <div className="text-xs font-bold text-blue-400 opacity-80 group-hover:opacity-100 flex items-center gap-1 transition-all">
            Ayarları Yönet
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </div>
        </div>

        {/* Aras Kargo Card */}
        <div 
          onClick={() => setIsArasModalOpen(true)}
          className="bg-navy-800 p-6 rounded-xl border border-navy-700 shadow-lg hover:border-red-500/50 transition-colors group cursor-pointer flex flex-col justify-between min-h-[220px]"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
               <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center p-2 shadow-inner">
                 <span className="font-extrabold text-red-600 text-lg tracking-tight">ARAS</span>
               </div>
               <span className="px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-[10px] tracking-widest font-black border border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.15)]">AKTİF</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-red-400 transition-colors">Aras Kargo API</h3>
            <p className="text-slate-400 text-sm mb-4 leading-relaxed line-clamp-2">Sipariş onaylandığında otomatik kargo barkodu üretimi ve takip numarası eşzamanlama altyapısı.</p>
          </div>
          <div className="text-xs font-bold text-red-400 opacity-80 group-hover:opacity-100 flex items-center gap-1 transition-all">
            Ayarları Yönet
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </div>
        </div>

        {/* n8n Card */}
        <div 
          onClick={() => router.push('/admin/workflows')}
          className="bg-navy-800 p-6 rounded-xl border border-navy-700 shadow-lg hover:border-purple-500/50 transition-colors group cursor-pointer flex flex-col justify-between min-h-[220px]"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
               <div className="w-14 h-14 bg-gradient-to-tr from-rose-500 via-purple-500 to-electric-default rounded-xl flex items-center justify-center p-2 shadow-inner">
                 <span className="font-black text-white text-xl">n8n</span>
               </div>
               <span className="px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-[10px] tracking-widest font-black border border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.15)]">AKTİF</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">n8n Otomasyon</h3>
            <p className="text-slate-400 text-sm mb-4 leading-relaxed line-clamp-2">Kargo, stok ve sipariş süreçleriniz için Webhook tabanlı akıllı iş akışı tasarım modülü.</p>
          </div>
          <div className="text-xs font-bold text-purple-400 opacity-80 group-hover:opacity-100 flex items-center gap-1 transition-all">
            İş Akışlarına Git
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </div>
        </div>

        {/* Enabled Extra Integrations */}
        {extraIntegrations.filter(e => e.active).map(integration => (
          <div 
            key={integration.id}
            onClick={() => toggleExtraIntegration(integration.id)}
            className="bg-navy-800 p-6 rounded-xl border border-navy-700 shadow-lg hover:border-emerald-500/50 transition-all group cursor-pointer flex flex-col justify-between min-h-[220px] animate-in fade-in zoom-in-95 duration-200"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                 <div className={`w-14 h-14 bg-gradient-to-tr ${integration.color} rounded-xl flex items-center justify-center text-white text-xl font-bold p-2 shadow-inner`}>
                   {integration.icon}
                 </div>
                 <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-[10px] tracking-widest font-black border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.15)]">AKTİF</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">{integration.name}</h3>
              <p className="text-slate-400 text-sm mb-4 leading-relaxed line-clamp-2">{integration.desc}</p>
            </div>
            <div className="text-xs font-bold text-emerald-400 opacity-80 group-hover:opacity-100 flex items-center gap-1 transition-all">
              Devre Dışı Bırak
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </div>
          </div>
        ))}

        {/* Add Integration Card */}
        <div 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-navy-800 p-6 rounded-xl border border-navy-700 border-dashed opacity-60 hover:opacity-100 transition-all flex flex-col items-center justify-center min-h-[220px] cursor-pointer hover:bg-navy-700/50 hover:border-slate-500"
        >
          <div className="w-12 h-12 rounded-full bg-navy-700 flex items-center justify-center text-slate-400 mb-4 shadow-inner">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          </div>
          <h3 className="font-bold text-white">Yeni Entegrasyon Ekle</h3>
          <p className="text-xs text-slate-500 mt-2 text-center max-w-[200px]">Pazar yeri, fatura ve SMS kanallarını bağlayın.</p>
        </div>
      </div>

      {/* Iyzico Settings Modal */}
      {isIyzicoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-navy-950/75 animate-in fade-in duration-200">
          <div className="bg-navy-800 border border-navy-700 w-full max-w-lg rounded-3xl p-6 md:p-8 shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsIyzicoModalOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <h2 className="text-xl font-black text-white mb-6">İyzico Entegrasyon Ayarları</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleSave('İyzico', () => setIsIyzicoModalOpen(false)); }} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Iyzico API Key</label>
                <input 
                  type="text" required
                  value={iyzicoForm.apiKey}
                  onChange={e => setIyzicoForm({...iyzicoForm, apiKey: e.target.value})}
                  className="w-full bg-navy-900 border border-navy-600 rounded-xl px-4 py-3 text-white focus:border-electric-default outline-none transition-all font-mono text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Iyzico Secret Key</label>
                <input 
                  type="password" required
                  value={iyzicoForm.secretKey}
                  onChange={e => setIyzicoForm({...iyzicoForm, secretKey: e.target.value})}
                  className="w-full bg-navy-900 border border-navy-600 rounded-xl px-4 py-3 text-white focus:border-electric-default outline-none transition-all font-mono text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">API Base URL</label>
                <input 
                  type="url" required
                  value={iyzicoForm.baseUrl}
                  onChange={e => setIyzicoForm({...iyzicoForm, baseUrl: e.target.value})}
                  className="w-full bg-navy-900 border border-navy-600 rounded-xl px-4 py-3 text-white focus:border-electric-default outline-none transition-all font-mono text-sm"
                />
              </div>
              <div className="flex gap-4 pt-4 border-t border-navy-700/60">
                <button 
                  type="button"
                  disabled={testing}
                  onClick={() => testConnection('İyzico API')}
                  className="flex-1 bg-navy-700 hover:bg-navy-650 text-white font-bold py-3.5 rounded-xl border border-navy-650 transition-all text-sm"
                >
                  Bağlantıyı Test Et
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-electric-default hover:bg-electric-hover text-white font-bold py-3.5 rounded-xl transition-all text-sm shadow-[0_4px_20px_rgba(59,130,246,0.25)]"
                >
                  Değişiklikleri Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Aras Kargo Settings Modal */}
      {isArasModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-navy-950/75 animate-in fade-in duration-200">
          <div className="bg-navy-800 border border-navy-700 w-full max-w-lg rounded-3xl p-6 md:p-8 shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsArasModalOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <h2 className="text-xl font-black text-white mb-6">Aras Kargo API Ayarları</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleSave('Aras Kargo', () => setIsArasModalOpen(false)); }} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Aras Kargo Servis Kullanıcı Adı</label>
                <input 
                  type="text" required
                  value={arasForm.username}
                  onChange={e => setArasForm({...arasForm, username: e.target.value})}
                  className="w-full bg-navy-900 border border-navy-600 rounded-xl px-4 py-3 text-white focus:border-electric-default outline-none transition-all font-mono text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Aras Kargo API Şifresi</label>
                <input 
                  type="password" required
                  value={arasForm.password}
                  onChange={e => setArasForm({...arasForm, password: e.target.value})}
                  className="w-full bg-navy-900 border border-navy-600 rounded-xl px-4 py-3 text-white focus:border-electric-default outline-none transition-all font-mono text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Müşteri Kodu</label>
                <input 
                  type="text" required
                  value={arasForm.customerCode}
                  onChange={e => setArasForm({...arasForm, customerCode: e.target.value})}
                  className="w-full bg-navy-900 border border-navy-600 rounded-xl px-4 py-3 text-white focus:border-electric-default outline-none transition-all font-mono text-sm"
                />
              </div>
              <div className="flex gap-4 pt-4 border-t border-navy-700/60">
                <button 
                  type="button"
                  disabled={testing}
                  onClick={() => testConnection('Aras Kargo API')}
                  className="flex-1 bg-navy-700 hover:bg-navy-650 text-white font-bold py-3.5 rounded-xl border border-navy-650 transition-all text-sm"
                >
                  Bağlantıyı Test Et
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-electric-default hover:bg-electric-hover text-white font-bold py-3.5 rounded-xl transition-all text-sm shadow-[0_4px_20px_rgba(59,130,246,0.25)]"
                >
                  Değişiklikleri Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Integration Marketplace Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-navy-950/75 animate-in fade-in duration-200">
          <div className="bg-navy-800 border border-navy-700 w-full max-w-2xl rounded-3xl p-6 md:p-8 shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <h2 className="text-xl font-black text-white mb-2">Entegrasyon Pazaryeri</h2>
            <p className="text-sm text-slate-400 mb-6">İş süreçlerinizi hızlandıracak yeni modülleri tek tıkla sisteminize bağlayın.</p>
            
            <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2">
              {extraIntegrations.map((integration) => (
                <div 
                  key={integration.id}
                  className="p-4 bg-navy-900 border border-navy-700/60 rounded-2xl flex items-center justify-between gap-4 hover:border-navy-600 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 bg-gradient-to-tr ${integration.color} rounded-xl flex items-center justify-center text-white text-lg font-bold shadow-inner`}>
                      {integration.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">{integration.name}</h4>
                      <p className="text-xs text-slate-400">{integration.desc}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => { toggleExtraIntegration(integration.id); }}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                      integration.active 
                        ? 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20' 
                        : 'bg-electric-default hover:bg-electric-hover text-white'
                    }`}
                  >
                    {integration.active ? 'Devre Dışı Bırak' : 'Etkinleştir'}
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-6 mt-6 border-t border-navy-700/60 flex justify-end">
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="bg-navy-700 hover:bg-navy-650 text-white font-bold py-3 px-8 rounded-xl transition-all text-sm"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
