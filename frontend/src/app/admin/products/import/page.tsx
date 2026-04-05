"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function BulkImportPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'update' | 'reset'>('update');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<{success: number, errors: number, error_details: string[]} | null>(null);

  const handleDownloadTemplate = () => {
    const headers = ["name", "sku", "description", "price", "stock", "min_stock", "category", "weight_grams", "specifications"];
    const demoRow = ["Arduino Klon", "ARD-K", "Açıklama Test", "150.5", "50", "10", "Geliştirme Kartları", "45", '{"Volt":"5V"}'];
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), demoRow.join(",")].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "technocus_product_import_template.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      alert("Lütfen bir dosya seçin!");
      return;
    }

    if (mode === 'reset') {
      const confirmReset = window.confirm("DİKKAT! Tüm mevcut ürünler veritabanından SİLİNECEK, sonrasında yeni dosyadakiler eklenecek. Emin misiniz?");
      if (!confirmReset) return;
    }

    setIsUploading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("mode", mode);

      const token = localStorage.getItem("token");
      const url = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/products/bulk-import`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData
      });

      const data = await res.json();
      
      if (res.status === 401 || res.status === 403) {
        throw new Error("Oturum süreniz dolmuş veya admin yetkiniz yok. Lütfen çıkış yapıp tekrar giriş yapın.");
      }

      if (!res.ok) {
        throw new Error(data.detail || "Yükleme sırasında sunucu hatası!");
      }

      setResult(data);

      if (data.errors === 0) {
        alert("Ürünler başarıyla yapılandırıldı!");
      }
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Bir hata oluştu.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="py-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Toplu Ürün Yükleme (Excel/CSV)</h1>
        <button type="button" onClick={() => router.back()} className="text-slate-400 hover:text-white transition-colors">Geri Dön</button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6 border-b border-navy-700 pb-2">
        <button 
          onClick={() => setMode('update')}
          className={`pb-2 px-4 transition-colors font-bold ${mode === 'update' ? 'text-electric-default border-b-2 border-electric-default' : 'text-slate-400 hover:text-white'}`}
        >
          Ürün Güncelleme Ekleme (Güvenli)
        </button>
        <button 
          onClick={() => setMode('reset')}
          className={`pb-2 px-4 transition-colors font-bold ${mode === 'reset' ? 'text-red-500 border-b-2 border-red-500' : 'text-slate-400 hover:text-white'}`}
        >
          Baştan Ürün Girme (Mevcut Ürünleri Siler)
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Upload Form */}
        <div className="bg-navy-800 rounded-xl p-6 border border-navy-700 shadow-lg relative overflow-hidden">
          {mode === 'reset' && (
             <div className="absolute top-0 inset-x-0 h-1 bg-red-500"></div>
          )}
          <h2 className="text-xl font-bold text-white mb-4">
            Dosya Yükle <span className="text-slate-400 text-sm font-normal">({mode === 'update' ? 'Güncelle & Ekle' : 'Sıfırla & Baştan Yükle'})</span>
          </h2>
          <p className="text-slate-400 text-sm mb-6">
            Lütfen şablona uygun olarak hazırlanmış `.xlsx` veya `.csv` dosyanızı seçin.
          </p>
          
          <form onSubmit={handleUpload} className="space-y-6">
            <input 
              type="file" 
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-electric-default file:text-white hover:file:bg-electric-hover cursor-pointer border border-navy-700 p-2 rounded-lg"
            />
            
            <button 
              type="submit" 
              disabled={isUploading || !file} 
              className={`w-full py-3 rounded-lg font-bold text-white transition-colors ${
                isUploading || !file ? 'bg-navy-700 text-slate-500 cursor-not-allowed' : 
                mode === 'reset' ? 'bg-red-600 hover:bg-red-700' : 'bg-electric-default hover:bg-electric-hover'
              }`}
            >
              {isUploading ? "Yükleniyor ve İşleniyor..." : (mode === 'update' ? "Güncellemeyi Başlat" : "Veritabanını Sıfırla ve Yükle")}
            </button>
          </form>
        </div>

        {/* Template info */}
        <div className="bg-navy-800 rounded-xl p-6 border border-navy-700 shadow-lg flex flex-col items-start">
          <h2 className="text-xl font-bold text-white mb-4">Örnek Şablon</h2>
          <p className="text-slate-400 text-sm mb-6">
            Verilerinizi hatasız bir şekilde içeri aktarmak için aşağıdaki şablonu kullanabilirsiniz. Sütun isimlerinin tam olarak eşleştiğinden emin olun.
          </p>
          <ul className="text-xs text-slate-500 space-y-2 mb-6 bg-navy-900 p-4 rounded border border-navy-700 w-full h-40 overflow-y-auto">
            <li><strong className="text-slate-300">name:</strong> Gerekli (String)</li>
            <li><strong className="text-slate-300">sku:</strong> Gerekli, Benzersiz (String)</li>
            <li><strong className="text-slate-300">description:</strong> Opsiyonel (String)</li>
            <li><strong className="text-slate-300">price:</strong> Gerekli (Sayı)</li>
            <li><strong className="text-slate-300">stock:</strong> Gerekli (Tamsayı)</li>
            <li><strong className="text-slate-300">min_stock:</strong> Gerekli (Tamsayı)</li>
            <li><strong className="text-slate-300">category:</strong> Gerekli (Kategori Adı - yoksa otomatik oluşturulur)</li>
            <li><strong className="text-slate-300">weight_grams:</strong> Opsiyonel (Sayı)</li>
            <li><strong className="text-slate-300">specifications:</strong> Opsiyonel, geçerli bir JSON olmalıdır. (Örn: {"{"}"Renk": "Kırmızı"{"}"})</li>
          </ul>
          
          <button onClick={handleDownloadTemplate} className="mt-auto btn-secondary text-sm flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            Örnek CSV İndir
          </button>
        </div>
      </div>

      {/* Results Box */}
      {result && (
        <div className={`mt-8 p-6 rounded-xl border ${result.errors > 0 ? 'bg-red-900/10 border-red-900/50' : 'bg-green-900/10 border-green-900/50'}`}>
          <h3 className="text-xl font-bold text-white mb-4">Yükleme Sonucu</h3>
          <div className="flex gap-8 mb-6">
            <div className="flex flex-col">
              <span className="text-green-400 text-3xl font-bold">{result.success}</span>
              <span className="text-slate-400 text-sm">Başarılı Kayıt / Güncelleme</span>
            </div>
            <div className="flex flex-col">
              <span className="text-red-400 text-3xl font-bold">{result.errors}</span>
              <span className="text-slate-400 text-sm">Hatalı Satır</span>
            </div>
          </div>
          
          {result.error_details && result.error_details.length > 0 && (
            <div>
              <h4 className="font-semibold text-slate-300 mb-2">Hata Detayları:</h4>
              <ul className="list-disc pl-5 space-y-1 text-sm text-red-300/80 bg-navy-900/50 p-4 rounded border border-red-900/30 max-h-48 overflow-y-auto">
                {result.error_details.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          )}
          
          {result.success > 0 && (
            <div className="mt-6 flex justify-end">
               <Link href="/admin/products" className="btn-primary text-sm">Ürünleri Görüntüle</Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
