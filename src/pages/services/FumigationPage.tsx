import React from 'react';
import { Link } from 'react-router-dom';
import { Wind, CheckCircle, Shield, Package, Building, Truck, ArrowLeft, Phone, Mail, AlertTriangle } from 'lucide-react';

const FumigationPage = () => {
  const applications = [
    {
      icon: Package,
      title: "Depo ve Ambar Fumigasyonu",
      description: "Tahıl, bakliyat ve diğer gıda ürünlerinin depolandığı alanların fumigasyonu",
      features: [
        "Tahıl zararlıları kontrolü",
        "Depo böcekleri mücadelesi",
        "Ürün kalitesi koruma",
        "Uzun vadeli koruma"
      ]
    },
    {
      icon: Truck,
      title: "Konteyner Fumigasyonu",
      description: "İhracat ve ithalat konteynerleri için karantina fumigasyonu",
      features: [
        "İhracat sertifikasyonu",
        "Karantina gereklilikleri",
        "Uluslararası standartlar",
        "Hızlı işlem süresi"
      ]
    },
    {
      icon: Building,
      title: "Gıda Tesisi Fumigasyonu",
      description: "Gıda üretim ve işleme tesislerinde kapsamlı fumigasyon uygulaması",
      features: [
        "Üretim hattı fumigasyonu",
        "Makine ve ekipman fumigasyonu",
        "HACCP uyumlu prosedürler",
        "Minimal üretim durması"
      ]
    },
    {
      icon: Shield,
      title: "Özel Alan Fumigasyonu",
      description: "Müze, kütüphane ve tarihi eser depolarında özel fumigasyon",
      features: [
        "Hassas materyal koruması",
        "Özel gaz karışımları",
        "Minimum hasar riski",
        "Uzman ekip uygulaması"
      ]
    }
  ];

  const gases = [
    {
      name: "Fosfin (PH3)",
      description: "Tahıl ve gıda ürünleri için en yaygın kullanılan fumigant",
      applications: ["Tahıl depoları", "Gıda fabrikaları", "Konteynerler"],
      advantages: ["Yüksek etkinlik", "Kalıntı bırakmaz", "Ekonomik"]
    },
    {
      name: "Metil Bromür",
      description: "Geniş spektrumlu fumigant, özel uygulamalar için",
      applications: ["Karantina fumigasyonu", "Toprak fumigasyonu", "Yapısal fumigasyon"],
      advantages: ["Hızlı etki", "Geniş spektrum", "Güçlü penetrasyon"]
    },
    {
      name: "Sülfüril Florür",
      description: "Yapısal fumigasyon için çevre dostu alternatif",
      applications: ["Bina fumigasyonu", "Mobilya fumigasyonu", "Termit kontrolü"],
      advantages: ["Çevre dostu", "Ozon tabakasına zararsız", "Etkili"]
    }
  ];

  const process = [
    {
      step: 1,
      title: "Ön İnceleme ve Planlama",
      description: "Alanın detaylı incelenmesi, fumigasyon planının hazırlanması ve güvenlik önlemlerinin belirlenmesi"
    },
    {
      step: 2,
      title: "Hazırlık ve Sızdırmazlık",
      description: "Alanın boşaltılması, sızdırmazlık işlemleri ve güvenlik önlemlerinin alınması"
    },
    {
      step: 3,
      title: "Gaz Uygulaması",
      description: "Hesaplanan dozda fumigant gazın uygulanması ve dağılımının sağlanması"
    },
    {
      step: 4,
      title: "Maruz Kalma Süresi",
      description: "Belirlenen süre boyunca gazın etkili olması için alanın kapalı tutulması"
    },
    {
      step: 5,
      title: "Havalandırma",
      description: "Kontrollü havalandırma ile gazın güvenli şekilde uzaklaştırılması"
    },
    {
      step: 6,
      title: "Test ve Sertifikasyon",
      description: "Gaz kalıntı testleri ve fumigasyon sertifikasının düzenlenmesi"
    }
  ];

  const safety = [
    "Lisanslı ve deneyimli fumigasyon uzmanları",
    "Güvenlik protokollerine tam uyum",
    "Modern gaz tespit ekipmanları",
    "Acil durum müdahale planları",
    "Kişisel koruyucu ekipman kullanımı",
    "Çevre ve insan sağlığı önceliği",
    "Uluslararası güvenlik standartları",
    "Sürekli güvenlik eğitimleri"
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
            <span className="text-gray-600">Fumigasyon</span>
          </div>
        </div>
      </section>

      {/* Page Header */}
      <section className="bg-gradient-to-br from-purple-50 to-purple-100 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center mb-6">
              <Wind className="h-12 w-12 text-purple-600 mr-4" />
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
                Fumigasyon Hizmetleri
              </h1>
            </div>
            <p className="text-xl text-gray-600 leading-relaxed">
              Kapalı alan fumigasyonu ile etkili zararlı kontrolü. Depo, konteyner ve özel alanlar için 
              profesyonel fumigasyon hizmetleri sunuyoruz.
            </p>
          </div>
        </div>
      </section>

      {/* Safety Warning */}
      <section className="py-8 bg-orange-50 border-l-4 border-orange-400">
        <div className="container mx-auto px-4">
          <div className="flex items-start space-x-4">
            <AlertTriangle className="h-6 w-6 text-orange-600 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-orange-800 mb-2">Güvenlik Uyarısı</h3>
              <p className="text-orange-700">
                Fumigasyon işlemleri sadece lisanslı uzmanlar tarafından gerçekleştirilmelidir. 
                Tüm güvenlik protokollerine uyum zorunludur ve işlem sırasında alana giriş kesinlikle yasaktır.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Applications */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Fumigasyon Uygulama Alanları</h2>
            <p className="text-xl text-gray-600">
              Farklı sektörlerde özelleştirilmiş fumigasyon çözümleri
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {applications.map((application, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-xl p-8 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                    <application.icon className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">{application.title}</h3>
                </div>
                <p className="text-gray-600 mb-6">{application.description}</p>
                <ul className="space-y-2">
                  {application.features.map((feature, featureIndex) => (
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

      {/* Fumigant Gases */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Kullandığımız Fumigant Gazlar</h2>
            <p className="text-xl text-gray-600">
              Onaylı ve etkili fumigant gazları ile güvenli uygulamalar
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {gases.map((gas, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">{gas.name}</h3>
                <p className="text-gray-600 mb-6">{gas.description}</p>
                
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-800 mb-3">Uygulama Alanları:</h4>
                  <ul className="space-y-1">
                    {gas.applications.map((app, appIndex) => (
                      <li key={appIndex} className="text-sm text-gray-600">• {app}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Avantajları:</h4>
                  <ul className="space-y-1">
                    {gas.advantages.map((advantage, advIndex) => (
                      <li key={advIndex} className="flex items-center text-sm">
                        <CheckCircle className="h-4 w-4 text-purple-600 mr-2" />
                        <span className="text-gray-600">{advantage}</span>
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
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Fumigasyon Süreci</h2>
            <p className="text-xl text-gray-600">
              Güvenli ve etkili fumigasyon için sistematik yaklaşımımız
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {process.map((step, index) => (
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

      {/* Safety */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-800 mb-6">Güvenlik Önceliğimiz</h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Fumigasyon işlemlerinde güvenlik en önemli önceliğimizdir. Tüm uygulamalarımızda 
                uluslararası güvenlik standartlarına uygun prosedürler izliyoruz.
              </p>
              
              <div className="space-y-3">
                {safety.map((item, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <Shield className="h-6 w-6 text-purple-600 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <img 
                src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800" 
                alt="Fumigasyon Güvenlik" 
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
            Fumigasyon Hizmeti İçin Bizimle İletişime Geçin
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Profesyonel fumigasyon hizmeti için keşif talebi gönderin veya bizi arayın.
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

export default FumigationPage;