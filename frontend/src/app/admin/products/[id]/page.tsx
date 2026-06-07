"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { getStorageItem } from '@/lib/auth';

export default function EditProductPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [product, setProduct] = useState<any>(null);
  const [specs, setSpecs] = useState<{ key: string, value: string }[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const productId = params.id;

  useEffect(() => {
    Promise.all([
      apiFetch('/api/categories/'),
      apiFetch(`/api/products/${productId}`)
    ]).then(([catsData, prodData]) => {
      setCategories(catsData);
      setProduct(prodData);
      setImageUrls(prodData.image_urls || []);
      
      if (prodData.spec_data) {
        const specArr = Object.entries(prodData.spec_data).map(([k, v]) => ({ key: k, value: String(v) }));
        setSpecs(specArr.length > 0 ? specArr : [{ key: '', value: '' }]);
      } else {
        setSpecs([{ key: '', value: '' }]);
      }
      setLoading(false);
    }).catch(err => {
      console.error(err);
      alert("Ürün yüklenemedi!");
      router.back();
    });
  }, [productId, router]);

  // --- Image Upload Logic ---
  const uploadFiles = useCallback(async (filesToUpload: File[]) => {
    if (filesToUpload.length === 0) return;
    setUploading(true);
    setUploadProgress(`0 / ${filesToUpload.length} yükleniyor...`);
    
    const newUrls: string[] = [];
    for (let i = 0; i < filesToUpload.length; i++) {
      const file = filesToUpload[i];
      if (!file.type.startsWith('image/')) continue;
      
      const imageFormData = new FormData();
      imageFormData.append('file', file);
      
      try {
        const token = getStorageItem("token");
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/upload/image`, {
          method: 'POST',
          headers: { "Authorization": `Bearer ${token}` },
          body: imageFormData
        });
        if (res.ok) {
          const data = await res.json();
          newUrls.push(data.url);
        }
      } catch (e) {
        console.error(`Dosya yüklenemedi: ${file.name}`, e);
      }
      setUploadProgress(`${i + 1} / ${filesToUpload.length} yükleniyor...`);
    }
    
    setImageUrls(prev => [...prev, ...newUrls]);
    setUploading(false);
    setUploadProgress(null);
  }, []);

  // Drag & Drop handlers
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    if (droppedFiles.length > 0) {
      uploadFiles(droppedFiles);
    }
  }, [uploadFiles]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      uploadFiles(Array.from(e.target.files));
      e.target.value = '';
    }
  };

  const handleRemoveImage = (index: number) => {
    setImageUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddUrl = () => {
    const url = urlInput.trim();
    if (!url) return;
    try {
      new URL(url);
      setImageUrls(prev => [...prev, url]);
      setUrlInput('');
    } catch {
      alert('Geçerli bir URL girin');
    }
  };

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

      const specData = specs.reduce((acc, curr) => {
        if (curr.key && curr.value) acc[curr.key] = curr.value;
        return acc;
      }, {} as Record<string, string>);

      const productData = {
        name: formData.get('name'),
        sku: product.sku,
        description: formData.get('description'),
        price: parseFloat(formData.get('price') as string),
        stock: parseInt(formData.get('stock') as string),
        category_id: parseInt(formData.get('category_id') as string),
        min_stock_alert: parseInt(formData.get('min_stock_alert') as string) || 5,
        is_active: formData.get('is_active') === 'true',
        spec_data: specData,
        image_urls: imageUrls,
      };

      await apiFetch(`/api/products/${productId}`, {
        method: 'PUT',
        body: JSON.stringify(productData),
      });

      router.push('/admin/products');
    } catch (error: any) {
      console.error("Error updating product:", error);
      alert("Ürün güncellenirken bir hata oluştu: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="text-white text-center py-20">Yükleniyor...</div>;

  return (
    <div className="py-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Ürünü Düzenle: {product.name}</h1>
        <button type="button" onClick={() => router.back()} className="text-slate-400 hover:text-white transition-colors">Geri Dön</button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Temel Bilgiler */}
        <div className="bg-navy-800 rounded-xl p-6 border border-navy-700 shadow-lg space-y-6">
          <h2 className="text-xl font-semibold text-white border-b border-navy-700 pb-2">Temel Bilgiler</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Ürün Adı *</label>
              <input required name="name" type="text" defaultValue={product.name} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">SKU *</label>
              <input required name="sku" type="text" defaultValue={product.sku} className="input-field" disabled title="SKU değiştirilemez" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Açıklama</label>
            <textarea name="description" rows={4} defaultValue={product.description || ''} className="input-field resize-none"></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Fiyat (TL) *</label>
              <input required name="price" type="number" step="0.01" min="0" defaultValue={product.price} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Stok Adedi *</label>
              <input required name="stock" type="number" min="0" defaultValue={product.stock} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Kategori *</label>
              <select required name="category_id" defaultValue={product.category_id} className="input-field">
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Kritik Stok Uyarısı</label>
              <input name="min_stock_alert" type="number" min="0" defaultValue={product.min_stock_alert} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Aktif Mi?</label>
              <select name="is_active" defaultValue={product.is_active ? 'true' : 'false'} className="input-field">
                <option value="true">Aktif</option>
                <option value="false">Pasif</option>
              </select>
            </div>
          </div>
        </div>

        {/* Görseller */}
        <div className="bg-navy-800 rounded-xl p-6 border border-navy-700 shadow-lg space-y-6">
          <div className="flex justify-between items-center border-b border-navy-700 pb-2">
            <h2 className="text-xl font-semibold text-white">Görseller (Cloudinary)</h2>
            <span className="text-xs text-slate-500">{imageUrls.length} görsel</span>
          </div>
          
          {/* Mevcut Görseller Galeri */}
          {imageUrls.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {imageUrls.map((img, i) => (
                <div key={i} className="group relative aspect-square rounded-xl overflow-hidden border-2 border-navy-700 hover:border-electric-default transition-all duration-200 shadow-md">
                  <img src={img} alt={`Ürün görseli ${i + 1}`} className="w-full h-full object-cover" />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-200 flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(i)}
                      className="opacity-0 group-hover:opacity-100 transition-all duration-200 bg-red-500/90 hover:bg-red-600 text-white rounded-full p-2.5 shadow-lg transform scale-75 group-hover:scale-100"
                      title="Görseli Sil"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  {/* Badge */}
                  {i === 0 && (
                    <span className="absolute top-2 left-2 bg-electric-default text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
                      ANA GÖRSEL
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Drag & Drop Zone */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`
              relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300
              ${dragActive 
                ? 'border-electric-default bg-electric-default/10 scale-[1.01] shadow-lg shadow-electric-default/10' 
                : 'border-navy-600 hover:border-slate-500 hover:bg-navy-700/30'
              }
              ${uploading ? 'pointer-events-none opacity-60' : ''}
            `}
          >
            <input 
              ref={fileInputRef}
              type="file" 
              multiple 
              accept="image/*"
              className="hidden"
              onChange={handleFileSelect}
            />
            
            {uploading ? (
              <div className="space-y-3">
                <div className="w-10 h-10 border-4 border-electric-default border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-electric-default font-medium">{uploadProgress}</p>
              </div>
            ) : (
              <>
                <div className={`mx-auto w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 ${dragActive ? 'bg-electric-default/20' : 'bg-navy-700'}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-7 w-7 transition-colors ${dragActive ? 'text-electric-default' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-slate-300 font-medium">
                  Görselleri buraya <span className="text-electric-default">sürükleyip bırakın</span>
                </p>
                <p className="text-slate-500 text-sm mt-1">
                  veya dosya seçmek için tıklayın
                </p>
                <p className="text-slate-600 text-xs mt-3">PNG, JPG, WebP — Maks. 10MB</p>
              </>
            )}
          </div>

          {/* URL ile Ekleme */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">URL ile Görsel Ekle</label>
            <div className="flex gap-3">
              <input 
                type="url" 
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://example.com/gorsel.jpg"
                className="input-field flex-1"
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddUrl())}
              />
              <button 
                type="button" 
                onClick={handleAddUrl}
                disabled={!urlInput.trim()}
                className="px-5 py-2.5 bg-navy-700 hover:bg-navy-600 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg border border-navy-600 transition-all duration-200 text-sm font-medium whitespace-nowrap"
              >
                + Ekle
              </button>
            </div>
          </div>
        </div>

        {/* Teknik Özellikler */}
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
          <button type="submit" disabled={isSubmitting || uploading} className="btn-primary min-w-[150px]">
            {isSubmitting ? 'Güncelleniyor...' : 'Değişiklikleri Kaydet'}
          </button>
        </div>
      </form>
    </div>
  );
}
