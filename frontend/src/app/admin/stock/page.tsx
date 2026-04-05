"use client";

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';

export default function AdminStock() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/api/products/').then(data => {
      setProducts(data);
      setLoading(false);
    }).catch(console.error);
  }, []);

  if (loading) {
    return <div className="h-40 flex items-center justify-center"><div className="w-6 h-6 border-4 border-electric-default border-t-transparent rounded-full animate-spin"></div></div>;
  }

  const criticalCount = products.filter(p => p.stock <= p.min_stock_alert).length;
  const totalStock = products.reduce((acc, curr) => acc + curr.stock, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-navy-800 p-6 rounded-xl border border-navy-700 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
          </div>
          <div>
            <p className="text-slate-400 text-sm font-medium">Toplam Ürün Çeşidi</p>
            <h3 className="text-2xl font-bold text-white">{products.length}</h3>
          </div>
        </div>
        <div className="bg-navy-800 p-6 rounded-xl border border-navy-700 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
          </div>
          <div>
            <p className="text-slate-400 text-sm font-medium">Kasadaki Toplam Stok</p>
            <h3 className="text-2xl font-bold text-white">{totalStock}</h3>
          </div>
        </div>
        <div className="bg-navy-800 p-6 rounded-xl border border-navy-700 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          </div>
          <div>
            <p className="text-slate-400 text-sm font-medium">Kritik Stok Uyarıları</p>
            <h3 className="text-2xl font-bold text-red-400">{criticalCount} <span className="text-sm font-normal text-slate-500">ürün uyarı veriyor</span></h3>
          </div>
        </div>
      </div>

      <div className="bg-navy-800 rounded-xl border border-navy-700 shadow-lg overflow-hidden">
        <div className="p-6 border-b border-navy-700 flex justify-between items-center">
          <h2 className="text-lg font-bold text-white">Detaylı Stok Durumu</h2>
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 shadow-[0_0_10px_rgba(22,163,74,0.3)]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            Excel ile Toplu Güncelle
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-navy-900 border-b border-navy-700 text-slate-400">
              <tr>
                <th className="p-4 font-semibold uppercase text-xs tracking-wider">Ürün Bilgisi</th>
                <th className="p-4 font-semibold uppercase text-xs tracking-wider">SKU</th>
                <th className="p-4 font-semibold text-right uppercase text-xs tracking-wider">Mevcut Stok</th>
                <th className="p-4 font-semibold text-right uppercase text-xs tracking-wider">Kritik Eşik</th>
                <th className="p-4 font-semibold text-center uppercase text-xs tracking-wider">Uyarı / Durum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-700/50">
              {products.map(p => {
                const isCritical = p.stock <= p.min_stock_alert;
                return (
                  <tr key={p.id} className={`transition-colors ${isCritical ? 'bg-red-500/5 hover:bg-red-500/10' : 'hover:bg-navy-700/30'}`}>
                    <td className="p-4 font-medium text-white flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${isCritical ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,1)]' : 'bg-green-500'}`}></div>
                      {p.name}
                    </td>
                    <td className="p-4 text-slate-400 font-mono text-xs">{p.sku}</td>
                    <td className={`p-4 text-right font-bold ${isCritical ? 'text-red-400 text-lg' : 'text-white'}`}>{p.stock}</td>
                    <td className="p-4 text-right text-slate-500">{p.min_stock_alert}</td>
                    <td className="p-4 text-center">
                      {isCritical ? (
                        <span className="px-3 py-1 bg-red-600 border border-red-500 text-white rounded text-xs font-bold tracking-wide shadow-[0_0_10px_rgba(220,38,38,0.5)]">KRİTİK SEVİYE</span>
                      ) : (
                        <span className="px-3 py-1 bg-navy-900 border border-green-500/30 text-green-400 rounded text-xs font-medium">Stok Yeterli</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
