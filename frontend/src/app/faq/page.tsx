"use client";
import { useState } from "react";

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "Siparişim kaç günde teslim edilir?",
      a: "İstanbul içi siparişleriniz aynı gün kurye ile, Türkiye'nin diğer illerine olan siparişleriniz ise 16:00'a kadar verildiği takdirde aynı gün Aras Kargo ile kargoya teslim edilmektedir. Ortalama teslimat süresi 1-3 iş günüdür."
    },
    {
      q: "Kargo ücretiniz ne kadar?",
      a: "Tüm Türkiye'ye sabit kargo ücreti 49.90 TL'dir. 500 TL ve üzeri alışverişlerinizde kargo ücretsizdir!"
    },
    {
      q: "İade işlemlerini nasıl yapabilirim?",
      a: "Satın aldığınız ürünü kullanılmamış ve paketi bozulmamış olması şartıyla 14 gün içerisinde faturası ile birlikte iade edebilirsiniz. Hesabınız menüsündeki Siparişlerim bölümünden iade kodu alarak Aras Kargo ile ücretsiz gönderebilirsiniz."
    },
    {
      q: "Teknik destek veriyor musunuz?",
      a: "Evet! Özellikle Arduino kitleri, drone kurulumları ve Raspberry Pi projelerinde uzman mühendis kadromuz size e-posta üzerinden teknik destek sağlamaktadır."
    },
    {
      q: "Kurumsal fatura kesiyor musunuz?",
      a: "Evet. Ödeme sayfasında 'Kurumsal Fatura' seçeneğini işaretleyerek Vergi Numaranızı ve Vergi Dairenizi girdiğiniz takdirde e-faturanız doğrudan belirttiğiniz e-posta adresinize iletilir."
    },
    {
      q: "Stokta olmayan ürünler ne zaman gelir?",
      a: "Stokta bulunmayan ürünlerin detay sayfasında 'Gelince Haber Ver' butonunu kullanarak e-posta bültenimize abone olabilirsiniz. Ürün stoğumuz haftalık olarak güncellenmektedir."
    }
  ];

  return (
    <div className="py-12 max-w-3xl mx-auto min-h-[60vh]">
      <div className="text-center space-y-4 mb-16">
         <span className="inline-block py-1.5 px-4 rounded-full bg-electric-default/10 text-electric-default text-sm font-bold tracking-widest uppercase border border-electric-default/20">Destek Merkezi</span>
        <h1 className="text-4xl md:text-5xl font-black text-white">Sıkça Sorulan Sorular</h1>
        <p className="text-lg text-slate-400">
          En çok merak edilen soruları sizin için yanıtladık. Eğer aradığınızı bulamazsanız bizimle iletişime geçebilirsiniz.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div 
              key={index} 
              className={`bg-navy-800 border rounded-2xl overflow-hidden transition-all duration-300 ${isOpen ? 'border-electric-default shadow-[0_0_20px_rgba(59,130,246,0.15)]' : 'border-navy-700 hover:border-navy-600'}`}
            >
              <button 
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
              >
                <span className={`text-lg font-bold ${isOpen ? 'text-electric-default' : 'text-white'}`}>
                  {faq.q}
                </span>
                <span className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-electric-default text-white rotate-180' : 'bg-navy-700 text-slate-400'}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </span>
              </button>
              <div 
                className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <div className="p-6 pt-0 text-slate-300 leading-relaxed border-t border-navy-700/50 mt-2">
                  {faq.a}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
