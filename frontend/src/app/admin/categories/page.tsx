"use client";

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';

export default function AdminCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await apiFetch('/api/categories/');
      setCategories(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiFetch('/api/categories/', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      setIsModalOpen(false);
      setFormData({ name: '', description: '' });
      loadCategories();
    } catch (e: any) {
      alert(e.message || "Hata oluştu");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Kategoriyi silmek istediğinize emin misiniz?")) return;
    try {
      await apiFetch(`/api/categories/${id}`, { method: 'DELETE' });
      loadCategories();
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
           <h1 className="text-2xl font-bold text-white mb-1">Kategori Yönetimi</h1>
           <p className="text-sm text-slate-400">Sitede gösterilecek ürün kategorilerini ekleyin veya silin.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-electric-default hover:bg-electric-hover text-white font-bold py-2.5 px-5 rounded-lg shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
          Yeni Kategori Ekle
        </button>
      </div>

      <div className="bg-navy-800 rounded-xl border border-navy-700 shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-navy-900 border-b border-navy-700 text-slate-400">
              <tr>
                <th className="p-4 font-semibold uppercase text-xs tracking-wider">Kategori ID</th>
                <th className="p-4 font-semibold uppercase text-xs tracking-wider">Kategori Adı</th>
                <th className="p-4 font-semibold uppercase text-xs tracking-wider">URL Slug</th>
                <th className="p-4 font-semibold uppercase text-xs tracking-wider text-right">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-700/50">
              {categories.map(c => (
                <tr key={c.id} className="hover:bg-navy-700/30 transition-colors">
                  <td className="p-4 font-mono text-slate-500 text-xs">#{c.id.toString().padStart(4, '0')}</td>
                  <td className="p-4 font-medium text-white">{c.name}</td>
                  <td className="p-4 font-mono text-electric-default text-xs">{c.slug}</td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleDelete(c.id)} className="text-red-400 hover:bg-red-500/20 p-2 rounded-lg transition-colors border border-transparent hover:border-red-500/30">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-12 text-center text-slate-500">
                    <div className="w-16 h-16 border-2 border-dashed border-navy-600 rounded-full flex flex-col items-center justify-center mx-auto mb-4 text-slate-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                    </div>
                    Sisteme henüz hiç kategori eklenmemiş.
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
              <h2 className="text-xl font-bold text-white">Yeni Kategori Oluştur</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white bg-navy-700 p-1.5 rounded-full transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <form onSubmit={handleCreate} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Kategori Adı</label>
                <input required type="text" className="w-full bg-navy-900 border border-navy-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-electric-default focus:ring-1 focus:ring-electric-default" placeholder="Arduino Modülleri" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Açıklama (Opsiyonel)</label>
                <textarea className="w-full bg-navy-900 border border-navy-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-electric-default focus:ring-1 focus:ring-electric-default resize-none" rows={3} placeholder="Kategori ile ilgili kısa bilgi..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-navy-700 hover:bg-navy-600 text-white font-medium py-3 rounded-lg transition-colors border border-navy-600">İptal</button>
                <button type="submit" className="flex-1 bg-gradient-to-r from-electric-default to-cyan-500 hover:from-electric-hover hover:to-cyan-400 text-white font-bold py-3 rounded-lg shadow-[0_5px_15px_rgba(59,130,246,0.4)] transition-all">Oluştur</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
