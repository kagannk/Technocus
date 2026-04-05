"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  if (!mounted) return null;

  const links = [
    { href: '/account/orders', label: 'Siparişlerim', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' },
    { href: '/account/profile', label: 'Profil Bilgilerim', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { href: '/account/addresses', label: 'Adres Defterim', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  ];

  return (
    <div className="py-10 max-w-6xl mx-auto flex flex-col md:flex-row gap-8 min-h-[60vh]">
      <aside className="w-full md:w-72 shrink-0">
         <div className="bg-navy-800 border border-navy-700 rounded-2xl p-5 sticky top-28 shadow-xl">
           <h2 className="text-xl font-bold text-white mb-6 px-2 border-b border-navy-700 pb-4">İşlemlerim</h2>
           <nav className="space-y-2">
             {links.map(link => {
               const isActive = pathname === link.href;
               return (
                 <Link key={link.href} href={link.href} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-gradient-to-r from-electric-default to-cyan-500 text-white font-bold shadow-lg' : 'text-slate-300 hover:bg-navy-700 hover:text-white'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isActive ? 2.5 : 2} d={link.icon} /></svg>
                    {link.label}
                 </Link>
               )
             })}
             <button onClick={() => { localStorage.clear(); router.push('/'); }} className="w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors mt-6 border-t border-navy-700 pt-5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                Güvenli Çıkış
             </button>
           </nav>
         </div>
      </aside>
      <main className="flex-1 bg-navy-800 border border-navy-700 rounded-2xl p-6 md:p-8 shadow-xl">
        {children}
      </main>
    </div>
  );
}
