"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import { useCartStore } from '@/store/useCartStore';
import toast from 'react-hot-toast';

const CATEGORY_META: Record<string, { label: string; icon: string; description: string }> = {
  drone: {
    label: "Drone",
    icon: "🚁",
    description: "FPV motorlar, ESC, uçuş kontrolcüsü, batarya ve çerçeve parçaları.",
  },
  elektronik: {
    label: "Elektronik",
    icon: "⚡",
    description: "Arduino, Raspberry Pi, ESP32, sensörler ve geliştirme kartları.",
  },
  robotik: {
    label: "Robotik",
    icon: "🤖",
    description: "Servo motorlar, step motorlar, robot kitleri ve yapay zeka modülleri.",
  },
};

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { addItem } = useCartStore();
  const meta = CATEGORY_META[params.slug] ?? { label: params.slug, icon: "🔧", description: "" };

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      setError(false);
      try {
        const data = await apiFetch(`/api/products/?category_slug=${params.slug}`);
        setProducts(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Category products load error:", e);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, [params.slug]);

  return (
    <div className="py-8 space-y-8">
      {/* Breadcrumb + Header */}
      <div>
        <nav className="text-sm text-slate-500 mb-3 flex items-center gap-2">
          <Link href="/" className="hover:text-electric-default transition-colors">Ana Sayfa</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-electric-default transition-colors">Ürünler</Link>
          <span>/</span>
          <span className="text-slate-300">{meta.label}</span>
        </nav>
        <div className="flex items-center gap-4">
          <span className="text-5xl">{meta.icon}</span>
          <div>
            <h1 className="text-4xl font-black text-white">{meta.label}</h1>
            {meta.description && (
              <p className="text-slate-400 mt-1 max-w-xl">{meta.description}</p>
            )}
          </div>
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="h-80 bg-navy-800 animate-pulse rounded-2xl border border-navy-700" />
          ))}
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <div className="py-20 text-center bg-navy-800/50 rounded-2xl border border-red-500/20">
          <p className="text-red-400 font-semibold">Ürünler yüklenirken bir hata oluştu.</p>
          <p className="text-slate-500 text-sm mt-2">Lütfen sayfayı yenileyin veya daha sonra tekrar deneyin.</p>
        </div>
      )}

      {/* Products Grid */}
      {!loading && !error && products.length > 0 && (
        <>
          <p className="text-slate-500 text-sm">{products.length} ürün listeleniyor</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((prod) => (
              <div
                key={prod.id}
                className="bg-navy-800 border border-navy-700 rounded-2xl overflow-hidden hover:border-electric-default/50 transition-all hover:-translate-y-1 shadow-lg group flex flex-col"
              >
                <Link href={`/products/${prod.slug}-${prod.id}`} className="block relative aspect-square bg-white p-4">
                  <img
                    src={prod.image_urls?.[0] || 'https://placehold.co/400x400/eaeff4/1b243b?text=Technocus'}
                    alt={prod.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                  />
                  {prod.stock < 5 && prod.stock > 0 && (
                    <span className="absolute top-3 right-3 bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow">
                      SADECE {prod.stock} KALDI
                    </span>
                  )}
                  {prod.stock === 0 && (
                    <span className="absolute top-3 right-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow">
                      TÜKENDİ
                    </span>
                  )}
                </Link>

                <div className="p-5 flex flex-col flex-1">
                  <Link
                    href={`/products/${prod.slug}-${prod.id}`}
                    className="font-bold text-lg text-white mb-2 line-clamp-2 hover:text-electric-default transition-colors"
                  >
                    {prod.name}
                  </Link>

                  <div className="mt-auto flex items-end justify-between">
                    <span className="text-2xl font-black text-electric-default">
                      ₺{Number(prod.price).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                    </span>
                    <button
                      onClick={() => {
                        if (prod.stock === 0) return;
                        addItem(prod, 1);
                        toast.success(`${prod.name} sepete eklendi!`);
                      }}
                      disabled={prod.stock === 0}
                      className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${
                        prod.stock > 0
                          ? 'bg-navy-700 hover:bg-electric-default text-white cursor-pointer'
                          : 'bg-navy-800 text-slate-600 cursor-not-allowed'
                      }`}
                      title={prod.stock === 0 ? 'Stokta Yok' : 'Sepete Ekle'}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.35 2.7a1 1 0 00.9 1.4h11.5M10 21a2 2 0 100-4 2 2 0 000 4zm7 0a2 2 0 100-4 2 2 0 000 4z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Empty state */}
      {!loading && !error && products.length === 0 && (
        <div className="py-20 text-center bg-navy-800/50 rounded-2xl border border-navy-700 border-dashed space-y-4">
          <p className="text-4xl">📦</p>
          <p className="text-slate-400 font-semibold text-lg">Bu kategoride henüz ürün bulunmuyor.</p>
          <Link
            href="/products"
            className="text-electric-default font-bold hover:underline inline-block"
          >
            Tüm Ürünlere Göz At →
          </Link>
        </div>
      )}
    </div>
  );
}
