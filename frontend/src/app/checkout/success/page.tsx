"use client";
import Link from 'next/link';
import { useEffect } from 'react';
import { useCart } from '@/hooks/useCart';

export default function CheckoutSuccessPage() {
  const { clearCart } = useCart();

  useEffect(() => {
    // Extra safety to ensure cart is empty when reaching this page
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-navy-800 p-10 rounded-3xl border border-navy-700 shadow-2xl text-center">
        <div>
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-500/10 mb-6">
            <svg className="h-10 w-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h2 className="mt-6 text-center text-3xl font-black text-white">Siparişiniz Başarıyla Alındı!</h2>
          <p className="mt-4 text-center text-slate-400 text-lg">
            Sipariş detaylarınızı ve faturanızı e-posta adresinize ileteceğiz. Bizi tercih ettiğiniz için teşekkür ederiz!
          </p>
        </div>
        
        <div className="pt-8 border-t border-navy-700">
          <div className="flex flex-col space-y-4">
            <Link 
              href="/products" 
              className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-electric-default hover:bg-electric-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-electric-default transition-all shadow-lg"
            >
              Alışverişe Devam Et
              <svg className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </Link>
          </div>
          <p className="mt-6 text-xs text-slate-500 italic">
            Sipariş no: #TS-{Math.floor(Math.random() * 900000) + 100000}
          </p>
        </div>
      </div>
    </div>
  );
}
