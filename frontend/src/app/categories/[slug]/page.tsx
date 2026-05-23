"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { useCartStore } from "@/store/useCartStore";
import toast from "react-hot-toast";

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCartStore();

  const slug = params.slug;

  const categoryNames: Record<string, string> = {
    drone: "Drone Parçaları",
    elektronik: "Elektronik & Geliştirme",
    robotik: "Robotik Sistemler"
  };

  const categoryName = categoryNames[slug] || slug.charAt(0).toUpperCase() + slug.slice(1);

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await apiFetch(`/api/products?category=${slug}`);
        setProducts(data);
      } catch (e) {
        console.error("Kategori yüklenemedi:", e);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, [slug]);

  const handleAddToCart = (product: any, e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product, 1);
    toast.success(`${product.name} sepete eklendi!`);
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-electric-default border-t-transparent rounded-full animate-spin mb-4"></div>
          <div className="text-slate-400 font-bold">Kategori yükleniyor...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      {/* Kategori Başlığı */}
      <div className="mb-10 text-center bg-navy-800 border border-navy-700 rounded-3xl p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-electric-default/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3"></div>
        
        <h1 className="text-4xl md:text-5xl font-black text-white mb-4 relative z-10">{categoryName}</h1>
        <p className="text-slate-400 text-lg relative z-10">Bu kategoride {products.length} ürün bulundu.</p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 bg-navy-800/50 border border-navy-700 rounded-3xl">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mx-auto text-slate-600 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
          <h2 className="text-2xl font-bold text-white mb-2">Ürün Bulunamadı</h2>
          <p className="text-slate-400 mb-8">Bu kategoride şu anda listelenecek ürün yok.</p>
          <Link href="/products" className="btn-primary py-3 px-8 rounded-xl font-bold shadow-lg">
            Tüm Ürünlere Dön
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => {
            const mainImage = product.image_urls?.[0] || 'https://placehold.co/400x400/eaeff4/1b243b?text=Technocus';
            return (
              <Link 
                href={`/products/${product.slug}-${product.id}`} 
                key={product.id} 
                className="bg-navy-800 rounded-2xl overflow-hidden border border-navy-700 group hover:border-electric-default transition-all hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] hover:-translate-y-1 flex flex-col h-full"
              >
                <div className="aspect-square bg-white relative p-4 overflow-hidden border-b border-navy-700">
                  <img src={mainImage} alt={product.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                  
                  {product.stock === 0 && (
                    <div className="absolute inset-0 bg-navy-900/80 flex items-center justify-center backdrop-blur-sm">
                      <div className="bg-red-500 text-white font-bold py-2 px-6 rounded-full transform -rotate-12 shadow-2xl border-2 border-red-400">
                        STOKTA YOK
                      </div>
                    </div>
                  )}
                  
                  {product.stock > 0 && product.stock <= 5 && (
                    <div className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                      SON {product.stock} ÜRÜN
                    </div>
                  )}
                </div>
                
                <div className="p-5 flex flex-col flex-1">
                  <div className="text-xs font-bold text-electric-default mb-2">{product.category_name}</div>
                  <h3 className="font-bold text-white text-lg leading-tight mb-2 group-hover:text-electric-default transition-colors line-clamp-2">
                    {product.name}
                  </h3>
                  
                  <div className="mt-auto pt-4 flex items-center justify-between">
                    <div className="text-xl font-black text-white">
                      ₺{product.price.toLocaleString('tr-TR', {minimumFractionDigits:2})}
                    </div>
                    
                    <button 
                      onClick={(e) => handleAddToCart(product, e)}
                      disabled={product.stock === 0}
                      className="bg-navy-700 hover:bg-electric-default text-white p-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed group/btn"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform group-hover/btn:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.35 2.7a1 1 0 00.9 1.4h11.5M10 21a2 2 0 100-4 2 2 0 000 4zm7 0a2 2 0 100-4 2 2 0 000 4z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
