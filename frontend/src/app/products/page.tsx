"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/useCartStore';
import { toast } from 'react-hot-toast';

const CATEGORIES = [
  { slug: "drone", label: "🚁 Drone" },
  { slug: "elektronik", label: "⚡ Elektronik" },
  { slug: "robotik", label: "🤖 Robotik" },
];

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const { addItem } = useCartStore();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    setLoading(true);
    const url = selectedCategory
      ? `${API_URL}/api/products/?category_slug=${selectedCategory}&limit=200`
      : `${API_URL}/api/products/?limit=200`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setProducts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Ürünler yüklenirken hata:", err);
        setLoading(false);
      });
  }, [selectedCategory, API_URL]);

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    toast.success(`${product.name} sepete eklendi!`);
  };

  const handleCategoryToggle = (slug: string) => {
    setSelectedCategory((prev) => (prev === slug ? "" : slug));
  };

  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold text-white mb-8">Tüm Ürünler</h1>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="bg-navy-800 p-6 rounded-2xl border border-navy-700 shadow-sm sticky top-24">
            <h3 className="font-semibold text-white mb-4">Kategoriler</h3>
            <ul className="space-y-2">
              {CATEGORIES.map((cat) => (
                <li key={cat.slug}>
                  <button
                    onClick={() => handleCategoryToggle(cat.slug)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all text-left ${
                      selectedCategory === cat.slug
                        ? "bg-electric-default text-white shadow-lg shadow-electric-default/20"
                        : "text-slate-300 hover:bg-navy-700 hover:text-white"
                    }`}
                  >
                    <span>{cat.label}</span>
                    {selectedCategory === cat.slug && (
                      <span className="ml-auto text-xs bg-white/20 px-1.5 py-0.5 rounded-md">✕</span>
                    )}
                  </button>
                </li>
              ))}
            </ul>

            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory("")}
                className="mt-4 w-full text-xs text-slate-500 hover:text-red-400 transition-colors text-center"
              >
                Filtreyi Temizle
              </button>
            )}

            <h3 className="font-semibold text-white mt-8 mb-4">Fiyat Aralığı</h3>
            <div className="flex items-center space-x-2">
              <input type="number" placeholder="Min" className="w-full bg-navy-900 border border-navy-700 rounded-lg py-2 px-3 text-white text-sm focus:outline-none focus:border-electric-default" />
              <span className="text-slate-500">-</span>
              <input type="number" placeholder="Max" className="w-full bg-navy-900 border border-navy-700 rounded-lg py-2 px-3 text-white text-sm focus:outline-none focus:border-electric-default" />
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <span className="text-slate-400 font-medium">
              {loading ? "Yükleniyor..." : `${products.length} ürün listeleniyor`}
              {selectedCategory && !loading && (
                <span className="ml-2 text-electric-default font-bold text-sm">
                  ({CATEGORIES.find(c => c.slug === selectedCategory)?.label})
                </span>
              )}
            </span>
            <select className="bg-navy-800 border border-navy-700 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-electric-default shadow-sm cursor-pointer">
              <option>En Yeniler</option>
              <option>Fiyat: Düşükten Yükseğe</option>
              <option>Fiyat: Yüksekten Düşüğe</option>
            </select>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-80 bg-navy-800 animate-pulse rounded-2xl border border-navy-700"></div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((prod) => (
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
                    <p className="text-xs text-slate-400 mb-6">{prod.category_name || 'Kategorisiz'}</p>

                    <div className="mt-auto flex items-end justify-between">
                      <div>
                        <span className="text-xs text-slate-500 line-through block mb-1">
                          ₺{(prod.price * 1.2).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                        </span>
                        <span className="text-2xl font-black text-electric-default">
                          ₺{prod.price.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      {isClient && (
                        <button
                          onClick={(e) => handleAddToCart(e, prod)}
                          disabled={prod.stock === 0}
                          className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                            prod.stock > 0 ? 'bg-navy-700 hover:bg-electric-default text-white shadow-lg active:scale-95' : 'bg-navy-800 text-slate-600 cursor-not-allowed'
                          }`}
                          title={prod.stock > 0 ? 'Sepete Ekle' : 'Stokta Yok'}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.35 2.7a1 1 0 00.9 1.4h11.5M10 21a2 2 0 100-4 2 2 0 000 4zm7 0a2 2 0 100-4 2 2 0 000 4z" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-navy-800 p-12 text-center rounded-2xl border border-navy-700 text-slate-400 space-y-3">
              <p className="text-4xl">📦</p>
              <p className="text-lg font-semibold">
                {selectedCategory ? "Bu kategoride ürün bulunamadı." : "Gösterilecek bir ürün bulunamadı."}
              </p>
              {selectedCategory && (
                <button onClick={() => setSelectedCategory("")} className="text-electric-default hover:underline text-sm font-bold">
                  Tüm Ürünlere Dön
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
