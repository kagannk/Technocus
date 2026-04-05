"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
// Mock data since endpoint isn't mapped to user yet.
const MOCK_ORDERS = [
  { id: "1001", date: "15 Ekim 2023", total: 1850.50, status: "Teslim Edildi", items: 3 },
  { id: "1002", date: "24 Kasım 2023", total: 450.00, status: "Kargoda", items: 1 }
];

export default function OrdersPage() {
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [loading, setLoading] = useState(false); // mock

  if (loading) {
    return <div className="text-white animate-pulse">Siparişleriniz yükleniyor...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-black text-white mb-6">Sipariş Geçmişim</h1>
      
      {orders.length === 0 ? (
        <div className="text-center py-12 bg-navy-900 border border-navy-700 rounded-xl">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-slate-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
           <p className="text-slate-400 mb-6">Henüz bir siparişiniz bulunmuyor.</p>
           <Link href="/products" className="btn-primary py-2 px-6 rounded-lg text-sm">Alışverişe Başla</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-navy-900 border border-navy-700 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:border-electric-default/50 transition-colors">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-electric-default font-bold text-lg">TS-{order.id}</span>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${order.status === 'Teslim Edildi' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'}`}>
                    {order.status}
                  </span>
                </div>
                <div className="text-sm text-slate-400 flex items-center gap-4">
                  <span>{order.date}</span>
                  <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                  <span>{order.items} Ürün</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between md:flex-col md:items-end gap-2 border-t md:border-t-0 border-navy-700 pt-4 md:pt-0">
                <span className="text-lg font-black text-white">₺{order.total.toLocaleString('tr-TR', {minimumFractionDigits:2})}</span>
                <button className="text-sm font-semibold text-electric-default hover:text-white transition-colors bg-electric-default/10 px-4 py-1.5 rounded-lg group-hover:bg-electric-default group-hover:text-white">Detayları Gör</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
