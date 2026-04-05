import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-navy-900 border-t border-navy-800 pt-16 pb-8 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-electric-default/5 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-16">
          <div className="lg:col-span-2">
            <Link href="/" className="text-3xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-electric-default to-cyan-400 inline-block mb-6">
              Technocus<span className="text-electric-default">.</span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-sm">
              <strong className="text-electric-default block text-lg mb-2">"Technocus: Teknolojinin Merkezi"</strong>
              Türkiye'nin lider maker, robotik ve elektronik komponent platformu. En yeni modüller, dev kartlar ve yenilikçi projeler için güvenilir adresiniz.
            </p>
            <div className="flex gap-4">
               {/* Social Icons */}
               <a href="https://instagram.com/kagannk_" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-navy-800 border border-navy-700 flex items-center justify-center text-slate-400 hover:text-white hover:bg-electric-default hover:border-electric-default transition-all shadow-lg">
                 <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
               </a>
               <a href="#" className="w-10 h-10 rounded-full bg-navy-800 border border-navy-700 flex items-center justify-center text-slate-400 hover:text-white hover:bg-pink-600 hover:border-pink-600 transition-all shadow-lg">
                 <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
               </a>
               <a href="#" className="w-10 h-10 rounded-full bg-navy-800 border border-navy-700 flex items-center justify-center text-slate-400 hover:text-white hover:bg-indigo-600 hover:border-indigo-600 transition-all shadow-lg">
                 <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
               </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-white mb-5 uppercase tracking-wider text-sm">Hızlı Linkler</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link href="/about" className="hover:text-electric-default transition-colors">Hakkımızda</Link></li>
              <li><Link href="/products" className="hover:text-electric-default transition-colors">Tüm Ürünler</Link></li>
              <li><Link href="/faq" className="hover:text-electric-default transition-colors">Sıkça Sorulan Sorular</Link></li>
              <li><Link href="/contact" className="hover:text-electric-default transition-colors">İletişim</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-white mb-5 uppercase tracking-wider text-sm">Kurumsal</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link href="/terms" className="hover:text-electric-default transition-colors">Kullanım Koşulları</Link></li>
              <li><Link href="/privacy" className="hover:text-electric-default transition-colors">Gizlilik Politikası</Link></li>
              <li><Link href="/kvkk" className="hover:text-electric-default transition-colors">KVKK Aydınlatma Metni</Link></li>
              <li><Link href="/return-policy" className="hover:text-electric-default transition-colors">İade Politikası</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-white mb-5 uppercase tracking-wider text-sm">İletişim</h4>
            <div className="space-y-4 text-sm text-slate-400">
              <div className="flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-electric-default mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <p>Levent, İstanbul</p>
              </div>
              <div className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-electric-default" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                <p>info@technocus.example</p>
              </div>
              <div className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-electric-default" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                <p>+90 (212) 555 0123</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center border-t border-navy-800 pt-8 mt-8">
          <p className="text-sm text-slate-500 mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Technocus. Tüm hakları saklıdır.
          </p>
          <div className="flex items-center gap-4 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all">
             {/* Payment & Shipping Logos */}
             <div className="bg-white px-2 py-1 rounded">
               <span className="text-xs font-black text-rose-600 tracking-tighter">IYZICO</span>
             </div>
             <div className="bg-white px-2 py-1 rounded flex items-center h-6">
               <span className="text-xs font-black text-blue-900 tracking-tighter italic">VISA</span>
             </div>
             <div className="bg-white px-2 py-1 rounded flex items-center h-6">
               <div className="w-4 h-4 rounded-full bg-red-500 translate-x-1 mix-blend-multiply"></div>
               <div className="w-4 h-4 rounded-full bg-yellow-500 -translate-x-1 mix-blend-multiply"></div>
             </div>
             <div className="bg-white px-2 py-1 rounded flex items-center h-6">
               <span className="text-xs font-black text-red-600 tracking-tighter">ARAS</span>
             </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
