export default function AboutPage() {
  return (
    <div className="py-12 max-w-4xl mx-auto space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-black text-white">Hakkımızda</h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto">
          Technocus, Türkiye'nin lider maker, robotik ve elektronik donanım kütüphanesidir. Yenilikçiliği ve üretmeyi seven herkes için tek durak noktası olmayı hedefliyoruz.
        </p>
      </div>

      <div className="bg-navy-800 border border-navy-700 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-electric-default/10 rounded-full blur-[80px]"></div>
         <div className="relative z-10 space-y-8 text-slate-300 leading-relaxed text-lg">
           <p>
             <strong>Hikayemiz:</strong> 2018 yılında küçük bir garaj atölyesinde başlayan serüvenimiz, bugün Türkiye'nin 81 iline hizmet veren devasa bir lojistik dağıtım merkezine dönüştü. "Maker hareketi"nin ülkemizde hak ettiği değeri bulması ve öğrencisinden mühendisine herkesin en kaliteli elektronik komponentlere ulaşabilmesi için yola çıktık.
           </p>
           <p>
             <strong>Misyonumuz:</strong> Teknolojiyi ve yazılımı elle tutulur donanımlara dönüştürmek isteyen herkese ilham vermek. En güncel Arduino, Raspberry Pi, Sensör, Motor ve Drone kitlerini en hızlı ve en uygun fiyatlarla sunarak "Kendin Yap (DIY)" kültürünü yaygınlaştırmak.
           </p>
           <p>
             <strong>Vizyonumuz:</strong> Dünya standartlarında donanım tedarik altyapısı kurarak Avrupa'nın en büyük hobi ve endüstriyel elektronik e-ticaret platformlarından biri olmak. Genç yeteneklere sponsorluklarla destek olmak, atölyelere ve okullara teknoloji laboratuvarları kazandırmak.
           </p>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-navy-800 border border-navy-700 p-8 rounded-2xl text-center">
            <h3 className="text-4xl font-black text-electric-default mb-2">+10K</h3>
            <p className="text-slate-400 font-medium">Mutlu Müşteri</p>
         </div>
         <div className="bg-navy-800 border border-navy-700 p-8 rounded-2xl text-center">
            <h3 className="text-4xl font-black text-cyan-400 mb-2">+5000</h3>
            <p className="text-slate-400 font-medium">Çeşit Ürün</p>
         </div>
         <div className="bg-navy-800 border border-navy-700 p-8 rounded-2xl text-center">
            <h3 className="text-4xl font-black text-purple-400 mb-2">24 Saat</h3>
            <p className="text-slate-400 font-medium">Ortalama Teslimat</p>
         </div>
      </div>

      <div className="bg-navy-800/50 border border-navy-700 rounded-3xl p-8 text-center mt-12">
        <h2 className="text-2xl font-bold text-white mb-4">Mühendislerimiz ve Ekibimiz</h2>
        <p className="text-slate-400 mb-6">Elektrik-Elektronik, Mekatronik ve Yazılım alanında uzmanlaşmış 40 kişilik kadromuz, satın alma öncesi ve sonrasında teknik destek hattı ile daima yanınızdadır.</p>
        <div className="flex justify-center gap-2">
           <span className="w-16 h-1 bg-electric-default rounded-full"></span>
           <span className="w-4 h-1 bg-electric-default rounded-full opacity-50"></span>
           <span className="w-2 h-1 bg-electric-default rounded-full opacity-20"></span>
        </div>
      </div>
      
      <div className="mt-8 pt-6 border-t border-navy-800 text-center">
        <p className="text-sm font-semibold text-slate-500 bg-navy-800/80 inline-block px-4 py-2 rounded-xl border border-navy-700">
          Bu site bir okul ödevi projesi olarak geliştirilmiştir. Ticari amaç taşımamaktadır.
        </p>
      </div>
    </div>
  );
}
