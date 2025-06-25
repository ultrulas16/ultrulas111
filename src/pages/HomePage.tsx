import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, CheckCircle, Users, Award, Clock, Wrench, ArrowRight, Star, Phone, Mail, MapPin, Target, Eye, Building, Zap } from 'lucide-react';
import QuoteForm from '../components/QuoteForm';

const HomePage = () => {
  const features = [
    {
      icon: Shield,
      title: "Güvenli Yöntemler",
      description: "İnsan ve çevre sağlığına zararsız ürünler kullanıyoruz"
    },
    {
      icon: CheckCircle,
      title: "Etkili Çözümler",
      description: "Kanıtlanmış yöntemlerle kalıcı sonuçlar elde ediyoruz"
    },
    {
      icon: Users,
      title: "Uzman Ekip",
      description: "Lisanslı ve deneyimli teknik personelimizle hizmet veriyoruz"
    }
  ];

  const stats = [
    { number: "33+", label: "Yıl Tecrübe", icon: Clock },
    { number: "1230+", label: "Mutlu Müşteri", icon: Users },
    { number: "15", label: "Uzman Personel", icon: Wrench },
    { number: "13", label: "Hizmet İli", icon: Award }
  ];

  const services = [
    {
      icon: Shield,
      title: "Böcek Mücadelesi",
      description: "Karınca, hamamböceği, sivrisinek ve diğer böcek türlerine karşı etkili mücadele.",
      features: ["IPM Sistemleri", "Çevre Dostu Ürünler", "Uzun Vadeli Koruma"],
      link: "/hizmetler"
    },
    {
      icon: Target,
      title: "Kemirgen Kontrolü",
      description: "Fare, sıçan ve diğer kemirgen türlerine karşı sistematik mücadele programları.",
      features: ["Yem İstasyonları", "Giriş Noktası Kapatma", "Sürekli Monitoring"],
      link: "/hizmetler"
    },
    {
      icon: Zap,
      title: "Dezenfeksiyon",
      description: "Virüs, bakteri ve fungus'lara karşı kapsamlı dezenfeksiyon hizmetleri.",
      features: ["99.9% Etkinlik", "Güvenli Ürünler", "Hijyen Sertifikası"],
      link: "/hizmetler/dezenfeksiyon"
    },
    {
      icon: Building,
      title: "Kurumsal Hizmetler",
      description: "Fabrika, hastane, otel ve diğer kurumsal tesisler için özel çözümler.",
      features: ["BRC/HACCP Uyumlu", "Düzenli Raporlama", "7/24 Destek"],
      link: "/hizmetler"
    }
  ];

  const testimonials = [
    {
      name: "Ahmet Yılmaz",
      role: "Ev Sahibi",
      content: "PestMentor ekibi evimizde karınca problemi için geldi. Çok profesyonel ve etkili bir hizmet aldık. Artık hiç karınca görmüyoruz.",
      rating: 5,
      location: "Bursa"
    },
    {
      name: "Fatma Kaya",
      role: "Restoran Sahibi",
      content: "Restoranımızda düzenli olarak PestMentor hizmetini alıyoruz. Hijyen standartlarımızı en üst seviyede tutmamıza yardımcı oluyorlar.",
      rating: 5,
      location: "İstanbul"
    },
    {
      name: "Mehmet Demir",
      role: "Fabrika Müdürü",
      content: "Fabrikamızda kemirgen kontrolü için PestMentor ile çalışıyoruz. Sistematik yaklaşımları ve takip hizmetleri mükemmel.",
      rating: 5,
      location: "İzmir"
    }
  ];

  const whyChooseUs = [
    {
      icon: Award,
      title: "33+ Yıl Tecrübe",
      description: "Sektörde üç dekadı aşkın deneyim ve uzmanlık",
      color: "bg-pest-green-100 text-pest-green-700"
    },
    {
      icon: Users,
      title: "15 Uzman Personel",
      description: "Lisanslı ve sürekli eğitim alan profesyonel ekip",
      color: "bg-blue-100 text-blue-700"
    },
    {
      icon: Shield,
      title: "Güvenli Ürünler",
      description: "İnsan ve çevre sağlığına zararsız, onaylı kimyasallar",
      color: "bg-green-100 text-green-700"
    },
    {
      icon: Clock,
      title: "7/24 Hizmet",
      description: "Acil durumlar için kesintisiz destek hattı",
      color: "bg-orange-100 text-orange-700"
    },
    {
      icon: MapPin,
      title: "13 İl Hizmet",
      description: "Türkiye genelinde geniş hizmet ağı",
      color: "bg-purple-100 text-purple-700"
    },
    {
      icon: CheckCircle,
      title: "Garanti Sistemi",
      description: "Hizmet kalitesi garantisi ve takip sistemi",
      color: "bg-indigo-100 text-indigo-700"
    }
  ];

  const serviceAreas = [
    "Bursa", "İstanbul", "İzmir", "Ankara", "Antalya", "Mersin",
    "Afyon", "Kocaeli", "Yalova", "Sakarya", "Uşak", "Balıkesir", "Çanakkale"
  ];

  return (
    <div>
      {/* Hero Section with Quote Form */}
      <section className="bg-gradient-to-br from-pest-green-50 to-pest-green-100 py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-pest-green-600/10 to-transparent"></div>
        <div className="container mx-auto px-4 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center bg-pest-green-700 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Award className="h-4 w-4 mr-2" />
                33+ Yıl Sektör Deneyimi
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-800 mb-6 leading-tight">
                Türkiye'nin 
                <span className="text-pest-green-700 block"> Güvenilir</span> 
                <span className="text-pest-green-700">Zararlı Mücadele</span> Uzmanı
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                1991'den beri evinizi ve iş yerinizi zararlılardan koruyoruz. 33 yılı aşkın tecrübemiz ve 
                15 kişilik uzman ekibimizle Türkiye genelinde güvenli, etkili çözümler sunuyoruz.
              </p>
              <div className="grid grid-cols-3 gap-6 pt-6 border-t border-pest-green-200">
                {features.map((feature, index) => (
                  <div key={index} className="text-center">
                    <feature.icon className="h-8 w-8 text-pest-green-700 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 font-medium">{feature.title}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              {/* Quote Form */}
              <QuoteForm />
              
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-pest-green-100 rounded-full flex items-center justify-center">
                    <Shield className="h-6 w-6 text-pest-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">33+ Yıl Tecrübe</p>
                    <p className="text-sm text-gray-600">Türkiye genelinde</p>
                  </div>
                </div>
              </div>
              <div className="absolute -top-6 -right-6 bg-pest-green-700 text-white p-4 rounded-xl shadow-lg">
                <div className="text-center">
                  <p className="text-2xl font-bold">1230+</p>
                  <p className="text-sm">Mutlu Müşteri</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <stat.icon className="h-8 w-8 text-pest-green-700 mx-auto mb-4" />
                <div className="text-3xl font-bold text-pest-green-700 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-pest-green-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Hizmetlerimiz</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Zararlı mücadelesinde ihtiyaç duyabileceğiniz tüm hizmetleri profesyonel ekibimizle sunuyoruz.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {services.map((service, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
                <div className="w-16 h-16 bg-pest-green-100 rounded-lg flex items-center justify-center mb-6 group-hover:bg-pest-green-700 transition-colors">
                  <service.icon className="h-8 w-8 text-pest-green-700 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">{service.title}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <ul className="space-y-2 mb-4">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-pest-green-600 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link to={service.link} className="text-pest-green-700 hover:text-pest-green-800 font-medium flex items-center">
                  Detayları Gör <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link 
              to="/hizmetler" 
              className="inline-block bg-pest-green-700 text-white px-8 py-3 rounded-lg hover:bg-pest-green-800 transition-colors font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Tüm Hizmetleri Görüntüle
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Neden PestMentor?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              33 yıllık tecrübemiz ve sürekli gelişen teknolojimizle zararlı mücadelesinde güvenilir çözüm ortağınız.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {whyChooseUs.map((item, index) => (
              <div key={index} className="text-center bg-gray-50 rounded-xl p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className={`w-16 h-16 ${item.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <item.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Areas */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-pest-green-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Hizmet Alanlarımız</h2>
            <p className="text-xl text-gray-600">
              Türkiye'nin 13 farklı ilinde profesyonel zararlı mücadele hizmetleri
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
            {serviceAreas.map((area, index) => (
              <div key={index} className="bg-white rounded-lg p-4 text-center shadow-md hover:shadow-lg transition-shadow">
                <MapPin className="h-5 w-5 text-pest-green-600 mx-auto mb-2" />
                <span className="text-gray-700 font-medium">{area}</span>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link 
              to="/hizmet-bolgeleri" 
              className="inline-flex items-center text-pest-green-700 hover:text-pest-green-800 font-medium"
            >
              <span>Tüm Hizmet Bölgelerini Gör</span>
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Müşteri Yorumları</h2>
            <p className="text-xl text-gray-600">Müşterilerimizin memnuniyeti bizim en büyük başarımızdır</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic leading-relaxed">"{testimonial.content}"</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-800">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="h-4 w-4 mr-1" />
                    {testimonial.location}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Service */}
      <section className="py-16 bg-red-600">
        <div className="container mx-auto px-4">
          <div className="text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Acil Durum Hizmeti</h2>
            <p className="text-xl text-red-100 mb-6">
              7/24 acil zararlı mücadele hizmeti için hemen arayın!
            </p>
            <a 
              href="tel:02242338387" 
              className="inline-flex items-center bg-white text-red-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors font-bold text-lg shadow-lg"
            >
              <Phone className="h-6 w-6 mr-2" />
              0224 233 83 87
            </a>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-pest-green-700">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Zararlı Probleminizi Çözelim
          </h2>
          <p className="text-xl text-pest-green-100 mb-8 max-w-2xl mx-auto">
            33 yıllık tecrübemiz ve 15 kişilik uzman ekibimizle zararlı probleminizi kesin çözüme kavuşturalım. 
            Ücretsiz keşif hizmeti ile başlayalım!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/iletisim" 
              className="bg-white text-pest-green-700 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium shadow-lg flex items-center justify-center space-x-2"
            >
              <Mail className="h-5 w-5" />
              <span>Ücretsiz Keşif Talebi</span>
            </Link>
            <a 
              href="tel:02242338387" 
              className="border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-pest-green-700 transition-colors font-medium flex items-center justify-center space-x-2"
            >
              <Phone className="h-5 w-5" />
              <span>0224 233 83 87</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;