"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
  });
  
  useEffect(() => {
    // Populate with arbitrary localstorage data
    setFormData(prev => ({
      ...prev,
      fullName: localStorage.getItem('user_name') || '',
    }));
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('user_name', formData.fullName);
    toast.success('Profil bilgileriniz güncellendi.');
    setTimeout(() => {
      window.location.reload(); // Hard reload to update layout name
    }, 1000);
  };

  return (
    <div>
      <h1 className="text-2xl font-black text-white mb-6">Profil Bilgilerim</h1>
      
      <form onSubmit={handleSave} className="space-y-6 max-w-xl">
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Ad Soyad</label>
          <input 
            type="text" 
            required
            value={formData.fullName}
            onChange={(e) => setFormData({...formData, fullName: e.target.value})}
            className="w-full bg-navy-900 border border-navy-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-electric-default" 
          />
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">E-posta Adresi <span className="text-xs text-orange-400 ml-2">(Değiştirilemez)</span></label>
          <input 
            type="email" 
            disabled
            value={formData.email}
            placeholder="Kayıtlı e-posta adresiniz"
            className="w-full bg-navy-900/50 border border-navy-700 rounded-lg px-4 py-3 text-slate-500 cursor-not-allowed" 
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Telefon Numarası</label>
          <input 
            type="tel" 
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            placeholder="+90 (___) ___ __ __"
            className="w-full bg-navy-900 border border-navy-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-electric-default" 
          />
        </div>

        <button type="submit" className="btn-primary py-3 px-8 rounded-lg shadow-lg font-bold">
          Değişiklikleri Kaydet
        </button>
      </form>

      <div className="mt-12 pt-8 border-t border-navy-700">
         <h2 className="text-lg font-bold text-white mb-4">Şifre Değiştir</h2>
         <form className="space-y-5 max-w-xl" onSubmit={(e) => { e.preventDefault(); toast.success('Şifre başarıyla güncellendi.'); }}>
            <div>
               <input type="password" required placeholder="Mevcut Şifreniz" className="w-full bg-navy-900 border border-navy-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-electric-default" />
            </div>
            <div className="grid grid-cols-2 gap-4">
               <input type="password" required placeholder="Yeni Şifre" className="w-full bg-navy-900 border border-navy-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-electric-default" />
               <input type="password" required placeholder="Yeni Şifre Tekrar" className="w-full bg-navy-900 border border-navy-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-electric-default" />
            </div>
            <button type="submit" className="bg-navy-700 hover:bg-navy-600 text-white font-bold py-2.5 px-6 rounded-lg transition-colors border border-navy-600">Şifreyi Güncelle</button>
         </form>
      </div>
    </div>
  );
}
