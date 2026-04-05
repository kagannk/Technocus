"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-20 px-4">
      <div className="max-w-2xl w-full text-center space-y-8 animate-in fade-in zoom-in duration-700">
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-electric-default/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="relative w-24 h-24 bg-electric-default rounded-full flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(59,130,246,0.5)] border-4 border-navy-900">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-5xl font-black text-white tracking-tight">
            Siparişiniz Tamamlandı!
          </h1>
          <p className="text-xl text-slate-400 font-medium">
            Technocus&apos;u tercih ettiğiniz için teşekkür ederiz.
          </p>
        </div>

        <div className="bg-navy-800/50 backdrop-blur-xl border border-navy-700 rounded-3xl p-10 shadow-2xl space-y-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-electric-default/5 rounded-full -mr-16 -mt-16 blur-2xl transition-all group-hover:bg-electric-default/10"></div>

          <div className="flex flex-col items-center gap-2">
            <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Sipariş Numarası</span>
            <span className="text-3xl font-black text-electric-default tabular-nums">
              #{orderId?.toString().padStart(6, "0")}
            </span>
          </div>

          <div className="pt-6 border-t border-navy-700 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/account/orders"
              className="px-8 py-4 bg-navy-700 hover:bg-navy-600 text-white font-bold rounded-2xl transition-all border border-navy-600"
            >
              Siparişimi Takip Et
            </Link>
            <Link
              href="/"
              className="px-8 py-4 bg-electric-default hover:bg-electric-hover text-white font-bold rounded-2xl shadow-[0_10px_30px_rgba(59,130,246,0.3)] transition-all"
            >
              Alışverişe Devam Et
            </Link>
          </div>
        </div>

        <p className="text-sm text-slate-500">
          Sipariş detaylarınız e-posta adresinize gönderilmiştir.
        </p>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-electric-default border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <OrderConfirmationContent />
    </Suspense>
  );
}
