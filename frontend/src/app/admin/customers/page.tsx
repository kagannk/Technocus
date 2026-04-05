"use client";

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      const data = await apiFetch('/api/customers/');
      setCustomers(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id: number) => {
    try {
      await apiFetch(`/api/customers/${id}/status`, { method: 'PUT' });
      loadCustomers();
    } catch (e) {
      alert("Hata oluştu.");
    }
  };

  if (loading) {
    return <div className="h-40 flex items-center justify-center"><div className="w-6 h-6 border-4 border-electric-default border-t-transparent rounded-full animate-spin"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-white">Müşteri Yönetimi</h1>
      </div>

      <div className="bg-navy-800 rounded-xl border border-navy-700 shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-navy-900 border-b border-navy-700 text-slate-400">
              <tr>
                <th className="p-4 font-semibold uppercase text-xs tracking-wider">Müşteri Detayı</th>
                <th className="p-4 font-semibold uppercase text-xs tracking-wider text-center">Toplam Sipariş</th>
                <th className="p-4 font-semibold uppercase text-xs tracking-wider text-center">Toplam Harcama</th>
                <th className="p-4 font-semibold uppercase text-xs tracking-wider text-center">Durum</th>
                <th className="p-4 font-semibold uppercase text-xs tracking-wider text-right">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-700/50">
              {customers.map(c => (
                <tr key={c.id} className={`transition-colors ${!c.is_active ? 'bg-red-900/10' : 'hover:bg-navy-700/30'}`}>
                  <td className="p-4">
                    <div className="font-bold text-white mb-0.5">{c.full_name || 'İsimsiz Müşteri'}</div>
                    <div className="text-xs text-slate-400">{c.email}</div>
                  </td>
                  <td className="p-4 text-center font-bold text-slate-300">{c.order_count}</td>
                  <td className="p-4 text-center font-bold text-green-400">₺{c.total_spent.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</td>
                  <td className="p-4 text-center">
                    {c.is_active ? (
                      <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-semibold">Aktif</span>
                    ) : (
                      <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-semibold">Engellendi</span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => toggleStatus(c.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                        c.is_active 
                          ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30' 
                          : 'bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-green-500/30'
                      }`}
                    >
                      {c.is_active ? 'Kullanıcıyı Engelle' : 'Kullanıcı Kilidini Aç'}
                    </button>
                  </td>
                </tr>
              ))}
              {customers.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">Müşteri bulunamadı.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
