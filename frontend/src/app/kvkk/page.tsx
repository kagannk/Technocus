export default function KvkkPage() {
  return (
    <div className="py-12 max-w-4xl mx-auto min-h-[60vh]">
      <div className="bg-navy-800 border border-navy-700 rounded-3xl p-8 md:p-12 shadow-2xl">
        <h1 className="text-3xl md:text-4xl font-black text-white mb-8 border-b border-navy-700 pb-6">
          Kişisel Verilerin Korunması (KVKK) Aydınlatma Metni
        </h1>
        
        <div className="space-y-8 text-slate-300 leading-relaxed text-sm md:text-base">
          <section>
            <h2 className="text-xl font-bold text-electric-default mb-3">1. Veri Sorumlusunun Kimliği</h2>
            <p>
              6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca, Technocus Elektronik Ticaret A.Ş. ("Şirket") olarak, veri sorumlusu sıfatıyla, kişisel verilerinizi aşağıda açıklanan amaçlar kapsamında; hukuka ve dürüstlük kurallarına uygun bir şekilde işleyebilecek, kaydedebilecek, saklayabilecek, sınıflandırabilecek, güncelleyebilecek ve mevzuatın izin verdiği hallerde üçüncü kişilere açıklayabilecek/aktarabileceğiz.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-electric-default mb-3">2. Kişisel Verilerin İşlenme Amacı</h2>
            <p>
              Toplanan kişisel verileriniz, Şirketimiz tarafından sunulan ürün ve hizmetlerden sizleri faydalandırmak için gerekli çalışmaların iş birimlerimiz tarafından yapılması, sipariş süreçlerinin yürütülmesi, teslimatların sağlanması, ödeme işlemlerinin alınması, müşteri memnuniyeti aktivitelerinin planlanması ve icrası, ticari ve elektronik pazarlama faaliyetlerinin yürütülmesi (onayınız var ise) amaçlarıyla işlenmektedir.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-electric-default mb-3">3. Kişisel Verilerin Aktarılması</h2>
            <p>
              İşlenen kişisel verileriniz; yukarıda belirtilen amaçların gerçekleştirilmesi doğrultusunda, kargo ve lojistik şirketlerine (örn. Aras Kargo), ödeme altyapısı sağlayıcılarına (örn. iyzico), tedarikçilerimize, kanunen yetkili kamu kurumlarına ve özel kişi veya kuruluşlara KVKK’nın 8. ve 9. maddelerinde belirtilen kişisel veri işleme şartları çerçevesinde aktarılabilecektir.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-electric-default mb-3">4. Veri Sahibinin Hakları</h2>
            <p>
              KVKK'nın 11. maddesi uyarınca veri sahipleri;
            </p>
            <ul className="list-disc pl-6 mt-3 space-y-2 text-slate-400">
              <li>Kişisel verilerinin işlenip işlenmediğini öğrenme,</li>
              <li>Kişisel verileri işlenmişse buna ilişkin bilgi talep etme,</li>
              <li>İşlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme,</li>
              <li>Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme,</li>
              <li>Eksik veya yanlış işlenmiş olması hâlinde bunların düzeltilmesini isteme haklarına sahiptir.</li>
            </ul>
            <p className="mt-4">
              Haklarınızı kullanmak için <strong className="text-white">kvkk@technocus.example</strong> adresine e-posta gönderebilirsiniz. Talepleriniz en geç 30 gün içinde ücretsiz olarak sonuçlandırılacaktır.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
