"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { apiFetch } from "@/lib/api";

interface Address {
  id: string;
  title: string;
  receiver_name: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  is_corporate: boolean;
  company_name?: string;
  tax_office?: string;
  tax_number?: string;
}

export default function AddressesPage() {
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  // Form states
  const [formTitle, setFormTitle] = useState("");
  const [formReceiverName, setFormReceiverName] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formAddress, setFormAddress] = useState("");
  const [formCity, setFormCity] = useState("İstanbul");
  const [formDistrict, setFormDistrict] = useState("");
  const [formIsCorporate, setFormIsCorporate] = useState(false);
  const [formCompanyName, setFormCompanyName] = useState("");
  const [formTaxOffice, setFormTaxOffice] = useState("");
  const [formTaxNumber, setFormTaxNumber] = useState("");

  useEffect(() => {
    const fetchUserAndAddresses = async () => {
      try {
        const res = await apiFetch("/api/auth/me");
        if (res && res.email) {
          setUserEmail(res.email);
          const stored = localStorage.getItem(`technocus_addresses_${res.email}`);
          if (stored) {
            setAddresses(JSON.parse(stored));
          }
        }
      } catch (err) {
        console.error("Kullanıcı bilgisi alınamadı:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserAndAddresses();
  }, []);

  const saveAddresses = (newAddresses: Address[]) => {
    setAddresses(newAddresses);
    if (userEmail) {
      localStorage.setItem(`technocus_addresses_${userEmail}`, JSON.stringify(newAddresses));
    }
  };

  const openAddModal = () => {
    setEditingAddress(null);
    setFormTitle("");
    setFormReceiverName(localStorage.getItem("user_name") || "");
    setFormPhone("");
    setFormAddress("");
    setFormCity("İstanbul");
    setFormDistrict("");
    setFormIsCorporate(false);
    setFormCompanyName("");
    setFormTaxOffice("");
    setFormTaxNumber("");
    setIsModalOpen(true);
  };

  const openEditModal = (address: Address) => {
    setEditingAddress(address);
    setFormTitle(address.title);
    setFormReceiverName(address.receiver_name);
    setFormPhone(address.phone);
    setFormAddress(address.address);
    setFormCity(address.city);
    setFormDistrict(address.district);
    setFormIsCorporate(address.is_corporate);
    setFormCompanyName(address.company_name || "");
    setFormTaxOffice(address.tax_office || "");
    setFormTaxNumber(address.tax_number || "");
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formTitle || !formReceiverName || !formPhone || !formAddress || !formCity || !formDistrict) {
      toast.error("Lütfen zorunlu alanları doldurun.");
      return;
    }

    const newAddressData: Address = {
      id: editingAddress ? editingAddress.id : Math.random().toString(36).substring(2, 9),
      title: formTitle,
      receiver_name: formReceiverName,
      phone: formPhone,
      address: formAddress,
      city: formCity,
      district: formDistrict,
      is_corporate: formIsCorporate,
      ...(formIsCorporate ? {
        company_name: formCompanyName,
        tax_office: formTaxOffice,
        tax_number: formTaxNumber,
      } : {})
    };

    let updatedAddresses: Address[];
    if (editingAddress) {
      updatedAddresses = addresses.map((addr) =>
        addr.id === editingAddress.id ? newAddressData : addr
      );
      toast.success("Adresiniz başarıyla güncellendi.");
    } else {
      updatedAddresses = [...addresses, newAddressData];
      toast.success("Yeni adresiniz başarıyla eklendi.");
    }

    saveAddresses(updatedAddresses);
    setIsModalOpen(false);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Bu adresi silmek istediğinize emin misiniz?")) {
      const updated = addresses.filter((addr) => addr.id !== id);
      saveAddresses(updated);
      toast.success("Adres silindi.");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-electric-default border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-400">Adresleriniz yükleniyor...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-white">Adreslerim</h1>
          <p className="text-xs text-slate-400 mt-1">Siparişlerinizde kullanmak üzere kayıtlı teslimat adresleriniz.</p>
        </div>
        <button
          onClick={openAddModal}
          className="btn-primary py-2.5 px-5 rounded-xl text-sm font-bold flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Yeni Ekle
        </button>
      </div>

      {addresses.length === 0 ? (
        <div className="bg-navy-900/50 border border-navy-700/60 rounded-3xl p-12 text-center max-w-xl mx-auto backdrop-blur-md">
          <div className="w-16 h-16 bg-navy-800 rounded-2xl flex items-center justify-center m-auto mb-6 border border-navy-700 text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Kayıtlı Adres Yok</h3>
          <p className="text-sm text-slate-400 mb-6 leading-relaxed">Hesabınıza kayıtlı herhangi bir adres bulunamadı. Alışverişlerinizi daha hızlı tamamlamak için ilk adresinizi şimdi ekleyin.</p>
          <button
            onClick={openAddModal}
            className="bg-navy-800 hover:bg-navy-750 border border-navy-600 text-white font-bold py-2.5 px-6 rounded-xl transition-all"
          >
            Adres Ekle
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((address) => (
            <div
              key={address.id}
              className="bg-navy-900/80 border border-navy-700 rounded-2xl p-5 relative hover:border-navy-600 transition-all flex flex-col justify-between group shadow-lg hover:shadow-navy-900/50 backdrop-blur-sm"
            >
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  onClick={() => openEditModal(address)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-electric-default hover:bg-navy-800 transition-all"
                  title="Düzenle"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={(e) => handleDelete(address.id, e)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-navy-800 transition-all"
                  title="Sil"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>

              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-bold text-white text-lg">{address.title}</h3>
                  {address.is_corporate ? (
                    <span className="text-[10px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded-md font-semibold tracking-wider uppercase">
                      Kurumsal
                    </span>
                  ) : (
                    <span className="text-[10px] bg-electric-default/10 text-electric-default border border-electric-default/20 px-2 py-0.5 rounded-md font-semibold tracking-wider uppercase">
                      Bireysel
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-300 font-semibold mb-3">{address.receiver_name}</p>
                <p className="text-sm text-slate-400 leading-relaxed mb-4 whitespace-pre-line">
                  {address.address}
                  {"\n"}
                  {address.district} / {address.city}
                </p>
              </div>

              <div className="border-t border-navy-800/60 pt-3 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {address.phone}
                </span>

                {address.is_corporate && address.company_name && (
                  <span className="text-[10px] text-slate-500 truncate max-w-[150px] font-medium" title={address.company_name}>
                    {address.company_name}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Glassmorphic Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto backdrop-blur-md bg-navy-950/75">
          <div className="bg-navy-800 border border-navy-700 w-full max-w-xl rounded-3xl p-6 md:p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h2 className="text-xl font-black text-white mb-6">
              {editingAddress ? "Adresi Güncelle" : "Yeni Adres Ekle"}
            </h2>

            <form onSubmit={handleSave} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Adres Başlığı *</label>
                  <input
                    type="text"
                    required
                    placeholder="Örn: Evim, İş Yerim"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full bg-navy-900 border border-navy-600 rounded-xl px-4 py-3 text-white focus:border-electric-default outline-none transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Alıcı Adı Soyadı *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ad Soyad"
                    value={formReceiverName}
                    onChange={(e) => setFormReceiverName(e.target.value)}
                    className="w-full bg-navy-900 border border-navy-600 rounded-xl px-4 py-3 text-white focus:border-electric-default outline-none transition-all text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Telefon *</label>
                  <input
                    type="tel"
                    required
                    placeholder="05xx xxx xx xx"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full bg-navy-900 border border-navy-600 rounded-xl px-4 py-3 text-white focus:border-electric-default outline-none transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">İl *</label>
                  <input
                    type="text"
                    required
                    value={formCity}
                    onChange={(e) => setFormCity(e.target.value)}
                    className="w-full bg-navy-900 border border-navy-600 rounded-xl px-4 py-3 text-white focus:border-electric-default outline-none transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">İlçe *</label>
                  <input
                    type="text"
                    required
                    placeholder="İlçe"
                    value={formDistrict}
                    onChange={(e) => setFormDistrict(e.target.value)}
                    className="w-full bg-navy-900 border border-navy-600 rounded-xl px-4 py-3 text-white focus:border-electric-default outline-none transition-all text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Açık Adres *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Mahalle, sokak, kapı numarası..."
                  value={formAddress}
                  onChange={(e) => setFormAddress(e.target.value)}
                  className="w-full bg-navy-900 border border-navy-600 rounded-xl px-4 py-3 text-white focus:border-electric-default outline-none transition-all text-sm resize-none"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="formIsCorporate"
                  checked={formIsCorporate}
                  onChange={(e) => setFormIsCorporate(e.target.checked)}
                  className="w-5 h-5 rounded border-navy-600 bg-navy-900 text-electric-default focus:ring-electric-default"
                />
                <label htmlFor="formIsCorporate" className="text-sm font-semibold text-slate-300 cursor-pointer select-none">
                  Kurumsal Fatura Adresi
                </label>
              </div>

              {formIsCorporate && (
                <div className="space-y-4 pt-3 border-t border-navy-700/60 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Firma Ünvanı *</label>
                    <input
                      type="text"
                      required={formIsCorporate}
                      placeholder="Şirket Tam Adı"
                      value={formCompanyName}
                      onChange={(e) => setFormCompanyName(e.target.value)}
                      className="w-full bg-navy-900 border border-navy-600 rounded-xl px-4 py-3 text-white focus:border-electric-default outline-none transition-all text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Vergi Dairesi *</label>
                      <input
                        type="text"
                        required={formIsCorporate}
                        placeholder="Daire Adı"
                        value={formTaxOffice}
                        onChange={(e) => setFormTaxOffice(e.target.value)}
                        className="w-full bg-navy-900 border border-navy-600 rounded-xl px-4 py-3 text-white focus:border-electric-default outline-none transition-all text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Vergi Numarası *</label>
                      <input
                        type="text"
                        required={formIsCorporate}
                        maxLength={10}
                        placeholder="10 Haneli Vergi No"
                        value={formTaxNumber}
                        onChange={(e) => setFormTaxNumber(e.target.value.replace(/\D/g, ""))}
                        className="w-full bg-navy-900 border border-navy-600 rounded-xl px-4 py-3 text-white focus:border-electric-default outline-none transition-all text-sm"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-4 pt-4 border-t border-navy-700/60">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-navy-700 hover:bg-navy-650 text-white font-bold py-3.5 rounded-xl border border-navy-650 transition-all text-sm"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-electric-default hover:bg-electric-hover text-white font-bold py-3.5 rounded-xl transition-all text-sm shadow-[0_4px_20px_rgba(59,130,246,0.25)]"
                >
                  {editingAddress ? "Güncelle" : "Adresi Kaydet"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
