"use client";

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [trackingCode, setTrackingCode] = useState('');
  
  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await apiFetch('/api/orders/all');
      setOrders(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: number, newStatus: string) => {
    try {
      const res = await apiFetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus, tracking_code: trackingCode || null })
      });
      alert(`Sipariş durumu güncellendi: ${res.status}`);
      setSelectedOrder(null);
      setTrackingCode('');
      loadOrders();
    } catch (e) {
      alert("Hata oluştu.");
    }
  };

  const filteredOrders = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  if (loading) {
    return <div className="h-40 flex items-center justify-center"><div className="w-6 h-6 border-4 border-electric-default border-t-transparent rounded-full animate-spin"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-navy-800 p-6 rounded-xl border border-navy-700 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Gelişmiş Sipariş Yönetimi</h1>
          <p className="text-sm text-slate-400">Sipariş durumlarınızı ve Aras Kargo entegrasyonlarını buradan yönetebilirsiniz.</p>
        </div>
        <select 
          className="bg-navy-900 border border-navy-600 text-white rounded-lg px-4 py-2.5 focus:ring-1 focus:ring-electric-default"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">Filtrele: Tüm Siparişler</option>
          <option value="pending">Beklemede</option>
          <option value="approved">Onaylandı (Hazırlanıyor)</option>
          <option value="shipped">Kargoda</option>
          <option value="delivered">Teslim Edildi</option>
          <option value="cancelled">İptal Edildi</option>
        </select>
      </div>

      <div className="bg-navy-800 rounded-xl border border-navy-700 shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-navy-900 border-b border-navy-700 text-slate-400">
              <tr>
                <th className="p-4 font-semibold uppercase text-xs tracking-wider">Sipariş No</th>
                <th className="p-4 font-semibold uppercase text-xs tracking-wider">Tarih</th>
                <th className="p-4 font-semibold uppercase text-xs tracking-wider">Müşteri</th>
                <th className="p-4 font-semibold uppercase text-xs tracking-wider">Tutar</th>
                <th className="p-4 font-semibold uppercase text-xs tracking-wider">Durum</th>
                <th className="p-4 font-semibold text-right uppercase text-xs tracking-wider">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-700/50">
              {filteredOrders.map(order => (
                <tr key={order.id} className="hover:bg-navy-700/30 transition-colors group">
                  <td className="p-4 font-medium text-white">#{order.id.toString().padStart(6, '0')}</td>
                  <td className="p-4 text-slate-300">{new Date(order.created_at).toLocaleString('tr-TR')}</td>
                  <td className="p-4">
                    <div className="text-white font-bold">{order.user?.full_name || 'İsimsiz Müşteri'}</div>
                    <div className="text-[10px] text-slate-500">{order.user?.email}</div>
                  </td>
                  <td className="p-4 text-electric-default font-black">
                    ₺{order.total_amount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase ${
                      order.status === 'pending' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30 shadow-[0_0_10px_rgba(249,115,22,0.2)]' :
                      order.status === 'approved' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30 shadow-[0_0_10px_rgba(59,130,246,0.2)]' :
                      order.status === 'shipped' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30 shadow-[0_0_10px_rgba(168,85,247,0.2)]' :
                      order.status === 'delivered' ? 'bg-green-500/20 text-green-400 border border-green-500/30 shadow-[0_0_10px_rgba(34,197,94,0.2)]' :
                      'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}>
                      {order.status}
                    </span>
                    {order.tracking_code && <div className="text-[10px] mt-1.5 text-slate-400 font-mono tracking-wider bg-navy-900 px-2 py-0.5 rounded inline-block border border-navy-600">{order.tracking_code}</div>}
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => setSelectedOrder(order)} className="text-white bg-electric-default/20 hover:bg-electric-default px-3 py-1.5 rounded-lg text-sm font-semibold transition-all opacity-0 group-hover:opacity-100 border border-electric-default/40">
                      Yönet
                    </button>
                  </td>
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-12 text-center">
                    <div className="w-16 h-16 bg-navy-700/50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                    </div>
                    <p className="text-slate-400">Hiç sipariş bulunamadı.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedOrder && (
        <div className="fixed inset-y-0 right-0 w-full md:w-[500px] bg-navy-800 shadow-[-10px_0_30px_rgba(0,0,0,0.5)] z-50 transform transition-transform duration-300 flex flex-col border-l border-navy-700">
          <div className="p-6 border-b border-navy-700 flex justify-between items-center bg-navy-900/50 backdrop-blur-md">
            <div>
              <h2 className="text-xl font-bold text-white mb-1">Sipariş Düzenle</h2>
              <p className="text-xs font-mono text-slate-400">#{selectedOrder.id.toString().padStart(6, '0')}</p>
            </div>
            <button onClick={() => {setSelectedOrder(null); setTrackingCode('');}} className="w-8 h-8 rounded-full bg-navy-700 flex items-center justify-center text-slate-400 hover:text-white hover:bg-red-500/20 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          
          <div className="p-6 overflow-y-auto flex-1 space-y-8">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-navy-900/50 p-4 rounded-xl border border-navy-700">
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  Teslimat
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed">{selectedOrder.shipping_address}</p>
              </div>
              <div className="bg-navy-900/50 p-4 rounded-xl border border-navy-700">
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                  Tutar
                </h4>
                <p className="text-2xl font-bold text-electric-default">₺{selectedOrder.total_amount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</p>
                <p className="text-xs text-green-400 mt-1">Ödeme Başarılı</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-white uppercase text-xs tracking-wider">Durum Güncellemesi</h3>
              <div className="grid grid-cols-2 gap-3">
                {['pending', 'approved', 'shipped', 'delivered', 'cancelled'].map(st => (
                  <button 
                    key={st}
                    onClick={() => handleStatusUpdate(selectedOrder.id, st)}
                    className={`px-4 py-3 rounded-lg text-sm font-semibold transition-all border ${
                      selectedOrder.status === st 
                        ? 'bg-electric-default text-white border-electric-default shadow-[0_0_15px_rgba(59,130,246,0.3)]' 
                        : 'bg-navy-900 text-slate-400 border-navy-700 hover:border-electric-default/50 hover:text-white'
                    }`}
                  >
                    {st.toUpperCase()}
                  </button>
                ))}
              </div>
              
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 flex gap-3 text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <p className="text-blue-300/80">Sipariş <strong>Onaylandı</strong> durumuna getirildiğinde sistem otomatik Aras Kargo etiketi üretecektir.</p>
              </div>
            </div>

            <div className="pt-6 border-t border-navy-700">
              <label className="block text-sm font-semibold text-white mb-2 uppercase tracking-wide">
                Kargo Entegrasyonu
              </label>
              <p className="text-xs text-slate-500 mb-4">Takip kodu girildiğinde n8n üzerinden müşteriye otomatik SMS/Email bildirimi gönderilir.</p>
              
              <div className="space-y-3">
                <input 
                  type="text" 
                  className="w-full bg-navy-900 border border-navy-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-electric-default focus:ring-1 focus:ring-electric-default font-mono text-center tracking-widest placeholder:text-slate-600 placeholder:normal-case placeholder:tracking-normal"
                  placeholder="ARAS-XXXXXXX"
                  value={trackingCode || selectedOrder.tracking_code || ''}
                  onChange={(e) => setTrackingCode(e.target.value)}
                />
                <button 
                  onClick={() => handleStatusUpdate(selectedOrder.id, selectedOrder.status)}
                  className="w-full bg-gradient-to-r from-electric-default to-cyan-500 hover:from-electric-hover hover:to-cyan-400 text-white py-3 rounded-lg text-sm font-bold shadow-[0_5px_15px_rgba(0,0,0,0.3)] transition-all transform hover:translate-y-[-1px] flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                  Kaydet ve Bildir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
