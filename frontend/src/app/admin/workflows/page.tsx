"use client";
export default function WorkflowsPage() {
  return (
    <div className="space-y-6">
      <div className="mb-8 flex justify-between items-center">
        <div>
           <h1 className="text-2xl font-bold text-white mb-1">n8n İş Akışları (Webhooks)</h1>
           <p className="text-sm text-slate-400">Sistem olaylarını dinleyen aktif otomasyon süreçleri.</p>
        </div>
        <button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-2.5 px-5 rounded-lg transition-all shadow-[0_5px_15px_rgba(147,51,234,0.3)] transform hover:-translate-y-0.5 flex items-center gap-2">
           İş Akışı Tasarımcısına Git
           <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
        </button>
      </div>

      <div className="bg-navy-800 rounded-xl border border-navy-700 shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-navy-900 border-b border-navy-700 text-slate-400">
              <tr>
                <th className="p-5 font-semibold uppercase text-xs tracking-wider border-r border-navy-700/50">Olay İçi Tetikleyici</th>
                <th className="p-5 font-semibold uppercase text-xs tracking-wider border-r border-navy-700/50">Webhook Endpoint (Internal)</th>
                <th className="p-5 font-semibold uppercase text-xs tracking-wider border-r border-navy-700/50">Hedef / Aksiyon</th>
                <th className="p-5 font-semibold uppercase text-xs tracking-wider text-center">Durum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-700/50 text-slate-300">
              <tr className="hover:bg-navy-700/30 transition-colors">
                <td className="p-5 border-r border-navy-700/50">
                   <div className="font-bold text-white">Yeni Sipariş Oluşturuldu</div>
                   <div className="text-slate-500 font-mono text-[10px] mt-1 tracking-widest bg-navy-900 inline-block px-1.5 py-0.5 rounded border border-navy-600">ORDER.CREATED</div>
                </td>
                <td className="p-5 font-mono text-xs text-electric-default border-r border-navy-700/50">http://n8n:5678/webhook/order_created</td>
                <td className="p-5 font-medium border-r border-navy-700/50">Admin Email Bildirimi Gönder (SMTP)</td>
                <td className="p-5 text-center"><span className="px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-[10px] tracking-widest font-bold border border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.15)] flex items-center justify-center gap-1.5 w-max mx-auto"><div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div> DİNLENİYOR</span></td>
              </tr>
              <tr className="hover:bg-navy-700/30 transition-colors">
                <td className="p-5 border-r border-navy-700/50">
                   <div className="font-bold text-white">Kritik Stok Uyarısı</div>
                   <div className="text-slate-500 font-mono text-[10px] mt-1 tracking-widest bg-navy-900 inline-block px-1.5 py-0.5 rounded border border-navy-600">STOCK.LOW</div>
                </td>
                <td className="p-5 font-mono text-xs text-electric-default border-r border-navy-700/50">http://n8n:5678/webhook/low_stock</td>
                <td className="p-5 font-medium border-r border-navy-700/50">Tedarikçi Otomatik Sipariş Maili İlet</td>
                <td className="p-5 text-center"><span className="px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-[10px] tracking-widest font-bold border border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.15)] flex items-center justify-center gap-1.5 w-max mx-auto"><div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div> DİNLENİYOR</span></td>
              </tr>
              <tr className="hover:bg-navy-700/30 transition-colors">
                <td className="p-5 border-r border-navy-700/50">
                   <div className="font-bold text-white">Sipariş Onaylandı</div>
                   <div className="text-slate-500 font-mono text-[10px] mt-1 tracking-widest bg-navy-900 inline-block px-1.5 py-0.5 rounded border border-navy-600">ORDER.APPROVED</div>
                </td>
                <td className="p-5 font-mono text-xs text-electric-default border-r border-navy-700/50">http://n8n:5678/webhook/order_approved</td>
                <td className="p-5 font-medium border-r border-navy-700/50">Müşteriye Sipariş Fatura Gönderimi + Hazırlık Aşamasında E-Postası</td>
                <td className="p-5 text-center"><span className="px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-[10px] tracking-widest font-bold border border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.15)] flex items-center justify-center gap-1.5 w-max mx-auto"><div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div> DİNLENİYOR</span></td>
              </tr>
              <tr className="hover:bg-navy-700/30 transition-colors">
                <td className="p-5 border-r border-navy-700/50">
                   <div className="font-bold text-white">Kargo Takip Bilgisi Girildi</div>
                   <div className="text-slate-500 font-mono text-[10px] mt-1 tracking-widest bg-navy-900 inline-block px-1.5 py-0.5 rounded border border-navy-600">SHIPPING.TRACKED</div>
                </td>
                <td className="p-5 font-mono text-xs text-electric-default border-r border-navy-700/50">http://n8n:5678/webhook/tracking_updated</td>
                <td className="p-5 font-medium border-r border-navy-700/50">Müşteriye Twilio Üzerinden SMS İle "Siparişiniz kargoya verildi. Takip Kodu: XYZ" Bildirimi</td>
                <td className="p-5 text-center"><span className="px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-[10px] tracking-widest font-bold border border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.15)] flex items-center justify-center gap-1.5 w-max mx-auto"><div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div> DİNLENİYOR</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
