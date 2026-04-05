"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/useCartStore';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice } = useCartStore();
  const cartTotal = getTotalPrice();
  const router = useRouter();
  
  const handleCheckout = () => {
    if (items.length > 0) {
      router.push('/checkout');
    }
  };

  if (items.length === 0) {
    return (
      <div className="py-20 text-center">
        <div className="w-24 h-24 bg-navy-800 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.35 2.7a1 1 0 00.9 1.4h11.5M10 21a2 2 0 100-4 2 2 0 000 4zm7 0a2 2 0 100-4 2 2 0 000 4z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Sepetiniz Boş</h2>
        <p className="text-slate-400 mb-8">Henüz sepetinize bir ürün eklemediniz.</p>
        <Link href="/products" className="btn-primary px-8 py-3 rounded-xl font-bold">
          Alışverişe Başla
        </Link>
      </div>
    );
  }

  return (
    <div className="py-8">
      <h1 className="text-4xl font-black text-white mb-8">Sepetim</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="bg-navy-800 rounded-2xl p-4 border border-navy-700 flex flex-col md:flex-row items-center gap-6 group hover:border-navy-600 transition-colors">
              <div className="w-24 h-24 bg-white rounded-xl flex-shrink-0 border border-navy-700 p-2 overflow-hidden">
                 <img src={item.image} alt={item.name} className="object-contain w-full h-full" />
              </div>
              <div className="flex-1 min-w-0">
                <Link href={`/products/${item.sku}-${item.id}`} className="text-lg font-bold text-slate-200 hover:text-electric-default transition-colors line-clamp-1">
                  {item.name}
                </Link>
                <div className="text-xs text-slate-500 mt-1 uppercase tracking-wider">SKU: {item.sku}</div>
              </div>
              <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                <div className="flex flex-row items-center bg-navy-900 border border-navy-700 rounded-xl overflow-hidden shadow-inner">
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="px-4 py-2 text-slate-300 hover:text-white hover:bg-navy-800 transition-colors font-bold"
                  >-</button>
                  <div className="w-8 text-center text-white font-bold">{item.quantity}</div>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="px-4 py-2 text-slate-300 hover:text-white hover:bg-navy-800 transition-colors font-bold"
                  >+</button>
                </div>
                <div className="text-xl font-black text-white w-28 text-right">₺{(item.price * item.quantity).toLocaleString('tr-TR', {minimumFractionDigits:2})}</div>
                <button 
                  onClick={() => removeItem(item.id)}
                  className="text-slate-500 hover:text-red-400 p-2 hover:bg-red-500/10 rounded-xl transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="w-full lg:w-96">
          <div className="bg-navy-800 rounded-3xl p-8 border border-navy-700 sticky top-28 shadow-2xl">
            <h2 className="text-xl font-black text-white mb-8 border-b border-navy-700 pb-4">Sipariş Özeti</h2>
            
            <div className="space-y-4 text-slate-400 mb-8">
              <div className="flex justify-between">
                <span>Ara Toplam</span>
                <span className="text-slate-200 font-bold">₺{cartTotal.toLocaleString('tr-TR', {minimumFractionDigits:2})}</span>
              </div>
              <div className="flex justify-between">
                <span>Kargo</span>
                <span className="text-green-400 font-bold">Ücretsiz</span>
              </div>
              <div className="flex justify-between font-black text-white text-2xl pt-6 border-t border-navy-700">
                <span>Toplam</span>
                <span className="text-electric-default">₺{cartTotal.toLocaleString('tr-TR', {minimumFractionDigits:2})}</span>
              </div>
            </div>

            <button 
              onClick={handleCheckout} 
              className="btn-primary w-full py-4 text-lg font-bold shadow-[0_10px_30px_rgba(59,130,246,0.3)] group flex items-center justify-center gap-3 rounded-xl transition-all hover:-translate-y-1"
            >
              <span>Ödemeye Geç</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Iyzico ile %100 Güvenli Ödeme</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
