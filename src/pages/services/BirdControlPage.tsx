import React from 'react';
import { Link } from 'react-router-dom';
import { Bird, CheckCircle, Shield, Volume2, Eye, Zap, ArrowLeft, Phone, Mail } from 'lucide-react';

const BirdControlPage = () => {
  const methods = [
    {
      icon: Shield,
      title: "Fiziksel Engelleme",
      description: "Kuşların konaklamasını ve yuva yapmasını engelleyen fiziksel çözümler",
      features: [
        "Kuş telleri ve iğneler",
        "Koruyucu ağlar",
        "Elektrikli sistemler",
        "Cam ve yüzey koruyucuları"
      ]
    },
    {
      icon: Volume2,
      title: "Ses Caydırıcılar",
      description: "Kuşları rahatsız eden ses sistemleri ile etkili uzaklaştırma",
      features: [
        "Ultrasonik cihazlar",
        "Yırtıcı kuş sesleri",
        "Alarm sistemleri",
        "Programlanabilir ses cihazları"
      ]
    },
    {
      icon: Eye,
      title: "Görsel Caydırıcılar",
      description: "Kuşları korkutan ve uzaklaştıran görsel sistemler",
      features: [
        "Yansıtıcı bantlar",
        "Sahte yırtıcı kuşlar",
        "Hareketli objeler",
        "Lazer sistemleri"
      ]
    },
    {
      icon: Zap,
      title: "Elektrikli Sistemler",
      description: "Zararsız elektrikli şok ile kuşları uzaklaştıran sistemler",
      features: [
        "Düşük voltaj sistemleri",
        "İnsan ve kuş güvenli",
        "Dayanıklı malzemeler",
        "Uzun ömürlü çözümler"
      ]
    }
  ];

  const birdTypes = [
    {
      name: "Güvercinler",
      problems: ["Dış cephe kirliliği", "Hastalık riski", "Yuva yapma", "Gürültü"],
      solutions: ["Kuş telleri", "Koruyucu ağlar", "Ses caydırıcılar"]
    },
    {
      name: "Martılar",
      problems: ["Çöp karıştırma", "Saldırganlık", "Gürültü", "Hijyen problemi"],
      solutions: ["Elektrikli sistemler", "Görsel caydırıcılar", "Ses sistemleri"]
    },
    {
      name: "Kargalar",
      problems: ["Tarım zararı", "Çöp dağıtma", "Gürültü", "Saldırganlık"],
      solutions: ["Lazer sistemleri", "Ses caydırıcılar", "Yırtıcı kuş sesleri"]
    },
    {
      name: "Serçeler",
      problems: ["Yuva yapma", "Tarım zararı", "Hijyen problemi", "Gürültü"],
      solutions: ["Koruyucu ağlar", "Kuş telleri", "Ultrasonik cihazlar"]
    }
  ];

  const process = [
    {
      step: 1,
      title: "Kuş Aktivite Analizi",
      description: "Kuş türlerinin tespiti, davranış analizi ve problem alanlarının belirlenmesi"
    },
    {
      step: 2,
      title: "Çözüm Planlaması",
      description: "Kuş türüne ve alana özel caydırıcı yöntemlerin seçimi ve planlanması"
    },
    {
      step: 3,
      title: "Sistem Kurulumu",
      description: "Seçilen caydırıcı sistemlerin profesyonel kurulumu ve test edilmesi"
    },
    {
      step: 4,
      title: "İzleme ve Bakım",
      description: "Sistemlerin etkinliğinin izlenmesi ve düzenli bakım hizmetleri"
    }
  ];

  const benefits = [
    "İnsan ve kuş sağlığına zararsız yöntemler",
    "Çevre dostu ve sürdürülebilir çözümler",
    "Uzun vadeli ve kalıcı koruma",
    "Estetik görünümü bozmayan tasarımlar",
    "Minimum bakım gerektiren sistemler",
    "Hava koşullarına dayanıklı malzemeler",
    "Kolay kurulum ve kullanım",
    "Maliyet etkin çözümler"
  ];

  const applications = [
    "Çatı ve saçak alanları",
    "Balkon ve teraslar",
    "Klima ve havalandırma sistemleri",
    "Reklam panoları ve tabelalar",
    "Köprü ve alt geçitler",
    "Fabrika ve depo çatıları",
    "Hastane ve okul binaları",
    "Tarihi yapılar ve anıtlar"
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
            <span className="text-gray-600">Kuş Kontrolü</span>
          </div>
        </div>
      </section>

      {/* Page Header */}
      <section className="bg-gradient-to-br from-sky-50 to-sky-100 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center mb-6">
              <Bird className="h-12 w-12 text-sky-600 mr-4" />
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
                Kuş Kontrolü
              </h1>
            </div>
            <p className="text-xl text-gray-600 leading-relaxed">
              Zararsız ve etkili yöntemlerle kuş problemlerine kalıcı çözümler. 
              İnsan ve kuş sağlığını koruyarak, çevre dostu sistemlerle uzaklaştırma hizmetleri sunuyoruz.
            </p>
          </div>
        </div>
      </section>

      {/* Methods */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Kuş Kontrolü Yöntemlerimiz</h2>
            <p className="text-xl text-gray-600">
              Zararsız ve etkili kuş uzaklaştırma sistemleri
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {methods.map((method, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-xl p-8 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center mr-4">
                    <method.icon className="h-6 w-6 text-sky-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">{method.title}</h3>
                </div>
                <p className="text-gray-600 mb-6">{method.description}</p>
                <ul className="space-y-2">
                  {method.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-sky-600 mr-3" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bird Types */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-sky-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Kuş Türleri ve Çözümler</h2>
            <p className="text-xl text-gray-600">
              Farklı kuş türleri için özelleştirilmiş kontrol yöntemleri
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {birdTypes.map((bird, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">{bird.name}</h3>
                
                <div className="mb-4">
                  <h4 className="font-medium text-gray-700 mb-2">Problemler:</h4>
                  <ul className="space-y-1">
                    {bird.problems.map((problem, problemIndex) => (
                      <li key={problemIndex} className="text-sm text-red-600">• {problem}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Çözümler:</h4>
                  <ul className="space-y-1">
                    {bird.solutions.map((solution, solutionIndex) => (
                      <li key={solutionIndex} className="flex items-center text-sm">
                        <CheckCircle className="h-3 w-3 text-sky-600 mr-2" />
                        <span className="text-gray-600">{solution}</span>
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
              Etkili kuş kontrolü için sistematik yaklaşımımız
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {process.map((step, index) => (
                <div key={index} className="flex items-start space-x-6">
                  <div className="w-12 h-12 bg-sky-600 text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
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

      {/* Benefits & Applications */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-sky-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Neden Bizim Kuş Kontrolü?</h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Kuş kontrolünde zararsız ve etkili yöntemler kullanarak, hem kuşları hem de 
                insanları koruyoruz. Çevre dostu çözümlerimizle uzun vadeli koruma sağlıyoruz.
              </p>
              
              <div className="space-y-3">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="h-6 w-6 text-sky-600 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Uygulama Alanları</h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Farklı yapı türlerinde kuş problemlerine özel çözümler sunuyoruz.
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                {applications.map((application, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Bird className="h-5 w-5 text-sky-600 flex-shrink-0" />
                    <span className="text-gray-700">{application}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-sky-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Kuş Kontrolü İçin Bizimle İletişime Geçin
          </h2>
          <p className="text-xl text-sky-100 mb-8 max-w-2xl mx-auto">
            Kuş problemleriniz için etkili ve zararsız çözümler sunmak üzere keşif hizmeti talep edin.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/iletisim" 
              className="bg-white text-sky-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium shadow-lg flex items-center justify-center space-x-2"
            >
              <Mail className="h-5 w-5" />
              <span>Keşif Talebi</span>
            </Link>
            <a 
              href="tel:02242338387" 
              className="border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-sky-600 transition-colors font-medium flex items-center justify-center space-x-2"
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

export default BirdControlPage;