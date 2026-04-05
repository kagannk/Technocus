import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ToastProvider from "@/providers/ToastProvider";
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Technocus | Yeni Nesil Teknoloji Mağazası",
  description: "Arduino, Raspberry Pi, drone ve endüstriyel elektronik komponentlerde Teknolojinin Merkezi. Bütün siparişlerinizde aynı gün ücretsiz kargo garantisi.",
  keywords: "arduino, raspberry pi, drone parçaları, maker seti, robotik kodlama, 3d yazıcı, elektronik parça"
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body className="bg-navy-950 text-slate-200 font-sans selection:bg-electric-default selection:text-white">
        <Navbar />
        <main className="container mx-auto px-4 min-h-screen">
          {children}
        </main>
        <Footer />
        <Toaster position="top-right" />
      </body>
    </html>
  )
}
