import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, CheckCircle, Building, Users, Award, Clock, ArrowLeft, Phone, Mail, Target } from 'lucide-react';

const PestControlPage = () => {
  const facilities = [
    {
      icon: Building,
      title: "Fabrika ve Üretim Tesisleri",
      description: "Endüstriyel tesislerde kapsamlı haşere kontrolü ve önleme programları",
      features: [
        "Üretim hattı koruma",
        "Hammadde depo kontrolü",
        "Makine ve ekipman koruma",
        "Kalite standartları uygunluğu"
      ]
    },
    {
      icon: Users,
      title: "Gıda İşleme Tesisleri",
      description: "Gıda güvenliği standartlarına uygun haşere mücadele programları",
      features: [
        "HACCP uyumlu uygulamalar",
        "Kritik kontrol noktaları",
        "Hijyen standartları",
        "Sürekli monitoring sistemi"
      ]
    },
    {
      icon: Award,
      title: "Depo ve Lojistik Merkezleri",
      description: "Büyük depolama alanlarında etkili haşere kontrolü",
      features: [
        "Geniş alan uygulamaları",
        "Ürün koruma sistemleri",
        "Giriş-çıkış kontrolleri",
        "Periyodik izleme programları"
      ]
    },
    {
      icon: Clock,
      title: "Hastane ve Sağlık Kuruluşları",
      description: "Sağlık sektörü için özel haşere kontrolü ve hijyen programları",
      features: [
        "Steril alan koruması",
        "Hasta güvenliği önceliği",
        "Enfeksiyon kontrolü",
        "Özel protokol uygulamaları"
      ]
    }
  ];

  const pests = [
    {
      name: "Karıncalar",
      description: "Endüstriyel tesislerde karınca kolonilerinin kontrolü",
      methods: ["Jel yem uygulamaları", "Sprey ilaçlama", "Koloni imhası", "Giriş noktası kapatma"]
    },
    {
      name: "Hamamböcekleri",
      description: "Gıda tesislerinde hamamböceği mücadelesi",
      methods: ["Gel yem sistemleri", "Tuzak uygulamaları", "Yuva tespiti", "Hijyen iyileştirme"]
    },
    {
      name: "Sinekler",
      description: "Üretim alanlarında sinek kontrolü",
      methods: ["UV tuzaklar", "Yem istasyonları", "Larvacide uygulamaları", "Fiziksel engeller"]
    },
    {
      name: "Depo Böcekleri",
      description: "Tahıl ve gıda depolarında zararlı böcek kontrolü",
      methods: ["Fumigasyon", "Temas zehirleri", "Feromon tuzaklar", "Sıcaklık kontrolü"]
    },
    {
      name: "Kemirgenler",
      description: "Fare ve sıçan kontrolü programları",
      methods: ["Yem istasyonları", "Mekanik tuzaklar", "Giriş noktası kapatma", "Habitat modifikasyonu"]
    },
    {
      name: "Güveler",
      description: "Tekstil ve gıda güvelerinin kontrolü",
      methods: ["Feromon tuzaklar", "Sprey uygulamaları", "Sıcaklık tedavisi", "Depolama koşulları"]
    }
  ];

  const process = [
    {
      step: 1,
      title: "Tesis Analizi",
      description: "Detaylı tesis incelemesi, risk alanlarının tespiti ve haşere türlerinin belirlenmesi"
    },
    {
      step: 2,
      title: "Program Tasarımı",
      description: "Tesise özel haşere mücadele programının geliştirilmesi ve uygulama planının hazırlanması"
    },
    {
      step: 3,
      title: "Sistematik Uygulama",
      description: "Planlanan programın sistematik olarak uygulanması ve ilk müdahalelerin gerçekleştirilmesi"
    },
    {
      step: 4,
      title: "İzleme ve Kontrol",
      description: "Düzenli monitoring, etkinlik değerlendirmesi ve gerekli ayarlamaların yapılması"
    },
    {
      step: 5,
      title: "Raporlama",
      description: "Detaylı raporlama, trend analizi ve iyileştirme önerilerinin sunulması"
    },
    {
      step: 6,
      title: "Sürekli İyileştirme",
      description: "Program etkinliğinin değerlendirilmesi ve sürekli iyileştirme faaliyetleri"
    }
  ];

  const benefits = [
    "Üretim kalitesinin korunması",
    "Gıda güvenliği standartlarına uygunluk",
    "Müşteri şikayetlerinin önlenmesi",
    "Yasal gerekliliklere uyum",
    "Marka itibarının korunması",
    "Ekonomik kayıpların önlenmesi",
    "Çalışan sağlığının korunması",
    "Sürekli iyileştirme kültürü"
  ];

  const standards = [
    {
      name: "HACCP",
      description: "Gıda güvenliği yönetim sistemi uygunluğu"
    },
    {
      name: "ISO 22000",
      description: "Gıda güvenliği yönetim sistemi standardı"
    },
    {
      name: "BRC",
      description: "İngiliz Perakende Konsorsiyumu standardı"
    },
    {
      name: "IFS",
      description: "Uluslararası Gıda Standardı uygunluğu"
    },
    {
      name: "GMP",
      description: "İyi Üretim Uygulamaları standartları"
    },
    {
      name: "AIB",
      description: "Amerikan Fırıncılık Enstitüsü standartları"
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
            <span className="text-gray-600">Haşere Mücadelesi</span>
          </div>
        </div>
      </section>

      {/* Page Header */}
      <section className="bg-gradient-to-br from-red-50 to-red-100 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center mb-6">
              <Shield className="h-12 w-12 text-red-600 mr-4" />
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
                Haşere Mücadelesi
              </h1>
            </div>
            <p className="text-xl text-gray-600 leading-relaxed">
              Endüstriyel tesislerde kapsamlı haşere kontrolü ve önleme hizmetleri. 
              Üretim kalitesini koruyarak, gıda güvenliği standartlarına uygunluk sağlıyoruz.
            </p>
          </div>
        </div>
      </section>

      {/* Facilities */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Hizmet Verdiğimiz Tesisler</h2>
            <p className="text-xl text-gray-600">
              Farklı endüstriyel tesislerde özelleştirilmiş haşere kontrolü
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {facilities.map((facility, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-xl p-8 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                    <facility.icon className="h-6 w-6 text-red-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">{facility.title}</h3>
                </div>
                <p className="text-gray-600 mb-6">{facility.description}</p>
                <ul className="space-y-2">
                  {facility.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-red-600 mr-3" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pest Types */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-red-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Mücadele Ettiğimiz Haşereler</h2>
            <p className="text-xl text-gray-600">
              Endüstriyel tesislerde karşılaşılan haşere türleri ve kontrol yöntemleri
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pests.map((pest, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">{pest.name}</h3>
                <p className="text-gray-600 mb-4 text-sm">{pest.description}</p>
                
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Kontrol Yöntemleri:</h4>
                  <ul className="space-y-1">
                    {pest.methods.map((method, methodIndex) => (
                      <li key={methodIndex} className="flex items-center text-sm">
                        <Target className="h-3 w-3 text-red-600 mr-2" />
                        <span className="text-gray-600">{method}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Uygulama Süreci</h2>
            <p className="text-xl text-gray-600">
              Sistematik haşere mücadele programımızın 6 temel adımı
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {process.map((step, index) => (
                <div key={index} className="flex items-start space-x-6">
                  <div className="w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
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

      {/* Standards */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-red-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Uygunluk Standartları</h2>
            <p className="text-xl text-gray-600">
              Uluslararası kalite ve güvenlik standartlarına uygun hizmet
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {standards.map((standard, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{standard.name}</h3>
                <p className="text-gray-600 text-sm">{standard.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-800 mb-6">Haşere Mücadelesinin Faydaları</h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Profesyonel haşere mücadelesi ile üretim kalitesini korur, gıda güvenliği 
                standartlarına uygunluk sağlar ve işletmenizin itibarını güçlendiririz.
              </p>
              
              <div className="space-y-3">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="h-6 w-6 text-red-600 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <img 
                src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800" 
                alt="Haşere Mücadelesi" 
                className="rounded-2xl shadow-xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-red-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Haşere Mücadelesi İçin Bizimle İletişime Geçin
          </h2>
          <p className="text-xl text-red-100 mb-8 max-w-2xl mx-auto">
            Tesisınız için özel haşere mücadele programı geliştirmek üzere keşif hizmeti talep edin.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/iletisim" 
              className="bg-white text-red-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium shadow-lg flex items-center justify-center space-x-2"
            >
              <Mail className="h-5 w-5" />
              <span>Keşif Talebi</span>
            </Link>
            <a 
              href="tel:02242338387" 
              className="border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-red-600 transition-colors font-medium flex items-center justify-center space-x-2"
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

export default PestControlPage;