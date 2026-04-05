export default function TermsPage() {
  return (
    <div className="py-12 max-w-4xl mx-auto min-h-[60vh]">
      <div className="bg-navy-800 border border-navy-700 rounded-3xl p-8 md:p-12 shadow-2xl">
        <h1 className="text-3xl md:text-4xl font-black text-white mb-8 border-b border-navy-700 pb-6">
          Kullanım Koşulları ve Mesafeli Satış Sözleşmesi
        </h1>
        
        <div className="space-y-8 text-slate-300 leading-relaxed text-sm md:text-base">
          <section>
              İşbu sözleşme, "Technocus Teknoloji Vadisi, Maker Sokak No:42 Kadıköy/İstanbul" adresinde mukim Technocus Elektronik A.Ş. (bundan böyle "Satıcı" olarak anılacaktır) ile www.technocus.com internet sitesinden (bundan böyle "Site" olarak anılacaktır) alışveriş yapan veya siteye üye olan internet kullanıcı (bundan böyle "Alıcı" veya "Kullanıcı" olarak anılacaktır) arasında akdedilmiştir.
          </section>

          <section>
            <h2 className="text-xl font-bold text-electric-default mb-3">2. Sözleşmenin Konusu</h2>
            <p>
              İşbu sözleşmenin konusu, Alıcı'nın Satıcı'ya ait Site'den elektronik ortamda siparişini yaptığı ürün/hizmetin satışı, teslimatı ve iadesi ile ilgili olarak 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği hükümleri gereğince tarafların hak ve yükümlülüklerinin saptanmasıdır.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-electric-default mb-3">3. Satıcı Hak ve Yükümlülükleri</h2>
            <p>
              Satıcı, sipariş edilen ürünü eksiksiz, ayıpsız ve siparişte belirtilen niteliklere uygun şekilde (varsa garanti belgeleri ve kullanım kılavuzları ile birlikte) teslim etmeyi kabul ve taahhüt eder. Site üzerindeki ürün içerikleri, fiyatları, teknik özellikleri Satıcı tarafından haber verilmeksizin değiştirilebilir.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-electric-default mb-3">4. İade ve Cayma Hakkı</h2>
            <p>
              Alıcı, satın aldığı ürünün kendisine veya gösterdiği adresteki kişi/kuruluşa teslim tarihinden itibaren 14 (on dört) gün içerisinde hiçbir hukuki ve cezai sorumluluk üstlenmeksizin ve hiçbir gerekçe göstermeksizin malı reddederek sözleşmeden cayma hakkına sahiptir. Cayma hakkının kullanımı için ürünün ambalajının açılmamış, lehimlenmemiş, yanmamış veya tahrip olmamış olması gerekmektedir. (Açık kaynak tabanlı elektronik modüllerde lehim yapılması veya kısa devre yaptırılması iade hakkını geçersiz kılar).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-electric-default mb-3">5. Uyuşmazlıkların Çözümü</h2>
            <p>
              İşbu sözleşmenin uygulanmasında, Gümrük ve Ticaret Bakanlığınca ilan edilen değere kadar Alıcı'nın mal veya hizmeti satın aldığı veya ikametgahının bulunduğu yerdeki Tüketici Hakem Heyetleri ile Tüketici Mahkemeleri yetkilidir.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
