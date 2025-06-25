import React from 'react';
import { Link } from 'react-router-dom';
import { Droplets, CheckCircle, Shield, Zap, Users, Award, Clock, ArrowLeft, Phone, Mail } from 'lucide-react';

const DisinfectionPage = () => {
  const services = [
    {
      icon: Shield,
      title: "Mekan Dezenfeksiyonu",
      description: "Ofis, fabrika, mağaza ve diğer kapalı alanların kapsamlı dezenfeksiyonu",
      features: [
        "Yüzey dezenfeksiyonu",
        "Hava dezenfeksiyonu",
        "Mobilya ve ekipman temizliği",
        "Özel alan uygulamaları"
      ]
    },
    {
      icon: Zap,
      title: "Araç Dezenfeksiyonu",
      description: "Otomobil, minibüs, otobüs ve ticari araçların iç mekan dezenfeksiyonu",
      features: [
        "İç mekan yüzey temizliği",
        "Klima sistemi dezenfeksiyonu",
        "Koltuk ve döşeme temizliği",
        "Hızlı ve etkili uygulama"
      ]
    },
    {
      icon: Users,
      title: "Hastane Dezenfeksiyonu",
      description: "Sağlık kuruluşları için özel dezenfeksiyon protokolleri",
      features: [
        "Ameliyathane dezenfeksiyonu",
        "Hasta odaları temizliği",
        "Ortak alan dezenfeksiyonu",
        "Tıbbi standartlara uygunluk"
      ]
    },
    {
      icon: Award,
      title: "Gıda Tesisi Dezenfeksiyonu",
      description: "Gıda üretim ve işleme tesisleri için hijyen çözümleri",
      features: [
        "Üretim hattı dezenfeksiyonu",
        "Depo alanları temizliği",
        "HACCP uyumlu uygulamalar",
        "Gıda güvenliği standartları"
      ]
    }
  ];

  const disinfectants = [
    {
      name: "Virüs Karşıtı Dezenfektanlar",
      description: "COVID-19, grip ve diğer viral enfeksiyonlara karşı etkili",
      effectiveness: "99.9%"
    },
    {
      name: "Bakteri Karşıtı Çözümler",
      description: "Gram pozitif ve negatif bakterilere karşı geniş spektrum",
      effectiveness: "99.99%"
    },
    {
      name: "Fungus Karşıtı Ürünler",
      description: "Küf, maya ve diğer fungal organizmalara karşı",
      effectiveness: "99.9%"
    },
    {
      name: "Spor Karşıtı Dezenfektanlar",
      description: "Dirençli bakteriyel sporlara karşı özel formülasyonlar",
      effectiveness: "99.99%"
    }
  ];

  const process = [
    {
      step: 1,
      title: "Ön Değerlendirme",
      description: "Alanın incelenmesi, risk analizi ve dezenfeksiyon planının hazırlanması"
    },
    {
      step: 2,
      title: "Hazırlık",
      description: "Alanın boşaltılması, hassas ekipmanların korunması ve güvenlik önlemleri"
    },
    {
      step: 3,
      title: "Uygulama",
      description: "Profesyonel ekipmanlarla sistematik dezenfeksiyon uygulaması"
    },
    {
      step: 4,
      title: "Kontrol ve Sertifikasyon",
      description: "Etkinlik kontrolü, test sonuçları ve hijyen sertifikası verilmesi"
    }
  ];

  const benefits = [
    "Virüs, bakteri ve fungus'lara karşı %99.9 etkinlik",
    "İnsan ve çevre sağlığına zararsız ürünler",
    "Hızlı kuruyan, kalıntı bırakmayan formülasyonlar",
    "Uluslararası standartlara uygun sertifikalı ürünler",
    "Uzman ekip tarafından profesyonel uygulama",
    "Uygulama sonrası hijyen sertifikası",
    "7/24 acil dezenfeksiyon hizmeti",
    "Düzenli takip ve kontrol programları"
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
            <span className="text-gray-600">Dezenfeksiyon</span>
          </div>
        </div>
      </section>

      {/* Page Header */}
      <section className="bg-gradient-to-br from-blue-50 to-blue-100 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center mb-6">
              <Droplets className="h-12 w-12 text-blue-600 mr-4" />
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
                Dezenfeksiyon Hizmetleri
              </h1>
            </div>
            <p className="text-xl text-gray-600 leading-relaxed">
              Virüs, bakteri ve fungus'lara karşı kapsamlı dezenfeksiyon hizmetleri. 
              Modern teknikler ve onaylı ürünlerle mekanlarınızı güvenli hale getiriyoruz.
            </p>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Dezenfeksiyon Hizmetlerimiz</h2>
            <p className="text-xl text-gray-600">
              Farklı mekan türleri için özelleştirilmiş dezenfeksiyon çözümleri
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-xl p-8 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <service.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">{service.title}</h3>
                </div>
                <p className="text-gray-600 mb-6">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-blue-600 mr-3" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Disinfectants */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Kullandığımız Dezenfektanlar</h2>
            <p className="text-xl text-gray-600">
              Onaylı ve etkili dezenfektan ürünleri ile güvenli temizlik
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {disinfectants.map((disinfectant, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">{disinfectant.effectiveness}</div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">{disinfectant.name}</h3>
                <p className="text-gray-600 text-sm">{disinfectant.description}</p>
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
              Sistematik ve güvenli dezenfeksiyon sürecimiz
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {process.map((step, index) => (
                <div key={index} className="flex items-start space-x-6">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
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
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-800 mb-6">Neden Bizim Dezenfeksiyon Hizmetimiz?</h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Profesyonel ekibimiz ve onaylı ürünlerimizle, mekanlarınızı virüs, bakteri ve 
                fungus'lardan koruyoruz. Sağlık standartlarına uygun, güvenli ve etkili çözümler sunuyoruz.
              </p>
              
              <div className="space-y-3">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <img 
                src="https://images.pexels.com/photos/4492125/pexels-photo-4492125.jpeg?auto=compress&cs=tinysrgb&w=800" 
                alt="Dezenfeksiyon Hizmeti" 
                className="rounded-2xl shadow-xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Dezenfeksiyon Hizmeti İçin Bizimle İletişime Geçin
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Mekanınızın hijyen ihtiyaçları için profesyonel dezenfeksiyon hizmeti talep edin.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/iletisim" 
              className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium shadow-lg flex items-center justify-center space-x-2"
            >
              <Mail className="h-5 w-5" />
              <span>Keşif Talebi</span>
            </Link>
            <a 
              href="tel:02242338387" 
              className="border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-blue-600 transition-colors font-medium flex items-center justify-center space-x-2"
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

export default DisinfectionPage;