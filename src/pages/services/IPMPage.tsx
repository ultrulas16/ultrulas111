import React from 'react';
import { Link } from 'react-router-dom';
import { Bug, CheckCircle, Target, Shield, Users, Award, Clock, ArrowLeft, Phone, Mail } from 'lucide-react';

const IPMPage = () => {
  const benefits = [
    {
      icon: Shield,
      title: "Çevre Dostu",
      description: "Minimum kimyasal kullanımı ile çevre ve insan sağlığını korur"
    },
    {
      icon: Target,
      title: "Hedef Odaklı",
      description: "Sadece zararlı türlere odaklanarak faydalı organizmaları korur"
    },
    {
      icon: Clock,
      title: "Uzun Vadeli",
      description: "Sürdürülebilir çözümler ile kalıcı koruma sağlar"
    },
    {
      icon: Award,
      title: "Maliyet Etkin",
      description: "Uzun vadede daha ekonomik ve verimli sonuçlar sunar"
    }
  ];

  const steps = [
    {
      step: 1,
      title: "İnceleme ve Tanı",
      description: "Zararlı türlerinin tespiti, yaşam döngülerinin analizi ve risk değerlendirmesi yapılır."
    },
    {
      step: 2,
      title: "Strateji Geliştirme",
      description: "Tesise özel IPM stratejisi geliştirilir ve uygulama planı hazırlanır."
    },
    {
      step: 3,
      title: "Önleyici Tedbirler",
      description: "Fiziksel engeller, hijyen iyileştirmeleri ve çevresel düzenlemeler yapılır."
    },
    {
      step: 4,
      title: "Monitoring Sistemi",
      description: "Sürekli izleme sistemleri kurulur ve düzenli kontroller gerçekleştirilir."
    },
    {
      step: 5,
      title: "Müdahale Programı",
      description: "Gerektiğinde hedefli müdahaleler yapılır ve sonuçlar değerlendirilir."
    },
    {
      step: 6,
      title: "Değerlendirme ve İyileştirme",
      description: "Program etkinliği değerlendirilir ve sürekli iyileştirmeler yapılır."
    }
  ];

  const applications = [
    "Gıda üretim tesisleri",
    "İlaç ve kozmetik fabrikaları",
    "Hastane ve sağlık kuruluşları",
    "Otel ve turizm tesisleri",
    "Eğitim kurumları",
    "Ofis ve ticari binalar",
    "Depo ve lojistik merkezleri",
    "Perakende mağazalar"
  ];

  const features = [
    "Detaylı risk analizi ve haritalama",
    "Zararlı türlerine özel stratejiler",
    "Çevre dostu ürün ve yöntemler",
    "Sürekli monitoring ve raporlama",
    "Personel eğitimi ve bilinçlendirme",
    "Mevzuat uygunluk kontrolü",
    "Düzenli performans değerlendirmesi",
    "7/24 teknik destek hizmeti"
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
            <span className="text-gray-600">Zararlı Mücadelesi (IPM)</span>
          </div>
        </div>
      </section>

      {/* Page Header */}
      <section className="bg-gradient-to-br from-pest-green-50 to-pest-green-100 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center mb-6">
              <Bug className="h-12 w-12 text-pest-green-700 mr-4" />
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
                Zararlı Mücadelesi (IPM)
              </h1>
            </div>
            <p className="text-xl text-gray-600 leading-relaxed">
              Entegre Zararlı Yönetimi (IPM) ile çevre dostu, sürdürülebilir ve etkili zararlı kontrolü. 
              Modern bilim ve teknoloji ile desteklenen sistematik yaklaşımımızla uzun vadeli çözümler sunuyoruz.
            </p>
          </div>
        </div>
      </section>

      {/* What is IPM */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-800 mb-6">IPM Nedir?</h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Entegre Zararlı Yönetimi (IPM), zararlı kontrolünde çevre dostu, ekonomik ve sürdürülebilir 
                bir yaklaşımdır. Bu sistem, zararlıların biyolojisi ve ekolojisi hakkındaki bilgileri kullanarak, 
                çoklu kontrol yöntemlerini entegre eder.
              </p>
              <p className="text-gray-600 mb-8 leading-relaxed">
                IPM, sadece zararlıları öldürmek yerine, onların popülasyonunu kabul edilebilir seviyelerde 
                tutmayı hedefler. Bu yaklaşım, çevre ve insan sağlığını korurken, uzun vadeli ve maliyet 
                etkin çözümler sunar.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-pest-green-700 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-800">Bilimsel Yaklaşım</h4>
                    <p className="text-gray-600">Zararlı biyolojisi ve davranışları temelinde stratejiler</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-pest-green-700 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-800">Çoklu Yöntem</h4>
                    <p className="text-gray-600">Fiziksel, biyolojik ve kimyasal yöntemlerin entegrasyonu</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-pest-green-700 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-800">Sürekli İzleme</h4>
                    <p className="text-gray-600">Düzenli monitoring ve değerlendirme sistemleri</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <img 
                src="https://images.pexels.com/photos/4491461/pexels-photo-4491461.jpeg?auto=compress&cs=tinysrgb&w=800" 
                alt="IPM Zararlı Mücadelesi" 
                className="rounded-2xl shadow-xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-pest-green-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">IPM'nin Avantajları</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Entegre Zararlı Yönetimi'nin sağladığı benzersiz faydalar
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <benefit.icon className="h-12 w-12 text-pest-green-700 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* IPM Process */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">IPM Uygulama Süreci</h2>
            <p className="text-xl text-gray-600">
              Sistematik ve bilimsel yaklaşımımızın 6 temel adımı
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {steps.map((step, index) => (
                <div key={index} className="flex items-start space-x-6">
                  <div className="w-12 h-12 bg-pest-green-700 text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
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

      {/* Applications */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-pest-green-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-800 mb-6">Uygulama Alanları</h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                IPM sistemimiz, farklı sektörlerdeki tesislerin özel ihtiyaçlarına göre 
                özelleştirilerek uygulanır. Her sektörün kendine özgü zorluklarına uygun 
                çözümler geliştiririz.
              </p>
              
              <div className="grid md:grid-cols-2 gap-4">
                {applications.map((application, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-pest-green-700 flex-shrink-0" />
                    <span className="text-gray-700">{application}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <img 
                src="https://images.pexels.com/photos/4492125/pexels-photo-4492125.jpeg?auto=compress&cs=tinysrgb&w=800" 
                alt="IPM Uygulama Alanları" 
                className="rounded-2xl shadow-xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Hizmet Özellikleri</h2>
            <p className="text-xl text-gray-600">
              IPM programımızın kapsamlı özellikleri
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-pest-green-700 mt-1 flex-shrink-0" />
                  <span className="text-gray-700 font-medium">{feature}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-pest-green-700">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            IPM Programı İçin Bizimle İletişime Geçin
          </h2>
          <p className="text-xl text-pest-green-100 mb-8 max-w-2xl mx-auto">
            Tesisınız için özel IPM stratejisi geliştirmek üzere keşif hizmeti talep edin.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/iletisim" 
              className="bg-white text-pest-green-700 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium shadow-lg flex items-center justify-center space-x-2"
            >
              <Mail className="h-5 w-5" />
              <span>Keşif Talebi</span>
            </Link>
            <a 
              href="tel:02242338387" 
              className="border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-pest-green-700 transition-colors font-medium flex items-center justify-center space-x-2"
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

export default IPMPage;