import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, CheckCircle, FileText, Award, Users, Shield, ArrowLeft, Phone, Mail, ClipboardCheck } from 'lucide-react';

const ThirdPartyConsultingPage = () => {
  const services = [
    {
      icon: ClipboardCheck,
      title: "Bağımsız Kalite Denetimi",
      description: "Mevcut zararlı mücadele programlarının objektif değerlendirilmesi",
      features: [
        "Uygulama kalitesi kontrolü",
        "Prosedür uygunluk denetimi",
        "Personel yeterlilik değerlendirmesi",
        "Ekipman ve malzeme kontrolü"
      ]
    },
    {
      icon: FileText,
      title: "Mevzuat Uygunluk Kontrolü",
      description: "Yasal gerekliliklere uygunluk değerlendirmesi ve raporlama",
      features: [
        "Yasal mevzuat analizi",
        "Uygunluk gap analizi",
        "Düzeltici eylem önerileri",
        "Uygunluk sertifikasyonu"
      ]
    },
    {
      icon: Award,
      title: "Sertifikasyon Desteği",
      description: "Uluslararası standartlara uygunluk için danışmanlık hizmetleri",
      features: [
        "ISO 22000 desteği",
        "HACCP sistem kurulumu",
        "BRC/IFS hazırlık",
        "Audit öncesi değerlendirme"
      ]
    },
    {
      icon: Users,
      title: "Eğitim ve Bilinçlendirme",
      description: "Personel eğitimi ve farkındalık programları",
      features: [
        "Zararlı mücadele eğitimleri",
        "Hijyen ve sanitasyon eğitimi",
        "Risk değerlendirme eğitimi",
        "Sürekli iyileştirme programları"
      ]
    }
  ];

  const auditProcess = [
    {
      step: 1,
      title: "Ön Değerlendirme",
      description: "Mevcut durumun analizi, dokümantasyon incelemesi ve audit planının hazırlanması"
    },
    {
      step: 2,
      title: "Saha Denetimi",
      description: "Detaylı saha incelemesi, uygulama gözlemi ve personel görüşmeleri"
    },
    {
      step: 3,
      title: "Bulgular Analizi",
      description: "Denetim bulgularının değerlendirilmesi ve risk seviyelerinin belirlenmesi"
    },
    {
      step: 4,
      title: "Rapor Hazırlama",
      description: "Detaylı audit raporu, iyileştirme önerileri ve eylem planının sunulması"
    },
    {
      step: 5,
      title: "Takip ve İyileştirme",
      description: "Düzeltici eylemlerin takibi ve sürekli iyileştirme desteği"
    }
  ];

  const benefits = [
    "Objektif ve bağımsız değerlendirme",
    "Uluslararası standartlara uygunluk",
    "Risk yönetimi ve önleme",
    "Maliyet optimizasyonu",
    "Sürekli iyileştirme kültürü",
    "Müşteri güveninin artırılması",
    "Yasal uygunluk güvencesi",
    "Rekabet avantajı sağlama"
  ];

  const sectors = [
    {
      name: "Gıda Sektörü",
      description: "Gıda üretim ve işleme tesisleri için özel denetim programları",
      standards: ["HACCP", "ISO 22000", "BRC", "IFS"]
    },
    {
      name: "İlaç Sektörü",
      description: "Farmasötik üretim tesisleri için GMP uygunluk denetimleri",
      standards: ["GMP", "GDP", "ISO 13485", "FDA"]
    },
    {
      name: "Sağlık Sektörü",
      description: "Hastane ve sağlık kuruluşları için hijyen denetimleri",
      standards: ["JCI", "ISO 15189", "Sağlık Bakanlığı", "WHO"]
    },
    {
      name: "Turizm Sektörü",
      description: "Otel ve turizm tesisleri için kalite ve hijyen denetimleri",
      standards: ["ISO 9001", "HACCP", "Turizm Bakanlığı", "Yeşil Anahtar"]
    }
  ];

  const reportFeatures = [
    "Detaylı bulgular ve kanıtlar",
    "Risk seviyesi değerlendirmeleri",
    "Öncelikli iyileştirme alanları",
    "Spesifik eylem önerileri",
    "Zaman çizelgeli uygulama planı",
    "Maliyet-fayda analizleri",
    "Benchmark karşılaştırmaları",
    "Sürekli iyileştirme önerileri"
  ];

  return (
    <div className="pt-8">
      {/* Breadcrumb */}
      <section className="bg-gray-50 py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-pest-green-700 hover:text-pest-green-800">Ana Sayfa</Link>
            <span className="text-gray-400">/</span>
            <Link to="/hizmetler" className="text-pest-green-700 hover:text-pest-green-800">Hizmetler</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600">3. Göz Danışmanlık</span>
          </div>
        </div>
      </section>

      {/* Page Header */}
      <section className="bg-gradient-to-br from-indigo-50 to-indigo-100 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center mb-6">
              <Eye className="h-12 w-12 text-indigo-600 mr-4" />
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
                3. Göz Danışmanlık
              </h1>
            </div>
            <p className="text-xl text-gray-600 leading-relaxed">
              Bağımsız denetim ve danışmanlık hizmetleri ile kalite güvencesi sağlıyoruz. 
              Objektif değerlendirmeler ve iyileştirme önerileri ile işletmenizi destekliyoruz.
            </p>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Danışmanlık Hizmetlerimiz</h2>
            <p className="text-xl text-gray-600">
              Bağımsız ve objektif değerlendirmeler ile kalite güvencesi
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-xl p-8 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mr-4">
                    <service.icon className="h-6 w-6 text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">{service.title}</h3>
                </div>
                <p className="text-gray-600 mb-6">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-indigo-600 mr-3" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Audit Process */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Denetim Süreci</h2>
            <p className="text-xl text-gray-600">
              Sistematik ve kapsamlı denetim yaklaşımımız
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {auditProcess.map((step, index) => (
                <div key={index} className="flex items-start space-x-6">
                  <div className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                    {step.step}
                  </div>
                  <div className="bg-white rounded-xl p-6 shadow-lg flex-1">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Sectors */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Sektörel Uzmanlık</h2>
            <p className="text-xl text-gray-600">
              Farklı sektörlerde özelleşmiş denetim ve danışmanlık hizmetleri
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sectors.map((sector, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">{sector.name}</h3>
                <p className="text-gray-600 mb-4 text-sm">{sector.description}</p>
                
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Standartlar:</h4>
                  <div className="flex flex-wrap gap-1">
                    {sector.standards.map((standard, standardIndex) => (
                      <span key={standardIndex} className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded text-xs">
                        {standard}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits & Report Features */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Danışmanlığımızın Faydaları</h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Bağımsız ve objektif değerlendirmelerimiz ile işletmenizin kalite standartlarını 
                yükseltir, riskleri minimize eder ve sürekli iyileştirme kültürü oluştururuz.
              </p>
              
              <div className="space-y-3">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="h-6 w-6 text-indigo-600 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Rapor Özellikleri</h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Detaylı ve uygulanabilir raporlarımız ile işletmenizin iyileştirme alanlarını 
                net bir şekilde belirliyoruz.
              </p>
              
              <div className="space-y-3">
                {reportFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <FileText className="h-6 w-6 text-indigo-600 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-indigo-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            3. Göz Danışmanlık İçin Bizimle İletişime Geçin
          </h2>
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            Bağımsız denetim ve danışmanlık hizmetleri için keşif talebi gönderin.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/iletisim" 
              className="bg-white text-indigo-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium shadow-lg flex items-center justify-center space-x-2"
            >
              <Mail className="h-5 w-5" />
              <span>Keşif Talebi</span>
            </Link>
            <a 
              href="tel:02242338387" 
              className="border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-indigo-600 transition-colors font-medium flex items-center justify-center space-x-2"
            >
              <Phone className="h-5 w-5" />
              <span>Hemen Arayın</span>
            </a>
          </div>
        </div>
      </section>

      {/* Back to Services */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <Link 
            to="/hizmetler" 
            className="inline-flex items-center text-pest-green-700 hover:text-pest-green-800 font-medium"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Tüm Hizmetlere Dön
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ThirdPartyConsultingPage;