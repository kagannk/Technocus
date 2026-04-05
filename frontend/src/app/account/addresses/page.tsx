"use client";

import toast from "react-hot-toast";

export default function AddressesPage() {
  const handleAdd = () => {
    toast.success('Yeni adres ekleme modülü yakında aktif olacak.');
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black text-white">Adreslerim</h1>
        <button onClick={handleAdd} className="btn-primary py-2 px-4 rounded-lg text-sm font-bold flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Yeni Ekle
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         {/* Mock Address 1 */}
         <div className="bg-navy-900 border border-navy-700 rounded-xl p-5 relative group">
            <div className="absolute top-4 right-4 flex gap-2">
               <button className="text-slate-400 hover:text-electric-default"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>
               <button className="text-slate-400 hover:text-red-500"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
            </div>
            <h3 className="font-bold text-white mb-1">Ev Adresim</h3>
            <p className="text-xs text-electric-default font-semibold mb-3">Yılmaz Kağan</p>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              Caferağa Mah. Sakız Sk. No:2 D:5<br/>
              Kadıköy / İstanbul
            </p>
            <p className="text-xs text-slate-500">0532 123 45 67</p>
         </div>

         {/* Mock Address 2 */}
         <div className="bg-navy-900 border border-navy-700 rounded-xl p-5 relative hover:border-navy-600 transition-colors">
            <div className="absolute top-4 right-4 flex gap-2">
               <button className="text-slate-400 hover:text-electric-default"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>
               <button className="text-slate-400 hover:text-red-500"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
            </div>
            <h3 className="font-bold text-white mb-1">Şirket Merkez</h3>
            <p className="text-xs text-cyan-400 font-semibold mb-3">Kurumsal Fatura Adresi</p>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              Maslak Mah. Eski Büyükdere Cad. No:1<br/>
              Sarıyer / İstanbul
            </p>
            <p className="text-xs text-slate-500">0212 999 88 77</p>
         </div>
      </div>
    </div>
  );
}
