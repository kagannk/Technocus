"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    // Allow login page access regardless of auth state to prevent infinite loops, 
    // but typically you'd redirect away if they are already logged in. Simple implementation for now.
    if (pathname === '/admin/login') {
      setIsAuthenticated(true);
      return;
    }

    if (!token || role !== 'admin') {
      router.push('/admin/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [pathname, router]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy-900">
        <div className="w-8 h-8 border-4 border-electric-default border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-navy-900 font-sans text-slate-300">
      <AdminSidebar currentPath={pathname} />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col pt-16 lg:pt-0 lg:ml-64 transition-all duration-300">
        {/* Header */}
        <header className="h-16 bg-navy-800 border-b border-navy-700 flex items-center justify-between px-6 sticky top-0 z-20 shadow-sm">
          <div className="font-semibold text-white truncate flex items-center gap-2">
            <span className="lg:hidden text-electric-default font-bold tracking-wide">TECHNOCUS</span>
            <span className="hidden lg:inline">Yönetim Paneli / {pathname.split('/').pop()?.toUpperCase() || 'DASHBOARD'}</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end mr-2 hidden sm:flex">
              <span className="text-sm font-semibold text-white">Sistem Yöneticisi</span>
              <span className="text-xs text-slate-400">admin@technocus.com</span>
            </div>
            <div className="w-10 h-10 bg-gradient-to-tr from-electric-default to-cyan-500 rounded-lg flex items-center justify-center text-white font-bold shadow-lg">
              A
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 md:p-8 overflow-x-hidden bg-[#0A0F1D]">
          {children}
        </main>
      </div>
    </div>
  );
}
