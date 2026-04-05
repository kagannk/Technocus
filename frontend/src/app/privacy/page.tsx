export default function PrivacyPage() {
  return (
    <div className="py-12 max-w-4xl mx-auto min-h-[60vh]">
      <div className="bg-navy-800 border border-navy-700 rounded-3xl p-8 md:p-12 shadow-2xl">
        <h1 className="text-3xl md:text-4xl font-black text-white mb-8 border-b border-navy-700 pb-6">
          Gizlilik Politikası
        </h1>
        
        <div className="space-y-8 text-slate-300 leading-relaxed text-sm md:text-base">
          <section>
            <p>
              Technocus olarak kullanıcılarımızın özel hayatlarının gizliliğine ve kişisel verilerinin güvenliğine büyük önem vermekteyiz. Bu Gizlilik Politikası, www.technocus.example ("Web Sitesi") adresini ziyaret eden veya platforma üye olan kullanıcıların ("Kullanıcı") bilgilerinin nasıl toplandığını, kullanıldığını ve korunduğunu açıklamaktadır.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-electric-default mb-3">Toplanan Bilgiler</h2>
            <p>
              Üyelik formu, sipariş ekranları ve iletişim formları aracılığıyla ad-soyad, e-posta adresi, telefon numarası, teslimat ve fatura adresleri gibi kimlik ve iletişim bilgilerinizi toplamaktayız. Kredi kartı tahsilat işlemleri iyzico altyapısı üzerinden gerçekleşmekte olup, kredi kartı bilgileriniz sistemimizde <strong>kesinlikle saklanmamaktadır</strong>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-electric-default mb-3">Çerezler (Cookies) ve İzleme</h2>
            <p>
              Web sitemizi daha verimli kullanabilmeniz ve alışveriş deneyiminizi özelleştirebilmemiz için (örn. sepetinizdeki ürünlerin hatırlanması) çerezler kullanmaktayız. Tarayıcı ayarlarınızdan çerezleri dilediğiniz zaman reddedebilir veya silebilirsiniz, ancak bu durumda sitenin bazı fonksiyonları tam çalışmayabilir.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-electric-default mb-3">Bilgi Güvenliği</h2>
            <p>
              Kişisel bilgilerinizin yetkisiz erişim, kayıp, kullanım ve ifşasına karşı korunması için gelişmiş ağ güvenlik standartları (256-bit SSL sertifikası) kullanılmaktadır. Veritabanlarımız dünya standartlarındaki bulut altyapılarında şifreli olarak barındırılmaktadır.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-electric-default mb-3">İletişim İzinleri</h2>
            <p>
              Eğer açık rızanız bulunuyorsa, e-posta adresinize veya cep telefonunuza kampanya, indirim ve yeni ürün bildirimleri gönderilebilir. Dilediğiniz zaman "Hesabım" paneli üzerinden veya gelen e-postadaki linke tıklayarak bu abonelikten anında ayrılabilirsiniz.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
