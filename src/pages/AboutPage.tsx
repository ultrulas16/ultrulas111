import React from 'react';
import { Link } from 'react-router-dom';
import { Award, Clock, Users, Wrench, Shield, CheckCircle, Target, Eye, Heart } from 'lucide-react';

const AboutPage = () => {
  const stats = [
    { number: "30+", label: "Yıl Tecrübe", icon: Clock },
    { number: "1230+", label: "Mutlu Müşteri", icon: Users },
    { number: "15+", label: "Uzman Personel", icon: Wrench },
    { number: "7/24", label: "Destek Hattı", icon: Award }
  ];

  const values = [
    {
      icon: Shield,
      title: "Güvenlik",
      description: "İnsan ve çevre sağlığını koruyarak, güvenli yöntemlerle hizmet veriyoruz."
    },
    {
      icon: CheckCircle,
      title: "Kalite",
      description: "En yüksek kalite standartlarında, etkili ve uzun vadeli çözümler sunuyoruz."
    },
    {
      icon: Users,
      title: "Müşteri Memnuniyeti",
      description: "Müşterilerimizin memnuniyeti bizim en büyük önceliğimizdir."
    },
    {
      icon: Target,
      title: "Profesyonellik",
      description: "Uzman ekibimizle profesyonel yaklaşım ve sistematik çözümler sağlıyoruz."
    }
  ];

  const timeline = [
    {
      year: "1991",
      title: "Kuruluş",
      description: "Sistem İlaçlama Sanayi ve Ticaret Limited Şirketi olarak faaliyete başladık."
    },
    {
      year: "2012",
      title: "Büyüme",
      description: "Ekibimizi genişlettik ve hizmet alanımızı Bursa geneline yaydık."
    },
    {
      year: "2016",
      title: "Teknoloji",
      description: "Modern ekipmanlar ve çevre dostu ürünlerle hizmet kalitemizi artırdık."
    },
    {
      year: "2020",
      title: "PestMentor",
      description: "PestMentor markası altında yenilenmiş hizmet anlayışımızla devam ettik."
    },
    {
      year: "2024",
      title: "Bugün",
      description: "Bursa'nın en güvenilir zararlı mücadele uzmanı olarak hizmet veriyoruz."
    }
  ];

  const team = [
    {
      name: "Ahmet Yılmaz",
      role: "Genel Müdür",
      experience: "20+ yıl",
      description: "Sektörde uzun yılların getirdiği deneyimle ekibimizi yönetiyor."
    },
    {
      name: "Mehmet Kaya",
      role: "Teknik Müdür",
      experience: "15+ yıl",
      description: "Teknik operasyonları ve kalite kontrolünü sorumluluğunda yürütüyor."
    },
    {
      name: "Fatma Demir",
      role: "Müşteri İlişkileri",
      experience: "10+ yıl",
      description: "Müşteri memnuniyeti ve iletişim süreçlerini koordine ediyor."
    }
  ];

  return (
    <div className="pt-8">
      {/* Page Header */}
      <section className="bg-gradient-to-br from-emerald-50 to-green-100 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Hakkımızda
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            32 yılı aşkın süredir Bursa ve çevresinde zararlı mücadele hizmetleri sunarak, 
            binlerce müşterimizin güvenini kazandık.
          </p>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-800 mb-6">Hikayemiz</h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                <strong className="text-emerald-600">Sistem İlaçlama Sanayi ve Ticaret Limited Şirketi</strong> 
                olarak 1991 yılında Bursa'da faaliyete başladık. O günden bugüne zararlı mücadele 
                sektöründe edindiğimiz deneyim ve uzmanlıkla müşterilerimize en kaliteli hizmeti sunmaya odaklandık.
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                PestMentor markası altında, modern teknikler ve çevre dostu yöntemler kullanarak 
                müşterilerimize güvenli ve etkili çözümler sunuyoruz. Sürekli gelişen teknoloji ve 
                yöntemleri takip ederek, sektörde öncü olmaya devam ediyoruz.
              </p>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Uzman ekibimiz, düzenli eğitim ve gelişim programları ile kendisini güncel tutuyor. 
                İnsan ve çevre sağlığını koruyarak, müşteri memnuniyetini en üst seviyede tutmayı hedefliyoruz.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
                  <p className="text-gray-600">Modern ve güvenli ilaçlama yöntemleri</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
                  <p className="text-gray-600">Çevre dostu ve insan sağlığına zararsız ürünler</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
                  <p className="text-gray-600">Lisanslı ve deneyimli teknik personel</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
                  <p className="text-gray-600">Sürekli takip ve kontrol hizmetleri</p>
                </div>
              </div>
            </div>
            <div>
              <img 
                src="https://images.pexels.com/photos/4491461/pexels-photo-4491461.jpeg?auto=compress&cs=tinysrgb&w=800" 
                alt="PestMentor Ekibi" 
                className="rounded-2xl shadow-xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-emerald-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <stat.icon className="h-8 w-8 text-emerald-600 mx-auto mb-4" />
                <div className="text-3xl font-bold text-emerald-600 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="bg-emerald-50 rounded-2xl p-8">
              <div className="flex items-center mb-6">
                <Target className="h-8 w-8 text-emerald-600 mr-3" />
                <h3 className="text-2xl font-bold text-gray-800">Misyonumuz</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                İnsan ve çevre sağlığını koruyarak, modern teknikler ve güvenli yöntemlerle 
                zararlı mücadele hizmetleri sunmak. Müşterilerimizin yaşam kalitesini artırmak 
                ve güvenli ortamlar oluşturmak için sürekli gelişim göstermek.
              </p>
            </div>
            
            <div className="bg-blue-50 rounded-2xl p-8">
              <div className="flex items-center mb-6">
                <Eye className="h-8 w-8 text-blue-600 mr-3" />
                <h3 className="text-2xl font-bold text-gray-800">Vizyonumuz</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Bursa ve çevresinde zararlı mücadele sektörünün lider kuruluşu olmak. 
                İnovatif çözümler ve müşteri odaklı hizmet anlayışımızla sektörde 
                standartları belirleyen, güvenilir marka olmak.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-emerald-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Değerlerimiz</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Çalışma prensiplerimizi belirleyen temel değerlerimiz
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <value.icon className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Tarihçemiz</h2>
            <p className="text-xl text-gray-600">Kuruluşumuzdan bugüne kadar olan yolculuğumuz</p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-emerald-200"></div>
            <div className="space-y-12">
              {timeline.map((item, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <div className="bg-white rounded-xl p-6 shadow-lg">
                      <div className="text-2xl font-bold text-emerald-600 mb-2">{item.year}</div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">{item.title}</h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </div>
                  <div className="w-4 h-4 bg-emerald-600 rounded-full border-4 border-white shadow-lg z-10"></div>
                  <div className="w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-emerald-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Ekibimiz</h2>
            <p className="text-xl text-gray-600">Deneyimli ve uzman kadromuzla hizmetinizdeyiz</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="h-12 w-12 text-emerald-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{member.name}</h3>
                <p className="text-emerald-600 font-medium mb-2">{member.role}</p>
                <p className="text-sm text-gray-500 mb-4">{member.experience}</p>
                <p className="text-gray-600">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-emerald-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Bizimle Çalışmaya Hazır mısınız?
          </h2>
          <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
            32 yılı aşkın tecrübemiz ve uzman ekibimizle zararlı probleminizi çözelim.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/iletisim" 
              className="bg-white text-emerald-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium shadow-lg"
            >
              İletişime Geçin
            </Link>
            <a 
              href="tel:02242338387" 
              className="border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-emerald-600 transition-colors font-medium"
            >
              Hemen Arayın
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;