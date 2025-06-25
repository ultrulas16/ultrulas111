import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, Users, Building, CheckCircle, Star, ArrowRight } from 'lucide-react';

const ServiceRegionsPage = () => {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  const cities = [
    {
      id: 'bursa',
      name: 'Bursa',
      region: 'Marmara',
      population: '3.1M',
      districts: ['Osmangazi', 'Nilüfer', 'Yıldırım', 'Mudanya', 'Gemlik', 'İnegöl'],
      isHeadquarters: true,
      description: 'Merkez ofisimizin bulunduğu şehir. 15+ yıldır hizmet veriyoruz.',
      services: ['Tüm Hizmetler', '7/24 Destek', 'Acil Müdahale', 'Uzman Ekip']
    },
    {
      id: 'istanbul',
      name: 'İstanbul',
      region: 'Marmara',
      population: '15.8M',
      districts: ['Avrupa Yakası', 'Anadolu Yakası', 'Beyoğlu', 'Kadıköy', 'Beşiktaş', 'Şişli'],
      isHeadquarters: false,
      description: 'Türkiye\'nin en büyük şehri. Geniş hizmet ağımızla yanınızdayız.',
      services: ['Kurumsal Hizmetler', 'Konut Hizmetleri', 'Acil Müdahale', 'IPM Programları']
    },
    {
      id: 'izmir',
      name: 'İzmir',
      region: 'Ege',
      population: '4.4M',
      districts: ['Konak', 'Bornova', 'Karşıyaka', 'Bayraklı', 'Buca', 'Çiğli'],
      isHeadquarters: false,
      description: 'Ege Bölgesi\'nin incisi. Profesyonel ekibimizle hizmetinizdeyiz.',
      services: ['Endüstriyel Hizmetler', 'Liman Hizmetleri', 'Gıda Tesisleri', 'Fumigasyon']
    },
    {
      id: 'ankara',
      name: 'Ankara',
      region: 'İç Anadolu',
      population: '5.7M',
      districts: ['Çankaya', 'Keçiören', 'Yenimahalle', 'Mamak', 'Sincan', 'Etimesgut'],
      isHeadquarters: false,
      description: 'Başkent Ankara\'da kurumsal hizmetlerde öncüyüz.',
      services: ['Devlet Kurumları', 'Büyük Tesisler', 'Hastaneler', 'Eğitim Kurumları']
    },
    {
      id: 'antalya',
      name: 'Antalya',
      region: 'Akdeniz',
      population: '2.6M',
      districts: ['Muratpaşa', 'Kepez', 'Konyaaltı', 'Aksu', 'Manavgat', 'Alanya'],
      isHeadquarters: false,
      description: 'Turizm başkenti Antalya\'da otel ve turizm tesisleri uzmanlığımız.',
      services: ['Otel Hizmetleri', 'Turizm Tesisleri', 'Restoran Zinciri', 'Sezonluk Hizmet']
    },
    {
      id: 'mersin',
      name: 'Mersin',
      region: 'Akdeniz',
      population: '1.9M',
      districts: ['Akdeniz', 'Yenişehir', 'Toroslar', 'Mezitli', 'Tarsus', 'Erdemli'],
      isHeadquarters: false,
      description: 'Akdeniz\'in liman şehri. Lojistik ve endüstriyel tesislerde uzmanız.',
      services: ['Liman Hizmetleri', 'Lojistik Merkezler', 'Endüstriyel Tesisler', 'Konteyner Fumigasyonu']
    },
    {
      id: 'afyon',
      name: 'Afyon',
      region: 'Ege',
      population: '750K',
      districts: ['Merkez', 'Sandıklı', 'Dinar', 'Bolvadin', 'Çay', 'Dazkırı'],
      isHeadquarters: false,
      description: 'Termal turizm merkezi. Otel ve sağlık tesisleri uzmanlığımız.',
      services: ['Termal Tesisler', 'Sağlık Turizmi', 'Tarım Tesisleri', 'Konut Hizmetleri']
    },
    {
      id: 'kocaeli',
      name: 'Kocaeli',
      region: 'Marmara',
      population: '2.0M',
      districts: ['İzmit', 'Gebze', 'Darıca', 'Körfez', 'Derince', 'Başiskele'],
      isHeadquarters: false,
      description: 'Sanayi şehri Kocaeli. Endüstriyel tesislerde geniş deneyimimiz.',
      services: ['Endüstriyel Tesisler', 'Otomotiv Sektörü', 'Kimya Tesisleri', 'Lojistik Merkezler']
    },
    {
      id: 'yalova',
      name: 'Yalova',
      region: 'Marmara',
      population: '280K',
      districts: ['Merkez', 'Çiftlikköy', 'Çınarcık', 'Altınova', 'Armutlu', 'Termal'],
      isHeadquarters: false,
      description: 'Termal şehir Yalova. Turizm ve konut hizmetlerinde yanınızdayız.',
      services: ['Termal Tesisler', 'Konut Siteleri', 'Turizm Tesisleri', 'Villa Hizmetleri']
    },
    {
      id: 'sakarya',
      name: 'Sakarya',
      region: 'Marmara',
      population: '1.0M',
      districts: ['Adapazarı', 'Serdivan', 'Erenler', 'Akyazı', 'Geyve', 'Hendek'],
      isHeadquarters: false,
      description: 'Yeşil şehir Sakarya. Endüstriyel ve konut hizmetlerinde uzmanız.',
      services: ['Endüstriyel Tesisler', 'Konut Projeleri', 'Tarım Tesisleri', 'Turizm Tesisleri']
    },
    {
      id: 'usak',
      name: 'Uşak',
      region: 'Ege',
      population: '370K',
      districts: ['Merkez', 'Banaz', 'Eşme', 'Karahallı', 'Sivaslı', 'Ulubey'],
      isHeadquarters: false,
      description: 'Tekstil şehri Uşak. Sanayi tesisleri ve konut hizmetlerinde yanınızdayız.',
      services: ['Tekstil Tesisleri', 'Sanayi Tesisleri', 'Konut Hizmetleri', 'Tarım Tesisleri']
    },
    {
      id: 'balikesir',
      name: 'Balıkesir',
      region: 'Marmara',
      population: '1.2M',
      districts: ['Karesi', 'Altıeylül', 'Bandırma', 'Edremit', 'Ayvalık', 'Gönen'],
      isHeadquarters: false,
      description: 'Zeytinyağı merkezi Balıkesir. Gıda ve turizm sektöründe uzmanız.',
      services: ['Gıda Tesisleri', 'Turizm Tesisleri', 'Tarım Tesisleri', 'Liman Hizmetleri']
    },
    {
      id: 'canakkale',
      name: 'Çanakkale',
      region: 'Marmara',
      population: '540K',
      districts: ['Merkez', 'Biga', 'Gelibolu', 'Lapseki', 'Çan', 'Yenice'],
      isHeadquarters: false,
      description: 'Tarihi şehir Çanakkale. Turizm ve tarım sektöründe hizmet veriyoruz.',
      services: ['Turizm Tesisleri', 'Tarım Tesisleri', 'Liman Hizmetleri', 'Konut Hizmetleri']
    }
  ];

  const regions = [
    {
      name: 'Marmara Bölgesi',
      cities: cities.filter(city => city.region === 'Marmara'),
      color: 'bg-pest-green-500'
    },
    {
      name: 'Ege Bölgesi',
      cities: cities.filter(city => city.region === 'Ege'),
      color: 'bg-pest-green-600'
    },
    {
      name: 'Akdeniz Bölgesi',
      cities: cities.filter(city => city.region === 'Akdeniz'),
      color: 'bg-pest-green-700'
    },
    {
      name: 'İç Anadolu Bölgesi',
      cities: cities.filter(city => city.region === 'İç Anadolu'),
      color: 'bg-pest-green-800'
    }
  ];

  const stats = [
    { number: "13", label: "Hizmet Verdiğimiz İl", icon: MapPin },
    { number: "15+", label: "Uzman Personel", icon: Users },
    { number: "1230+", label: "Mutlu Müşteri", icon: Star },
    { number: "7/24", label: "Destek Hattı", icon: Clock }
  ];

  return (
    <div className="pt-8">
      {/* Page Header */}
      <section className="bg-gradient-to-br from-pest-green-50 to-pest-green-100 py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-6">
            <MapPin className="h-12 w-12 text-pest-green-700 mr-4" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
              Hizmet Bölgelerimiz
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Türkiye'nin 13 farklı ilinde profesyonel zararlı mücadele hizmetleri sunuyoruz. 
            Merkez ofisimiz Bursa'da olmakla birlikte, tüm bölgelerde uzman ekibimizle hizmetinizdeyiz.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <stat.icon className="h-8 w-8 text-pest-green-700 mx-auto mb-4" />
                <div className="text-3xl font-bold text-pest-green-700 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Simple City Grid Map */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-pest-green-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Hizmet Verdiğimiz İller</h2>
            <p className="text-xl text-gray-600">
              13 ilde profesyonel zararlı mücadele hizmetleri
            </p>
          </div>

          {/* City Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {cities.map((city) => (
              <div 
                key={city.id}
                className={`bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 ${
                  selectedCity === city.id ? 'ring-4 ring-pest-green-500 ring-opacity-50' : ''
                }`}
                onClick={() => setSelectedCity(selectedCity === city.id ? null : city.id)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded-full mr-3 ${
                      city.isHeadquarters ? 'bg-red-600' : 'bg-pest-green-600'
                    }`}></div>
                    <h3 className="text-xl font-bold text-gray-800">{city.name}</h3>
                  </div>
                  {city.isHeadquarters && (
                    <Star className="h-5 w-5 text-red-600" />
                  )}
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bölge:</span>
                    <span className="font-medium text-gray-800">{city.region}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nüfus:</span>
                    <span className="font-medium text-gray-800">{city.population}</span>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4">{city.description}</p>

                <div className="space-y-2">
                  {city.services.slice(0, 2).map((service, index) => (
                    <div key={index} className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-pest-green-600 mr-2" />
                      <span className="text-gray-600 text-sm">{service}</span>
                    </div>
                  ))}
                </div>

                {city.isHeadquarters && (
                  <div className="mt-4 bg-red-50 rounded-lg p-3">
                    <p className="text-red-700 text-sm font-medium text-center">
                      🏢 Merkez Ofis
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="mt-12 flex flex-wrap justify-center gap-6">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-600 rounded-full"></div>
              <span className="text-gray-700 font-medium">Merkez Ofis (Bursa)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-pest-green-600 rounded-full"></div>
              <span className="text-gray-700 font-medium">Hizmet Bölgeleri</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-gray-600" />
              <span className="text-gray-600">Detaylar için şehir kartına tıklayın</span>
            </div>
          </div>
        </div>
      </section>

      {/* City Details */}
      {selectedCity && (
        <section className="py-12 bg-white border-t-4 border-pest-green-600">
          <div className="container mx-auto px-4">
            {(() => {
              const city = cities.find(c => c.id === selectedCity);
              if (!city) return null;
              
              return (
                <div className="max-w-4xl mx-auto">
                  <div className="grid lg:grid-cols-2 gap-8 items-center">
                    <div>
                      <div className="flex items-center mb-4">
                        <h3 className="text-3xl font-bold text-gray-800 mr-3">{city.name}</h3>
                        {city.isHeadquarters && (
                          <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
                            Merkez Ofis
                          </span>
                        )}
                      </div>
                      <p className="text-lg text-gray-600 mb-6">{city.description}</p>
                      
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-2">Bölge</h4>
                          <p className="text-gray-600">{city.region}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-2">Nüfus</h4>
                          <p className="text-gray-600">{city.population}</p>
                        </div>
                      </div>

                      <div className="mb-6">
                        <h4 className="font-semibold text-gray-800 mb-3">Hizmet Verdiğimiz Alanlar</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {city.services.map((service, index) => (
                            <div key={index} className="flex items-center">
                              <CheckCircle className="h-4 w-4 text-pest-green-600 mr-2" />
                              <span className="text-gray-600 text-sm">{service}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-800 mb-3">Hizmet Verdiğimiz İlçeler</h4>
                      <div className="grid grid-cols-2 gap-2 mb-6">
                        {city.districts.map((district, index) => (
                          <div key={index} className="bg-gray-50 rounded-lg p-3 text-center">
                            <span className="text-gray-700 text-sm">{district}</span>
                          </div>
                        ))}
                      </div>

                      <div className="bg-pest-green-50 rounded-xl p-6">
                        <h4 className="font-semibold text-gray-800 mb-4">İletişim</h4>
                        <div className="space-y-3">
                          <div className="flex items-center">
                            <Phone className="h-5 w-5 text-pest-green-600 mr-3" />
                            <a href="tel:02242338387" className="text-pest-green-600 hover:text-pest-green-700">
                              0224 233 83 87
                            </a>
                          </div>
                          <div className="flex items-center">
                            <Mail className="h-5 w-5 text-pest-green-600 mr-3" />
                            <a href="mailto:info@pestmentor.com.tr" className="text-pest-green-600 hover:text-pest-green-700">
                              info@pestmentor.com.tr
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </section>
      )}

      {/* Regional Services */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Bölgesel Hizmetlerimiz</h2>
            <p className="text-xl text-gray-600">
              Her bölgenin özel ihtiyaçlarına göre özelleştirilmiş hizmetler
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {regions.map((region, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-8">
                <div className="flex items-center mb-6">
                  <div className={`w-4 h-4 ${region.color} rounded-full mr-3`}></div>
                  <h3 className="text-2xl font-bold text-gray-800">{region.name}</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  {region.cities.map((city) => (
                    <div 
                      key={city.id} 
                      className="bg-white rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => setSelectedCity(city.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-800">{city.name}</h4>
                          <p className="text-sm text-gray-600">{city.population}</p>
                        </div>
                        {city.isHeadquarters && (
                          <Star className="h-5 w-5 text-red-600" />
                        )}
                      </div>
                    </div>
                  ))}
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
            Hangi İlde Olursanız Olun, Yanınızdayız
          </h2>
          <p className="text-xl text-pest-green-100 mb-8 max-w-2xl mx-auto">
            13 ilde hizmet veren geniş ağımızla, zararlı mücadele ihtiyaçlarınız için 
            en yakın ekibimizle iletişime geçin.
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
    </div>
  );
};

export default ServiceRegionsPage;