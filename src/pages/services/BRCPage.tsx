import React from 'react';
import { Link } from 'react-router-dom';
import { Award, CheckCircle, Shield, FileText, Users, Building, ArrowLeft, Phone, Mail, Target } from 'lucide-react';

const BRCPage = () => {
  const brcRequirements = [
    {
      icon: Shield,
      title: "Zararlı Mücadele Programı",
      description: "BRC standardına uygun kapsamlı zararlı mücadele ve monitoring sistemi",
      features: [
        "Risk değerlendirme ve haritalama",
        "Yazılı zararlı mücadele prosedürleri",
        "Düzenli monitoring ve kayıt tutma",
        "Eğitimli personel ve yetkinlik kanıtları"
      ]
    },
    {
      icon: FileText,
      title: "Dokümantasyon Sistemi",
      description: "BRC audit gereksinimlerine uygun detaylı dokümantasyon",
      features: [
        "Zararlı mücadele politikası",
        "Risk analizi raporları",
        "Uygulama kayıtları",
        "Düzeltici eylem raporları"
      ]
    },
    {
      icon: Target,
      title: "Monitoring ve Kontrol",
      description: "Sürekli izleme ve performans değerlendirme sistemi",
      features: [
        "Tuzak monitoring sistemi",
        "Trend analizi raporları",
        "KPI takip sistemi",
        "Audit hazırlık desteği"
      ]
    },
    {
      icon: Users,
      title: "Eğitim ve Yetkinlik",
      description: "BRC gereksinimlerine uygun personel eğitimi ve yetkinlik programları",
      features: [
        "Zararlı mücadele eğitimleri",
        "Yetkinlik değerlendirmesi",
        "Sürekli eğitim programları",
        "Sertifikasyon desteği"
      ]
    }
  ];

  const brcClauses = [
    {
      clause: "4.11",
      title: "Zararlı Mücadele",
      description: "Zararlı mücadele programının kurulması ve uygulanması",
      requirements: [
        "Risk değerlendirme yapılması",
        "Yazılı prosedürlerin oluşturulması",
        "Düzenli monitoring yapılması",
        "Kayıtların tutulması"
      ]
    },
    {
      clause: "4.11.1",
      title: "Zararlı Mücadele Programı",
      description: "Kapsamlı zararlı mücadele programının geliştirilmesi",
      requirements: [
        "Tesis risk haritası",
        "Zararlı türleri tanımlaması",
        "Kontrol yöntemleri belirlenmesi",
        "Acil durum prosedürleri"
      ]
    },
    {
      clause: "4.11.2",
      title: "Monitoring Sistemi",
      description: "Etkili monitoring ve kayıt sistemi kurulması",
      requirements: [
        "Tuzak yerleşim planı",
        "Düzenli kontrol programı",
        "Trend analizi yapılması",
        "Düzeltici eylem planları"
      ]
    },
    {
      clause: "4.11.3",
      title: "Yetkinlik ve Eğitim",
      description: "Personel yetkinliği ve eğitim gereksinimleri",
      requirements: [
        "Eğitim programları",
        "Yetkinlik değerlendirmesi",
        "Sürekli gelişim planları",
        "Sertifikasyon takibi"
      ]
    }
  ];

  const auditPreparation = [
    {
      step: 1,
      title: "Ön Değerlendirme",
      description: "Mevcut durumun BRC gereksinimlerine göre değerlendirilmesi ve gap analizi"
    },
    {
      step: 2,
      title: "Sistem Kurulumu",
      description: "BRC uyumlu zararlı mücadele sisteminin kurulması ve dokümantasyonu"
    },
    {
      step: 3,
      title: "Uygulama ve Test",
      description: "Sistemin uygulanması, test edilmesi ve iyileştirilmesi"
    },
    {
      step: 4,
      title: "Audit Hazırlığı",
      description: "BRC audit öncesi final kontroller ve hazırlık çalışmaları"
    },
    {
      step: 5,
      title: "Audit Desteği",
      description: "BRC audit sırasında teknik destek ve danışmanlık hizmeti"
    }
  ];

  const benefits = [
    "BRC sertifikasyonu için gerekli zararlı mücadele sistemi",
    "Uluslararası perakende zincirlerine satış imkanı",
    "Müşteri güveninin artırılması",
    "Risk yönetimi ve önleme sistemleri",
    "Sürekli iyileştirme kültürü",
    "Yasal uygunluk güvencesi",
    "Rekabet avantajı sağlama",
    "Marka değerinin artırılması"
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
            <span className="text-gray-600">BRC Zararlı Mücadelesi</span>
          </div>
        </div>
      </section>

      {/* Page Header */}
      <section className="bg-gradient-to-br from-blue-50 to-blue-100 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center mb-6">
              <Award className="h-12 w-12 text-blue-600 mr-4" />
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
                BRC Zararlı Mücadelesi
              </h1>
            </div>
            <p className="text-xl text-gray-600 leading-relaxed">
              BRC (British Retail Consortium) standardına uygun zararlı mücadele sistemleri. 
              Gıda güvenliği sertifikasyonu için gerekli tüm gereksinimleri karşılıyoruz.
            </p>
          </div>
        </div>
      </section>

      {/* BRC Requirements */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">BRC Zararlı Mücadele Gereksinimleri</h2>
            <p className="text-xl text-gray-600">
              BRC standardının zararlı mücadele gereksinimlerini tam olarak karşılıyoruz
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {brcRequirements.map((requirement, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-xl p-8 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <requirement.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">{requirement.title}</h3>
                </div>
                <p className="text-gray-600 mb-6">{requirement.description}</p>
                <ul className="space-y-2">
                  {requirement.features.map((feature, featureIndex) => (
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

      {/* BRC Clauses */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">BRC Standart Maddeleri</h2>
            <p className="text-xl text-gray-600">
              BRC standardının zararlı mücadele ile ilgili temel maddeleri
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {brcClauses.map((clause, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center mb-4">
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold mr-3">
                    {clause.clause}
                  </span>
                  <h3 className="text-lg font-semibold text-gray-800">{clause.title}</h3>
                </div>
                <p className="text-gray-600 mb-4">{clause.description}</p>
                <ul className="space-y-2">
                  {clause.requirements.map((req, reqIndex) => (
                    <li key={reqIndex} className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                      <span className="text-gray-600">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Audit Preparation Process */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">BRC Audit Hazırlık Süreci</h2>
            <p className="text-xl text-gray-600">
              BRC audit başarısı için sistematik hazırlık sürecimiz
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {auditPreparation.map((step, index) => (
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
              <h2 className="text-4xl font-bold text-gray-800 mb-6">BRC Uyumlu Zararlı Mücadelesinin Faydaları</h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                BRC standardına uygun zararlı mücadele sistemi ile gıda güvenliği sertifikasyonu 
                alarak uluslararası pazarlarda rekabet avantajı elde edin.
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
                src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800" 
                alt="BRC Zararlı Mücadelesi" 
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
            BRC Sertifikasyonu İçin Bizimle İletişime Geçin
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            BRC standardına uygun zararlı mücadele sistemi kurulumu için uzman desteği alın.
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

export default BRCPage;