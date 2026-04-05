"use client";

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { useCartStore } from '@/store/useCartStore';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const { getTotalItems, _hasHydrated } = useCartStore();

  useEffect(() => {
    setIsClient(true);
    const handleScroll = () => {
    setIsScrolled(window.scrollY > 20);
    setMounted(true);
    };
    window.addEventListener('scroll', handleScroll);
    
    // Check auth status
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      setUserName(localStorage.getItem('user_name') || 'Hesabım');
    }

    // Click outside search
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Debounced Search
  useEffect(() => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    
    if (searchQuery.trim().length >= 2) {
      searchTimeoutRef.current = setTimeout(async () => {
        try {
          const data = await apiFetch(`/api/products/search?q=${encodeURIComponent(searchQuery)}&limit=5`);
          setSuggestions(data);
          setShowSuggestions(true);
        } catch (e) {
          console.error(e);
        }
      }, 400); // 400ms debounce
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
    
    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, [searchQuery]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user_name');
    setIsAuthenticated(false);
    setIsUserMenuOpen(false);
    router.push('/');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSuggestions(false);
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsMenuOpen(false);
    }
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 top-0 left-0 ${isScrolled ? 'bg-navy-900/95 backdrop-blur-md shadow-xl border-b border-navy-700/50 py-2' : 'bg-transparent backdrop-blur-sm border-b border-navy-700/30 py-4'}`}>
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex items-center gap-6">
          <Link href="/" className="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-electric-default to-cyan-400 transition-all hover:scale-105 flex items-center gap-2 shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 text-electric-default">
              <path fillRule="evenodd" d="M14.615 1.595a.75.75 0 0 1 .359.852L12.982 9.75h7.268a.75.75 0 0 1 .548 1.262l-10.5 11.25a.75.75 0 0 1-1.272-.71l1.992-7.302H3.75a.75.75 0 0 1-.548-1.262l10.5-11.25a.75.75 0 0 1 .913-.143Z" clipRule="evenodd" />
            </svg>
            Technocus<span className="text-electric-default">.</span>
          </Link>
          
          {/* Desktop Links */}
          <div className="hidden lg:flex space-x-6">
            <Link href="/products" className="text-sm font-semibold text-slate-300 hover:text-white transition-colors">Tüm Ürünler</Link>
            <Link href="/categories/drone" className="text-sm font-semibold text-slate-300 hover:text-white transition-colors">Drone</Link>
            <Link href="/categories/elektronik" className="text-sm font-semibold text-slate-300 hover:text-white transition-colors">Elektronik</Link>
            <Link href="/categories/robotik" className="text-sm font-semibold text-slate-300 hover:text-white transition-colors">Robotik</Link>
          </div>
        </div>

        {/* Search Bar (Desktop) */}
        <div className="hidden md:flex flex-1 max-w-md mx-6" ref={searchRef}>
          <form onSubmit={handleSearch} className="relative w-full group">
            <input 
              type="text" 
              placeholder="Ürün, kategori veya marka ara..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => { if(suggestions.length > 0) setShowSuggestions(true); }}
              className="w-full bg-navy-800/80 border border-navy-600 focus:border-electric-default focus:ring-1 focus:ring-electric-default rounded-full py-2.5 pl-12 pr-4 text-sm text-white transition-all placeholder:text-slate-500 shadow-inner group-hover:bg-navy-800"
            />
            <button type="submit" className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-electric-default transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </button>
            
            {/* Live Search Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-navy-800 border border-navy-600 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in slide-in-from-top-2">
                {suggestions.map(item => (
                  <Link 
                    key={item.id} 
                    href={`/products/${item.slug}-${item.id}`} 
                    onClick={() => setShowSuggestions(false)}
                    className="flex items-center gap-3 p-3 hover:bg-navy-700 transition-colors border-b border-navy-700/50 last:border-0"
                  >
                    <div className="w-10 h-10 bg-white rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden">
                       <img src={item.image_urls?.[0] || 'https://placehold.co/100x100?text=Ürün'} className="w-full h-full object-contain" alt={item.name} />
                    </div>
                    <div className="flex-1 min-w-0">
                       <h4 className="text-sm font-bold text-white truncate">{item.name}</h4>
                       <p className="text-xs text-electric-default">₺{item.price.toLocaleString('tr-TR', {minimumFractionDigits:2})}</p>
                    </div>
                  </Link>
                ))}
                <button 
                  type="submit" 
                  className="w-full p-3 text-center text-sm text-slate-400 hover:text-white hover:bg-navy-700 transition-colors bg-navy-900/50"
                >
                  Tüm sonuçları gör &rarr;
                </button>
              </div>
            )}
            
          </form>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-5">
          <button className="md:hidden text-slate-300 hover:text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </button>

          <Link href="/cart" className="text-slate-300 hover:text-electric-default transition-colors relative group">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.35 2.7a1 1 0 00.9 1.4h11.5M10 21a2 2 0 100-4 2 2 0 000 4zm7 0a2 2 0 100-4 2 2 0 000 4z" />
            </svg>
            {isClient && _hasHydrated && getTotalItems() > 0 && (
              <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-rose-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-lg border-2 border-navy-900 leading-none">
                {getTotalItems()}
              </span>
            )}
          </Link>
          
          <div className="hidden sm:flex items-center gap-3 border-l border-navy-700 pl-5 ml-2">
            {isAuthenticated ? (
              <div className="relative">
                <button 
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 text-sm font-semibold text-slate-200 hover:text-white transition-colors group"
                >
                  <div className="w-8 h-8 rounded-full bg-navy-700 flex items-center justify-center border border-navy-600 group-hover:border-electric-default transition-colors overflow-hidden">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400 group-hover:text-electric-default" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  </div>
                  <span className="truncate max-w-[100px]">{userName}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 text-slate-500 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-3 w-48 bg-navy-800 border border-navy-700 shadow-2xl rounded-xl py-2 overflow-hidden animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2 border-b border-navy-700/50 mb-1">
                      <p className="text-xs text-slate-500">Hoş geldiniz</p>
                      <p className="text-sm font-bold text-white truncate">{userName}</p>
                    </div>
                    <Link href="/account/orders" onClick={() => setIsUserMenuOpen(false)} className="block px-4 py-2 text-sm text-slate-300 hover:bg-navy-700 hover:text-white transition-colors">Siparişlerim</Link>
                    <Link href="/account/profile" onClick={() => setIsUserMenuOpen(false)} className="block px-4 py-2 text-sm text-slate-300 hover:bg-navy-700 hover:text-white transition-colors">Profil Ayarları</Link>
                    <Link href="/account/addresses" onClick={() => setIsUserMenuOpen(false)} className="block px-4 py-2 text-sm text-slate-300 hover:bg-navy-700 hover:text-white transition-colors">Adreslerim</Link>
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors mt-1 border-t border-navy-700/50 pt-3">
                      Çıkış Yap
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/login" className="text-sm font-bold text-slate-300 hover:text-white transition-colors px-2">Giriş Yap</Link>
                <Link href="/register" className="btn-primary text-sm py-2 px-5 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.25)] hover:shadow-[0_0_20px_rgba(59,130,246,0.4)]">
                  Kayıt Ol
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-navy-900 border-b border-navy-700 shadow-2xl animate-in slide-in-from-top-2">
          <div className="p-4 space-y-4">
            <form onSubmit={handleSearch} className="relative w-full mb-6">
              <input 
                type="text" 
                placeholder="Ürün Ara..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-navy-800 border border-navy-600 rounded-lg py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-electric-default"
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </form>
            
            <div className="flex flex-col space-y-3 pb-4 border-b border-navy-800">
              <Link href="/products" onClick={() => setIsMenuOpen(false)} className="text-lg font-bold text-white">Tüm Ürünler</Link>
              <Link href="/categories/drone" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium text-slate-300">Drone</Link>
              <Link href="/categories/elektronik" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium text-slate-300">Elektronik</Link>
              <Link href="/categories/robotik" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium text-slate-300">Robotik</Link>
            </div>

            <div className="pt-2 flex flex-col gap-3">
              {isAuthenticated ? (
                <>
                  <Link href="/account/orders" onClick={() => setIsMenuOpen(false)} className="text-base text-slate-300 flex items-center gap-3"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-electric-default" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg> Siparişlerim</Link>
                  <Link href="/account/profile" onClick={() => setIsMenuOpen(false)} className="text-base text-slate-300 flex items-center gap-3"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> Profil Ayarları</Link>
                  <button onClick={handleLogout} className="text-left text-base text-red-400 mt-2 font-bold">Çıkış Yap</button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <Link href="/login" onClick={() => setIsMenuOpen(false)} className="btn-secondary text-center py-2.5 rounded-lg font-bold">Giriş Yap</Link>
                  <Link href="/register" onClick={() => setIsMenuOpen(false)} className="btn-primary text-center py-2.5 rounded-lg shadow-lg font-bold">Kayıt Ol</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
