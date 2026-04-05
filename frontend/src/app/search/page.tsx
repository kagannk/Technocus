"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";

function SearchResults() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";
  
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!q) return;
    
    let isMounted = true;
    setLoading(true);
    
    apiFetch(`/api/products/search?q=${encodeURIComponent(q)}`)
      .then(data => {
        if (isMounted) setResults(data);
      })
      .catch(err => console.error(err))
      .finally(() => {
        if (isMounted) setLoading(false);
      });
      
    return () => { isMounted = false; };
  }, [q]);

  return (
    <div className="py-8 min-h-[60vh]">
      <div className="mb-8 border-b border-navy-700 pb-6">
        <h1 className="text-3xl font-black text-white">
          Arama Sonuçları
        </h1>
        <p className="text-slate-400 mt-2">
          "<strong className="text-electric-default">{q}</strong>" için {results.length} sonuç bulundu.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => <div key={i} className="h-80 bg-navy-800 animate-pulse rounded-2xl border border-navy-700"></div>)}
        </div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {results.map((prod) => (
            <div key={prod.id} className="bg-navy-800 border border-navy-700 rounded-2xl overflow-hidden hover:border-electric-default/50 transition-all hover:-translate-y-1 shadow-lg group flex flex-col">
              <Link href={`/products/${prod.slug}-${prod.id}`} className="block relative aspect-square bg-white p-4">
                 <img 
                   src={prod.image_urls && prod.image_urls.length > 0 ? prod.image_urls[0] : 'https://placehold.co/400x400/eaeff4/1b243b?text=Technocus'} 
                   alt={prod.name}
                   className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                 />
              </Link>
              <div className="p-5 flex flex-col flex-1">
                <Link href={`/products/${prod.slug}-${prod.id}`} className="font-bold text-lg text-white mb-2 line-clamp-2 hover:text-electric-default transition-colors">
                  {prod.name}
                </Link>
                <p className="text-xs text-slate-400 mb-6 line-clamp-2">{prod.description}</p>
                
                <div className="mt-auto flex items-end justify-between">
                  <span className="text-2xl font-black text-electric-default">₺{prod.price.toLocaleString('tr-TR', {minimumFractionDigits:2})}</span>
                  <button className="w-10 h-10 rounded-xl flex items-center justify-center bg-navy-700 hover:bg-electric-default text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.35 2.7a1 1 0 00.9 1.4h11.5M10 21a2 2 0 100-4 2 2 0 000 4zm7 0a2 2 0 100-4 2 2 0 000 4z" /></svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-navy-800 border border-navy-700 rounded-3xl">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-slate-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <h2 className="text-xl font-bold text-white mb-2">Ürün Bulunamadı</h2>
          <p className="text-slate-400 max-w-md mx-auto">Arama kriterlerinize uygun sonuç bulamadık. Lütfen farklı kelimelerle veya kategori adlarıyla tekrar arama yapmayı deneyin.</p>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="text-white animate-pulse py-20 text-center">Arama sonuçları yükleniyor...</div>}>
      <SearchResults />
    </Suspense>
  );
}
