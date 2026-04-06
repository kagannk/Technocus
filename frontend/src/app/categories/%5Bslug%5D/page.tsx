"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

const CATEGORY_META: Record<string, { label: string; emoji: string; desc: string }> = {
  drone: { label: "Drone", emoji: "🚁", desc: "FPV drone parçaları ve aksesuarları" },
  elektronik: { label: "Elektronik", emoji: "⚡", desc: "Mikrodenetleyiciler ve elektronik modüller" },
  robotik: { label: "Robotik", emoji: "🤖", desc: "Robot kitleri ve hareket sistemleri" },
};

interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  stock: number;
  image_urls: string[];
}

export default function CategoryPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const meta = CATEGORY_META[slug] || { label: slug, emoji: "📦", desc: "" };
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError("");
    fetch(`${API_URL}/api/products/?category_slug=${slug}&limit=100`)
      .then((res) => {
        if (!res.ok) throw new Error(`API hatası: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setProducts(Array.isArray(data) ? data : data.items || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [slug, API_URL]);

  return (
    <div className="min-h-screen pt-24 px-4 pb-16">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <nav className="text-sm text-slate-500 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-electric-default transition-colors">Ana Sayfa</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-electric-default transition-colors">Ürünler</Link>
          <span>/</span>
          <span className="text-slate-300">{meta.label}</span>
        </nav>

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-black text-white">
            {meta.emoji} {meta.label}
          </h1>
          {meta.desc && <p className="text-slate-400 mt-2 text-lg">{meta.desc}</p>}
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-navy-800 rounded-xl h-64 animate-pulse" />
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="py-20 text-center bg-navy-800/50 rounded-2xl border border-red-500/20">
            <p className="text-red-400 font-semibold">Hata: {error}</p>
            <p className="text-slate-500 text-sm mt-2">Lütfen sayfayı yenileyin.</p>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && products.length === 0 && (
          <div className="py-20 text-center bg-navy-800/50 rounded-2xl border border-navy-700 border-dashed space-y-4">
            <p className="text-4xl">📦</p>
            <p className="text-slate-400 font-semibold text-lg">Bu kategoride henüz ürün bulunmuyor.</p>
            <Link href="/products" className="text-electric-default font-bold hover:underline inline-block">
              Tüm Ürünlere Göz At →
            </Link>
          </div>
        )}

        {/* Products */}
        {!loading && !error && products.length > 0 && (
          <>
            <p className="text-slate-500 text-sm mb-6">{products.length} ürün listeleniyor</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}-${product.id}`}
                  className="bg-navy-800 border border-navy-700 rounded-2xl p-4 hover:border-electric-default/50 hover:-translate-y-1 transition-all group"
                >
                  <div className="aspect-square bg-white rounded-xl mb-3 overflow-hidden flex items-center justify-center p-2">
                    <img
                      src={product.image_urls?.[0] || "https://placehold.co/300x300/eaeff4/1b243b?text=Technocus"}
                      alt={product.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <h3 className="text-white font-semibold text-sm line-clamp-2 mb-2 group-hover:text-electric-default transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-electric-default font-black text-lg">
                    ₺{Number(product.price).toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
                  </p>
                  {product.stock <= 5 && product.stock > 0 && (
                    <span className="text-xs text-orange-400 mt-1 block">Son {product.stock} adet</span>
                  )}
                  {product.stock === 0 && (
                    <span className="text-xs text-red-400 mt-1 block">Tükendi</span>
                  )}
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
