import React from 'react';
import { Link } from 'react-router-dom';
import { Award, CheckCircle, Shield, FileText, Users, Target, ArrowLeft, Phone, Mail, Cog, Globe } from 'lucide-react';

const ISO22000Page = () => {
  const isoRequirements = [
    {
      icon: Shield,
      title: "Gıda Güvenliği Yönetim Sistemi",
      description: "ISO 22000 standardına uygun kapsamlı gıda güvenliği yönetim sistemi",
      features: [
        "Gıda güvenliği politikası",
        "Risk değerlendirme sistemleri",
        "Operasyonel ön koşul programları",
        "HACCP ilkelerinin uygulanması"
      ]
    },
    {
      icon: Target,
      title: "Zararlı Mücadele Programı",
      description: "ISO 22000 gereksinimlerine uygun zararlı mücadele ve monitoring",
      features: [
        "Entegre zararlı yönetimi (IPM)",
        "Risk analizi ve haritalama",
        "Monitoring ve kayıt sistemleri",
        "Performans değerlendirmesi"
      ]
    },
    {
      icon: Cog,
      title: "Süreç Yönetimi",
      description: "Zararlı mücadele süreçlerinin sistematik yönetimi",
      features: [
        "Süreç tanımlaması",
        "Performans göstergeleri",
        "Sürekli iyileştirme",
        "İç audit sistemleri"
      ]
    },
    {
      icon: Users,
      title: "İnsan Kaynakları",
      description: "ISO 22000 gereksinimlerine uygun personel yetkinliği",
      features: [
        "Yetkinlik değerlendirmesi",
        "Eğitim programları",
        "Farkındalık eğitimleri",
        "Performans takibi"
      ]
    }
  ];

  const isoStructure = [
    {
      clause: "4",
      title: "Organizasyonun Bağlamı",
      description: "Organizasyonun iç ve dış bağlamının belirlenmesi",
      requirements: [
        "İç ve dış faktörlerin analizi",
        "İlgili tarafların belirlenmesi",
        "FSMS kapsamının tanımlanması",
        "Gıda güvenliği yönetim sisteminin kurulması"
      ]
    },
    {
      clause: "5",
      title: "Liderlik",
      description: "Üst yönetimin liderliği ve taahhüdü",
      requirements: [
        "Gıda güvenliği politikası",
        "Roller ve sorumluluklar",
        "Müşteri odaklılık",
        "Gıda güvenliği ekibi"
      ]
    },
    {
      clause: "6",
      title: "Planlama",
      description: "Risk ve fırsatların ele alınması",
      requirements: [
        "Risk ve fırsat değerlendirmesi",
        "Gıda güvenliği hedefleri",
        "Değişikliklerin planlanması",
        "Acil durum hazırlığı"
      ]
    },
    {
      clause: "7",
      title: "Destek",
      description: "Kaynaklar, yetkinlik ve farkındalık",
      requirements: [
        "Kaynak yönetimi",
        "Yetkinlik ve eğitim",
        "Farkındalık programları",
        "İletişim sistemleri"
      ]
    },
    {
      clause: "8",
      title: "Operasyon",
      description: "Operasyonel planlama ve kontrol",
      requirements: [
        "Operasyonel ön koşul programları",
        "HACCP planının uygulanması",
        "Zararlı mücadele programları",
        "İzlenebilirlik sistemleri"
      ]
    },
    {
      clause: "9",
      title: "Performans Değerlendirmesi",
      description: "İzleme, ölçme, analiz ve değerlendirme",
      requirements: [
        "İzleme ve ölçme",
        "İç audit programları",
        "Yönetim gözden geçirmesi",
        "Performans analizi"
      ]
    },
    {
      clause: "10",
      title: "İyileştirme",
      description: "Uygunsuzluk ve sürekli iyileştirme",
      requirements: [
        "Uygunsuzluk yönetimi",
        "Düzeltici eylemler",
        "Sürekli iyileştirme",
        "Sistem güncellemeleri"
      ]
    }
  ];

  const implementationSteps = [
    {
      step: 1,
      title: "Gap Analizi",
      description: "Mevcut durumun ISO 22000 gereksinimlerine göre değerlendirilmesi"
    },
    {
      step: 2,
      title: "Sistem Tasarımı",
      description: "ISO 22000 uyumlu gıda güvenliği yönetim sisteminin tasarlanması"
    },
    {
      step: 3,
      title: "Dokümantasyon",
      description: "Politika, prosedür ve talimatların hazırlanması"
    },
    {
      step: 4,
      title: "Eğitim ve Uygulama",
      description: "Personel eğitimi ve sistemin uygulamaya konulması"
    },
    {
      step: 5,
      title: "İç Audit",
      description: "Sistemin etkinliğinin iç audit ile değerlendirilmesi"
    },
    {
      step: 6,
      title: "Sertifikasyon Audit",
      description: "Bağımsız kuruluş tarafından sertifikasyon auditinin yapılması"
    }
  ];

  const benefits = [
    "ISO 22000 sertifikasyonu için gerekli zararlı mücadele sistemi",
    "Uluslararası kabul görmüş gıda güvenliği standardı",
    "Müşteri güveninin artırılması",
    "Risk yönetimi ve önleme sistemleri",
    "Sürekli iyileştirme kültürü",
    "Yasal gereksinimlere uygunluk",
    "Pazar erişiminin genişletilmesi",
    "Operasyonel verimlilik artışı"
  ];

  const pestControlIntegration = [
    {
      area: "Operasyonel Ön Koşul Programları",
      description: "Zararlı mücadele programının operasyonel ön koşul programı olarak entegrasyonu",
      elements: [
        "Zararlı mücadele politikası",
        "Risk değerlendirme prosedürleri",
        "Monitoring ve kayıt sistemleri",
        "Düzeltici eylem prosedürleri"
      ]
    },
    {
      area: "HACCP Entegrasyonu",
      description: "Zararlı mücadelesinin HACCP sistemine entegre edilmesi",
      elements: [
        "Tehlike analizi sürecine dahil edilme",
        "CCP belirleme sürecinde değerlendirme",
        "Monitoring sistemlerine entegrasyon",
        "Doğrulama faaliyetlerine dahil edilme"
      ]
    },
    {
      area: "Performans İzleme",
      description: "Zararlı mücadele performansının sistematik izlenmesi",
      elements: [
        "KPI tanımlaması ve takibi",
        "Trend analizi raporları",
        "Etkinlik değerlendirmesi",
        "İyileştirme fırsatlarının belirlenmesi"
      ]
    }
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
            <span className="text-gray-600">ISO 22000 Zararlı Mücadelesi</span>
          </div>
        </div>
      </section>

      {/* Page Header */}
      <section className="bg-gradient-to-br from-purple-50 to-purple-100 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center mb-6">
              <Globe className="h-12 w-12 text-purple-600 mr-4" />
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
                ISO 22000 Zararlı Mücadelesi
              </h1>
            </div>
            <p className="text-xl text-gray-600 leading-relaxed">
              ISO 22000 Gıda Güvenliği Yönetim Sistemi standardına uygun zararlı mücadele. 
              Uluslararası standartlarda gıda güvenliği için sistematik yaklaşım.
            </p>
          </div>
        </div>
      </section>

      {/* ISO Requirements */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">ISO 22000 Zararlı Mücadele Gereksinimleri</h2>
            <p className="text-xl text-gray-600">
              ISO 22000 standardının zararlı mücadele ile ilgili temel gereksinimleri
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {isoRequirements.map((requirement, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-xl p-8 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                    <requirement.icon className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">{requirement.title}</h3>
                </div>
                <p className="text-gray-600 mb-6">{requirement.description}</p>
                <ul className="space-y-2">
                  {requirement.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-purple-600 mr-3" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ISO Structure */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">ISO 22000 Standart Yapısı</h2>
            <p className="text-xl text-gray-600">
              ISO 22000 standardının temel maddeleri ve zararlı mücadele entegrasyonu
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {isoStructure.map((clause, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center mb-4">
                  <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-bold mr-3">
                    Madde {clause.clause}
                  </span>
                  <h3 className="text-lg font-semibold text-gray-800">{clause.title}</h3>
                </div>
                <p className="text-gray-600 mb-4">{clause.description}</p>
                <ul className="space-y-2">
                  {clause.requirements.map((req, reqIndex) => (
                    <li key={reqIndex} className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-purple-600 rounded-full mr-3"></div>
                      <span className="text-gray-600">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pest Control Integration */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Zararlı Mücadelesinin ISO 22000'e Entegrasyonu</h2>
            <p className="text-xl text-gray-600">
              Zararlı mücadele programının ISO 22000 sistemine nasıl entegre edildiği
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {pestControlIntegration.map((integration, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">{integration.area}</h3>
                <p className="text-gray-600 mb-4">{integration.description}</p>
                <ul className="space-y-2">
                  {integration.elements.map((element, elementIndex) => (
                    <li key={elementIndex} className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 text-purple-600 mr-3" />
                      <span className="text-gray-600">{element}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Implementation Steps */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">ISO 22000 Uygulama Süreci</h2>
            <p className="text-xl text-gray-600">
              ISO 22000 sertifikasyonu için sistematik uygulama sürecimiz
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {implementationSteps.map((step, index) => (
                <div key={index} className="flex items-start space-x-6">
                  <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
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

      {/* Benefits */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-800 mb-6">ISO 22000 Uyumlu Zararlı Mücadelesinin Faydaları</h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                ISO 22000 standardına uygun zararlı mücadele sistemi ile uluslararası kabul görmüş 
                gıda güvenliği sertifikasyonu elde ederek global pazarlarda rekabet avantajı sağlayın.
              </p>
              
              <div className="space-y-3">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="h-6 w-6 text-purple-600 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <img 
                src="https://images.pexels.com/photos/4491461/pexels-photo-4491461.jpeg?auto=compress&cs=tinysrgb&w=800" 
                alt="ISO 22000 Zararlı Mücadelesi" 
                className="rounded-2xl shadow-xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-purple-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            ISO 22000 Sertifikasyonu İçin Bizimle İletişime Geçin
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            ISO 22000 standardına uygun zararlı mücadele sistemi kurulumu için uzman desteği alın.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/iletisim" 
              className="bg-white text-purple-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium shadow-lg flex items-center justify-center space-x-2"
            >
              <Mail className="h-5 w-5" />
              <span>Keşif Talebi</span>
            </Link>
            <a 
              href="tel:02242338387" 
              className="border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-purple-600 transition-colors font-medium flex items-center justify-center space-x-2"
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

export default ISO22000Page;