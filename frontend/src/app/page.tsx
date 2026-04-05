"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { useCartStore } from "@/store/useCartStore";
import toast from "react-hot-toast";

export default function Home() {
  const [categories, setCategories] = useState<any[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCartStore();

  useEffect(() => {
// ... (lines 11-28 remain same basically)
    async function loadData() {
      try {
        const [cats, prods] = await Promise.all([
          apiFetch("/api/categories/"),
          apiFetch("/api/products/")
        ]);
        setCategories(cats.slice(0, 4)); // Only top 4 categories
        setFeaturedProducts(prods.slice(0, 8)); // Top 8 newest products
      } catch (error) {
        console.error("Data loading error:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-24 pb-16">
      {/* 1. Animated Hero Section */}
      <section className="relative rounded-3xl bg-gradient-to-br from-navy-900 via-navy-800 to-indigo-950 border border-navy-700 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] mt-8">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-30 mix-blend-overlay"></div>
        {/* Animated Glow Elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-electric-default/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4 animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        <div className="relative z-10 p-8 md:p-16 lg:py-24 lg:w-3/4">
          <span className="inline-block py-1 px-3 rounded-full bg-electric-default/10 border border-electric-default/30 text-electric-default text-sm font-bold tracking-widest uppercase mb-6 shadow-sm">
            YENİ PROJELER İÇİN
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-[1.1] tracking-tight">
            Hayalindeki Projeyi <br/>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-electric-default via-cyan-400 to-purple-500 animate-gradient-x">Gerçeğe Dönüştür.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl leading-relaxed">
            Arduino, Raspberry Pi, endüstriyel sensörler ve maker malzemelerinde Türkiye'nin en büyük donanım kütüphanesi.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/products" className="bg-electric-default hover:bg-electric-hover text-white text-lg font-bold px-8 py-4 rounded-xl shadow-[0_10px_30px_rgba(59,130,246,0.4)] transition-all transform hover:-translate-y-1">
              Hemen Keşfet
            </Link>
            <Link href="/categories" className="bg-navy-800/80 hover:bg-navy-700 border border-navy-600 text-white text-lg font-bold px-8 py-4 rounded-xl backdrop-blur-sm transition-all transform hover:-translate-y-1">
              Kategoriler
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Neden Biz? (Why Us Section) */}
      <section className="py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-navy-800/50 border border-navy-700 p-6 rounded-2xl flex items-center gap-4">
            <div className="w-14 h-14 bg-electric-default/10 rounded-xl flex items-center justify-center shrink-0">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-electric-default" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
            </div>
            <div>
              <h4 className="font-bold text-white text-lg">Aynı Gün Kargo</h4>
              <p className="text-sm text-slate-400">16:00'a kadar olan siparişlerinizde.</p>
            </div>
          </div>
          <div className="bg-navy-800/50 border border-navy-700 p-6 rounded-2xl flex items-center gap-4">
            <div className="w-14 h-14 bg-green-500/10 rounded-xl flex items-center justify-center shrink-0">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            </div>
            <div>
              <h4 className="font-bold text-white text-lg">%100 Güvenli Ödeme</h4>
              <p className="text-sm text-slate-400">256-bit SSL Iyzico altyapısı.</p>
            </div>
          </div>
          <div className="bg-navy-800/50 border border-navy-700 p-6 rounded-2xl flex items-center gap-4">
            <div className="w-14 h-14 bg-purple-500/10 rounded-xl flex items-center justify-center shrink-0">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <div>
              <h4 className="font-bold text-white text-lg">Hızlı İade</h4>
              <p className="text-sm text-slate-400">Koşulsuz ve sorunsuz 14 gün iade.</p>
            </div>
          </div>
          <div className="bg-navy-800/50 border border-navy-700 p-6 rounded-2xl flex items-center gap-4">
            <div className="w-14 h-14 bg-orange-500/10 rounded-xl flex items-center justify-center shrink-0">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            </div>
            <div>
              <h4 className="font-bold text-white text-lg">Teknik Destek</h4>
              <p className="text-sm text-slate-400">Projenizde tıkandığınızda yanınızdayız.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Popüler Kategoriler */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-white">Popüler Kategoriler</h2>
          <Link href="/categories" className="text-electric-default hover:text-white font-bold transition-colors">Tüm Kategoriler &rarr;</Link>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[1,2,3,4].map(i => <div key={i} className="h-32 bg-navy-800 animate-pulse rounded-2xl border border-navy-700"></div>)}
          </div>
        ) : categories.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <Link href={`/categories/${cat.slug}`} key={cat.id} className="bg-navy-800 hover:bg-navy-700 border border-navy-700 hover:border-electric-default/50 transition-all rounded-2xl p-6 text-center group cursor-pointer">
                <div className="w-16 h-16 mx-auto bg-navy-900 rounded-full flex items-center justify-center mb-4 transition-transform group-hover:scale-110 shadow-inner">
                  <span className="text-electric-default text-3xl font-black">{cat.name.charAt(0)}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-200 group-hover:text-white transition-colors">{cat.name}</h3>
                <p className="text-xs text-slate-500 mt-2">Daha fazla gör</p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-navy-800 p-8 text-center rounded-xl text-slate-500">Kategori verisi bulunamadı.</div>
        )}
      </section>

      {/* 4. Kampanya Banner */}
      <section>
        <div className="rounded-3xl bg-gradient-to-r from-purple-900 to-indigo-900 border border-purple-700/50 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between shadow-2xl relative overflow-hidden">
           <div className="absolute right-0 top-0 opacity-10">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-64 h-64 -translate-y-10 translate-x-10" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 22h20L12 2zm0 4.5l6.5 13.5H5.5L12 6.5z"/></svg>
           </div>
           <div className="relative z-10 mb-8 md:mb-0 text-center md:text-left">
             <h3 className="text-3xl md:text-4xl font-black text-white mb-2">Yaz Fırsatları Başladı!</h3>
             <p className="text-purple-200 text-lg">Öğrencilere özel tüm Raspberry Pi setlerinde <strong className="text-white">%15 indirim</strong> fırsatını kaçırmayın.</p>
           </div>
           <div className="relative z-10 flex-shrink-0">
              <Link href="/campaigns" className="bg-white text-purple-900 hover:bg-gray-100 font-bold px-8 py-4 rounded-xl shadow-xl transition-transform hover:scale-105 inline-block">
                İndirimleri Keşfet
              </Link>
           </div>
        </div>
      </section>

      {/* 5. Öne Çıkan Ürünler */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-white">Yeni Eklenen Ürünler</h2>
          <Link href="/products" className="text-electric-default hover:text-white font-bold transition-colors">Tüm Ürünler &rarr;</Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1,2,3,4].map(i => <div key={i} className="h-80 bg-navy-800 animate-pulse rounded-2xl border border-navy-700"></div>)}
          </div>
        ) : featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((prod) => (
              <div key={prod.id} className="bg-navy-800 border border-navy-700 rounded-2xl overflow-hidden hover:border-electric-default/50 transition-all hover:-translate-y-1 shadow-lg group flex flex-col">
                <Link href={`/products/${prod.slug}-${prod.id}`} className="block relative aspect-square bg-white p-4">
                   <img 
                     src={prod.image_urls && prod.image_urls.length > 0 ? prod.image_urls[0] : 'https://placehold.co/400x400/eaeff4/1b243b?text=Technocus'} 
                     alt={prod.name}
                     className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                   />
                   {prod.stock < 5 && prod.stock > 0 && (
                     <span className="absolute top-3 right-3 bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow">SADECE {prod.stock} KALDI</span>
                   )}
                   {prod.stock === 0 && (
                     <span className="absolute top-3 right-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow">TÜKENDİ</span>
                   )}
                </Link>
                <div className="p-5 flex flex-col flex-1">
                  <Link href={`/products/${prod.slug}-${prod.id}`} className="font-bold text-lg text-white mb-2 line-clamp-2 hover:text-electric-default transition-colors">
                    {prod.name}
                  </Link>
                  <p className="text-xs text-slate-400 mb-6">{prod.category?.name || 'Kategorisiz'}</p>
                  
                  <div className="mt-auto flex items-end justify-between">
                    <div>
                      <span className="text-xs text-slate-500 line-through block mb-1">₺{(prod.price * 1.2).toLocaleString('tr-TR', {minimumFractionDigits:2})}</span>
                      <span className="text-2xl font-black text-electric-default">₺{prod.price.toLocaleString('tr-TR', {minimumFractionDigits:2})}</span>
                    </div>
                    <button 
                      onClick={() => {
                        addItem(prod, 1);
                        toast.success(`${prod.name} sepete eklendi!`);
                      }}
                      className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${prod.stock > 0 ? 'bg-navy-700 hover:bg-electric-default text-white' : 'bg-navy-800 text-slate-600 cursor-not-allowed'}`}
                      disabled={prod.stock === 0}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.35 2.7a1 1 0 00.9 1.4h11.5M10 21a2 2 0 100-4 2 2 0 000 4zm7 0a2 2 0 100-4 2 2 0 000 4z" /></svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-navy-800 p-8 text-center rounded-xl text-slate-500">Ürün verisi bulunamadı.</div>
        )}
      </section>
    </div>
  );
}
