"use client";
import { Toaster } from "react-hot-toast";

export default function ToastProvider() {
  return (
    <Toaster 
      position="bottom-right" 
      toastOptions={{
        className: 'font-medium',
        style: {
          background: '#0F172A',
          color: '#fff',
          border: '1px solid #1E293B',
          borderRadius: '0.75rem',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
        },
        success: {
          iconTheme: {
            primary: '#10B981',
            secondary: '#0F172A',
          },
        },
        error: {
          iconTheme: {
            primary: '#EF4444',
            secondary: '#0F172A',
          },
        },
      }} 
    />
  );
}
