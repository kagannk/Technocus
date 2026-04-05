"use client";

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';

export default function AdminSettings() {
  const [loading, setLoading] = useState(true);

  // default local forms
  const [formData, setFormData] = useState<Record<string, string>>({});

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await apiFetch('/api/settings/');
      const initial: Record<string, string> = {};
      data.forEach((s: any) => initial[s.key] = s.value);
      setFormData(initial);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (key: string) => {
    try {
      await apiFetch(`/api/settings/${key}`, {
        method: 'PUT',
        body: JSON.stringify({ value: formData[key] || "" })
      });
      alert('Ayar başarıyla kaydedildi.');
      loadSettings();
    } catch (e) {
      alert("Hata oluştu.");
    }
  };

  if (loading) return <div className="h-40 flex items-center justify-center"><div className="w-6 h-6 border-4 border-electric-default border-t-transparent rounded-full animate-spin"></div></div>;

  const settingKeys = [
    { key: "SITE_NAME", label: "Site Adı", desc: "Mağazanızın tarayıcıda görünen adı" },
    { key: "CONTACT_EMAIL", label: "İletişim E-posta", desc: "Müşterilerin size ulaşacağı e-posta adresi" },
    { key: "FREE_SHIPPING_THRESHOLD", label: "Ücretsiz Kargo Barajı (₺)", desc: "Bu tutarın üzerindeki siparişlerde kargo bedava olur" },
    { key: "MAINTENANCE_MODE", label: "Bakım Modu", desc: "true veya false (Sadece adminler siteyi görebilir)" },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Genel Ayarlar</h1>
        <p className="text-sm text-slate-400">Technocus sistem yapılandırmasını buradan yönetebilirsiniz.</p>
      </div>

      <div className="bg-navy-800 rounded-xl border border-navy-700 shadow-lg overflow-hidden">
        <div className="p-6 border-b border-navy-700 bg-navy-900/50">
           <h2 className="text-lg font-bold text-white">Mağaza Ayarları</h2>
        </div>
        
        <div className="p-6 space-y-8">
          {settingKeys.map(item => (
            <div key={item.key} className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-navy-700 last:border-0 last:pb-0">
              <div className="flex-1">
                 <h4 className="text-white font-medium mb-1">{item.label}</h4>
                 <p className="text-xs text-slate-500">{item.desc}</p>
                 <p className="inline-block mt-2 px-2 py-0.5 bg-navy-900 border border-navy-600 rounded text-[10px] text-electric-default font-mono uppercase tracking-widest">{item.key}</p>
              </div>
              <div className="flex items-center gap-3 w-full md:w-auto">
                 <input 
                   type="text" 
                   value={formData[item.key] || ''}
                   onChange={e => setFormData({ ...formData, [item.key]: e.target.value })}
                   className="w-full md:w-64 bg-navy-900 border border-navy-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-electric-default focus:ring-1 focus:ring-electric-default font-medium"
                   placeholder="Değer giriniz..."
                 />
                 <button 
                   onClick={() => handleSave(item.key)}
                   className="bg-navy-700 hover:bg-electric-default hover:text-white hover:border-transparent text-slate-300 font-bold px-5 py-2.5 rounded-lg transition-all border border-navy-600 shadow-sm whitespace-nowrap"
                 >
                   Kaydet
                 </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
