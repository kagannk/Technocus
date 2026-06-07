"use client";

import { useState } from 'react';
import { apiFetch } from '@/lib/api';
import toast from 'react-hot-toast';

export default function ReportsPage() {
  const [downloading, setDownloading] = useState(false);

  const downloadReport = async (type: 'sales' | 'tax', format: 'csv' | 'xlsx') => {
    setDownloading(true);
    try {
      const orders = await apiFetch('/api/orders/all');
      if (!orders || orders.length === 0) {
        toast.error("Rapor oluşturmak için veri bulunamadı.");
        setDownloading(false);
        return;
      }

      let fileContent = "";
      let filename = "";

      if (type === 'sales') {
        filename = `technocus_satis_raporu_${Date.now()}`;
        if (format === 'csv') {
          fileContent = "Sipariş ID,Müşteri E-posta,Müşteri Adı,Toplam Tutar (TL),Telefon,Kargo Kodu,Sipariş Durumu,Sipariş Tarihi\n";
          orders.forEach((o: any) => {
            const formattedDate = new Date(o.created_at || Date.now()).toLocaleDateString('tr-TR');
            fileContent += `"${o.id}","${o.user?.email || ''}","${o.user?.full_name || 'İsimsiz'}","${o.total_amount}","${o.phone || ''}","${o.tracking_code || ''}","${o.status}","${formattedDate}"\n`;
          });
        } else {
          // tab-separated Excel-friendly file
          fileContent = "Sipariş ID\tMüşteri E-posta\tMüşteri Adı\tToplam Tutar (TL)\tTelefon\tKargo Kodu\tSipariş Durumu\tSipariş Tarihi\n";
          orders.forEach((o: any) => {
            const formattedDate = new Date(o.created_at || Date.now()).toLocaleDateString('tr-TR');
            fileContent += `${o.id}\t${o.user?.email || ''}\t${o.user?.full_name || 'İsimsiz'}\t${o.total_amount}\t${o.phone || ''}\t${o.tracking_code || ''}\t${o.status}\t${formattedDate}\n`;
          });
        }
      } else {
        filename = `technocus_vergi_muhasebe_${Date.now()}`;
        if (format === 'csv') {
          fileContent = "Sipariş ID,Müşteri,Matrah (KDV'siz Tutar - TL),KDV Oranı (%18),Hesaplanan KDV (TL),Genel Toplam (TL),Ödeme Tarihi\n";
          orders.forEach((o: any) => {
            if (o.status === 'paid' || o.status === 'delivered' || o.status === 'shipped') {
              const formattedDate = new Date(o.created_at || Date.now()).toLocaleDateString('tr-TR');
              const total = parseFloat(o.total_amount);
              const matrah = total / 1.18;
              const kdv = total - matrah;
              fileContent += `"${o.id}","${o.user?.full_name || 'İsimsiz'}","${matrah.toFixed(2)}","18%","${kdv.toFixed(2)}","${total.toFixed(2)}","${formattedDate}"\n`;
            }
          });
        } else {
          fileContent = "Sipariş ID\tMüşteri\tMatrah (KDV'siz Tutar - TL)\tKDV Oranı (%18)\tHesaplanan KDV (TL)\tGenel Toplam (TL)\tÖdeme Tarihi\n";
          orders.forEach((o: any) => {
            if (o.status === 'paid' || o.status === 'delivered' || o.status === 'shipped') {
              const formattedDate = new Date(o.created_at || Date.now()).toLocaleDateString('tr-TR');
              const total = parseFloat(o.total_amount);
              const matrah = total / 1.18;
              const kdv = total - matrah;
              fileContent += `${o.id}\t${o.user?.full_name || 'İsimsiz'}\t${matrah.toFixed(2)}\t18%\t${kdv.toFixed(2)}\t${total.toFixed(2)}\t${formattedDate}\n`;
            }
          });
        }
      }

      // Add UTF-8 BOM so Excel opens Turkish characters correctly
      const blob = new Blob(["\uFEFF" + fileContent], {
        type: format === 'csv' ? 'text/csv;charset=utf-8;' : 'application/vnd.ms-excel;charset=utf-8;'
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `${filename}.${format === 'csv' ? 'csv' : 'xls'}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Rapor başarıyla üretildi ve indirildi.");
    } catch (e) {
      console.error(e);
      toast.error("Rapor oluşturulurken bir hata oluştu.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
           <h1 className="text-2xl font-bold text-white mb-1">Raporlar & Analiz</h1>
           <p className="text-sm text-slate-400">Verileri PDF veya Excel formatlarında hızlıca dışa aktarın.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div 
          onClick={() => downloadReport('sales', 'xlsx')}
          className="bg-navy-800 border border-navy-700 p-8 rounded-xl flex items-center justify-between shadow-lg group hover:border-electric-default/50 transition-colors cursor-pointer"
        >
           <div className="flex-1">
             <h3 className="text-xl font-bold text-white mb-2 group-hover:text-electric-default transition-colors">Aylık Satış Raporu</h3>
             <p className="text-sm text-slate-400 mb-6 leading-relaxed">Son 30 günün tüm sipariş kalemlerini, iadeleri ve kar/zarar analizini barındırır.</p>
             <button 
               disabled={downloading}
               className="text-electric-default text-xs font-bold uppercase tracking-wider hover:bg-electric-default hover:text-white transition-colors border border-electric-default/30 px-5 py-2.5 rounded-lg bg-electric-default/10"
             >
               {downloading ? 'Hazırlanıyor...' : 'Excel İndir (.xls)'}
             </button>
           </div>
           <div className="w-20 h-20 rounded-full bg-electric-default/5 flex items-center justify-center group-hover:scale-110 transition-transform">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-electric-default/70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
           </div>
        </div>

        <div 
          onClick={() => downloadReport('tax', 'csv')}
          className="bg-navy-800 border border-navy-700 p-8 rounded-xl flex items-center justify-between shadow-lg group hover:border-cyan-400/50 transition-colors cursor-pointer"
        >
           <div className="flex-1">
             <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">Vergi & Muhasebe Çıktısı</h3>
             <p className="text-sm text-slate-400 mb-6 leading-relaxed">Paraşüt, Logo gibi E-fatura sistemlerine kolayca entegre edilebilir ham gelir ve KDV verisi.</p>
             <button 
               disabled={downloading}
               className="text-cyan-400 text-xs font-bold uppercase tracking-wider hover:bg-cyan-500 hover:text-white transition-colors border border-cyan-400/30 px-5 py-2.5 rounded-lg bg-cyan-400/10"
             >
               {downloading ? 'Hazırlanıyor...' : 'CSV İndir (.csv)'}
             </button>
           </div>
           <div className="w-20 h-20 rounded-full bg-cyan-400/5 flex items-center justify-center group-hover:scale-110 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-cyan-400/70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
           </div>
        </div>
      </div>
    </div>
  );
}
