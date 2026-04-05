export default function AccountPage() {
  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold text-white mb-8">Hesabım</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="bg-navy-800 rounded-xl border border-navy-700 overflow-hidden shadow-lg">
            <div className="p-6 border-b border-navy-700 text-center">
              <div className="w-20 h-20 mx-auto bg-navy-900 border-2 border-electric-default rounded-full flex items-center justify-center text-2xl font-bold text-electric-default mb-4 shadow-[0_0_15px_rgba(59,130,246,0.2)]">TS</div>
              <h2 className="font-bold text-white text-lg">Test Kullanıcı</h2>
              <p className="text-sm text-slate-400">test@example.com</p>
            </div>
            <nav className="flex flex-col">
              <a href="#" className="px-6 py-4 text-white bg-navy-900/80 border-l-4 border-electric-default font-medium flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-electric-default" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                Siparişlerim
              </a>
              <a href="#" className="px-6 py-4 text-slate-400 hover:text-white hover:bg-navy-700/50 transition-colors border-l-4 border-transparent flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                Adres Bilgilerim
              </a>
              <a href="#" className="px-6 py-4 text-slate-400 hover:text-white hover:bg-navy-700/50 transition-colors border-l-4 border-transparent flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                Hesap Ayarları
              </a>
              <a href="#" className="px-6 py-4 text-red-400 hover:bg-red-400/10 transition-colors border-l-4 border-transparent flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                Çıkış Yap
              </a>
            </nav>
          </div>
        </aside>
        
        <div className="flex-1">
          <div className="bg-navy-800 rounded-xl border border-navy-700 p-6 md:p-8 shadow-lg">
            <h2 className="text-xl font-bold text-white mb-6 border-b border-navy-700 pb-4">Son Siparişlerim</h2>
            
            <div className="space-y-6">
              {[1, 2].map(order => (
                <div key={order} className="border border-navy-700 p-5 rounded-xl hover:border-electric-default/40 hover:bg-navy-900/30 transition-all duration-300">
                  <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-white text-lg">Sipariş #TS{order}9842</span>
                        <span className="bg-green-500/10 border border-green-500/20 text-green-400 text-xs px-2.5 py-1 rounded-full font-medium">Tamamlandı</span>
                      </div>
                      <div className="text-sm text-slate-400 mt-2">12 Ekim 2024, 14:30</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-electric-default text-xl">₺950,00</div>
                      <a href="#" className="text-sm text-electric-default hover:text-white transition-colors underline decoration-electric-default/50 hover:decoration-white mt-1 inline-block">Faturayı Görüntüle</a>
                    </div>
                  </div>
                  <div className="flex gap-3 text-sm text-slate-300 bg-navy-900 border border-navy-700 p-3 rounded-lg mt-4 items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
                    <span className="font-medium">Kargo Takip:</span>
                    <a href="#" className="text-blue-400 hover:text-blue-300 hover:underline font-mono">YURTİÇİ Kargo - 123456789</a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
