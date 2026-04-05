"use client";

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import toast from 'react-hot-toast';

export default function AdminShipping() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('to_ship'); // to_ship, shipped
  
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

  const handleUpdate = async (orderId: number, status: string, trackingCode?: string) => {
    try {
      await apiFetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status, tracking_code: trackingCode })
      });
      toast.success("Sipariş güncellendi");
      loadOrders();
    } catch (e) {
      toast.error("Hata oluştu");
    }
  };

  const filteredOrders = orders.filter(o => {
    if (filter === 'to_ship') return ['pending', 'approved'].includes(o.status);
    if (filter === 'shipped') return o.status === 'shipped';
    return true;
  });

  if (loading) {
    return <div className="h-40 flex items-center justify-center"><div className="w-6 h-6 border-4 border-electric-default border-t-transparent rounded-full animate-spin"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-navy-800 p-6 rounded-xl border border-navy-700 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Kargo Yönetimi</h1>
          <p className="text-sm text-slate-400">Sevkiyat bekleyen ve yoldaki siparişlerin takibi.</p>
        </div>
        <div className="flex bg-navy-900 p-1 rounded-lg border border-navy-700">
           <button 
             onClick={() => setFilter('to_ship')}
             className={`px-4 py-2 rounded-md text-xs font-bold transition-all ${filter === 'to_ship' ? 'bg-electric-default text-white' : 'text-slate-400 hover:text-white'}`}
           >
             Sevkiyat Bekleyenler
           </button>
           <button 
             onClick={() => setFilter('shipped')}
             className={`px-4 py-2 rounded-md text-xs font-bold transition-all ${filter === 'shipped' ? 'bg-electric-default text-white' : 'text-slate-400 hover:text-white'}`}
           >
             Yoldakiler
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filteredOrders.length > 0 ? filteredOrders.map(order => (
          <div key={order.id} className="bg-navy-800 border border-navy-700 rounded-2xl overflow-hidden hover:border-navy-600 transition-all shadow-lg">
            <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 md:items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-mono text-slate-500">#{order.id.toString().padStart(6, '0')}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                    order.status === 'pending' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' : 
                    order.status === 'shipped' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                    'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                  }`}>
                    {order.status}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-1">{order.user?.full_name || 'İsimsiz Müşteri'}</h3>
                <p className="text-sm text-slate-400 line-clamp-1">{order.shipping_address}</p>
                <div className="mt-4 flex gap-4">
                   <div className="text-xs"><span className="text-slate-500">Tutar:</span> <span className="text-electric-default font-bold">₺{order.total_amount.toLocaleString('tr-TR')}</span></div>
                   <div className="text-xs"><span className="text-slate-500">Telefon:</span> <span className="text-white font-medium">{order.phone || 'Girilmedi'}</span></div>
                </div>
              </div>

              <div className="w-full md:w-auto flex flex-col gap-4">
                 <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Takip No"
                      defaultValue={order.tracking_code || ''}
                      className="bg-navy-900 border border-navy-700 rounded-lg px-4 py-2 text-sm text-white focus:border-electric-default outline-none font-mono"
                      onBlur={(e) => {
                        if (e.target.value !== order.tracking_code) {
                          handleUpdate(order.id, order.status, e.target.value);
                        }
                      }}
                    />
                    {order.status === 'approved' && (
                      <button 
                        onClick={() => handleUpdate(order.id, 'shipped')}
                        className="bg-electric-default hover:bg-electric-hover text-white text-xs font-bold px-4 py-2 rounded-lg transition-all flex items-center gap-2 whitespace-nowrap"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        Kargoya Ver
                      </button>
                    )}
                    {order.status === 'shipped' && (
                      <button 
                        onClick={() => handleUpdate(order.id, 'delivered')}
                        className="bg-green-600 hover:bg-green-500 text-white text-xs font-bold px-4 py-2 rounded-lg transition-all flex items-center gap-2 whitespace-nowrap"
                      >
                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                         Teslim Edildi
                      </button>
                    )}
                    {order.status === 'pending' && (
                       <button 
                         onClick={() => handleUpdate(order.id, 'approved')}
                         className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-lg transition-all whitespace-nowrap"
                       >
                         Onayla
                       </button>
                    )}
                 </div>
                 {order.tracking_code && (
                   <div className="text-[10px] text-slate-500 italic text-right">
                     Kargo etiketi oluşturuldu: {order.tracking_code}
                   </div>
                 )}
              </div>
            </div>
            
            {/* Quick Item View */}
            <div className="bg-navy-900/30 px-6 py-4 border-t border-navy-700/50 flex flex-wrap gap-4">
               {order.items?.map((item: any) => (
                 <div key={item.id} className="flex items-center gap-2 bg-navy-900/50 px-3 py-1.5 rounded-xl border border-navy-700/30">
                    <img src={item.product?.image_urls?.[0]} className="w-6 h-6 rounded-md object-cover bg-white p-0.5" alt="" />
                    <span className="text-[10px] font-bold text-white whitespace-nowrap">{item.quantity}x {item.product?.name}</span>
                 </div>
               ))}
            </div>
          </div>
        )) : (
          <div className="bg-navy-800 border border-navy-700 rounded-3xl p-20 text-center">
            <p className="text-slate-500 text-lg font-medium italic">Kargo işlemi bekleyen sipariş bulunamadı.</p>
          </div>
        )}
      </div>
    </div>
  );
}
