// This file contains template data for the presentation module
// These are fallback templates in case the Supabase connection fails

export const defaultTemplates = [
  {
    id: 'template-brc',
    name: 'BRC Zararlı Mücadelesi Eğitimi',
    standard: 'BRC',
    description: 'BRC standardına uygun zararlı mücadelesi eğitim sunumu',
    slides: [
      {
        id: 'slide-1',
        type: 'title',
        content: {
          title: 'BRC Standardında Zararlı Mücadelesi',
          subtitle: 'Gıda Güvenliği için Kapsamlı Yaklaşım'
        },
        background: '#ffffff'
      },
      {
        id: 'slide-2',
        type: 'content',
        content: {
          title: 'BRC Standardı Nedir?',
          bullets: [
            'British Retail Consortium tarafından geliştirilen gıda güvenliği standardı',
            'Dünya çapında kabul gören sertifikasyon sistemi',
            'Gıda güvenliği, kalite ve operasyonel kriterleri içerir',
            'Zararlı mücadelesi, standardın önemli bir bileşenidir',
            'Versiyon 9 ile daha kapsamlı zararlı mücadele gereksinimleri',
            'Perakende sektörü için temel gereksinim'
          ]
        },
        background: '#ffffff'
      },
      {
        id: 'slide-3',
        type: 'content',
        content: {
          title: 'BRC Zararlı Mücadele Gereksinimleri',
          bullets: [
            'Kapsamlı zararlı mücadele programı',
            'Risk değerlendirme ve haritalama',
            'Düzenli monitoring ve kayıt tutma',
            'Eğitimli personel ve yetkinlik kanıtları',
            'Dokümantasyon sistemi',
            'Tedarikçi değerlendirmesi',
            'Acil durum prosedürleri',
            'Trend analizi ve sürekli iyileştirme'
          ]
        },
        background: '#ffffff'
      },
      {
        id: 'slide-4',
        type: 'two-column',
        content: {
          title: 'BRC Madde 4.11: Zararlı Mücadelesi',
          leftTitle: 'Gereksinimler',
          leftContent: [
            'Zararlı mücadele programının kurulması',
            'Yazılı prosedürlerin oluşturulması',
            'Düzenli monitoring yapılması',
            'Kayıtların tutulması',
            'Personel eğitimi',
            'Tedarikçi yönetimi'
          ],
          rightTitle: 'Uygulamalar',
          rightContent: [
            'Tesis risk haritası',
            'Zararlı türleri tanımlaması',
            'Kontrol yöntemleri belirlenmesi',
            'Acil durum prosedürleri',
            'Periyodik denetimler',
            'Düzeltici eylem planları'
          ]
        },
        background: '#ffffff'
      },
      {
        id: 'slide-5',
        type: 'content',
        content: {
          title: 'BRC Audit Hazırlık Süreci',
          bullets: [
            'Gap analizi ve mevcut durum değerlendirmesi',
            'BRC uyumlu zararlı mücadele sisteminin kurulması',
            'Dokümantasyon ve kayıt sisteminin oluşturulması',
            'Personel eğitimi ve yetkinlik değerlendirmesi',
            'İç audit ve düzeltici eylemler',
            'Tedarikçi değerlendirmesi ve yönetimi',
            'Acil durum prosedürlerinin test edilmesi',
            'Trend analizi ve sürekli iyileştirme'
          ]
        },
        background: '#ffffff'
      },
      {
        id: 'slide-6',
        type: 'content',
        content: {
          title: 'BRC Uyumlu Zararlı Mücadelesinin Faydaları',
          bullets: [
            'Uluslararası perakende zincirlerine satış imkanı',
            'Müşteri güveninin artırılması',
            'Risk yönetimi ve önleme sistemleri',
            'Sürekli iyileştirme kültürü',
            'Yasal uygunluk güvencesi',
            'Rekabet avantajı sağlama',
            'Operasyonel verimliliğin artırılması',
            'Marka değerinin korunması'
          ]
        },
        background: '#ffffff'
      },
      {
        id: 'slide-7',
        type: 'content',
        content: {
          title: 'BRC Versiyon 9 Yenilikleri',
          bullets: [
            'Daha kapsamlı risk analizi gereksinimleri',
            'Tedarikçi yönetimi ve denetimi',
            'Dijital monitoring sistemleri',
            'Sürdürülebilirlik odaklı yaklaşımlar',
            'Entegre zararlı yönetimi (IPM) vurgusu',
            'Personel yetkinliğinin sürekli değerlendirilmesi',
            'Trend analizi ve veri yönetimi',
            'Sürekli iyileştirme kültürü'
          ]
        },
        background: '#ffffff'
      },
      {
        id: 'slide-8',
        type: 'thank-you',
        content: {
          title: 'Teşekkürler',
          subtitle: 'Sorularınız?'
        },
        background: '#ffffff'
      }
    ],
    thumbnail_url: null,
    is_active: true
  },
  {
    id: 'template-aib',
    name: 'AIB Zararlı Mücadelesi Eğitimi',
    standard: 'AIB',
    description: 'AIB standardına uygun zararlı mücadelesi eğitim sunumu',
    slides: [
      {
        id: 'slide-1',
        type: 'title',
        content: {
          title: 'AIB Standardında Zararlı Mücadelesi',
          subtitle: 'Gıda Güvenliği için Kapsamlı Yaklaşım'
        },
        background: '#ffffff'
      },
      {
        id: 'slide-2',
        type: 'content',
        content: {
          title: 'AIB Standardı Nedir?',
          bullets: [
            'American Institute of Baking tarafından geliştirilen gıda güvenliği standardı',
            'Gıda üretim tesisleri için kapsamlı denetim sistemi',
            'Beş kategoride değerlendirme yapılır',
            'Zararlı mücadelesi, standardın kritik bir bileşenidir',
            'Fırıncılık ve gıda endüstrisi için temel standart',
            'Uluslararası kabul görmüş denetim sistemi'
          ]
        },
        background: '#ffffff'
      },
      {
        id: 'slide-3',
        type: 'content',
        content: {
          title: 'AIB Zararlı Mücadele Kategorileri',
          bullets: [
            'Operasyonel Yöntemler',
            'Bakım için Tasarım',
            'Temizlik Uygulamaları',
            'Entegre Zararlı Yönetimi',
            'Personel Uygulamaları',
            'Dokümantasyon ve Kayıt Yönetimi',
            'Tedarikçi Değerlendirmesi',
            'Acil Durum Prosedürleri'
          ]
        },
        background: '#ffffff'
      },
      {
        id: 'slide-4',
        type: 'two-column',
        content: {
          title: 'AIB Puanlama Sistemi',
          leftTitle: 'Puan Aralıkları',
          leftContent: [
            'Superior (90-100): Mükemmel',
            'Excellent (80-89): Çok İyi',
            'Good (70-79): İyi',
            'Needs Improvement (<70): Geliştirilmeli',
            'Unsatisfactory (<60): Yetersiz'
          ],
          rightTitle: 'Değerlendirme Kriterleri',
          rightContent: [
            'Gereksinimleri aşan performans',
            'Gereksinimleri tam olarak karşılayan performans',
            'Gereksinimleri büyük ölçüde karşılayan performans',
            'Gereksinimleri kısmen karşılayan performans',
            'Gereksinimleri karşılamayan performans'
          ]
        },
        background: '#ffffff'
      },
      {
        id: 'slide-5',
        type: 'content',
        content: {
          title: 'AIB Denetim Kategorileri',
          bullets: [
            'Operasyonel Yöntemler ve Personel Uygulamaları (200 puan)',
            'Bakım için Temizlik (200 puan)',
            'Entegre Zararlı Yönetim Programı (200 puan)',
            'Gıda Güvenliği için Yeterli Önlemler (200 puan)',
            'Tesis ve Ekipman Tasarımı (200 puan)'
          ]
        },
        background: '#ffffff'
      },
      {
        id: 'slide-6',
        type: 'content',
        content: {
          title: 'AIB Audit Hazırlık Süreci',
          bullets: [
            'Ön değerlendirme ve gap analizi',
            'AIB gereksinimlerine uygun zararlı mücadele sisteminin geliştirilmesi',
            'Sistemin uygulanması ve personel eğitimlerinin verilmesi',
            'AIB kriterlerine göre iç audit yapılması ve iyileştirmeler',
            'AIB audit sırasında teknik destek ve danışmanlık hizmeti',
            'Düzeltici eylem planlarının hazırlanması ve uygulanması',
            'Sürekli iyileştirme programının oluşturulması',
            'Periyodik değerlendirme ve güncelleme'
          ]
        },
        background: '#ffffff'
      },
      {
        id: 'slide-7',
        type: 'content',
        content: {
          title: 'AIB Uyumlu Zararlı Mücadelesinin Faydaları',
          bullets: [
            'AIB sertifikasyonu için gerekli zararlı mücadele sistemi',
            'Gıda güvenliği standartlarında yüksek performans',
            'Müşteri güveninin artırılması',
            'Uluslararası kabul görmüş sertifikasyon',
            'Risk yönetimi ve önleme sistemleri',
            'Sürekli iyileştirme kültürü',
            'Operasyonel verimlilik artışı',
            'Marka değerinin korunması'
          ]
        },
        background: '#ffffff'
      },
      {
        id: 'slide-8',
        type: 'content',
        content: {
          title: 'AIB Denetiminde Sık Karşılaşılan Sorunlar',
          bullets: [
            'Yetersiz dokümantasyon ve kayıt tutma',
            'Eksik risk değerlendirmesi',
            'Personel eğitim eksiklikleri',
            'Monitoring sistemlerinin yetersizliği',
            'Düzeltici eylem planlarının uygulanmaması',
            'Trend analizi eksikliği',
            'Tedarikçi değerlendirme yetersizliği',
            'Acil durum prosedürlerinin test edilmemesi'
          ]
        },
        background: '#ffffff'
      },
      {
        id: 'slide-9',
        type: 'thank-you',
        content: {
          title: 'Teşekkürler',
          subtitle: 'Sorularınız?'
        },
        background: '#ffffff'
      }
    ],
    thumbnail_url: null,
    is_active: true
  },
  {
    id: 'template-haccp',
    name: 'HACCP Zararlı Mücadelesi Eğitimi',
    standard: 'HACCP',
    description: 'HACCP sistemine uygun zararlı mücadelesi eğitim sunumu',
    slides: [
      {
        id: 'slide-1',
        type: 'title',
        content: {
          title: 'HACCP Sisteminde Zararlı Mücadelesi',
          subtitle: 'Gıda Güvenliği için Sistematik Yaklaşım'
        },
        background: '#ffffff'
      },
      {
        id: 'slide-2',
        type: 'content',
        content: {
          title: 'HACCP Nedir?',
          bullets: [
            'Hazard Analysis and Critical Control Points (Tehlike Analizi ve Kritik Kontrol Noktaları)',
            'Gıda güvenliği için sistematik ve önleyici yaklaşım',
            'Tehlikeleri belirler, kritik kontrol noktalarını tanımlar',
            'Zararlı mücadelesi, HACCP sisteminin önemli bir parçasıdır',
            'Gıda zinciri boyunca güvenliği sağlar',
            'Uluslararası kabul görmüş bir sistemdir'
          ]
        },
        background: '#ffffff'
      },
      {
        id: 'slide-3',
        type: 'content',
        content: {
          title: 'HACCP\'nin 7 İlkesi',
          bullets: [
            '1. Tehlike Analizi: Potansiyel tehlikelerin belirlenmesi',
            '2. Kritik Kontrol Noktaları (CCP): Tehlikelerin kontrol edilebileceği noktalar',
            '3. Kritik Limitler: Her CCP için kabul edilebilir sınırlar',
            '4. Monitoring Sistemi: CCP\'lerin sürekli izlenmesi',
            '5. Düzeltici Eylemler: Kritik limitler aşıldığında alınacak önlemler',
            '6. Doğrulama: HACCP sisteminin etkinliğinin doğrulanması',
            '7. Kayıt Tutma: Tüm HACCP faaliyetlerinin dokümantasyonu'
          ]
        },
        background: '#ffffff'
      },
      {
        id: 'slide-4',
        type: 'two-column',
        content: {
          title: 'Zararlı Mücadelesinde HACCP Uygulaması',
          leftTitle: 'Tehlike Analizi',
          leftContent: [
            'Biyolojik tehlikeler (zararlılar)',
            'Kimyasal tehlikeler (ilaçlar)',
            'Fiziksel tehlikeler (kontaminasyon)',
            'Risk değerlendirme matrisi',
            'Zararlı türlerine göre risk analizi',
            'Mevsimsel risk faktörleri'
          ],
          rightTitle: 'Kritik Kontrol Noktaları',
          rightContent: [
            'İlaçlama öncesi hazırlık',
            'İlaç uygulama süreci',
            'Uygulama sonrası kontrol',
            'Monitoring noktaları',
            'Giriş noktaları kontrolü',
            'Depolama alanları kontrolü'
          ]
        },
        background: '#ffffff'
      },
      {
        id: 'slide-5',
        type: 'content',
        content: {
          title: 'Kritik Limitler ve Monitoring',
          bullets: [
            'İlaç konsantrasyonları için kritik limitler',
            'Uygulama süreleri ve bekleme süreleri',
            'Sıcaklık ve nem değerleri',
            'Düzenli kontrol programları',
            'Kayıt tutma sistemleri',
            'Trend analizi',
            'Monitoring ekipmanlarının kalibrasyonu',
            'Veri toplama ve analiz yöntemleri'
          ]
        },
        background: '#ffffff'
      },
      {
        id: 'slide-6',
        type: 'content',
        content: {
          title: 'Düzeltici Eylemler ve Doğrulama',
          bullets: [
            'Kritik limitler aşıldığında alınacak önlemler',
            'Acil müdahale prosedürleri',
            'Kök neden analizi',
            'Düzeltici eylem planları',
            'Doğrulama faaliyetleri',
            'Sistem performans değerlendirmesi',
            'Bağımsız doğrulama',
            'Periyodik gözden geçirme'
          ]
        },
        background: '#ffffff'
      },
      {
        id: 'slide-7',
        type: 'content',
        content: {
          title: 'HACCP Dokümantasyonu',
          bullets: [
            'HACCP planı',
            'Tehlike analizi kayıtları',
            'CCP belirleme kayıtları',
            'Monitoring kayıtları',
            'Düzeltici eylem kayıtları',
            'Doğrulama kayıtları',
            'Eğitim kayıtları',
            'Revizyon kayıtları'
          ]
        },
        background: '#ffffff'
      },
      {
        id: 'slide-8',
        type: 'content',
        content: {
          title: 'HACCP Uyumlu Zararlı Mücadelesinin Faydaları',
          bullets: [
            'HACCP sistemine entegre zararlı mücadele',
            'Gıda güvenliği risklerinin minimize edilmesi',
            'Yasal gereksinimlere tam uygunluk',
            'Sistematik risk yönetimi',
            'Sürekli iyileştirme kültürü',
            'Müşteri güveninin artırılması',
            'Operasyonel verimlilik artışı',
            'Marka değerinin korunması'
          ]
        },
        background: '#ffffff'
      },
      {
        id: 'slide-9',
        type: 'thank-you',
        content: {
          title: 'Teşekkürler',
          subtitle: 'Sorularınız?'
        },
        background: '#ffffff'
      }
    ],
    thumbnail_url: null,
    is_active: true
  },
  {
    id: 'template-iso22000',
    name: 'ISO 22000 Zararlı Mücadelesi Eğitimi',
    standard: 'ISO22000',
    description: 'ISO 22000 standardına uygun zararlı mücadelesi eğitim sunumu',
    slides: [
      {
        id: 'slide-1',
        type: 'title',
        content: {
          title: 'ISO 22000 Standardında Zararlı Mücadelesi',
          subtitle: 'Gıda Güvenliği Yönetim Sistemi Entegrasyonu'
        },
        background: '#ffffff'
      },
      {
        id: 'slide-2',
        type: 'content',
        content: {
          title: 'ISO 22000 Nedir?',
          bullets: [
            'Gıda güvenliği yönetim sistemi için uluslararası standart',
            'HACCP prensiplerini ve ISO 9001 yönetim sistemini birleştirir',
            'Gıda zincirindeki tüm kuruluşlar için uygulanabilir',
            'Zararlı mücadelesi, standardın önemli bir bileşenidir',
            'Süreç yaklaşımı ve risk temelli düşünme',
            'Sürekli iyileştirme odaklı sistem'
          ]
        },
        background: '#ffffff'
      },
      {
        id: 'slide-3',
        type: 'content',
        content: {
          title: 'ISO 22000 Standart Yapısı',
          bullets: [
            '4. Organizasyonun Bağlamı: İç ve dış faktörlerin analizi',
            '5. Liderlik: Üst yönetimin taahhüdü ve sorumlulukları',
            '6. Planlama: Risk ve fırsatların ele alınması',
            '7. Destek: Kaynaklar, yetkinlik, farkındalık, iletişim',
            '8. Operasyon: Operasyonel planlama ve kontrol',
            '9. Performans Değerlendirmesi: İzleme, ölçme, analiz',
            '10. İyileştirme: Uygunsuzluk ve sürekli iyileştirme'
          ]
        },
        background: '#ffffff'
      },
      {
        id: 'slide-4',
        type: 'two-column',
        content: {
          title: 'Zararlı Mücadelesinin ISO 22000\'e Entegrasyonu',
          leftTitle: 'Operasyonel Ön Koşul Programları',
          leftContent: [
            'Zararlı mücadele politikası',
            'Risk değerlendirme prosedürleri',
            'Monitoring ve kayıt sistemleri',
            'Düzeltici eylem prosedürleri',
            'Tedarikçi yönetimi',
            'Acil durum prosedürleri'
          ],
          rightTitle: 'HACCP Entegrasyonu',
          rightContent: [
            'Tehlike analizi sürecine dahil edilme',
            'CCP belirleme sürecinde değerlendirme',
            'Monitoring sistemlerine entegrasyon',
            'Doğrulama faaliyetlerine dahil edilme',
            'Kayıt tutma sistemleri',
            'Sürekli iyileştirme'
          ]
        },
        background: '#ffffff'
      },
      {
        id: 'slide-5',
        type: 'content',
        content: {
          title: 'ISO 22000:2018 Yenilikleri',
          bullets: [
            'Yüksek seviye yapı (HLS) uyumu',
            'Risk temelli düşünme yaklaşımı',
            'PDCA döngüsünün iki seviyede uygulanması',
            'Operasyonel ön koşul programları (OPRP) vurgusu',
            'Liderlik ve taahhüt gereksinimleri',
            'İç ve dış iletişim gereksinimleri',
            'Dokümante edilmiş bilgi yaklaşımı',
            'Performans değerlendirme ve iyileştirme'
          ]
        },
        background: '#ffffff'
      },
      {
        id: 'slide-6',
        type: 'content',
        content: {
          title: 'ISO 22000 Uygulama Süreci',
          bullets: [
            'Gap analizi ve mevcut durum değerlendirmesi',
            'ISO 22000 uyumlu gıda güvenliği yönetim sisteminin tasarlanması',
            'Politika, prosedür ve talimatların hazırlanması',
            'Personel eğitimi ve sistemin uygulamaya konulması',
            'Sistemin etkinliğinin iç audit ile değerlendirilmesi',
            'Bağımsız kuruluş tarafından sertifikasyon auditinin yapılması',
            'Sürekli iyileştirme programının uygulanması',
            'Periyodik yönetim gözden geçirmesi'
          ]
        },
        background: '#ffffff'
      },
      {
        id: 'slide-7',
        type: 'content',
        content: {
          title: 'Zararlı Mücadele Performans Göstergeleri',
          bullets: [
            'Zararlı aktivite trendleri',
            'Düzeltici eylem etkinliği',
            'Monitoring sistemi performansı',
            'Personel yetkinlik değerlendirmesi',
            'Tedarikçi performansı',
            'Müşteri şikayetleri',
            'İç ve dış audit bulguları',
            'Sürekli iyileştirme göstergeleri'
          ]
        },
        background: '#ffffff'
      },
      {
        id: 'slide-8',
        type: 'content',
        content: {
          title: 'ISO 22000 Uyumlu Zararlı Mücadelesinin Faydaları',
          bullets: [
            'ISO 22000 sertifikasyonu için gerekli zararlı mücadele sistemi',
            'Uluslararası kabul görmüş gıda güvenliği standardı',
            'Müşteri güveninin artırılması',
            'Risk yönetimi ve önleme sistemleri',
            'Sürekli iyileştirme kültürü',
            'Yasal gereksinimlere uygunluk',
            'Operasyonel verimlilik artışı',
            'Marka değerinin korunması'
          ]
        },
        background: '#ffffff'
      },
      {
        id: 'slide-9',
        type: 'thank-you',
        content: {
          title: 'Teşekkürler',
          subtitle: 'Sorularınız?'
        },
        background: '#ffffff'
      }
    ],
    thumbnail_url: null,
    is_active: true
  },
  {
    id: 'template-ipm',
    name: 'IPM Eğitim Sunumu',
    standard: 'IPM',
    description: 'Entegre Zararlı Yönetimi (IPM) eğitim sunumu',
    slides: [
      {
        id: 'slide-1',
        type: 'title',
        content: {
          title: 'Entegre Zararlı Yönetimi (IPM)',
          subtitle: 'Sürdürülebilir ve Etkili Zararlı Kontrolü'
        },
        background: '#ffffff'
      },
      {
        id: 'slide-2',
        type: 'content',
        content: {
          title: 'IPM Nedir?',
          bullets: [
            'Entegre Zararlı Yönetimi (IPM), zararlı kontrolünde çevre dostu, ekonomik ve sürdürülebilir bir yaklaşımdır',
            'Zararlıların biyolojisi ve ekolojisi hakkındaki bilgileri kullanır',
            'Çoklu kontrol yöntemlerini entegre eder',
            'Zararlıların popülasyonunu kabul edilebilir seviyelerde tutmayı hedefler',
            'Kimyasal kullanımını minimize eder',
            'Uzun vadeli çözüm sunar'
          ]
        },
        background: '#ffffff'
      },
      {
        id: 'slide-3',
        type: 'content',
        content: {
          title: 'IPM\'nin Avantajları',
          bullets: [
            'Çevre Dostu: Minimum kimyasal kullanımı ile çevre ve insan sağlığını korur',
            'Hedef Odaklı: Sadece zararlı türlere odaklanarak faydalı organizmaları korur',
            'Uzun Vadeli: Sürdürülebilir çözümler ile kalıcı koruma sağlar',
            'Maliyet Etkin: Uzun vadede daha ekonomik ve verimli sonuçlar sunar',
            'Direnç Yönetimi: Zararlıların kimyasallara direnç geliştirmesini önler',
            'Yasal Uygunluk: Giderek sıkılaşan mevzuata uyum sağlar'
          ]
        },
        background: '#ffffff'
      },
      {
        id: 'slide-4',
        type: 'two-column',
        content: {
          title: 'IPM Uygulama Süreci',
          leftTitle: 'Analiz ve Planlama',
          leftContent: [
            'İnceleme ve Tanı: Zararlı türlerinin tespiti',
            'Strateji Geliştirme: Özel çözüm planlaması',
            'Önleyici Tedbirler: Giriş ve barınma engelleme',
            'Monitoring Sistemi: Sürekli izleme planı',
            'Risk Haritası: Kritik noktaların belirlenmesi',
            'Eğitim Planı: Personel bilinçlendirme'
          ],
          rightTitle: 'Uygulama ve Takip',
          rightContent: [
            'Müdahale Programı: Entegre kontrol yöntemleri',
            'Değerlendirme ve İyileştirme: Sonuçların analizi',
            'Sürekli İzleme: Düzenli kontrol ve raporlama',
            'Periyodik Gözden Geçirme: Program güncellemesi',
            'Trend Analizi: Uzun vadeli veri değerlendirmesi',
            'Sürekli İyileştirme: Program optimizasyonu'
          ]
        },
        background: '#ffffff'
      },
      {
        id: 'slide-5',
        type: 'content',
        content: {
          title: 'IPM Bileşenleri',
          bullets: [
            'Kültürel Kontrol: Çevre düzenlemesi, hijyen iyileştirmeleri, habitat modifikasyonu',
            'Fiziksel Kontrol: Bariyerler, tuzaklar, sıcaklık uygulamaları, mekanik yöntemler',
            'Biyolojik Kontrol: Doğal düşmanlar, biyolojik ajanlar, feromonlar',
            'Kimyasal Kontrol: Seçici pestisitler, minimum dozaj, hedefli uygulama',
            'Monitoring: Sürekli izleme, tuzak sistemleri, veri toplama ve analiz',
            'Eğitim ve Bilinçlendirme: Personel eğitimi, farkındalık programları'
          ]
        },
        background: '#ffffff'
      },
      {
        id: 'slide-6',
        type: 'content',
        content: {
          title: 'IPM Monitoring Sistemleri',
          bullets: [
            'Kemirgen Monitoring: Yem istasyonları, tuzaklar, iz tozu',
            'Böcek Monitoring: Yapışkan tuzaklar, feromon tuzakları, ışık tuzakları',
            'Uçan Böcek Monitoring: EFK cihazları, yapışkan tuzaklar',
            'Depo Zararlıları Monitoring: Feromon tuzakları, tane tuzakları',
            'Dijital Monitoring: Otomatik tuzaklar, sensör sistemleri, uzaktan izleme',
            'Veri Yönetimi: Dijital kayıt sistemleri, trend analizi yazılımları'
          ]
        },
        background: '#ffffff'
      },
      {
        id: 'slide-7',
        type: 'content',
        content: {
          title: 'Uygulama Alanları',
          bullets: [
            'Gıda üretim tesisleri: Fabrikalar, fırınlar, işleme tesisleri',
            'İlaç ve kozmetik fabrikaları: GMP uyumlu uygulamalar',
            'Hastane ve sağlık kuruluşları: Hijyen odaklı programlar',
            'Otel ve turizm tesisleri: Misafir memnuniyeti odaklı çözümler',
            'Eğitim kurumları: Güvenli ve sağlıklı ortamlar',
            'Ofis ve ticari binalar: Çalışan konforu odaklı uygulamalar',
            'Depo ve lojistik merkezleri: Ürün koruma programları',
            'Perakende mağazalar: Müşteri deneyimi odaklı çözümler'
          ]
        },
        background: '#ffffff'
      },
      {
        id: 'slide-8',
        type: 'content',
        content: {
          title: 'IPM ve Sürdürülebilirlik',
          bullets: [
            'Çevresel Etki: Minimum kimyasal kullanımı ile ekosistem koruması',
            'Enerji Verimliliği: Optimize edilmiş uygulama programları',
            'Atık Yönetimi: Ambalaj ve atık azaltma stratejileri',
            'Su Koruması: Su kaynaklarının korunması ve verimli kullanımı',
            'Karbon Ayak İzi: Düşük emisyonlu uygulama yöntemleri',
            'Biyoçeşitlilik: Faydalı organizmaların korunması',
            'Sosyal Sorumluluk: Toplum sağlığının korunması',
            'Ekonomik Sürdürülebilirlik: Uzun vadeli maliyet etkinliği'
          ]
        },
        background: '#ffffff'
      },
      {
        id: 'slide-9',
        type: 'thank-you',
        content: {
          title: 'Teşekkürler',
          subtitle: 'Sorularınız?'
        },
        background: '#ffffff'
      }
    ],
    thumbnail_url: null,
    is_active: true
  },
  {
    id: 'template-general',
    name: 'Genel Zararlı Mücadelesi Eğitimi',
    standard: 'GENERAL',
    description: 'Genel zararlı mücadelesi eğitim sunumu',
    slides: [
      {
        id: 'slide-1',
        type: 'title',
        content: {
          title: 'Zararlı Mücadelesi Eğitimi',
          subtitle: 'Temel Bilgiler ve Uygulamalar'
        },
        background: '#ffffff'
      },
      {
        id: 'slide-2',
        type: 'content',
        content: {
          title: 'Zararlı Türleri',
          bullets: [
            'Kemirgenler: Fare, sıçan, diğer kemirgen türleri',
            'Sürünen Böcekler: Hamam böceği, karınca, bit, pire, tahtakurusu',
            'Uçan Böcekler: Sivrisinek, karasinek, güve, arı, eşek arısı',
            'Arachnidler: Örümcek, akrep, kene, uyuz',
            'Kuşlar: Güvercin, martı, serçe, diğer kuş türleri',
            'Depo Zararlıları: Tahıl biti, un güvesi, kuru meyve güvesi'
          ]
        },
        background: '#ffffff'
      },
      {
        id: 'slide-3',
        type: 'content',
        content: {
          title: 'Zararlıların Etkileri',
          bullets: [
            'Sağlık Riskleri: Hastalık bulaştırma, alerjik reaksiyonlar, zehirlenme',
            'Ekonomik Zararlar: Ürün ve malzeme hasarı, itibar kaybı, müşteri kaybı',
            'Yasal Sorunlar: Mevzuata uyumsuzluk, cezalar, işletme kapanması',
            'Müşteri Memnuniyetsizliği: Şikayetler, müşteri kaybı, itibar zedelenmesi',
            'Operasyonel Aksamalar: Üretim durması, verimlilik kaybı, iş gücü kaybı',
            'Psikolojik Etkiler: Çalışan ve müşteri rahatsızlığı, stres, korku'
          ]
        },
        background: '#ffffff'
      },
      {
        id: 'slide-4',
        type: 'two-column',
        content: {
          title: 'Zararlı Mücadele Yöntemleri',
          leftTitle: 'Önleyici Yöntemler',
          leftContent: [
            'Hijyen ve sanitasyon programları',
            'Yapısal iyileştirmeler ve bakım',
            'Giriş noktalarının kapatılması',
            'Düzenli denetimler ve kontroller',
            'Atık yönetimi ve depolama',
            'Personel eğitimi ve bilinçlendirme'
          ],
          rightTitle: 'Müdahale Yöntemleri',
          rightContent: [
            'Mekanik kontrol: Tuzaklar, yapışkanlar',
            'Fiziksel kontrol: Sıcaklık, nem, ışık',
            'Biyolojik kontrol: Doğal düşmanlar',
            'Kimyasal kontrol: İlaçlama, fumigasyon',
            'Entegre yöntemler: IPM programları',
            'Acil müdahale protokolleri'
          ]
        },
        background: '#ffffff'
      },
      {
        id: 'slide-5',
        type: 'content',
        content: {
          title: 'Zararlı Mücadele Programı',
          bullets: [
            'Risk değerlendirmesi ve haritalama: Kritik noktaların belirlenmesi',
            'Monitoring sistemleri ve tuzaklar: Sürekli izleme ve erken uyarı',
            'Düzenli kontrol ve denetimler: Periyodik incelemeler',
            'Kayıt tutma ve dokümantasyon: Yasal uygunluk ve trend analizi',
            'Personel eğitimi ve bilinçlendirme: Farkındalık ve katılım',
            'Sürekli iyileştirme: Program etkinliğinin artırılması',
            'Tedarikçi yönetimi: Dış kaynaklı risklerin kontrolü',
            'Acil durum planlaması: Beklenmedik durumlar için hazırlık'
          ]
        },
        background: '#ffffff'
      },
      {
        id: 'slide-6',
        type: 'content',
        content: {
          title: 'Güvenli Uygulama İlkeleri',
          bullets: [
            'Doğru ürün seçimi ve dozaj: Etkili ve güvenli uygulama',
            'Kişisel koruyucu ekipman kullanımı: Uygulayıcı güvenliği',
            'Uygulama sonrası güvenlik önlemleri: Bekleme süreleri ve uyarılar',
            'Çevre ve insan sağlığını koruma: Hedef dışı etkilerin minimizasyonu',
            'Acil durum prosedürleri: Kazalara karşı hazırlık',
            'Yasal mevzuata uygunluk: Ruhsatlı ürün ve yöntemler',
            'Atık yönetimi: Ambalaj ve kalıntıların güvenli bertarafı',
            'Kayıt tutma: Uygulama detaylarının dokümantasyonu'
          ]
        },
        background: '#ffffff'
      },
      {
        id: 'slide-7',
        type: 'content',
        content: {
          title: 'Zararlı Mücadelesinde Yeni Trendler',
          bullets: [
            'Dijital monitoring sistemleri: IoT tabanlı tuzaklar ve sensörler',
            'Veri analizi ve yapay zeka: Tahmine dayalı zararlı yönetimi',
            'Biyolojik kontrol yöntemleri: Doğal düşmanlar ve mikroorganizmalar',
            'Sürdürülebilir kimyasallar: Çevre dostu formülasyonlar',
            'Genetik kontrol yöntemleri: Kısırlaştırma ve popülasyon kontrolü',
            'Akıllı bina tasarımı: Zararlı girişini engelleyen mimari',
            'Mobil uygulama entegrasyonu: Gerçek zamanlı raporlama ve müdahale',
            'Blockchain teknolojisi: Şeffaf ve izlenebilir zararlı yönetimi'
          ]
        },
        background: '#ffffff'
      },
      {
        id: 'slide-8',
        type: 'content',
        content: {
          title: 'Sektöre Özel Uygulamalar',
          bullets: [
            'Gıda Üretimi: HACCP entegrasyonu, kritik kontrol noktaları',
            'Sağlık Sektörü: Steril alan koruması, enfeksiyon kontrolü',
            'Otelcilik: Misafir memnuniyeti odaklı gizli mücadele',
            'Perakende: Müşteri deneyimini bozmayan çözümler',
            'Lojistik: Ürün ve ambalaj koruması, konteyner fumigasyonu',
            'Eğitim Kurumları: Çocuk güvenliği odaklı uygulamalar',
            'Tarihi Yapılar: Yapıya zarar vermeyen özel yöntemler',
            'Endüstriyel Tesisler: Üretim süreçlerine entegre çözümler'
          ]
        },
        background: '#ffffff'
      },
      {
        id: 'slide-9',
        type: 'thank-you',
        content: {
          title: 'Teşekkürler',
          subtitle: 'Sorularınız?'
        },
        background: '#ffffff'
      }
    ],
    thumbnail_url: null,
    is_active: true
  },
  {
    id: 'template-rodents',
    name: 'Kemirgen Mücadelesi Eğitimi',
    standard: 'PESTS',
    description: 'Kemirgen türleri ve mücadele yöntemleri eğitim sunumu',
    slides: [
      {
        id: 'slide-1',
        type: 'title',
        content: {
          title: 'Kemirgen Mücadelesi',
          subtitle: 'Fare ve Sıçan Kontrolü için Kapsamlı Yaklaşım'
        },
        background: '#ffffff'
      },
      {
        id: 'slide-2',
        type: 'content',
        content: {
          title: 'Kemirgen Türleri',
          bullets: [
            'Ev Faresi (Mus musculus): 6-10 cm vücut, 7-10 cm kuyruk, gri-kahverengi',
            'Norveç Sıçanı (Rattus norvegicus): 18-25 cm vücut, 15-21 cm kuyruk, kahverengi',
            'Çatı Sıçanı (Rattus rattus): 16-22 cm vücut, 18-25 cm kuyruk, siyah-gri',
            'Tarla Faresi (Apodemus spp.): 8-12 cm vücut, 7-11 cm kuyruk, kahverengi',
            'Diğer kemirgen türleri: Bölgesel olarak değişiklik gösterebilir'
          ]
        },
        background: '#ffffff'
      },
      {
        id: 'slide-3',
        type: 'content',
        content: {
          title: 'Kemirgenlerin Özellikleri',
          bullets: [
            'Sürekli büyüyen kesici dişler: Kemirme ihtiyacı',
            'Yüksek üreme kapasitesi: Yılda 5-10 doğum, her doğumda 5-12 yavru',
            'Adaptasyon yeteneği: Farklı ortamlara hızlı uyum',
            'Gece aktivitesi: Genellikle gece aktif, gündüz gizlenme',
            'Sosyal yapı: Koloni halinde yaşama, hiyerarşik düzen',
            'Öğrenme kapasitesi: Tuzaklardan ve tehlikelerden kaçınma',
            'Güçlü duyu organları: Koku, dokunma, işitme ve tat duyuları'
          ]
        },
        background: '#ffffff'
      },
      {
        id: 'slide-4',
        type: 'two-column',
        content: {
          title: 'Kemirgenlerin Zararları',
          leftTitle: 'Sağlık Riskleri',
          leftContent: [
            'Hastalık bulaştırma: 35+ hastalık',
            'Leptospiroz, Hantavirus',
            'Salmonella, E. coli',
            'Veba, Tifüs',
            'Alerjik reaksiyonlar',
            'Isırık ve yaralanmalar'
          ],
          rightTitle: 'Ekonomik Zararlar',
          rightContent: [
            'Yapısal hasar: Duvar, çatı, izolasyon',
            'Elektrik kabloları: Yangın riski',
            'Ürün kontaminasyonu',
            'Ekipman hasarı',
            'İtibar kaybı',
            'İş durması ve verimlilik kaybı'
          ]
        },
        background: '#ffffff'
      },
      {
        id: 'slide-5',
        type: 'content',
        content: {
          title: 'Kemirgen Aktivite Belirtileri',
          bullets: [
            'Görsel gözlem: Canlı veya ölü kemirgenler',
            'Dışkı: Büyüklük ve şekil türe özgüdür (fare: pirinç tanesi, sıçan: zeytin çekirdeği)',
            'İdrar izleri: UV ışık altında görülebilen izler',
            'Kemirme izleri: Ahşap, plastik, kablo, gıda ambalajları',
            'Yağ izleri: Duvar ve zemin kenarlarında koyu renkli izler',
            'Ayak ve kuyruk izleri: Tozlu yüzeylerde görülebilir',
            'Ses: Duvar içi, tavan arası veya zemin altından gelen sesler',
            'Yuva: Kağıt, kumaş, izolasyon malzemesi parçaları'
          ]
        },
        background: '#ffffff'
      },
      {
        id: 'slide-6',
        type: 'content',
        content: {
          title: 'Kemirgen Mücadele Yöntemleri',
          bullets: [
            'Dışlama (Exclusion): Giriş noktalarının kapatılması, fiziksel bariyerler',
            'Habitat Modifikasyonu: Barınma ve beslenme alanlarının ortadan kaldırılması',
            'Mekanik Kontrol: Snap tuzaklar, canlı yakalama tuzakları, yapışkan tuzaklar',
            'Kimyasal Kontrol: Rodentisitler (antikoagülanlar, akut zehirler)',
            'Ultrasonik Cihazlar: Yüksek frekanslı ses dalgaları (sınırlı etkinlik)',
            'Biyolojik Kontrol: Doğal avcılar (kediler, yırtıcı kuşlar - sınırlı kontrol)',
            'Entegre Yaklaşım: Tüm yöntemlerin sistematik kombinasyonu'
          ]
        },
        background: '#ffffff'
      },
      {
        id: 'slide-7',
        type: 'content',
        content: {
          title: 'Rodentisit Kullanım İlkeleri',
          bullets: [
            'Doğru ürün seçimi: Hedef tür ve ortama uygun rodentisit',
            'Güvenli yerleştirme: Kilitli istasyonlar, çocuk ve evcil hayvan erişimi dışında',
            'Doğru dozaj: Etiket talimatlarına uygun kullanım',
            'Düzenli kontrol: İstasyonların periyodik kontrolü ve yem yenileme',
            'Ölü kemirgen yönetimi: Güvenli toplama ve bertaraf',
            'Direnç yönetimi: Farklı aktif maddelerin rotasyonu',
            'Kayıt tutma: Tüm uygulamaların dokümantasyonu',
            'Çevresel etki değerlendirmesi: Hedef dışı etkilerin minimizasyonu'
          ]
        },
        background: '#ffffff'
      },
      {
        id: 'slide-8',
        type: 'content',
        content: {
          title: 'Kemirgen Monitoring Sistemi',
          bullets: [
            'İstasyon yerleşim planı: Risk değerlendirmesine göre optimum yerleşim',
            'İstasyon tipleri: Yemli, yemsiz, snap tuzak, yapışkan tuzak',
            'Numaralandırma ve etiketleme: Her istasyonun benzersiz tanımlanması',
            'Kontrol sıklığı: Risk seviyesine göre günlük, haftalık veya aylık',
            'Aktivite kaydı: Tüketim, aktivite belirtileri, tuzak durumu',
            'Haritalama: Aktivite noktalarının görsel temsili',
            'Trend analizi: Aktivite seviyelerinin zaman içindeki değişimi',
            'Dijital monitoring: Otomatik bildirim sistemleri, uzaktan izleme'
          ]
        },
        background: '#ffffff'
      },
      {
        id: 'slide-9',
        type: 'content',
        content: {
          title: 'Entegre Kemirgen Yönetimi',
          bullets: [
            'Risk değerlendirmesi: Tesis ve çevre analizi',
            'Önleyici tedbirler: Yapısal iyileştirmeler, hijyen, habitat modifikasyonu',
            'Monitoring sistemi: Erken uyarı ve popülasyon takibi',
            'Müdahale stratejisi: Kademeli ve entegre yaklaşım',
            'Dokümantasyon: Kapsamlı kayıt tutma ve raporlama',
            'Eğitim: Personel farkındalığı ve katılımı',
            'Sürekli iyileştirme: Program etkinliğinin düzenli değerlendirilmesi',
            'Yasal uygunluk: Mevzuat ve standartlara uyum'
          ]
        },
        background: '#ffffff'
      },
      {
        id: 'slide-10',
        type: 'thank-you',
        content: {
          title: 'Teşekkürler',
          subtitle: 'Sorularınız?'
        },
        background: '#ffffff'
      }
    ],
    thumbnail_url: null,
    is_active: true
  },
  {
    id: 'template-cockroaches',
    name: 'Hamam Böceği Mücadelesi Eğitimi',
    standard: 'PESTS',
    description: 'Hamam böceği türleri ve mücadele yöntemleri eğitim sunumu',
    slides: [
      {
        id: 'slide-1',
        type: 'title',
        content: {
          title: 'Hamam Böceği Mücadelesi',
          subtitle: 'Etkili Kontrol ve Önleme Stratejileri'
        },
        background: '#ffffff'
      },
      {
        id: 'slide-2',
        type: 'content',
        content: {
          title: 'Hamam Böceği Türleri',
          bullets: [
            'Alman Hamam Böceği (Blattella germanica): 12-15 mm, kahverengi, en yaygın tür',
            'Amerikan Hamam Böceği (Periplaneta americana): 35-40 mm, kırmızımsı-kahverengi',
            'Doğu Hamam Böceği (Blatta orientalis): 20-27 mm, parlak siyah-kahverengi',
            'Kahverengi Bantlı Hamam Böceği (Supella longipalpa): 10-14 mm, açık kahverengi',
            'Avustralya Hamam Böceği (Periplaneta australasiae): 30-35 mm, kahverengi, sarı kenar',
            'Smoky Brown Hamam Böceği (Periplaneta fuliginosa): 25-38 mm, koyu kahverengi-siyah'
          ]
        },
        background: '#ffffff'
      },
      {
        id: 'slide-3',
        type: 'content',
        content: {
          title: 'Hamam Böceği Biyolojisi',
          bullets: [
            'Yaşam Döngüsü: Yumurta → Nimf → Erişkin (40-400 gün, türe göre değişir)',
            'Üreme: Ooteka (yumurta kapsülü) içinde 10-50 yumurta',
            'Beslenme: Omnivore (her şeyi yiyebilir), gece aktif',
            'Habitat: Sıcak, nemli, karanlık alanlar, çatlak ve yarıklar',
            'Hareket: Hızlı koşma, bazı türlerde uçma yeteneği',
            'Dayanıklılık: Açlığa, susuzluğa ve radyasyona karşı yüksek direnç',
            'Adaptasyon: Farklı ortamlara hızlı uyum sağlama yeteneği'
          ]
        },
        background: '#ffffff'
      },
      {
        id: 'slide-4',
        type: 'two-column',
        content: {
          title: 'Hamam Böceği Zararları',
          leftTitle: 'Sağlık Riskleri',
          leftContent: [
            'Hastalık bulaştırma: 33+ patojen',
            'Alerjik reaksiyonlar ve astım',
            'Gıda zehirlenmesi',
            'Salmonella, E. coli taşıma',
            'Parazit taşıma',
            'Psikolojik stres'
          ],
          rightTitle: 'Ekonomik Zararlar',
          rightContent: [
            'Gıda kontaminasyonu',
            'Ürün ve malzeme hasarı',
            'İtibar kaybı',
            'Müşteri şikayetleri',
            'Denetim başarısızlıkları',
            'İş kaybı ve kapanma riski'
          ]
        },
        background: '#ffffff'
      },
      {
        id: 'slide-5',
        type: 'content',
        content: {
          title: 'Hamam Böceği Aktivite Belirtileri',
          bullets: [
            'Canlı böcekler: Genellikle gece görülür, ışık açıldığında kaçarlar',
            'Dışkı: Küçük, siyah, kum tanesi veya kahve telvesi benzeri parçacıklar',
            'Boş ootekalar: Kahverengi kapsüller, türe göre şekil farklılıkları gösterir',
            'Kabuk değiştirme artıkları: Nimf dönemlerinden kalan boş kabuklar',
            'Karakteristik koku: Yoğun istilalarda fark edilebilen keskin koku',
            'Yumurta kapsülleri: Dişilerin taşıdığı veya bıraktığı ootekalar',
            'Yiyecek ve ambalajlarda kemirme izleri: Özellikle kağıt ve karton'
          ]
        },
        background: '#ffffff'
      },
      {
        id: 'slide-6',
        type: 'content',
        content: {
          title: 'Hamam Böceği Mücadele Yöntemleri',
          bullets: [
            'Hijyen ve Sanitasyon: Gıda artıkları ve su kaynaklarının kontrolü',
            'Dışlama (Exclusion): Giriş noktalarının kapatılması, çatlak ve yarıkların doldurulması',
            'Mekanik Kontrol: Yapışkan tuzaklar, vakumlama',
            'Kimyasal Kontrol: Jel yemler, toz formülasyonlar, rezidüel spreyler, IGR\'ler',
            'Isı Uygulaması: Yüksek sıcaklıkla (50-60°C) böcek eliminasyonu',
            'Soğuk Uygulaması: Düşük sıcaklıkla (-20°C) böcek eliminasyonu',
            'Biyolojik Kontrol: Doğal düşmanlar, entomopatojenik mantarlar (sınırlı kullanım)'
          ]
        },
        background: '#ffffff'
      },
      {
        id: 'slide-7',
        type: 'content',
        content: {
          title: 'Jel Yem Uygulaması',
          bullets: [
            'Etki Mekanizması: Oral alım, gecikmiş etki, koloni eliminasyonu',
            'Uygulama Noktaları: Aktivite alanları, gizlenme yerleri, hareket yolları',
            'Dozaj: Küçük damlalar (0.1-0.5g), çok sayıda nokta',
            'Avantajlar: Hedefli uygulama, düşük risk, yüksek etkinlik',
            'Aktif Maddeler: Fipronil, imidacloprid, indoxacarb, abamectin',
            'Rotasyon: Direnç yönetimi için farklı aktif maddelerin dönüşümlü kullanımı',
            'Monitoring: Uygulama sonrası etkinlik değerlendirmesi',
            'Yeniden Uygulama: Aktivite devam ediyorsa 2-4 hafta sonra tekrar'
          ]
        },
        background: '#ffffff'
      },
      {
        id: 'slide-8',
        type: 'content',
        content: {
          title: 'Monitoring ve Değerlendirme',
          bullets: [
            'Tuzak Yerleşimi: Stratejik noktalara yapışkan tuzak yerleştirme',
            'Tuzak Yoğunluğu: Risk seviyesine göre 1 tuzak/10-30 m²',
            'Kontrol Sıklığı: Haftalık veya aylık düzenli kontroller',
            'Veri Toplama: Tür, sayı, gelişim evresi, lokasyon kaydı',
            'Haritalama: Aktivite noktalarının görsel temsili',
            'Trend Analizi: Popülasyon değişiminin zaman içinde izlenmesi',
            'Etkinlik Değerlendirmesi: Müdahale sonrası sonuçların analizi',
            'Program Optimizasyonu: Verilere dayalı strateji güncellemesi'
          ]
        },
        background: '#ffffff'
      },
      {
        id: 'slide-9',
        type: 'content',
        content: {
          title: 'Entegre Hamam Böceği Yönetimi',
          bullets: [
            'Risk Değerlendirmesi: Tesis ve çevre analizi, giriş ve barınma noktaları',
            'Önleyici Tedbirler: Hijyen, dışlama, habitat modifikasyonu',
            'Monitoring Sistemi: Erken tespit ve popülasyon takibi',
            'Müdahale Stratejisi: Kademeli ve entegre yaklaşım',
            'Direnç Yönetimi: Farklı etki mekanizmalarının rotasyonu',
            'Dokümantasyon: Kapsamlı kayıt tutma ve raporlama',
            'Eğitim: Personel farkındalığı ve katılımı',
            'Sürekli İyileştirme: Program etkinliğinin düzenli değerlendirilmesi'
          ]
        },
        background: '#ffffff'
      },
      {
        id: 'slide-10',
        type: 'thank-you',
        content: {
          title: 'Teşekkürler',
          subtitle: 'Sorularınız?'
        },
        background: '#ffffff'
      }
    ],
    thumbnail_url: null,
    is_active: true
  },
  {
    id: 'template-flying-insects',
    name: 'Uçan Böcek Mücadelesi Eğitimi',
    standard: 'PESTS',
    description: 'Uçan böcek türleri ve mücadele yöntemleri eğitim sunumu',
    slides: [
      {
        id: 'slide-1',
        type: 'title',
        content: {
          title: 'Uçan Böcek Mücadelesi',
          subtitle: 'Sivrisinek, Karasinek ve Diğer Uçan Zararlılarla Mücadele'
        },
        background: '#ffffff'
      },
      {
        id: 'slide-2',
        type: 'content',
        content: {
          title: 'Önemli Uçan Böcek Türleri',
          bullets: [
            'Karasinek (Musca domestica): 6-7 mm, gri-siyah, gıda kontaminasyonu',
            'Sivrisinek (Culicidae): 3-6 mm, ince vücut, kan emici, hastalık vektörü',
            'Meyve Sineği (Drosophila): 2-3 mm, sarımsı-kahverengi, fermantasyon seven',
            'Güve (Tineidae, Pyralidae): 5-30 mm, gri-kahverengi, gıda ve tekstil zararlısı',
            'Arı ve Eşek Arısı (Vespidae): 10-30 mm, sarı-siyah, sokma riski',
            'Tatarcık (Phlebotominae): 1.5-3 mm, kan emici, Leishmania vektörü',
            'Yakarca (Simuliidae): 1-5 mm, kan emici, alerjik reaksiyonlar'
          ]
        },
        background: '#ffffff'
      },
      {
        id: 'slide-3',
        type: 'content',
        content: {
          title: 'Uçan Böceklerin Yaşam Döngüsü',
          bullets: [
            'Karasinek: Yumurta → Larva → Pupa → Erişkin (10-14 gün)',
            'Sivrisinek: Yumurta → Larva → Pupa → Erişkin (7-10 gün, su ortamında)',
            'Meyve Sineği: Yumurta → Larva → Pupa → Erişkin (8-10 gün)',
            'Güve: Yumurta → Larva → Pupa → Erişkin (30-300 gün, türe göre değişir)',
            'Arı/Eşek Arısı: Yumurta → Larva → Pupa → Erişkin (koloniler halinde)',
            'Üreme Hızı: Karasinek dişisi 500+ yumurta, sivrisinek 100-300 yumurta',
            'Mevsimsel Aktivite: Sıcaklık ve nem koşullarına bağlı popülasyon artışı'
          ]
        },
        background: '#ffffff'
      },
      {
        id: 'slide-4',
        type: 'two-column',
        content: {
          title: 'Uçan Böceklerin Zararları',
          leftTitle: 'Sağlık Riskleri',
          leftContent: [
            'Hastalık bulaştırma (vektör rolü)',
            'Gıda kontaminasyonu',
            'Alerjik reaksiyonlar',
            'Sokma ve ısırma yaralanmaları',
            'Psikolojik rahatsızlık',
            'Uyku bozuklukları'
          ],
          rightTitle: 'Ekonomik Zararlar',
          rightContent: [
            'Ürün ve gıda bozulması',
            'Müşteri şikayetleri',
            'İtibar kaybı',
            'Denetim başarısızlıkları',
            'Operasyonel aksamalar',
            'Temizlik maliyetleri'
          ]
        },
        background: '#ffffff'
      },
      {
        id: 'slide-5',
        type: 'content',
        content: {
          title: 'Uçan Böcek Mücadele Yöntemleri',
          bullets: [
            'Fiziksel Bariyerler: Sineklikler, hava perdeleri, otomatik kapılar',
            'Elektrikli Cihazlar: EFK (Elektronik Sinek Öldürücü), ILT (Işık Tuzakları)',
            'Yapışkan Tuzaklar: Pencere bantları, asılabilir tuzaklar',
            'Kimyasal Kontrol: Rezidüel spreyler, ULV uygulamaları, aerosol ürünler',
            'Larva Kontrolü: Üreme alanlarının tespiti ve larvacide uygulaması',
            'Feromon Tuzakları: Özellikle güve kontrolünde etkili',
            'Biyolojik Kontrol: Bacillus thuringiensis israelensis (BTI) gibi biyolojik ajanlar'
          ]
        },
        background: '#ffffff'
      },
      {
        id: 'slide-6',
        type: 'content',
        content: {
          title: 'EFK (Elektronik Sinek Öldürücü) Sistemleri',
          bullets: [
            'Çalışma Prensibi: UV-A ışık çekimi + elektrik şoku veya yapışkan yüzey',
            'Yerleşim Kriterleri: Giriş noktaları, gıda hazırlama alanları, pencerelerden uzak',
            'Montaj Yüksekliği: Genellikle 2-2.5 metre, türe göre değişebilir',
            'Lamba Değişimi: 6-12 ayda bir (etkinlik %30 düşünce)',
            'Bakım: Haftalık/aylık temizlik, yapışkan plaka değişimi',
            'Etkinlik Ölçümü: Yakalanan böcek sayısı ve türü kaydı, trend analizi',
            'Cihaz Tipleri: Duvar tipi, asılabilir, dekoratif, gizli, endüstriyel',
            'Gıda Güvenliği: Kırılmaya dayanıklı lambalar, yapışkan plaka koruma'
          ]
        },
        background: '#ffffff'
      },
      {
        id: 'slide-7',
        type: 'content',
        content: {
          title: 'Üreme Alanı Kontrolü',
          bullets: [
            'Sivrisinek: Durgun su birikintileri, saksı tabakları, yağmur suyu kanalları',
            'Karasinek: Çöp alanları, organik atıklar, hayvan dışkısı, bozulmuş gıdalar',
            'Meyve Sineği: Olgun meyveler, fermante gıdalar, şarap, sirke',
            'Güve: Gıda depoları, tekstil ürünleri, karanlık köşeler',
            'Larvacide Uygulaması: Biyolojik ve kimyasal larva kontrol ürünleri',
            'Fiziksel Kontrol: Su drenajı, atık yönetimi, temizlik rutinleri',
            'Habitat Modifikasyonu: Üreme alanlarının ortadan kaldırılması',
            'Periyodik İnceleme: Potansiyel üreme alanlarının düzenli kontrolü'
          ]
        },
        background: '#ffffff'
      },
      {
        id: 'slide-8',
        type: 'content',
        content: {
          title: 'Entegre Uçan Böcek Yönetimi',
          bullets: [
            'Risk Değerlendirmesi: Tesis ve çevre analizi, giriş ve üreme noktaları',
            'Önleyici Tedbirler: Fiziksel bariyerler, hijyen, habitat modifikasyonu',
            'Monitoring Sistemi: EFK cihazları, yapışkan tuzaklar, görsel inceleme',
            'Müdahale Stratejisi: Kademeli ve entegre yaklaşım',
            'Veri Analizi: Yakalanan böcek sayısı ve türü, trend analizi',
            'Dokümantasyon: Kapsamlı kayıt tutma ve raporlama',
            'Eğitim: Personel farkındalığı ve katılımı',
            'Sürekli İyileştirme: Program etkinliğinin düzenli değerlendirilmesi'
          ]
        },
        background: '#ffffff'
      },
      {
        id: 'slide-9',
        type: 'content',
        content: {
          title: 'Sektöre Özel Uygulamalar',
          bullets: [
            'Gıda Üretimi: HACCP uyumlu sistemler, yüksek güvenlikli EFK cihazları',
            'Sağlık Sektörü: Steril alan koruması, düşük kimyasal kullanımı',
            'Otelcilik: Misafir rahatsızlığı yaratmayan gizli sistemler',
            'Perakende: Müşteri alanlarında estetik çözümler',
            'Dış Mekan: Bahçe, teras, havuz alanları için özel uygulamalar',
            'Endüstriyel Tesisler: Yüksek kapasiteli sistemler, zorlu ortam çözümleri',
            'Atık Yönetimi: Çöp alanları, geri dönüşüm tesisleri için özel programlar',
            'Tarım ve Hayvancılık: Ahır, sera, depo alanları için özel çözümler'
          ]
        },
        background: '#ffffff'
      },
      {
        id: 'slide-10',
        type: 'thank-you',
        content: {
          title: 'Teşekkürler',
          subtitle: 'Sorularınız?'
        },
        background: '#ffffff'
      }
    ],
    thumbnail_url: null,
    is_active: true
  },
  {
    id: 'template-stored-pests',
    name: 'Depo Zararlıları Mücadelesi Eğitimi',
    standard: 'PESTS',
    description: 'Depo zararlıları ve mücadele yöntemleri eğitim sunumu',
    slides: [
      {
        id: 'slide-1',
        type: 'title',
        content: {
          title: 'Depo Zararlıları Mücadelesi',
          subtitle: 'Gıda ve Ürün Güvenliği için Kapsamlı Yaklaşım'
        },
        background: '#ffffff'
      },
      {
        id: 'slide-2',
        type: 'content',
        content: {
          title: 'Önemli Depo Zararlıları',
          bullets: [
            'Kırma Biti (Tribolium spp.): 2.3-4.5 mm, kırmızımsı-kahverengi, un ve tahıl zararlısı',
            'Ekin Kambur Biti (Rhyzopertha dominica): 2-3 mm, koyu kahverengi, tahıl delici',
            'Pirinç Biti (Sitophilus oryzae): 2.5-4 mm, koyu kahverengi, tahıl zararlısı',
            'Un Güvesi (Ephestia kuehniella): 20-25 mm kanat açıklığı, gri, un zararlısı',
            'Kuru Meyve Güvesi (Plodia interpunctella): 16-20 mm kanat açıklığı, bakır-kahverengi',
            'Tütün Böceği (Lasioderma serricorne): 2-3 mm, kırmızımsı-kahverengi, tütün zararlısı',
            'Ekin Biti (Sitophilus granarius): 3-5 mm, koyu kahverengi, tahıl zararlısı'
          ]
        },
        background: '#ffffff'
      },
      {
        id: 'slide-3',
        type: 'content',
        content: {
          title: 'Depo Zararlılarının Biyolojisi',
          bullets: [
            'Yaşam Döngüsü: Yumurta → Larva → Pupa → Erişkin (20-300 gün, türe göre değişir)',
            'Üreme: Dişi başına 50-400 yumurta (türe göre değişir)',
            'Beslenme: Primer (sağlam ürün) ve sekonder (işlenmiş ürün) zararlılar',
            'Gelişim Faktörleri: Sıcaklık (15-35°C), nem (%40-90), besin kalitesi',
            'Hareket: Uçma, tırmanma, sürünme yetenekleri',
            'Gizlenme: Çatlak, yarık ve ürün içinde yaşama',
            'Direnç: Bazı türlerde fumigantlara ve insektisitlere direnç gelişimi'
          ]
        },
        background: '#ffffff'
      },
      {
        id: 'slide-4',
        type: 'two-column',
        content: {
          title: 'Depo Zararlılarının Zararları',
          leftTitle: 'Doğrudan Zararlar',
          leftContent: [
            'Ürün tüketimi ve ağırlık kaybı',
            'Ürün kalitesinin düşmesi',
            'Besin değeri kaybı',
            'Çimlenme gücü kaybı (tohumlarda)',
            'Kontaminasyon (dışkı, kabuk, vücut parçaları)',
            'Koku ve tat bozulması'
          ],
          rightTitle: 'Dolaylı Zararlar',
          rightContent: [
            'Ekonomik kayıplar',
            'İtibar zedelenmesi',
            'Müşteri şikayetleri',
            'Yasal yaptırımlar',
            'İhracat reddi',
            'Sekonder enfestasyonlar'
          ]
        },
        background: '#ffffff'
      },
      {
        id: 'slide-5',
        type: 'content',
        content: {
          title: 'Depo Zararlısı Aktivite Belirtileri',
          bullets: [
            'Canlı veya ölü böcekler: Ürün içinde veya yüzeyinde',
            'Larva, pupa veya yumurtalar: Ürün içinde veya ambalajda',
            'Dışkı ve kabuk kalıntıları: Küçük siyah noktalar veya kabuk parçaları',
            'İpek ağlar: Güve larvalarının oluşturduğu ipeksi yapılar',
            'Delikler: Ürün taneleri veya ambalajlarda delikler',
            'Un benzeri toz: Böcek aktivitesi sonucu oluşan ince toz',
            'Koku değişimi: Fermente veya küf kokusu',
            'Isı artışı: Yoğun istilalarda ürün sıcaklığında artış'
          ]
        },
        background: '#ffffff'
      },
      {
        id: 'slide-6',
        type: 'content',
        content: {
          title: 'Depo Zararlıları Mücadele Yöntemleri',
          bullets: [
            'Fiziksel Kontrol: Sıcaklık (ısıtma/soğutma), nem kontrolü, modifiye atmosfer',
            'Mekanik Kontrol: Eleme, temizleme, vakumlama',
            'Biyolojik Kontrol: Doğal düşmanlar, entomopatojenik mikroorganizmalar',
            'Kimyasal Kontrol: Kontakt insektisitler, fümigantlar, IGR\'ler (Böcek Gelişim Düzenleyicileri)',
            'Feromon Tuzakları: Monitoring ve kitle yakalama',
            'Kültürel Kontrol: Depo hijyeni, rotasyon, izolasyon',
            'Bütünleşik Yaklaşım: Tüm yöntemlerin sistematik kombinasyonu'
          ]
        },
        background: '#ffffff'
      },
      {
        id: 'slide-7',
        type: 'content',
        content: {
          title: 'Fumigasyon',
          bullets: [
            'Tanım: Gaz halindeki pestisitlerle kapalı alanda zararlı kontrolü',
            'Fumigantlar: Fosfin (PH3), metil bromür, sülfüril florür',
            'Uygulama Alanları: Silolar, depolar, konteynerler, işleme tesisleri',
            'Etki Mekanizması: Solunum sistemi inhibisyonu, hücresel metabolizma bozulması',
            'Avantajlar: Yüksek penetrasyon, tüm yaşam evrelerine etki, kalıntı bırakmama',
            'Güvenlik Önlemleri: Sızdırmazlık, gaz ölçümü, eğitimli personel, uyarı işaretleri',
            'Yasal Gereklilikler: Lisanslı uygulamacı, izin ve bildirimler',
            'Çevresel Etkiler: Ozon tabakası, sera gazı emisyonu, hedef dışı organizmalar'
          ]
        },
        background: '#ffffff'
      },
      {
        id: 'slide-8',
        type: 'content',
        content: {
          title: 'Feromon Tuzakları ve Monitoring',
          bullets: [
            'Feromon Tipleri: Cinsel, toplanma, alarm, iz feromonları',
            'Tuzak Tipleri: Delta, yapışkan tuzak, huni tuzak, tane tuzağı',
            'Yerleşim: Stratejik noktalara, 10-30 metre aralıklarla',
            'Kontrol Sıklığı: Haftalık veya iki haftalık periyotlarla',
            'Veri Kaydı: Tür, sayı, lokasyon, tarih bilgileri',
            'Eşik Değerleri: Müdahale için belirlenen popülasyon seviyeleri',
            'Trend Analizi: Popülasyon değişiminin zaman içinde izlenmesi',
            'Erken Uyarı: İstila başlangıcının erken tespiti'
          ]
        },
        background: '#ffffff'
      },
      {
        id: 'slide-9',
        type: 'content',
        content: {
          title: 'Entegre Depo Zararlısı Yönetimi',
          bullets: [
            'Risk Değerlendirmesi: Tesis, ürün ve çevre analizi',
            'Önleyici Tedbirler: Yapısal iyileştirmeler, hijyen, rotasyon',
            'Monitoring Sistemi: Feromon tuzakları, görsel inceleme, örnekleme',
            'Müdahale Stratejisi: Kademeli ve entegre yaklaşım',
            'Direnç Yönetimi: Farklı etki mekanizmalarının rotasyonu',
            'Dokümantasyon: Kapsamlı kayıt tutma ve raporlama',
            'Eğitim: Personel farkındalığı ve katılımı',
            'Sürekli İyileştirme: Program etkinliğinin düzenli değerlendirilmesi'
          ]
        },
        background: '#ffffff'
      },
      {
        id: 'slide-10',
        type: 'thank-you',
        content: {
          title: 'Teşekkürler',
          subtitle: 'Sorularınız?'
        },
        background: '#ffffff'
      }
    ],
    thumbnail_url: null,
    is_active: true
  },
  {
    id: 'template-birds',
    name: 'Kuş Kontrolü Eğitimi',
    standard: 'PESTS',
    description: 'Kuş türleri ve kontrol yöntemleri eğitim sunumu',
    slides: [
      {
        id: 'slide-1',
        type: 'title',
        content: {
          title: 'Kuş Kontrolü',
          subtitle: 'İnsan ve Kuş Dostu Yaklaşımlar'
        },
        background: '#ffffff'
      },
      {
        id: 'slide-2',
        type: 'content',
        content: {
          title: 'Sorun Yaratan Kuş Türleri',
          bullets: [
            'Güvercin (Columba livia): Şehir ortamlarında en yaygın sorun',
            'Martı (Larus spp.): Sahil bölgeleri ve çöp alanlarında',
            'Serçe (Passer domesticus): Küçük ama sayıca fazla olabilir',
            'Sığırcık (Sturnus vulgaris): Büyük sürüler halinde',
            'Karga (Corvus spp.): Zeki ve adaptif, çöp karıştırma',
            'Ağaçkakan (Picidae): Yapısal hasara neden olabilir',
            'Kumru (Streptopelia spp.): Şehir ve banliyölerde yaygın'
          ]
        },
        background: '#ffffff'
      },
      {
        id: 'slide-3',
        type: 'content',
        content: {
          title: 'Kuşların Yarattığı Sorunlar',
          bullets: [
            'Dışkı Birikimi: Yapısal hasar, estetik sorunlar, kayma tehlikesi',
            'Sağlık Riskleri: Histoplazmosis, Salmonellosis, E. coli, ektoparazitler',
            'Yapısal Hasar: Çatı, oluk, havalandırma sistemleri, dış cephe',
            'Gürültü: Özellikle sabah erken saatlerde rahatsızlık',
            'Ürün Kontaminasyonu: Gıda işleme ve depolama alanlarında',
            'Yangın Riski: Yuva malzemelerinin havalandırma sistemlerini tıkaması',
            'İmaj ve İtibar: Müşteri algısı ve profesyonellik etkisi',
            'Yasal Sorumluluk: Kayma ve düşme kazaları, sağlık riskleri'
          ]
        },
        background: '#ffffff'
      },
      {
        id: 'slide-4',
        type: 'two-column',
        content: {
          title: 'Kuş Davranışları ve Biyolojisi',
          leftTitle: 'Davranış Özellikleri',
          leftContent: [
            'Yuva yapma ve üreme döngüsü',
            'Beslenme alışkanlıkları',
            'Tüneme davranışı',
            'Bölge savunması',
            'Göç ve mevsimsel hareketler',
            'Öğrenme ve adaptasyon yeteneği'
          ],
          rightTitle: 'Çekici Faktörler',
          rightContent: [
            'Gıda kaynakları',
            'Su kaynakları',
            'Barınma alanları',
            'Güvenli tüneme yerleri',
            'Yuva yapma fırsatları',
            'Çevresel koşullar'
          ]
        },
        background: '#ffffff'
      },
      {
        id: 'slide-5',
        type: 'content',
        content: {
          title: 'Fiziksel Engelleme Yöntemleri',
          bullets: [
            'Kuş Telleri: Paslanmaz çelik teller, tünemeyi engeller',
            'Kuş Dikenli Sistemler: Plastik veya metal dikenler, tünemeyi engeller',
            'Ağlar: Nylon veya paslanmaz çelik, geniş alanları korur',
            'Elektrikli Sistemler: Düşük voltajlı, zararsız şok etkisi',
            'Kaygan Yüzeyler: Jel veya kaygan polimer uygulamaları',
            'Bariyerler: Fiziksel engeller, giriş noktalarını kapatma',
            'Eğimli Paneller: 45-60° eğimli yüzeyler, tünemeyi engeller',
            'Döner Sistemler: Rüzgarla dönen engeller, tünemeyi zorlaştırır'
          ]
        },
        background: '#ffffff'
      },
      {
        id: 'slide-6',
        type: 'content',
        content: {
          title: 'Görsel ve İşitsel Caydırıcılar',
          bullets: [
            'Yansıtıcı Nesneler: Aynalar, CD\'ler, holografik bantlar',
            'Yırtıcı Kuş Maketleri: Şahin, kartal, baykuş figürleri',
            'Göz Balonları: Büyük göz desenli balonlar',
            'Lazer Sistemleri: Düşük güçlü lazer ışınları (özellikle yeşil)',
            'Ultrasonik Cihazlar: Yüksek frekanslı ses dalgaları (sınırlı etkinlik)',
            'Distress Call: Kuşların tehlike çağrılarını yayınlayan sistemler',
            'Predatör Sesleri: Yırtıcı kuş veya hayvan sesleri',
            'Ani Ses ve Işık: Hareket sensörlü sistemler'
          ]
        },
        background: '#ffffff'
      },
      {
        id: 'slide-7',
        type: 'content',
        content: {
          title: 'Habitat Modifikasyonu',
          bullets: [
            'Gıda Kaynaklarının Kontrolü: Açık çöp alanlarının kapatılması',
            'Su Kaynaklarının Yönetimi: Durgun su birikintilerinin giderilmesi',
            'Bitki Örtüsü Düzenlemesi: Tüneme ve yuva alanlarının azaltılması',
            'Bina Tasarımı: Kuş dostu olmayan mimari özellikler',
            'Çatı ve Oluk Bakımı: Düzenli temizlik ve onarım',
            'Atık Yönetimi: Kapalı çöp konteynerleri, düzenli toplama',
            'Peyzaj Düzenlemesi: Kuşları çekmeyen bitki türleri seçimi',
            'Alternatif Tüneme Alanları: Uzak bölgelerde güvenli alanlar oluşturma'
          ]
        },
        background: '#ffffff'
      },
      {
        id: 'slide-8',
        type: 'content',
        content: {
          title: 'Entegre Kuş Yönetimi',
          bullets: [
            'Risk Değerlendirmesi: Tesis ve çevre analizi, kuş türleri ve davranışları',
            'Önleyici Tedbirler: Habitat modifikasyonu, giriş ve tüneme engelleme',
            'Caydırıcı Sistemler: Görsel, işitsel ve fiziksel caydırıcıların kombinasyonu',
            'Monitoring: Kuş aktivitesinin düzenli izlenmesi ve değerlendirilmesi',
            'Temizlik ve Dezenfeksiyon: Dışkı ve yuva kalıntılarının güvenli temizliği',
            'Dokümantasyon: Kapsamlı kayıt tutma ve raporlama',
            'Eğitim: Personel farkındalığı ve katılımı',
            'Sürekli İyileştirme: Program etkinliğinin düzenli değerlendirilmesi'
          ]
        },
        background: '#ffffff'
      },
      {
        id: 'slide-9',
        type: 'content',
        content: {
          title: 'Yasal ve Etik Hususlar',
          bullets: [
            'Korunan Türler: Ulusal ve uluslararası koruma statüsündeki türler',
            'İzin ve Lisanslar: Bazı kontrol yöntemleri için gerekli olabilir',
            'Hayvan Refahı: İnsani ve etik yaklaşımlar',
            'Çevresel Etki: Hedef dışı türlere ve ekosisteme etkiler',
            'Kamu Algısı: Kuş kontrolü uygulamalarının toplumsal algısı',
            'Yerel Yönetimler: Belediye ve yerel otorite düzenlemeleri',
            'Endüstri Standartları: Sektöre özgü gereksinimler ve kılavuzlar',
            'Sürdürülebilirlik: Uzun vadeli ve çevre dostu yaklaşımlar'
          ]
        },
        background: '#ffffff'
      },
      {
        id: 'slide-10',
        type: 'thank-you',
        content: {
          title: 'Teşekkürler',
          subtitle: 'Sorularınız?'
        },
        background: '#ffffff'
      }
    ],
    thumbnail_url: null,
    is_active: true
  }
];