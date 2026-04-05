"use client";

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';

export default function AdminCampaigns() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    code: '',
    discount_type: 'percentage',
    discount_value: '',
    min_cart_amount: '0',
    max_usage_limit: ''
  });

  useEffect(() => {
    loadCoupons();
  }, []);

  const loadCoupons = async () => {
    try {
      const data = await apiFetch('/api/campaigns/');
      setCoupons(data);
    } catch (e) {
      console.error("Error loading coupons", e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        code: formData.code.toUpperCase(),
        discount_type: formData.discount_type,
        discount_value: parseFloat(formData.discount_value),
        min_cart_amount: parseFloat(formData.min_cart_amount),
        max_usage_limit: formData.max_usage_limit ? parseInt(formData.max_usage_limit) : null
      };

      await apiFetch('/api/campaigns/', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      setIsModalOpen(false);
      setFormData({ code: '', discount_type: 'percentage', discount_value: '', min_cart_amount: '0', max_usage_limit: '' });
      loadCoupons();
    } catch (e: any) {
      alert(e.message || "Hata oluştu");
    }
  };

  const toggleActive = async (id: number, current: boolean) => {
    try {
      await apiFetch(`/api/campaigns/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ is_active: !current })
      });
      loadCoupons();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Kuponu silmek istediğinize emin misiniz?")) return;
    try {
      await apiFetch(`/api/campaigns/${id}`, { method: 'DELETE' });
      loadCoupons();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return <div className="h-40 flex items-center justify-center"><div className="w-6 h-6 border-4 border-electric-default border-t-transparent rounded-full animate-spin"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
           <h1 className="text-2xl font-bold text-white mb-1">Kampanya & Kupon Yönetimi</h1>
           <p className="text-sm text-slate-400">Özel indirim kuponları oluşturun ve müşteri kullanımını sınırlandırın.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-electric-default hover:bg-electric-hover text-white font-bold py-2.5 px-5 rounded-lg shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
          Yeni Kupon Ekle
        </button>
      </div>

      <div className="bg-navy-800 rounded-xl border border-navy-700 shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-navy-900 border-b border-navy-700 text-slate-400">
              <tr>
                <th className="p-4 font-semibold uppercase text-xs tracking-wider">Kupon Kodu</th>
                <th className="p-4 font-semibold uppercase text-xs tracking-wider text-center">İndirim Tipi</th>
                <th className="p-4 font-semibold uppercase text-xs tracking-wider text-center">İndirim Değeri</th>
                <th className="p-4 font-semibold uppercase text-xs tracking-wider text-center">Kullanım (Kullanılan/Toplam)</th>
                <th className="p-4 font-semibold uppercase text-xs tracking-wider text-center">Durum</th>
                <th className="p-4 font-semibold uppercase text-xs tracking-wider text-right">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-700/50">
              {coupons.map(c => (
                <tr key={c.id} className="hover:bg-navy-700/30 transition-colors">
                  <td className="p-4">
                    <span className="font-mono bg-navy-900 border border-electric-default/30 text-electric-default px-3 py-1.5 rounded text-sm font-bold tracking-wider">{c.code}</span>
                  </td>
                  <td className="p-4 text-center text-slate-300 font-medium">
                    {c.discount_type === 'percentage' ? '% Yüzde İndirim' : '₺ Sabit Tutar'}
                  </td>
                  <td className="p-4 text-center font-bold text-white text-lg">
                    {c.discount_type === 'percentage' ? `%${c.discount_value}` : `₺${c.discount_value}`}
                  </td>
                  <td className="p-4 text-center">
                    <div className="inline-flex items-center gap-2 bg-navy-900 px-3 py-1 rounded-full border border-navy-600">
                       <span className="text-electric-default font-bold">{c.current_usage}</span>
                       <span className="text-slate-500">/</span>
                       <span className="text-white font-medium">{c.max_usage_limit || '∞'}</span>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <button 
                      onClick={() => toggleActive(c.id, c.is_active)}
                      className={`px-4 py-1.5 text-xs font-bold rounded-full transition-colors ${
                        c.is_active 
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30 shadow-[0_0_10px_rgba(34,197,94,0.2)]' 
                          : 'bg-slate-800 text-slate-500 border border-slate-700 hover:bg-slate-700'
                      }`}
                    >
                      {c.is_active ? 'AKTİF (DURDUR)' : 'PASİF (BAŞLAT)'}
                    </button>
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleDelete(c.id)} className="text-red-400 hover:bg-red-500/20 p-2 rounded-lg transition-colors border border-transparent hover:border-red-500/30">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </td>
                </tr>
              ))}
              {coupons.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-slate-500">
                    <div className="w-16 h-16 border-2 border-dashed border-navy-600 rounded-full flex flex-col items-center justify-center mx-auto mb-4 text-slate-500">
                      %
                    </div>
                     Henüz hiç kupon oluşturulmamış.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-navy-800 border border-navy-700 rounded-xl w-full max-w-md shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            <div className="p-6 border-b border-navy-700 flex justify-between items-center bg-navy-900/50">
              <h2 className="text-xl font-bold text-white">Yeni Kupon Oluştur</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white bg-navy-700 p-1.5 rounded-full transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <form onSubmit={handleCreate} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Kupon Kodu (Örn: SUMMER20)</label>
                <input required type="text" className="w-full bg-navy-900 border border-navy-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-electric-default focus:ring-1 focus:ring-electric-default font-mono uppercase tracking-widest" placeholder="KOD GİRİN" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})} />
              </div>
              
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">İndirim Tipi</label>
                  <select className="w-full bg-navy-900 border border-navy-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-electric-default" value={formData.discount_type} onChange={e => setFormData({...formData, discount_type: e.target.value})}>
                    <option value="percentage">% Yüzde</option>
                    <option value="fixed">₺ Sabit Tutar</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">İndirim Değeri</label>
                  <input required type="number" step="0.01" min="0" className="w-full bg-navy-900 border border-navy-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-electric-default" placeholder="10" value={formData.discount_value} onChange={e => setFormData({...formData, discount_value: e.target.value})} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Mini. Sepet Tutarı (₺)</label>
                  <input type="number" min="0" className="w-full bg-navy-900 border border-navy-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-electric-default" placeholder="0" value={formData.min_cart_amount} onChange={e => setFormData({...formData, min_cart_amount: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Maksimum Kullanım</label>
                  <input type="number" min="1" className="w-full bg-navy-900 border border-navy-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-electric-default" placeholder="Sınırsız" value={formData.max_usage_limit} onChange={e => setFormData({...formData, max_usage_limit: e.target.value})} />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-navy-700 hover:bg-navy-600 text-white font-medium py-3 rounded-lg transition-colors border border-navy-600">İptal</button>
                <button type="submit" className="flex-1 bg-gradient-to-r from-electric-default to-cyan-500 hover:from-electric-hover hover:to-cyan-400 text-white font-bold py-3 rounded-lg shadow-[0_5px_15px_rgba(59,130,246,0.4)] transition-all">Oluştur ve Aktif Et</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
