import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, CheckCircle, AlertTriangle, FileText, Users, Target, ArrowLeft, Phone, Mail, Thermometer, Eye } from 'lucide-react';

const HACCPPage = () => {
  const haccpPrinciples = [
    {
      principle: 1,
      title: "Tehlike Analizi",
      description: "Zararlı mücadele süreçlerinde potansiyel tehlikelerin belirlenmesi",
      details: [
        "Biyolojik tehlikeler (zararlılar)",
        "Kimyasal tehlikeler (ilaçlar)",
        "Fiziksel tehlikeler (kontaminasyon)",
        "Risk değerlendirme matrisi"
      ]
    },
    {
      principle: 2,
      title: "Kritik Kontrol Noktaları (CCP)",
      description: "Zararlı mücadelesi sürecinde kritik kontrol noktalarının belirlenmesi",
      details: [
        "İlaçlama öncesi hazırlık",
        "İlaç uygulama süreci",
        "Uygulama sonrası kontrol",
        "Monitoring noktaları"
      ]
    },
    {
      principle: 3,
      title: "Kritik Limitler",
      description: "Her CCP için kabul edilebilir sınırların belirlenmesi",
      details: [
        "İlaç konsantrasyonları",
        "Uygulama süreleri",
        "Sıcaklık ve nem değerleri",
        "Bekleme süreleri"
      ]
    },
    {
      principle: 4,
      title: "Monitoring Sistemi",
      description: "CCP'lerin sürekli izlenmesi ve kayıt altına alınması",
      details: [
        "Düzenli kontrol programları",
        "Kayıt tutma sistemleri",
        "Trend analizi",
        "Performans göstergeleri"
      ]
    },
    {
      principle: 5,
      title: "Düzeltici Eylemler",
      description: "Kritik limitler aşıldığında alınacak önlemler",
      details: [
        "Acil müdahale prosedürleri",
        "Kök neden analizi",
        "Düzeltici eylem planları",
        "Önleyici tedbirler"
      ]
    },
    {
      principle: 6,
      title: "Doğrulama",
      description: "HACCP sisteminin etkinliğinin doğrulanması",
      details: [
        "Sistem performans değerlendirmesi",
        "Bağımsız doğrulama",
        "Kalibrasyon kontrolleri",
        "Etkinlik testleri"
      ]
    },
    {
      principle: 7,
      title: "Kayıt Tutma",
      description: "Tüm HACCP faaliyetlerinin dokümantasyonu",
      details: [
        "Uygulama kayıtları",
        "Monitoring raporları",
        "Düzeltici eylem kayıtları",
        "Eğitim belgeleri"
      ]
    }
  ];

  const haccpSteps = [
    {
      step: 1,
      title: "HACCP Ekibi Oluşturma",
      description: "Multidisipliner HACCP ekibinin kurulması ve eğitimi"
    },
    {
      step: 2,
      title: "Ürün Tanımı",
      description: "Zararlı mücadele hizmetinin detaylı tanımlanması"
    },
    {
      step: 3,
      title: "Kullanım Amacı",
      description: "Hizmetin kullanım amacı ve hedef kitlesinin belirlenmesi"
    },
    {
      step: 4,
      title: "Akış Şeması",
      description: "Zararlı mücadele sürecinin akış şemasının oluşturulması"
    },
    {
      step: 5,
      title: "Akış Şeması Doğrulama",
      description: "Oluşturulan akış şemasının sahada doğrulanması"
    },
    {
      step: 6,
      title: "7 HACCP İlkesi",
      description: "HACCP'nin 7 temel ilkesinin uygulanması"
    }
  ];

  const ccpExamples = [
    {
      process: "İlaç Hazırlama",
      hazard: "Yanlış konsantrasyon",
      ccp: "İlaç karışım noktası",
      criticalLimit: "Etiket dozajı ±5%",
      monitoring: "Her karışımda ölçüm"
    },
    {
      process: "İlaç Uygulama",
      hazard: "Gıda kontaminasyonu",
      ccp: "Uygulama alanı",
      criticalLimit: "Gıda yokluğu",
      monitoring: "Uygulama öncesi kontrol"
    },
    {
      process: "Uygulama Sonrası",
      hazard: "Kalıntı riski",
      ccp: "Bekleme süresi",
      criticalLimit: "Minimum 24 saat",
      monitoring: "Süre takibi"
    },
    {
      process: "Ekipman Temizliği",
      hazard: "Çapraz kontaminasyon",
      ccp: "Temizlik süreci",
      criticalLimit: "Temizlik protokolü",
      monitoring: "Temizlik sonrası kontrol"
    }
  ];

  const benefits = [
    "HACCP sistemine entegre zararlı mücadele",
    "Gıda güvenliği risklerinin minimize edilmesi",
    "Yasal gereksinimlere tam uygunluk",
    "Sistematik risk yönetimi",
    "Sürekli iyileştirme kültürü",
    "Müşteri güveninin artırılması",
    "Audit başarısı için hazırlık",
    "Uluslararası standartlara uygunluk"
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
            <span className="text-gray-600">HACCP Zararlı Mücadelesi</span>
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
                HACCP Zararlı Mücadelesi
              </h1>
            </div>
            <p className="text-xl text-gray-600 leading-relaxed">
              HACCP (Hazard Analysis Critical Control Points) sistemine entegre zararlı mücadele. 
              Gıda güvenliği için kritik kontrol noktalarında sistematik yaklaşım.
            </p>
          </div>
        </div>
      </section>

      {/* HACCP Principles */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">HACCP'nin 7 İlkesi</h2>
            <p className="text-xl text-gray-600">
              Zararlı mücadelesinde HACCP ilkelerinin uygulanması
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {haccpPrinciples.map((principle, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center font-bold mr-4">
                    {principle.principle}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">{principle.title}</h3>
                </div>
                <p className="text-gray-600 mb-4">{principle.description}</p>
                <ul className="space-y-2">
                  {principle.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 text-red-600 mr-3" />
                      <span className="text-gray-600">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HACCP Implementation Steps */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-red-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">HACCP Uygulama Adımları</h2>
            <p className="text-xl text-gray-600">
              Zararlı mücadelesinde HACCP sisteminin kurulması için gerekli adımlar
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              {haccpSteps.map((step, index) => (
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

      {/* CCP Examples */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Kritik Kontrol Noktaları Örnekleri</h2>
            <p className="text-xl text-gray-600">
              Zararlı mücadelesinde belirlenen CCP örnekleri ve kontrol parametreleri
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-xl shadow-lg overflow-hidden">
              <thead className="bg-red-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">Süreç</th>
                  <th className="px-6 py-4 text-left font-semibold">Tehlike</th>
                  <th className="px-6 py-4 text-left font-semibold">CCP</th>
                  <th className="px-6 py-4 text-left font-semibold">Kritik Limit</th>
                  <th className="px-6 py-4 text-left font-semibold">Monitoring</th>
                </tr>
              </thead>
              <tbody>
                {ccpExamples.map((example, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="px-6 py-4 font-medium text-gray-800">{example.process}</td>
                    <td className="px-6 py-4 text-gray-600">{example.hazard}</td>
                    <td className="px-6 py-4 text-gray-600">{example.ccp}</td>
                    <td className="px-6 py-4 text-gray-600">{example.criticalLimit}</td>
                    <td className="px-6 py-4 text-gray-600">{example.monitoring}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Documentation System */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-red-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">HACCP Dokümantasyon Sistemi</h2>
            <p className="text-xl text-gray-600">
              Zararlı mücadelesi için gerekli HACCP dokümanları
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-lg text-center">
              <FileText className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">HACCP Planı</h3>
              <p className="text-gray-600 text-sm">Zararlı mücadele HACCP planı ve prosedürleri</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg text-center">
              <Eye className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Monitoring Kayıtları</h3>
              <p className="text-gray-600 text-sm">CCP monitoring ve kontrol kayıtları</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg text-center">
              <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Düzeltici Eylemler</h3>
              <p className="text-gray-600 text-sm">Sapma durumlarında alınan önlemler</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg text-center">
              <Users className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Eğitim Kayıtları</h3>
              <p className="text-gray-600 text-sm">Personel eğitimi ve yetkinlik belgeleri</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-800 mb-6">HACCP Uyumlu Zararlı Mücadelesinin Faydaları</h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                HACCP sistemine entegre zararlı mücadele ile gıda güvenliği risklerini minimize ederek, 
                sistematik ve güvenilir bir yaklaşım sağlıyoruz.
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
                src="https://images.pexels.com/photos/4492125/pexels-photo-4492125.jpeg?auto=compress&cs=tinysrgb&w=800" 
                alt="HACCP Zararlı Mücadelesi" 
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
            HACCP Uyumlu Zararlı Mücadelesi İçin Bizimle İletişime Geçin
          </h2>
          <p className="text-xl text-red-100 mb-8 max-w-2xl mx-auto">
            HACCP sistemine entegre zararlı mücadele çözümleri için uzman desteği alın.
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

export default HACCPPage;