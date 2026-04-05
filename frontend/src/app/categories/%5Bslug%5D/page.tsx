"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import { useCartStore } from '@/store/useCartStore';
import toast from 'react-hot-toast';

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const [products, setProducts] = useState<any[]>([]);
  const [categoryName, setCategoryName] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const { addItem } = useCartStore();

  useEffect(() => {
    async function loadCategoryData() {
      try {
        const categories = await apiFetch('/api/categories/');
        const category = categories.find((c: any) => c.slug === params.slug);
        
        if (category) {
          setCategoryName(category.name);
          const allProducts = await apiFetch('/api/products/');
          const filtered = allProducts.filter((p: any) => p.category_id === category.id);
          setProducts(filtered);
        }
      } catch (e) {
        console.error("Category load error:", e);
      } finally {
        setLoading(false);
      }
    }
    loadCategoryData();
  }, [params.slug]);

  if (loading) {
    return <div className="py-20 text-center text-slate-400">Yükleniyor...</div>;
  }

  return (
    <div className="py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <nav className="text-sm text-slate-500 mb-2">
            <Link href="/" className="hover:text-electric-default">Ana Sayfa</Link> / <span>Kategoriler</span>
          </nav>
          <h1 className="text-4xl font-black text-white">{categoryName || params.slug}</h1>
        </div>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((prod) => (
            <div key={prod.id} className="bg-navy-800 border border-navy-700 rounded-2xl overflow-hidden hover:border-electric-default/50 transition-all hover:-translate-y-1 shadow-lg group flex flex-col">
              <Link href={`/products/${prod.slug}-${prod.id}`} className="block relative aspect-square bg-white p-4">
                <img 
                  src={prod.image_urls?.[0] || 'https://placehold.co/400x400/eaeff4/1b243b?text=Technocus'} 
                  alt={prod.name}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                />
              </Link>
              <div className="p-5 flex flex-col flex-1">
                <Link href={`/products/${prod.slug}-${prod.id}`} className="font-bold text-lg text-white mb-2 line-clamp-2 hover:text-electric-default transition-colors">
                  {prod.name}
                </Link>
                <div className="mt-auto flex items-end justify-between">
                  <span className="text-2xl font-black text-electric-default">₺{prod.price.toLocaleString('tr-TR', {minimumFractionDigits:2})}</span>
                  <button 
                    onClick={() => {
                      addItem(prod, 1);
                      toast.success(`${prod.name} sepete eklendi!`);
                    }}
                    className="w-10 h-10 rounded-lg bg-navy-700 hover:bg-electric-default text-white flex items-center justify-center transition-all"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.35 2.7a1 1 0 00.9 1.4h11.5M10 21a2 2 0 100-4 2 2 0 000 4zm7 0a2 2 0 100-4 2 2 0 000 4z" /></svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center bg-navy-800 rounded-2xl border border-navy-700 border-dashed">
          <p className="text-slate-500">Bu kategoride henüz ürün bulunmuyor.</p>
          <Link href="/products" className="text-electric-default font-bold mt-4 inline-block hover:underline">Tüm Ürünlere Göz At &rarr;</Link>
        </div>
      )}
    </div>
  );
}
