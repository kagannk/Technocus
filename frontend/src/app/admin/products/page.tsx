"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/api/products/").then(data => {
      setProducts(data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  return (
    <div className="py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Ürün Yönetimi</h1>
        <div className="flex gap-4">
          <Link href="/admin/products/import" className="btn-secondary whitespace-nowrap">Toplu İçe Aktar (Excel/CSV)</Link>
          <Link href="/admin/products/new" className="btn-primary whitespace-nowrap">Yeni Ürün Ekle</Link>
        </div>
      </div>
      
      <div className="bg-navy-800 rounded-xl border border-navy-700 overflow-hidden shadow-lg">
        <div className="p-4 border-b border-navy-700 flex flex-col md:flex-row gap-4 bg-navy-900/50">
          <input type="text" placeholder="Ürün adı veya SKU ara..." className="input-field max-w-sm" />
          <select className="input-field max-w-xs cursor-pointer">
            <option>Tüm Kategoriler</option>
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-navy-800/80 text-slate-400 uppercase text-xs">
              <tr>
                <th className="px-6 py-4 font-medium">Görsel & Ürün Adı</th>
                <th className="px-6 py-4 font-medium">SKU</th>
                <th className="px-6 py-4 font-medium">Kategori</th>
                <th className="px-6 py-4 font-medium">Fiyat</th>
                <th className="px-6 py-4 font-medium">Stok</th>
                <th className="px-6 py-4 font-medium text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-700">
              {loading ? (
                <tr><td colSpan={6} className="p-8 text-center text-slate-500">Katalog Yükleniyor...</td></tr>
              ) : products.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-slate-500">Sistemde kayıtlı ürün bulunamadı.</td></tr>
              ) : products.map((prod) => (
                <tr key={prod.id} className="hover:bg-navy-700/30 transition-colors text-slate-300">
                  <td className="px-6 py-4 font-medium text-white flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-lg border border-navy-700 flex items-center justify-center overflow-hidden p-1 flex-shrink-0">
                      <img 
                         src={prod.image_urls && prod.image_urls.length > 0 ? prod.image_urls[0] : 'https://placehold.co/400x400/eaeff4/1b243b?text=Tech'} 
                         alt={prod.name}
                         className="w-full h-full object-contain"
                       />
                    </div>
                    <div className="line-clamp-2 max-w-xs" title={prod.name}>{prod.name}</div>
                  </td>
                  <td className="px-6 py-4 text-xs font-mono text-slate-400">{prod.sku}</td>
                  <td className="px-6 py-4 text-slate-400 text-xs font-semibold">{prod.category?.name || 'Kategorisiz'}</td>
                  <td className="px-6 py-4 font-bold text-electric-default text-base">₺{prod.price.toLocaleString('tr-TR', {minimumFractionDigits:2})}</td>
                  <td className="px-6 py-4">
                    {prod.stock <= prod.min_stock_alert ? 
                      <span className="text-red-400 font-bold bg-red-400/10 border border-red-500/20 px-3 py-1 rounded shadow-sm">{prod.stock} (Kritik)</span> : 
                      <span className="text-green-400 font-semibold bg-green-400/10 border border-green-500/20 px-3 py-1 rounded shadow-sm">{prod.stock}</span>}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-3 text-slate-400">
                      <button className="hover:text-electric-default transition-colors p-1" title="Düzenle">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      </button>
                      <button className="hover:text-red-400 transition-colors p-1" title="Sil">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
