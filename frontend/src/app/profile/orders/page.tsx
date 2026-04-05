"use client";

import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import Link from 'next/link';

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const fetchOrders = async () => {
      try {
        const data = await apiFetch('/api/orders/my-orders');
        setOrders(data);
      } catch (err) {
        console.error("Siparişler yüklenirken hata:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateString));
  };

  if (!isMounted) return null;

  return (
    <div className="py-12">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-black text-white">Siparişlerim</h1>
          <p className="text-slate-400 mt-2">Geçmiş ve güncel siparişlerinizi buradan takip edebilirsiniz.</p>
        </div>
        <Link 
          href="/products" 
          className="bg-navy-800 hover:bg-navy-700 border border-navy-700 text-white px-6 py-2 rounded-xl text-sm font-bold transition-all"
        >
          Alışverişe Devam Et
        </Link>
      </div>

      {loading ? (
        <div className="space-y-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-48 bg-navy-800 animate-pulse rounded-3xl border border-navy-700"></div>
          ))}
        </div>
      ) : orders.length > 0 ? (
        <div className="space-y-8">
          {orders.map((order) => (
            <div key={order.id} className="bg-navy-800 border border-navy-700 rounded-3xl overflow-hidden shadow-xl hover:border-navy-600 transition-all">
              {/* Order Header */}
              <div className="bg-navy-900/50 p-6 md:px-8 border-b border-navy-700 flex flex-wrap items-center justify-between gap-4">
                <div className="flex gap-8">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">Sipariş Tarihi</p>
                    <p className="text-sm text-white font-medium">
                      {formatDate(order.created_at)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">Toplam Tutar</p>
                    <p className="text-sm font-black text-electric-default">₺{order.total_amount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1 text-right">Durum</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      order.status === 'paid' ? 'bg-green-500/10 text-green-500' : 
                      order.status === 'pending' ? 'bg-orange-500/10 text-orange-500' : 
                      'bg-electric-default/10 text-electric-default'
                    }`}>
                      {order.status === 'paid' ? 'Ödendi' : order.status === 'shipped' ? 'Kargoda' : order.status}
                    </span>
                  </div>
                  <div className="h-10 w-px bg-navy-700"></div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">Sipariş No</p>
                    <p className="text-xs text-white family-mono">#TS-{order.id.toString().padStart(6, '0')}</p>
                  </div>
                </div>
              </div>

              {/* Order Content */}
              <div className="p-6 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="md:col-span-2 space-y-4">
                    {order.items.map((item: any) => (
                      <div key={item.id} className="flex items-center gap-4 p-3 bg-navy-900/30 rounded-2xl border border-navy-700/50">
                        <div className="w-16 h-16 bg-white rounded-xl overflow-hidden flex-shrink-0 p-1">
                          <img 
                            src={item.product?.image_urls?.[0] || 'https://placehold.co/100x100/eaeff4/1b243b?text=Product'} 
                            alt={item.product?.name} 
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="flex-1">
                          <Link href={`/products/${item.product?.slug}-${item.product?.id}`} className="text-white font-bold hover:text-electric-default transition-all line-clamp-1">
                            {item.product?.name}
                          </Link>
                          <p className="text-xs text-slate-400 mt-1">{item.quantity} Adet • ₺{item.price_at_purchase.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Tracking Widget */}
                  <div className="bg-navy-900 rounded-3xl p-6 border border-navy-700 flex flex-col justify-center">
                    {order.tracking_code ? (
                      <>
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 bg-electric-default/10 rounded-xl flex items-center justify-center">
                            <svg className="w-6 h-6 text-electric-default" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-400">Kargo Takip</p>
                            <p className="text-sm font-black text-white">Aras Kargo</p>
                          </div>
                        </div>
                        <p className="text-xs text-slate-500 mb-4 font-mono select-all bg-navy-950 p-2 rounded-lg border border-navy-800 text-center">
                          {order.tracking_code}
                        </p>
                        <a 
                          href="#" 
                          className="w-full bg-navy-800 hover:bg-navy-700 text-white text-xs font-bold py-3 rounded-xl text-center transition-all border border-navy-700 shadow-sm"
                        >
                          Kargom Nerede?
                        </a>
                      </>
                    ) : (
                      <div className="text-center py-4 text-slate-500">
                        <p className="text-sm font-medium italic">Kargo bilgisi henüz oluşturulmadı.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-navy-800 border border-navy-700 rounded-[2.5rem] p-16 text-center shadow-2xl">
          <div className="w-24 h-24 bg-navy-900 rounded-full flex items-center justify-center mx-auto mb-8 border border-navy-700">
            <svg className="w-12 h-12 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-black text-white mb-4">Henüz bir siparişiniz yok</h2>
          <p className="text-slate-400 max-w-sm mx-auto mb-10">Harika projeleriniz için ilk siparişinizi vermeye ne dersiniz?</p>
          <Link 
            href="/products" 
            className="inline-block bg-electric-default hover:bg-electric-hover text-white font-bold px-10 py-4 rounded-2xl shadow-[0_10px_30px_rgba(59,130,246,0.3)] transition-all"
          >
            Ürünleri İncele
          </Link>
        </div>
      )}
    </div>
  );
}
