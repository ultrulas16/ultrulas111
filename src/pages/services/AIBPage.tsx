import React from 'react';
import { Link } from 'react-router-dom';
import { Award, CheckCircle, Shield, FileText, Users, Building, ArrowLeft, Phone, Mail, Target, Star } from 'lucide-react';

const AIBPage = () => {
  const aibCategories = [
    {
      icon: Shield,
      title: "Operasyonel Yöntemler",
      description: "AIB standardına uygun operasyonel zararlı mücadele yöntemleri",
      features: [
        "Entegre zararlı yönetimi (IPM)",
        "Risk değerlendirme sistemleri",
        "Monitoring ve kayıt tutma",
        "Düzeltici eylem prosedürleri"
      ]
    },
    {
      icon: Building,
      title: "Yapısal Gereksinimler",
      description: "Tesislerin AIB yapısal standartlarına uygunluğu",
      features: [
        "Bina tasarımı ve yapısı",
        "Giriş noktalarının kontrolü",
        "Havalandırma sistemleri",
        "Drenaj ve su yönetimi"
      ]
    },
    {
      icon: FileText,
      title: "Dokümantasyon",
      description: "AIB audit gereksinimlerine uygun dokümantasyon sistemi",
      features: [
        "Zararlı mücadele politikaları",
        "Prosedür dokümanları",
        "Eğitim kayıtları",
        "Audit raporları"
      ]
    },
    {
      icon: Users,
      title: "Personel Yetkinliği",
      description: "AIB gereksinimlerine uygun personel eğitimi ve yetkinlik",
      features: [
        "Zararlı mücadele eğitimleri",
        "Yetkinlik değerlendirmesi",
        "Sürekli eğitim programları",
        "Sertifikasyon takibi"
      ]
    }
  ];

  const aibStandards = [
    {
      category: "Kategori 1",
      title: "Operasyonel Yöntemler",
      score: "Maksimum 200 Puan",
      description: "Zararlı mücadele operasyonlarının etkinliği ve uygunluğu",
      requirements: [
        "IPM programının uygulanması",
        "Risk değerlendirme ve haritalama",
        "Monitoring sistemlerinin kurulması",
        "Düzeltici eylem planlarının uygulanması"
      ]
    },
    {
      category: "Kategori 2", 
      title: "Bakım için Tasarım",
      score: "Maksimum 200 Puan",
      description: "Tesisin zararlı mücadele açısından tasarım uygunluğu",
      requirements: [
        "Yapısal tasarım değerlendirmesi",
        "Giriş noktalarının kontrolü",
        "Temizlik ve sanitasyon kolaylığı",
        "Malzeme ve ekipman uygunluğu"
      ]
    },
    {
      category: "Kategori 3",
      title: "Temizlik Uygulamaları", 
      score: "Maksimum 200 Puan",
      description: "Temizlik ve sanitasyon uygulamalarının etkinliği",
      requirements: [
        "Temizlik prosedürlerinin uygulanması",
        "Sanitasyon programlarının etkinliği",
        "Kimyasal kullanım kontrolü",
        "Atık yönetimi sistemleri"
      ]
    },
    {
      category: "Kategori 4",
      title: "Entegre Zararlı Yönetimi",
      score: "Maksimum 200 Puan", 
      description: "Kapsamlı zararlı mücadele programının uygulanması",
      requirements: [
        "IPM programının geliştirilmesi",
        "Zararlı monitoring sistemleri",
        "Kontrol yöntemlerinin uygulanması",
        "Program etkinliğinin değerlendirilmesi"
      ]
    }
  ];

  const scoringSystem = [
    {
      score: "Superior (90-100)",
      level: "Mükemmel",
      description: "Tüm gereksinimleri aşan performans",
      color: "bg-green-500"
    },
    {
      score: "Excellent (80-89)",
      level: "Çok İyi", 
      description: "Gereksinimleri tam olarak karşılayan performans",
      color: "bg-blue-500"
    },
    {
      score: "Good (70-79)",
      level: "İyi",
      description: "Gereksinimleri büyük ölçüde karşılayan performans", 
      color: "bg-yellow-500"
    },
    {
      score: "Needs Improvement (<70)",
      level: "Geliştirilmeli",
      description: "Gereksinimleri kısmen karşılayan performans",
      color: "bg-red-500"
    }
  ];

  const auditProcess = [
    {
      step: 1,
      title: "Ön Değerlendirme",
      description: "Mevcut durumun AIB standartlarına göre değerlendirilmesi ve gap analizi"
    },
    {
      step: 2,
      title: "Sistem Geliştirme", 
      description: "AIB gereksinimlerine uygun zararlı mücadele sisteminin geliştirilmesi"
    },
    {
      step: 3,
      title: "Uygulama ve Eğitim",
      description: "Sistemin uygulanması ve personel eğitimlerinin verilmesi"
    },
    {
      step: 4,
      title: "İç Audit",
      description: "AIB kriterlerine göre iç audit yapılması ve iyileştirmeler"
    },
    {
      step: 5,
      title: "AIB Audit Desteği",
      description: "AIB audit sırasında teknik destek ve danışmanlık hizmeti"
    }
  ];

  const benefits = [
    "AIB sertifikasyonu için gerekli zararlı mücadele sistemi",
    "Gıda güvenliği standartlarında yüksek performans",
    "Müşteri güveninin artırılması",
    "Uluslararası kabul görmüş sertifikasyon",
    "Risk yönetimi ve önleme sistemleri",
    "Sürekli iyileştirme kültürü",
    "Operasyonel verimlilik artışı",
    "Rekabet avantajı sağlama"
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
            <span className="text-gray-600">AIB Zararlı Mücadelesi</span>
          </div>
        </div>
      </section>

      {/* Page Header */}
      <section className="bg-gradient-to-br from-green-50 to-green-100 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center mb-6">
              <Star className="h-12 w-12 text-green-600 mr-4" />
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
                AIB Zararlı Mücadelesi
              </h1>
            </div>
            <p className="text-xl text-gray-600 leading-relaxed">
              AIB (American Institute of Baking) standardına uygun zararlı mücadele sistemleri. 
              Gıda güvenliği ve kalite yönetimi için uluslararası standartlarda hizmet.
            </p>
          </div>
        </div>
      </section>

      {/* AIB Categories */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">AIB Zararlı Mücadele Kategorileri</h2>
            <p className="text-xl text-gray-600">
              AIB standardının zararlı mücadele ile ilgili temel kategorileri
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {aibCategories.map((category, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-xl p-8 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                    <category.icon className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">{category.title}</h3>
                </div>
                <p className="text-gray-600 mb-6">{category.description}</p>
                <ul className="space-y-2">
                  {category.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AIB Standards */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-green-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">AIB Standart Kategorileri</h2>
            <p className="text-xl text-gray-600">
              AIB audit sisteminin dört temel kategorisi ve puanlama sistemi
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {aibStandards.map((standard, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">{standard.category}</h3>
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                    {standard.score}
                  </span>
                </div>
                <h4 className="text-xl font-bold text-gray-800 mb-3">{standard.title}</h4>
                <p className="text-gray-600 mb-4">{standard.description}</p>
                <ul className="space-y-2">
                  {standard.requirements.map((req, reqIndex) => (
                    <li key={reqIndex} className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-green-600 rounded-full mr-3"></div>
                      <span className="text-gray-600">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Scoring System */}
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">AIB Puanlama Sistemi</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {scoringSystem.map((score, index) => (
                <div key={index} className="text-center">
                  <div className={`w-16 h-16 ${score.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                    <span className="text-white font-bold text-sm">{score.level}</span>
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">{score.score}</h4>
                  <p className="text-gray-600 text-sm">{score.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Audit Process */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">AIB Audit Hazırlık Süreci</h2>
            <p className="text-xl text-gray-600">
              AIB audit başarısı için sistematik hazırlık sürecimiz
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {auditProcess.map((step, index) => (
                <div key={index} className="flex items-start space-x-6">
                  <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
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
      <section className="py-20 bg-gradient-to-br from-gray-50 to-green-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-800 mb-6">AIB Uyumlu Zararlı Mücadelesinin Faydaları</h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                AIB standardına uygun zararlı mücadele sistemi ile gıda güvenliği alanında 
                uluslararası kabul görmüş sertifikasyon elde edin.
              </p>
              
              <div className="space-y-3">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <img 
                src="https://images.pexels.com/photos/4491461/pexels-photo-4491461.jpeg?auto=compress&cs=tinysrgb&w=800" 
                alt="AIB Zararlı Mücadelesi" 
                className="rounded-2xl shadow-xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            AIB Sertifikasyonu İçin Bizimle İletişime Geçin
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            AIB standardına uygun zararlı mücadele sistemi kurulumu için uzman desteği alın.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/iletisim" 
              className="bg-white text-green-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium shadow-lg flex items-center justify-center space-x-2"
            >
              <Mail className="h-5 w-5" />
              <span>Keşif Talebi</span>
            </Link>
            <a 
              href="tel:02242338387" 
              className="border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-green-600 transition-colors font-medium flex items-center justify-center space-x-2"
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

export default AIBPage;