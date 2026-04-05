"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { apiFetch } from '@/lib/api';
import { useCartStore } from '@/store/useCartStore';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'desc'|'specs'|'reviews'>('desc');
  const [quantity, setQuantity] = useState(1);
  const [isClient, setIsClient] = useState(false);
  const { addItem } = useCartStore();

  useEffect(() => {
    setIsClient(true);
  }, []);
  const router = useRouter();

  // Extract ID from slug-id format
  const productId = params.id.split('-').pop();

  useEffect(() => {
    async function loadProduct() {
      try {
        const data = await apiFetch(`/api/products/${productId}`);
        setProduct(data);
      } catch (e) {
        console.error("Product load error:", e);
        toast.error("Ürün yüklenemedi.");
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [productId]);

  const handleShare = async () => {
    if (!product) return;
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${product.name} - Technocus`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Ürün linki kopyalandı!");
      }
    } catch(e) {}
  };

  const handleAddToCart = () => {
    if (!product || !product.id) {
      toast.error("Ürün bilgisi hatalı!");
      console.error("Add to cart failed: Product data is incomplete", product);
      return;
    }
    
    addItem(product, quantity);
    toast.success(`${product.name} sepete eklendi!`);
  };

  if (loading) {
    return <div className="py-20 text-center text-slate-400">Yükleniyor...</div>;
  }

  if (!product) {
    return <div className="py-20 text-center text-slate-400">Ürün bulunamadı.</div>;
  }

  const mainImage = product.image_urls?.[0] || 'https://placehold.co/800x800/eaeff4/1b243b?text=Technocus';

  return (
    <div className="py-8">
      {/* Breadcrumb & Global Actions */}
      <div className="flex items-center justify-between mb-8">
        <nav className="text-sm text-slate-400 flex items-center space-x-2">
          <Link href="/" className="hover:text-electric-default">Ana Sayfa</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-electric-default">Ürünler</Link>
          <span>/</span>
          <span className="text-slate-200 line-clamp-1">{product.name}</span>
        </nav>
        
        <button onClick={handleShare} className="flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white transition-colors bg-navy-800 border border-navy-700 px-3 py-1.5 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
          Paylaş
        </button>
      </div>

      {/* Main Container */}
      <div className="flex flex-col lg:flex-row gap-12 bg-navy-800 border border-navy-700 rounded-3xl p-6 lg:p-10 shadow-2xl mb-12">
        {/* Product Images */}
        <div className="w-full lg:w-5/12">
          <div className="bg-white rounded-2xl aspect-square border-4 border-navy-900 flex items-center justify-center mb-4 overflow-hidden relative group">
             <img src={mainImage} alt={product.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
             <div className="absolute top-4 left-4 bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded shadow">ORİJİNAL</div>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {product.image_urls?.map((url: string, i: number) => (
              <div key={i} className="bg-white w-20 h-20 rounded-xl flex-shrink-0 border-2 border-transparent hover:border-electric-default cursor-pointer transition-colors overflow-hidden">
                <img src={url} className="w-full h-full object-contain" />
              </div>
            )) || (
                <div className="bg-white w-20 h-20 rounded-xl flex-shrink-0 border-2 border-electric-default overflow-hidden">
                    <img src={mainImage} className="w-full h-full object-contain" />
                </div>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="w-full lg:w-7/12 flex flex-col">
          <div className="flex items-center gap-2 mb-3">
             <div className="flex text-yellow-500 text-sm">
                {[1,2,3,4,5].map(i => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                ))}
             </div>
             <span className="text-slate-400 font-medium ml-1">5.0 (12 Değerlendirme)</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight">{product.name}</h1>
          <p className="text-sm font-semibold text-slate-400 mb-8 uppercase tracking-wider">SKU: {product.sku}</p>
          
          <div className="flex flex-col mb-8 border-b border-navy-700/50 pb-8">
             <div className="text-5xl font-black text-electric-default">₺{product.price.toLocaleString('tr-TR', {minimumFractionDigits:2})}</div>
             <div className="text-sm text-slate-400 mt-2 font-medium bg-navy-900 inline-block w-max px-3 py-1 rounded-md border border-navy-700">KDV Dahildir</div>
          </div>
          
          <p className="text-slate-300 leading-relaxed text-lg mb-10 max-w-2xl">
            {product.description}
          </p>

          <div className={`flex items-center space-x-2 text-sm font-bold mb-6 w-max px-4 py-2 rounded-lg border ${product.stock > 0 ? 'text-green-400 bg-green-500/10 border-green-500/20' : 'text-red-400 bg-red-500/10 border-red-500/20'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>{product.stock > 0 ? `Stokta Var (${product.stock} adet)` : 'Stokta Yok'}</span>
          </div>

          {isClient && (
            <div className="flex items-center sm:space-x-4 mt-auto">
              <div className="flex items-center bg-navy-900 border border-navy-700 rounded-xl overflow-hidden shrink-0">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                  className="px-4 py-3 text-slate-300 hover:text-white hover:bg-navy-800 transition-colors font-bold text-xl"
                >-</button>
                <span className="w-10 text-center text-white font-bold text-lg">{quantity}</span>
                <button 
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} 
                  className="px-4 py-3 text-slate-300 hover:text-white hover:bg-navy-800 transition-colors font-bold text-xl"
                >+</button>
              </div>
              <button 
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="btn-primary flex-1 py-4 text-lg font-bold flex items-center justify-center space-x-3 rounded-xl shadow-[0_10px_20px_rgba(59,130,246,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.35 2.7a1 1 0 00.9 1.4h11.5M10 21a2 2 0 100-4 2 2 0 000 4zm7 0a2 2 0 100-4 2 2 0 000 4z" />
                </svg>
                <span>{product.stock > 0 ? 'Sepete Ekle' : 'Stok Bekleniyor'}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tabs Layout */}
      <div className="bg-navy-800 border border-navy-700 rounded-3xl overflow-hidden shadow-xl mb-16">
        <div className="flex border-b border-navy-700">
          <button 
            onClick={() => setActiveTab('desc')}
            className={`px-8 py-4 font-bold text-lg transition-all border-b-2 ${activeTab === 'desc' ? 'border-electric-default text-white bg-navy-900/50' : 'border-transparent text-slate-400 hover:text-white hover:bg-navy-700/50'}`}
          >
            Ürün Açıklaması
          </button>
          <button 
            onClick={() => setActiveTab('specs')}
            className={`px-8 py-4 font-bold text-lg transition-all border-b-2 ${activeTab === 'specs' ? 'border-electric-default text-white bg-navy-900/50' : 'border-transparent text-slate-400 hover:text-white hover:bg-navy-700/50'}`}
          >
            Teknik Özellikler
          </button>
          <button 
            onClick={() => setActiveTab('reviews')}
            className={`px-8 py-4 font-bold text-lg transition-all border-b-2 ${activeTab === 'reviews' ? 'border-electric-default text-white bg-navy-900/50' : 'border-transparent text-slate-400 hover:text-white hover:bg-navy-700/50'}`}
          >
            Yorumlar
          </button>
        </div>

        <div className="p-8 lg:p-12 text-slate-300 leading-relaxed text-lg min-h-[300px]">
          {activeTab === 'desc' && (
            <div className="animate-in fade-in slide-in-from-bottom-2">
              <p className="mb-4">{product.description}</p>
            </div>
          )}
          
          {activeTab === 'specs' && (
            <div className="animate-in fade-in slide-in-from-bottom-2">
              <table className="w-full text-left text-slate-300 bg-navy-900/50 rounded-xl overflow-hidden border border-navy-700">
                <tbody>
                  {product.spec_data ? Object.entries(product.spec_data).map(([key, val]: [string, any]) => (
                    <tr key={key} className="border-b border-navy-700 hover:bg-navy-800 transition-colors">
                      <td className="py-4 px-6 font-bold w-1/3 text-capitalize">{key.replace('_', ' ')}</td>
                      <td className="py-4 px-6 text-slate-400">{String(val)}</td>
                    </tr>
                  )) : (
                    <tr><td className="py-4 px-6 text-slate-500 italic">Teknik özellik belirtilmemiş.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 text-center text-slate-500 py-10">
               Bu ürün için henüz yorum yapılmamış.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
