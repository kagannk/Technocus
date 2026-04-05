"use client";

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await apiFetch('/api/admin/dashboard-stats');
        setStats(data);
      } catch (error) {
        console.error("Failed to load dashboard stats", error);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  if (loading) {
    return <div className="h-full flex items-center justify-center min-h-[500px]"><div className="w-8 h-8 border-4 border-electric-default border-t-transparent rounded-full animate-spin"></div></div>;
  }

  const chartData = {
    labels: stats?.sales_history?.map((s: any) => s.date) || [],
    datasets: [
      {
        fill: true,
        label: 'Günlük Ciro (TL)',
        data: stats?.sales_history?.map((s: any) => s.amount) || [],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#94a3b8' } },
      x: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#94a3b8' } }
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-navy-800 p-6 rounded-xl border border-navy-700 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-electric-default/10 rounded-bl-full -mr-4 -mt-4"></div>
          <p className="text-slate-400 text-sm font-medium mb-1">Toplam Sipariş</p>
          <h3 className="text-3xl font-bold text-white">{stats?.total_orders || 0}</h3>
        </div>
        <div className="bg-navy-800 p-6 rounded-xl border border-navy-700 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/10 rounded-bl-full -mr-4 -mt-4"></div>
          <p className="text-slate-400 text-sm font-medium mb-1">Bekleyen Sipariş</p>
          <h3 className="text-3xl font-bold text-orange-400">{stats?.pending_orders || 0}</h3>
        </div>
        <div className="bg-navy-800 p-6 rounded-xl border border-navy-700 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/10 rounded-bl-full -mr-4 -mt-4"></div>
          <p className="text-slate-400 text-sm font-medium mb-1">Toplam Gelir</p>
          <h3 className="text-3xl font-bold text-green-400">₺{(stats?.total_revenue || 0).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</h3>
        </div>
        <div className="bg-navy-800 p-6 rounded-xl border border-navy-700 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/10 rounded-bl-full -mr-4 -mt-4"></div>
          <p className="text-slate-400 text-sm font-medium mb-1">Kritik Stok Uyarısı</p>
          <h3 className="text-3xl font-bold text-red-400">{stats?.low_stock_count || 0} <span className="text-base font-normal text-slate-500">ürün</span></h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-navy-800 p-6 rounded-xl border border-navy-700 shadow-lg">
          <h2 className="text-lg font-bold text-white mb-6">Son 7 Günlük Satış Grafiği</h2>
          <div className="h-80 w-full">
            <Line options={chartOptions} data={chartData} />
          </div>
        </div>
        
        <div className="bg-navy-800 p-6 rounded-xl border border-navy-700 shadow-lg">
          <h2 className="text-lg font-bold text-white mb-6">Sistem Özetleri</h2>
          <div className="space-y-4">
            <div className="p-4 bg-navy-900 rounded-lg border border-navy-700 flex items-center gap-4">
              <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center text-cyan-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <div>
                <p className="text-white font-medium text-sm">Sistem Durumu</p>
                <p className="text-slate-400 text-xs">Tüm servisler aktif (n8n, İyzico, Aras)</p>
              </div>
            </div>
            <div className="p-4 bg-navy-900 rounded-lg border border-navy-700 flex items-center gap-4">
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center text-purple-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <div>
                <p className="text-white font-medium text-sm">Günün Fırsatları</p>
                <p className="text-slate-400 text-xs">2 aktif kampanya yayında</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
