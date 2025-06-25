import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Building, Home, Bug, Droplets, Wind, Bird, Eye, Shield, Users, Award, Clock, CheckCircle, Target, Zap, ArrowRight, Globe, Star, FileText } from 'lucide-react';

const ServicesPage = () => {
  const [activeTab, setActiveTab] = useState('corporate');

  const corporateServices = [
    {
      icon: Bug,
      title: "Zararlı Mücadelesi (IPM)",
      description: "Entegre Zararlı Yönetimi ile sistematik ve sürdürülebilir çözümler sunuyoruz.",
      features: [
        "Entegre zararlı yönetim programları",
        "Risk analizi ve değerlendirme",
        "Sürdürülebilir mücadele stratejileri",
        "Düzenli monitoring ve raporlama",
        "Çevre dostu yaklaşımlar",
        "Uzun vadeli koruma planları"
      ],
      process: [
        "Detaylı risk analizi",
        "IPM stratejisi geliştirme",
        "Sistematik uygulama",
        "Sürekli monitoring ve iyileştirme"
      ],
      link: "/hizmetler/zarli-mucadelesi-ipm"
    },
    {
      icon: Droplets,
      title: "Dezenfeksiyon",
      description: "Virüs, bakteri ve fungus'lara karşı kapsamlı dezenfeksiyon hizmetleri.",
      features: [
        "Mekan dezenfeksiyonu",
        "Hava kondisyonu sistemleri",
        "Su deposu ve tanklar",
        "Araç içi dezenfeksiyon",
        "Özel durum dezenfeksiyonu",
        "Hijyen sertifikasyonu"
      ],
      process: [
        "Hijyen durumu analizi",
        "Uygun dezenfektan seçimi",
        "Profesyonel uygulama",
        "Kalite kontrol ve sertifikasyon"
      ],
      link: "/hizmetler/dezenfeksiyon"
    },
    {
      icon: Wind,
      title: "Fumigasyon",
      description: "Kapalı alan fumigasyonu ile etkili zararlı kontrolü sağlıyoruz.",
      features: [
        "Depo ve ambar fumigasyonu",
        "Konteyner fumigasyonu",
        "Gıda işleme tesisleri",
        "İhracat ürünleri fumigasyonu",
        "Karantina fumigasyonu",
        "Sertifikalı uygulama"
      ],
      process: [
        "Fumigasyon planlaması",
        "Güvenlik önlemleri",
        "Kontrollü uygulama",
        "Havalandırma ve test"
      ],
      link: "/hizmetler/fumigasyon"
    },
    {
      icon: Bird,
      title: "Kuş Kontrolü",
      description: "Zararsız yöntemlerle kuş problemlerine kalıcı çözümler sunuyoruz.",
      features: [
        "Kuş kovucu sistemler",
        "Fiziksel engelleme çözümleri",
        "Ses ve görsel caydırıcılar",
        "Yuva temizliği ve önleme",
        "Çatı ve cephe koruma",
        "Uzun vadeli koruma planları"
      ],
      process: [
        "Kuş aktivite analizi",
        "Uygun yöntem seçimi",
        "Sistematik uygulama",
        "Düzenli bakım ve kontrol"
      ],
      link: "/hizmetler/kus-kontrolu"
    },
    {
      icon: Eye,
      title: "3. Göz Danışmanlık",
      description: "Bağımsız denetim ve danışmanlık hizmetleri ile kalite güvencesi sağlıyoruz.",
      features: [
        "Bağımsız kalite denetimi",
        "Mevzuat uygunluk kontrolü",
        "Risk değerlendirme raporları",
        "İyileştirme önerileri",
        "Eğitim ve bilinçlendirme",
        "Sürekli iyileştirme planları"
      ],
      process: [
        "Mevcut durum analizi",
        "Detaylı denetim",
        "Rapor hazırlama",
        "İyileştirme planı sunumu"
      ],
      link: "/hizmetler/ucuncu-goz-danismanlik"
    },
    {
      icon: Shield,
      title: "Haşere Mücadelesi",
      description: "Endüstriyel tesislerde kapsamlı haşere kontrolü ve önleme hizmetleri.",
      features: [
        "Fabrika ve üretim tesisleri",
        "Gıda işleme tesisleri",
        "Depo ve lojistik merkezleri",
        "Hastane ve sağlık kuruluşları",
        "Otel ve turizm tesisleri",
        "Eğitim kurumları"
      ],
      process: [
        "Tesis analizi",
        "Özelleştirilmiş program",
        "Düzenli uygulama",
        "Performans takibi"
      ],
      link: "/hizmetler/hasere-mucadelesi"
    }
  ];

  const standardsServices = [
    {
      icon: Award,
      title: "BRC Zararlı Mücadelesi",
      description: "BRC (British Retail Consortium) standardına uygun zararlı mücadele sistemleri.",
      features: [
        "BRC audit gereksinimlerine uygunluk",
        "Risk değerlendirme ve haritalama",
        "Dokümantasyon sistemi",
        "Monitoring ve kayıt tutma",
        "Düzeltici eylem prosedürleri",
        "Audit hazırlık desteği"
      ],
      process: [
        "Gap analizi",
        "Sistem kurulumu",
        "Uygulama ve test",
        "Audit desteği"
      ],
      link: "/hizmetler/brc-zarli-mucadelesi"
    },
    {
      icon: Star,
      title: "AIB Zararlı Mücadelesi",
      description: "AIB (American Institute of Baking) standardına uygun zararlı mücadele.",
      features: [
        "AIB kategorilerine uygun sistem",
        "Operasyonel yöntemler",
        "Yapısal gereksinimler",
        "Temizlik uygulamaları",
        "Entegre zararlı yönetimi",
        "Puanlama sistemi optimizasyonu"
      ],
      process: [
        "Ön değerlendirme",
        "Sistem geliştirme",
        "Uygulama ve eğitim",
        "AIB audit desteği"
      ],
      link: "/hizmetler/aib-zarli-mucadelesi"
    },
    {
      icon: Shield,
      title: "HACCP Zararlı Mücadelesi",
      description: "HACCP sistemine entegre zararlı mücadele ve kritik kontrol noktaları.",
      features: [
        "HACCP'nin 7 ilkesi uygulaması",
        "Tehlike analizi",
        "Kritik kontrol noktaları (CCP)",
        "Monitoring sistemi",
        "Düzeltici eylemler",
        "Doğrulama ve kayıt tutma"
      ],
      process: [
        "HACCP ekibi oluşturma",
        "Tehlike analizi",
        "CCP belirleme",
        "Sistem uygulama"
      ],
      link: "/hizmetler/haccp-zarli-mucadelesi"
    },
    {
      icon: Globe,
      title: "ISO 22000 Zararlı Mücadelesi",
      description: "ISO 22000 Gıda Güvenliği Yönetim Sistemi standardına uygun zararlı mücadele.",
      features: [
        "Gıda güvenliği yönetim sistemi",
        "Risk değerlendirme sistemleri",
        "Operasyonel ön koşul programları",
        "Süreç yönetimi",
        "Performans değerlendirmesi",
        "Sürekli iyileştirme"
      ],
      process: [
        "Gap analizi",
        "Sistem tasarımı",
        "Dokümantasyon",
        "Sertifikasyon audit"
      ],
      link: "/hizmetler/iso22000-zarli-mucadelesi"
    }
  ];

  const residentialServices = [
    {
      icon: Bug,
      title: "Hamam Böceği Mücadelesi",
      description: "Evlerde hamam böceği problemine etkili ve güvenli çözümler.",
      features: [
        "Gel yem uygulamaları",
        "Sprey ilaçlama",
        "Yuva tespiti ve imhası",
        "Giriş noktalarının kapatılması",
        "Uzun vadeli koruma",
        "Güvenli ürün kullanımı"
      ]
    },
    {
      icon: Target,
      title: "Karınca Kontrolü",
      description: "Karınca kolonilerinin tamamen ortadan kaldırılması.",
      features: [
        "Koloni takibi ve imhası",
        "Yem istasyonu uygulaması",
        "Doğal giriş noktalarının kapatılması",
        "Bahçe ve dış alan uygulaması",
        "Mevsimsel koruma",
        "Çevre dostu yöntemler"
      ]
    },
    {
      icon: Zap,
      title: "Kene Mücadelesi",
      description: "Kene ve diğer kan emici parazitlere karşı koruma.",
      features: [
        "Bahçe ve yeşil alan ilaçlaması",
        "Pet alanları özel uygulaması",
        "Ev içi kene kontrolü",
        "Önleyici tedbirler",
        "Mevsimsel koruma programı",
        "Güvenli ürün seçimi"
      ]
    },
    {
      icon: Home,
      title: "Tahta Kurusu Mücadelesi",
      description: "Yatak ve mobilyalarda tahta kurusu probleminin çözümü.",
      features: [
        "Buhar uygulaması",
        "Özel ilaçlama teknikleri",
        "Yatak ve mobilya uygulaması",
        "Gizli yuva tespiti",
        "Takip ve kontrol",
        "Hijyen önerileri"
      ]
    },
    {
      icon: Bug,
      title: "Sivrisinek Kontrolü",
      description: "Sivrisinek üreme alanlarının kontrolü ve korunma.",
      features: [
        "Larvacide uygulamaları",
        "Üreme alanı tespiti",
        "Bahçe ve balkon uygulaması",
        "Su birikintileri kontrolü",
        "Doğal kovucu yöntemler",
        "Mevsimsel koruma"
      ]
    },
    {
      icon: Target,
      title: "Karasinek Mücadelesi",
      description: "Karasinek problemine hızlı ve etkili müdahale.",
      features: [
        "Üreme alanı kontrolü",
        "Yem tuzak uygulamaları",
        "Mutfak ve yemek alanları",
        "Çöp alanları özel uygulaması",
        "Hijyen önerileri",
        "Sürekli koruma"
      ]
    },
    {
      icon: Bug,
      title: "Bit ve Pire Mücadelesi",
      description: "Evcil hayvan alanlarında bit ve pire kontrolü.",
      features: [
        "Pet alanları özel uygulaması",
        "Halı ve kumaş uygulaması",
        "Yaşam alanı dezenfeksiyonu",
        "Evcil hayvan güvenli ürünler",
        "Düzenli takip",
        "Hijyen danışmanlığı"
      ]
    },
    {
      icon: Target,
      title: "Örümcek Kontrolü",
      description: "Zararlı örümcek türlerine karşı güvenli mücadele.",
      features: [
        "Tür tespiti ve analizi",
        "Güvenli ilaçlama yöntemleri",
        "Ağ ve yuva temizliği",
        "Giriş noktalarının kapatılması",
        "Bahçe ve dış alan kontrolü",
        "Önleyici tedbirler"
      ]
    },
    {
      icon: Shield,
      title: "Sürüngen Mücadelesi",
      description: "Yılan ve diğer sürüngenlere karşı güvenli uzaklaştırma.",
      features: [
        "Güvenli yakalama ve uzaklaştırma",
        "Giriş noktalarının kapatılması",
        "Bahçe düzenlemesi önerileri",
        "Kovucu yöntemler",
        "Acil müdahale hizmeti",
        "Önleyici danışmanlık"
      ]
    }
  ];

  const whyChooseUs = [
    {
      icon: Award,
      title: "15+ Yıl Tecrübe",
      description: "Sektörde uzun yılların getirdiği deneyim ve uzmanlık"
    },
    {
      icon: Users,
      title: "Uzman Ekip",
      description: "Lisanslı ve sürekli eğitim alan profesyonel personel"
    },
    {
      icon: Shield,
      title: "Güvenli Ürünler",
      description: "İnsan ve çevre sağlığına zararsız, onaylı kimyasallar"
    },
    {
      icon: Clock,
      title: "Hızlı Hizmet",
      description: "Acil durumlar için 7/24 ulaşılabilir destek hattı"
    }
  ];

  return (
    <div className="pt-8">
      {/* Page Header */}
      <section className="bg-gradient-to-br from-pest-green-50 to-pest-green-100 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Hizmetlerimiz
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            PestMentor olarak, kurumsal ve konut zararlı mücadelesinde ihtiyaç duyabileceğiniz 
            tüm hizmetleri modern teknikler ve çevre dostu yöntemlerle sunuyoruz.
          </p>
        </div>
      </section>

      {/* Service Tabs */}
      <section className="py-8 bg-white sticky top-24 z-40 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex justify-center">
            <div className="bg-gray-100 rounded-lg p-1 flex flex-wrap">
              <button
                onClick={() => setActiveTab('corporate')}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 ${
                  activeTab === 'corporate'
                    ? 'bg-pest-green-700 text-white shadow-lg'
                    : 'text-gray-600 hover:text-pest-green-700'
                }`}
              >
                <Building className="h-5 w-5" />
                <span>Kurumsal Hizmetler</span>
              </button>
              <button
                onClick={() => setActiveTab('standards')}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 ${
                  activeTab === 'standards'
                    ? 'bg-pest-green-700 text-white shadow-lg'
                    : 'text-gray-600 hover:text-pest-green-700'
                }`}
              >
                <FileText className="h-5 w-5" />
                <span>Standart Uygunluk</span>
              </button>
              <button
                onClick={() => setActiveTab('residential')}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 ${
                  activeTab === 'residential'
                    ? 'bg-pest-green-700 text-white shadow-lg'
                    : 'text-gray-600 hover:text-pest-green-700'
                }`}
              >
                <Home className="h-5 w-5" />
                <span>Konut Hizmetleri</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Corporate Services */}
      {activeTab === 'corporate' && (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Kurumsal Hizmetler</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                İş yerleriniz için profesyonel zararlı mücadele ve hijyen çözümleri
              </p>
            </div>

            <div className="grid gap-16">
              {corporateServices.map((service, index) => (
                <div key={index} className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}>
                  <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                    <div className="flex items-center mb-6">
                      <div className="w-16 h-16 bg-pest-green-100 rounded-lg flex items-center justify-center mr-4">
                        <service.icon className="h-8 w-8 text-pest-green-700" />
                      </div>
                      <h3 className="text-3xl font-bold text-gray-800">{service.title}</h3>
                    </div>
                    <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                      {service.description}
                    </p>
                    
                    <div className="grid md:grid-cols-2 gap-8 mb-8">
                      <div>
                        <h4 className="text-xl font-semibold text-gray-800 mb-4">Hizmet Kapsamı</h4>
                        <ul className="space-y-2">
                          {service.features.slice(0, 3).map((feature, featureIndex) => (
                            <li key={featureIndex} className="flex items-start">
                              <CheckCircle className="h-5 w-5 text-pest-green-700 mr-3 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-600">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="text-xl font-semibold text-gray-800 mb-4">Uygulama Süreci</h4>
                        <ol className="space-y-2">
                          {service.process.slice(0, 3).map((step, stepIndex) => (
                            <li key={stepIndex} className="flex items-start">
                              <span className="w-6 h-6 bg-pest-green-700 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5 flex-shrink-0">
                                {stepIndex + 1}
                              </span>
                              <span className="text-gray-600">{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    </div>

                    <Link 
                      to={service.link}
                      className="inline-flex items-center bg-pest-green-700 text-white px-6 py-3 rounded-lg hover:bg-pest-green-800 transition-colors font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                      <span>Detaylı Bilgi</span>
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </Link>
                  </div>
                  
                  <div className={index % 2 === 1 ? 'lg:col-start-1' : ''}>
                    <img 
                      src={`https://images.pexels.com/photos/${
                        index === 0 ? '4491461' : 
                        index === 1 ? '4492125' : 
                        index === 2 ? '3184291' : 
                        index === 3 ? '4491461' : 
                        index === 4 ? '4492125' : '3184291'
                      }/pexels-photo-${
                        index === 0 ? '4491461' : 
                        index === 1 ? '4492125' : 
                        index === 2 ? '3184291' : 
                        index === 3 ? '4491461' : 
                        index === 4 ? '4492125' : '3184291'
                      }.jpeg?auto=compress&cs=tinysrgb&w=800`}
                      alt={service.title}
                      className="rounded-2xl shadow-xl w-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Standards Services */}
      {activeTab === 'standards' && (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Standart Uygunluk Hizmetleri</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Uluslararası gıda güvenliği standartlarına uygun zararlı mücadele sistemleri
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {standardsServices.map((service, index) => (
                <div 
                  key={index} 
                  className="bg-white border border-gray-200 rounded-xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group"
                >
                  <div className="w-16 h-16 bg-pest-green-100 rounded-lg flex items-center justify-center mb-6 group-hover:bg-pest-green-700 transition-colors">
                    <service.icon className="h-8 w-8 text-pest-green-700 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">{service.title}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>
                  
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-800 mb-3">Hizmet Kapsamı</h4>
                    <ul className="space-y-2">
                      {service.features.slice(0, 4).map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                          <div className="w-2 h-2 bg-pest-green-600 rounded-full mr-3"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link 
                    to={service.link}
                    className="inline-flex items-center text-pest-green-700 hover:text-pest-green-800 font-medium"
                  >
                    <span>Detaylı Bilgi</span>
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Residential Services */}
      {activeTab === 'residential' && (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Konut Hizmetleri</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Eviniz için güvenli ve etkili zararlı mücadele çözümleri
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {residentialServices.map((service, index) => (
                <div 
                  key={index} 
                  className="bg-white border border-gray-200 rounded-xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group"
                >
                  <div className="w-16 h-16 bg-pest-green-100 rounded-lg flex items-center justify-center mb-6 group-hover:bg-pest-green-700 transition-colors">
                    <service.icon className="h-8 w-8 text-pest-green-700 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">{service.title}</h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                        <div className="w-2 h-2 bg-pest-green-600 rounded-full mr-3"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Why Choose Us */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-pest-green-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Neden PestMentor?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Zararlı mücadelesinde güvenilir çözüm ortağınız olmak için sürekli kendimizi geliştiriyoruz.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseUs.map((item, index) => (
              <div key={index} className="text-center bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <item.icon className="h-12 w-12 text-pest-green-700 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-pest-green-700">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Hangi Hizmete İhtiyacınız Var?
          </h2>
          <p className="text-xl text-pest-green-100 mb-8 max-w-2xl mx-auto">
            Size en uygun çözümü sunabilmek için keşif hizmeti ile başlayalım.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/iletisim" 
              className="bg-white text-pest-green-700 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium shadow-lg"
            >
              Keşif Talebi
            </Link>
            <a 
              href="tel:02242338387" 
              className="border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-pest-green-700 transition-colors font-medium"
            >
              Hemen Arayın
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;