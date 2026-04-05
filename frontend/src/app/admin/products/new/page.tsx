"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';

export default function NewProductPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [specs, setSpecs] = useState([{ key: '', value: '' }]);
  const [files, setFiles] = useState<FileList | null>(null);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    apiFetch('/api/categories/')
      .then(data => setCategories(data))
      .catch(console.error);
  }, []);

  const handleAddSpec = () => {
    setSpecs([...specs, { key: '', value: '' }]);
  };

  const handleSpecChange = (index: number, field: 'key' | 'value', value: string) => {
    const newSpecs = [...specs];
    newSpecs[index][field] = value;
    setSpecs(newSpecs);
  };

  const handleRemoveSpec = (index: number) => {
    setSpecs(specs.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const formData = new FormData(e.currentTarget);
      let imageUrls: string[] = [];

      // 1. Upload Images
      if (files && files.length > 0) {
        const imageFormData = new FormData();
        Array.from(files).forEach(file => {
          imageFormData.append('files', file);
        });

        const token = localStorage.getItem("token");
        const uploadRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/upload/images`, {
          method: 'POST',
          headers: {
            "Authorization": `Bearer ${token}` // token exists for admin
          },
          body: imageFormData
        });

        if (uploadRes.ok) {
          imageUrls = await uploadRes.json();
        } else {
            throw new Error("Görsel yüklenemedi: " + await uploadRes.text());
        }
      }

      // 2. Prepare Product Data
      const specData = specs.reduce((acc, curr) => {
        if (curr.key && curr.value) acc[curr.key] = curr.value;
        return acc;
      }, {} as Record<string, string>);

      const productData = {
        name: formData.get('name'),
        sku: formData.get('sku'),
        description: formData.get('description'),
        price: parseFloat(formData.get('price') as string),
        stock: parseInt(formData.get('stock') as string),
        category_id: parseInt(formData.get('category_id') as string),
        min_stock_alert: 5,
        vat_rate: 20.0,
        is_active: true,
        spec_data: specData,
        image_urls: imageUrls,
      };

      // 3. Create Product
      await apiFetch('/api/products/', {
        method: 'POST',
        body: JSON.stringify(productData),
      });

      router.push('/admin/products');
    } catch (error: any) {
      console.error("Error creating product:", error);
      alert("Ürün eklenirken bir hata oluştu: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Yeni Ürün Ekle</h1>
        <button type="button" onClick={() => router.back()} className="text-slate-400 hover:text-white transition-colors">Geri Dön</button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-navy-800 rounded-xl p-6 border border-navy-700 shadow-lg space-y-6">
          <h2 className="text-xl font-semibold text-white border-b border-navy-700 pb-2">Temel Bilgiler</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Ürün Adı *</label>
              <input required name="name" type="text" className="input-field" placeholder="Örn: Arduino Uno R3" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">SKU *</label>
              <input required name="sku" type="text" className="input-field" placeholder="Örn: ARD-UNO-R3" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Açıklama</label>
            <textarea name="description" rows={4} className="input-field resize-none" placeholder="Ürün detaylı açıklaması..."></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Fiyat (TL) *</label>
              <input required name="price" type="number" step="0.01" min="0" className="input-field" placeholder="0.00" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Stok Adedi *</label>
              <input required name="stock" type="number" min="0" className="input-field" placeholder="0" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Kategori *</label>
              <select required name="category_id" className="input-field">
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="bg-navy-800 rounded-xl p-6 border border-navy-700 shadow-lg space-y-6">
          <h2 className="text-xl font-semibold text-white border-b border-navy-700 pb-2">Görseller (Cloudinary)</h2>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Çoklu Görsel Yükle</label>
            <input 
              type="file" 
              multiple 
              accept="image/*"
              className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-electric-default file:text-white hover:file:bg-electric-hover cursor-pointer" 
              onChange={(e) => setFiles(e.target.files)}
            />
            <p className="mt-2 text-xs text-slate-500">Seçilen görseller otomatik olarak Cloudinary'ye yüklenecektir.</p>
          </div>
        </div>

        <div className="bg-navy-800 rounded-xl p-6 border border-navy-700 shadow-lg space-y-6">
          <div className="flex justify-between items-center border-b border-navy-700 pb-2">
            <h2 className="text-xl font-semibold text-white">Teknik Özellikler</h2>
            <button type="button" onClick={handleAddSpec} className="text-sm font-medium text-electric-default hover:text-white transition-colors bg-electric-default/10 px-3 py-1 rounded"> + Özellik Ekle</button>
          </div>
          
          <div className="space-y-4">
            {specs.map((spec, index) => (
              <div key={index} className="flex gap-4">
                <input 
                  type="text" 
                  placeholder="Örn: Çalışma Gerilimi" 
                  className="input-field flex-1" 
                  value={spec.key}
                  onChange={(e) => handleSpecChange(index, 'key', e.target.value)}
                />
                <input 
                  type="text" 
                  placeholder="Örn: 5V" 
                  className="input-field flex-1" 
                  value={spec.value}
                  onChange={(e) => handleSpecChange(index, 'value', e.target.value)}
                />
                <button type="button" onClick={() => handleRemoveSpec(index)} className="p-3 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors border border-transparent hover:border-red-400/20">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            ))}
            {specs.length === 0 && <p className="text-slate-500 text-sm italic">Henüz özellik eklenmedi.</p>}
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button type="button" onClick={() => router.back()} className="btn-secondary">İptal</button>
          <button type="submit" disabled={isSubmitting} className="btn-primary min-w-[150px]">
            {isSubmitting ? 'Kaydediliyor...' : 'Ürünü Kaydet'}
          </button>
        </div>
      </form>
    </div>
  );
}
