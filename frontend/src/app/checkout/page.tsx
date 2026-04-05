"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/hooks/useCart';
import { apiFetch } from '@/lib/api';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart, isHydrated } = useCart();
  const cartTotal = getTotalPrice();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [savedCards, setSavedCards] = useState<any[]>([]);
  const [selectedCardToken, setSelectedCardToken] = useState<string | null>(null);
  const [saveCard, setSaveCard] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    address: '',
    city: 'İstanbul',
    district: '',
    card_holder_name: '',
    card_number: '',
    expire_month: '',
    expire_year: '',
    cvc: ''
  });

  useEffect(() => {
    if (isHydrated && items.length === 0) {
      router.push('/cart');
    }
    
    // Auto-fill user info if logged in
    const storedName = localStorage.getItem('user_name');
    if (storedName && !formData.full_name) {
      setFormData(prev => ({ ...prev, full_name: storedName }));
    }

    // Fetch saved cards
    const fetchSavedCards = async () => {
      try {
        const res = await apiFetch('/api/orders/saved-cards');
        if (res.status === 'success' && res.cardDetails) {
            setSavedCards(res.cardDetails);
            if (res.cardDetails.length > 0) {
                setSelectedCardToken(res.cardDetails[0].cardToken);
            }
        }
      } catch (err) {
        console.error("Kayıtlı kartlar yüklenemedi:", err);
      }
    };
    fetchSavedCards();
  }, [items, isHydrated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderPayload: any = {
        shipping_address: `${formData.address}, ${formData.district}/${formData.city}`,
        phone: formData.phone,
        items: items.map(item => ({
          product_id: item.id,
          quantity: item.quantity
        })),
        save_card: saveCard
      };

      if (selectedCardToken) {
        orderPayload.card_token = selectedCardToken;
      } else {
        orderPayload.card_info = {
          card_holder_name: formData.card_holder_name,
          card_number: formData.card_number.replace(/\s/g, ''),
          expire_month: formData.expire_month,
          expire_year: formData.expire_year,
          cvc: formData.cvc
        };
      }

      const res = await apiFetch('/api/orders/checkout', {
        method: 'POST',
        body: JSON.stringify(orderPayload)
      });

      if (res.status === 'success') {
        toast.success("Ödemeniz başarıyla alındı!");
        clearCart();
        router.push('/checkout/success');
      }
    } catch (err: any) {
      toast.error(err.message || "Ödeme başlatılamadı.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12">
      <h1 className="text-4xl font-black text-white mb-8">Ödeme & Teslimat</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          {/* Contact & Address */}
          <div className="bg-navy-800 border border-navy-700 rounded-3xl p-6 md:p-10 shadow-xl">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-electric-default rounded-lg flex items-center justify-center text-sm">1</div>
              Teslimat Bilgileri
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-400 mb-2">Ad Soyad</label>
                <input 
                  type="text" required
                  className="w-full bg-navy-900 border border-navy-600 rounded-xl px-4 py-3 text-white focus:border-electric-default outline-none transition-all"
                  value={formData.full_name}
                  onChange={e => setFormData({...formData, full_name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-400 mb-2">Telefon</label>
                <input 
                  type="tel" required
                  placeholder="05xx xxx xx xx"
                  className="w-full bg-navy-900 border border-navy-600 rounded-xl px-4 py-3 text-white focus:border-electric-default outline-none transition-all"
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-400 mb-2">Adres</label>
                <textarea 
                  required rows={3}
                  className="w-full bg-navy-900 border border-navy-600 rounded-xl px-4 py-3 text-white focus:border-electric-default outline-none transition-all"
                  value={formData.address}
                  onChange={e => setFormData({...formData, address: e.target.value})}
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-400 mb-2">İl</label>
                <input 
                  type="text" required
                  className="w-full bg-navy-900 border border-navy-600 rounded-xl px-4 py-3 text-white focus:border-electric-default outline-none transition-all"
                  value={formData.city}
                  onChange={e => setFormData({...formData, city: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-400 mb-2">İlçe</label>
                <input 
                  type="text" required
                  className="w-full bg-navy-900 border border-navy-600 rounded-xl px-4 py-3 text-white focus:border-electric-default outline-none transition-all"
                  value={formData.district}
                  onChange={e => setFormData({...formData, district: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="bg-navy-800 border border-navy-700 rounded-3xl p-6 md:p-10 shadow-xl">
             <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center text-sm">2</div>
              Ödeme Metodu
            </h2>
            <div className="p-4 bg-navy-900 rounded-xl border border-navy-700 flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white rounded-md p-1 flex items-center justify-center">
                     <img src="https://www.iyzico.com/assets/images/content/logo.svg" alt="iyzico" className="w-full" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Kredi / Banka Kartı</h4>
                    <p className="text-xs text-slate-500">Iyzico ile %100 güvenli ödeme</p>
                  </div>
               </div>
               <div className="w-6 h-6 rounded-full border-4 border-electric-default bg-navy-900"></div>
            </div>

            {/* Saved Cards Selection */}
            {savedCards.length > 0 && (
              <div className="mt-8 space-y-4">
                <h3 className="text-sm font-semibold text-slate-400 mb-4 uppercase tracking-wider">Kayıtlı Kartlarım</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {savedCards.map((card) => (
                    <div 
                      key={card.cardToken}
                      onClick={() => setSelectedCardToken(card.cardToken)}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                        selectedCardToken === card.cardToken ? 'border-electric-default bg-electric-default/5' : 'border-navy-700 bg-navy-900/50 hover:border-navy-600'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white rounded flex items-center justify-center p-1 uppercase font-black text-[10px] text-navy-900">
                          {card.cardAssociation || 'CARD'}
                        </div>
                        <div>
                          <p className="text-sm text-white font-bold">{card.cardAlias}</p>
                          <p className="text-xs text-slate-500">{card.binNumber.slice(0,4)} **** **** {card.lastFourDigits}</p>
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 ${selectedCardToken === card.cardToken ? 'border-electric-default bg-electric-default' : 'border-navy-600'}`}>
                        {selectedCardToken === card.cardToken && <div className="w-2 h-2 bg-white rounded-full m-auto mt-1"></div>}
                      </div>
                    </div>
                  ))}
                  <div 
                    onClick={() => setSelectedCardToken(null)}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                      selectedCardToken === null ? 'border-electric-default bg-electric-default/5' : 'border-navy-700 bg-navy-900/50 hover:border-navy-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-navy-700 rounded flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"></path></svg>
                      </div>
                      <p className="text-sm text-white font-bold">Yeni Kart Kullan</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 ${selectedCardToken === null ? 'border-electric-default bg-electric-default' : 'border-navy-600'}`}>
                      {selectedCardToken === null && <div className="w-2 h-2 bg-white rounded-full m-auto mt-1"></div>}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Credit Card Details */}
            {selectedCardToken === null && (
              <div className="mt-8 space-y-6 pt-6 border-t border-navy-700 animate-in fade-in slide-in-from-top-2 duration-300">
                <div>
                  <label className="block text-sm font-semibold text-slate-400 mb-2">Kart Üzerindeki İsim</label>
                  <input 
                    type="text" required={selectedCardToken === null} placeholder="HESAP SAHİBİ"
                    className="w-full bg-navy-900 border border-navy-600 rounded-xl px-4 py-3 text-white focus:border-electric-default outline-none transition-all"
                    value={formData.card_holder_name}
                    onChange={e => setFormData({...formData, card_holder_name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-400 mb-2">Kart Numarası</label>
                  <input 
                    type="text" required={selectedCardToken === null} placeholder="0000 0000 0000 0000"
                    maxLength={19}
                    className="w-full bg-navy-900 border border-navy-600 rounded-xl px-4 py-3 text-white focus:border-electric-default outline-none transition-all"
                    value={formData.card_number}
                    onChange={e => {
                      const value = e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();
                      setFormData({...formData, card_number: value});
                    }}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-1">
                    <label className="block text-sm font-semibold text-slate-400 mb-2">Ay</label>
                    <select 
                      required={selectedCardToken === null} className="w-full bg-navy-900 border border-navy-600 rounded-xl px-4 py-3 text-white focus:border-electric-default outline-none transition-all"
                      value={formData.expire_month}
                      onChange={e => setFormData({...formData, expire_month: e.target.value})}
                    >
                      <option value="">Ay</option>
                      {Array.from({length: 12}, (_, i) => (i + 1).toString().padStart(2, '0')).map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-1">
                    <label className="block text-sm font-semibold text-slate-400 mb-2">Yıl</label>
                    <select 
                      required={selectedCardToken === null} className="w-full bg-navy-900 border border-navy-600 rounded-xl px-4 py-3 text-white focus:border-electric-default outline-none transition-all"
                      value={formData.expire_year}
                      onChange={e => setFormData({...formData, expire_year: e.target.value})}
                    >
                      <option value="">Yıl</option>
                      {Array.from({length: 10}, (_, i) => (new Date().getFullYear() + i).toString()).map(y => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-1">
                    <label className="block text-sm font-semibold text-slate-400 mb-2">CVV</label>
                    <input 
                      type="password" required={selectedCardToken === null} placeholder="***" maxLength={3}
                      className="w-full bg-navy-900 border border-navy-600 rounded-xl px-4 py-3 text-white focus:border-electric-default outline-none transition-all"
                      value={formData.cvc}
                      onChange={e => setFormData({...formData, cvc: e.target.value.replace(/\D/g, '')})}
                    />
                  </div>
                </div>

                {/* Save Card Checkbox */}
                <div className="flex items-center gap-3 pt-2">
                  <input 
                    type="checkbox" 
                    id="save_card"
                    className="w-5 h-5 rounded border-navy-600 bg-navy-900 text-electric-default focus:ring-electric-default"
                    checked={saveCard}
                    onChange={e => setSaveCard(e.target.checked)}
                  />
                  <label htmlFor="save_card" className="text-sm font-medium text-slate-300 cursor-pointer">
                    Gelecek alışverişlerim için kartımı güvenle sakla
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Summary */}
        <div className="space-y-6">
          <div className="bg-navy-800 border border-navy-700 rounded-3xl p-6 shadow-xl sticky top-28">
            <h2 className="text-lg font-bold text-white mb-6">Sipariş Özeti</h2>
            <div className="space-y-4 mb-6 border-b border-navy-700 pb-6">
              {isHydrated && items.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-slate-300 truncate max-w-[180px]">{item.quantity}x {item.name}</span>
                  <span className="text-white font-bold">₺{(item.price * item.quantity).toLocaleString('tr-TR', {minimumFractionDigits:2})}</span>
                </div>
              ))}
              {!isHydrated && (
                <div className="text-slate-500 text-sm animate-pulse">Ürünler yükleniyor...</div>
              )}
            </div>
            
            <div className="space-y-3 mb-8">
               <div className="flex justify-between text-sm">
                 <span className="text-slate-400">Ara Toplam</span>
                 <span className="text-slate-200">₺{isHydrated ? cartTotal.toLocaleString('tr-TR', {minimumFractionDigits:2}) : "0,00"}</span>
               </div>
               <div className="flex justify-between text-sm">
                 <span className="text-slate-400">Kargo</span>
                 <span className="text-slate-200">₺{isHydrated ? "29,90" : "0,00"}</span>
               </div>
               <div className="flex justify-between text-xl font-black pt-3 border-t border-navy-700">
                 <span className="text-white">Toplam</span>
                 <span className="text-electric-default">₺{isHydrated ? (cartTotal + 29.90).toLocaleString('tr-TR', {minimumFractionDigits:2}) : "0,00"}</span>
               </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-electric-default hover:bg-electric-hover text-white font-bold py-4 rounded-xl shadow-[0_10px_30px_rgba(59,130,246,0.3)] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? 'İşleniyor...' : 'Ödemeyi Tamamla'}
            </button>
            <p className="mt-4 text-[10px] text-slate-500 text-center">
              "Ödemeyi Tamamla" butonuna basarak <Link href="/terms" className="text-slate-400 underline">Satış Sözleşmesini</Link> kabul etmiş olursunuz.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
