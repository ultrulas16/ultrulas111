import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Tag, Search, ArrowRight, Eye, MessageCircle, Share2 } from 'lucide-react';

const BlogPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedPost, setExpandedPost] = useState<number | null>(null);

  const categories = [
    { id: 'all', name: 'Tümü' },
    { id: 'prevention', name: 'Önleme' },
    { id: 'treatment', name: 'Mücadele' },
    { id: 'seasonal', name: 'Mevsimsel' },
    { id: 'tips', name: 'İpuçları' },
    { id: 'health', name: 'Sağlık' }
  ];

  const blogPosts = [
    {
      id: 1,
      title: "Evde Karınca Problemi: Doğal ve Etkili Çözümler",
      excerpt: "Karıncalar evlerde en yaygın görülen haşerelerden biridir. Bu yazımızda karınca problemini doğal yöntemlerle nasıl çözebileceğinizi öğreneceksiniz.",
      content: `Karıncalar, özellikle sıcak aylarda evlerde sıkça karşılaştığımız haşerelerdir. Bu sosyal böcekler, gıda arayışında evlerimize girerler ve hızla koloni oluştururlar.

## Karıncalar Neden Evlere Girer?

Karıncalar temelde üç temel ihtiyaç için evlere girerler:
- **Gıda arayışı**: Şeker, protein ve yağ içeren besinler
- **Su kaynağı**: Nemli alanlar ve su sızıntıları
- **Barınak**: Sıcak ve korunaklı alanlar

## Doğal Önleme Yöntemleri

### 1. Temizlik ve Hijyen
- Yemek artıklarını hemen temizleyin
- Mutfak tezgahlarını düzenli olarak silin
- Çöpleri kapalı tutun ve sık boşaltın
- Pet yemeklerini açıkta bırakmayın

### 2. Doğal Kovucular
- **Tarçın**: Karıncaların sevmediği güçlü bir koku
- **Kahve telvesi**: Giriş noktalarına serpin
- **Limon suyu**: Asidik yapısı karıncaları uzaklaştırır
- **Nane**: Taze nane yaprakları etkili bir kovucudur

### 3. Giriş Noktalarını Kapatma
- Pencere ve kapı çevresindeki çatlakları doldurun
- Su boruları çevresindeki boşlukları kapatın
- Elektrik prizleri çevresini kontrol edin

## Ne Zaman Profesyonel Yardım Almalı?

Eğer karınca problemi devam ediyorsa ve doğal yöntemler işe yaramıyorsa, profesyonel yardım almanın zamanı gelmiştir. Özellikle:
- Koloni büyüklüğü artıyorsa
- Yapısal hasara neden oluyorlarsa
- Alerjik reaksiyonlara sebep oluyorlarsa

Profesyonel mücadele, koloninin tamamen ortadan kaldırılması için en etkili yöntemdir.`,
      date: "2024-01-15",
      category: "prevention",
      readTime: "5 dk",
      views: 1250,
      comments: 23,
      tags: ["karınca", "doğal çözümler", "ev temizliği", "önleme"]
    },
    {
      id: 2,
      title: "Sivrisinek Sezonuna Hazırlık: Korunma Yöntemleri",
      excerpt: "Sivrisinek sezonu yaklaşırken, bu kan emici böceklerden korunmanın en etkili yollarını öğrenin. Doğal repellentlerden modern çözümlere kadar.",
      content: `Sivrisinek sezonu her yıl bahar aylarıyla birlikte başlar ve sonbahar sonuna kadar devam eder. Bu dönemde etkili korunma yöntemleri uygulamak, hem konforunuz hem de sağlığınız için önemlidir.

## Sivrisinek Üreme Alanlarını Ortadan Kaldırma

### Su Birikintilerini Giderme
Sivrisinekler yaşam döngülerini tamamlamak için durgun suya ihtiyaç duyarlar:
- Saksı tabakalarını boşaltın
- Çiçek vazolarındaki suyu sık değiştirin
- Yağmur suyu biriken alanları temizleyin
- Çatı oluklarını kontrol edin

### Bahçe Bakımı
- Uzun otları düzenli kesin
- Nemli alanları kurutun
- Kompost yığınlarını kapalı tutun

## Kişisel Korunma Yöntemleri

### Doğal Repellentler
- **Okaliptüs yağı**: Güçlü ve uzun süreli koruma
- **Lavanta**: Hoş koku ve etkili koruma
- **Neem yağı**: Doğal ve güvenli
- **Sarımsak**: İç kullanım ile doğal koruma

### Fiziksel Engeller
- Pencere sineklikleri
- Cibinlik kullanımı
- Açık renk giysiler
- Uzun kollu kıyafetler

## Modern Çözümler

### Elektronik Cihazlar
- UV ışıklı tuzaklar
- Ultrasonik kovucular
- Elektrikli vaporizer'lar

### Profesyonel Uygulamalar
- Bahçe ilaçlaması
- Larvacide uygulamaları
- Periyodik kontrol programları

## Sağlık Riskleri ve Önemi

Sivrisinekler sadece rahatsızlık vermekle kalmaz, aynı zamanda çeşitli hastalıkları da taşıyabilirler:
- West Nile Virüsü
- Zika Virüsü
- Chikungunya
- Dang Humması

Bu nedenle etkili korunma yöntemleri uygulamak hayati önem taşır.`,
      date: "2024-01-10",
      category: "seasonal",
      readTime: "7 dk",
      views: 2100,
      comments: 45,
      tags: ["sivrisinek", "korunma", "repellent", "sağlık"]
    },
    {
      id: 3,
      title: "Hamam Böceği Mücadelesi: Adım Adım Rehber",
      excerpt: "Hamam böcekleri evlerde en zor mücadele edilen haşerelerden biridir. Bu kapsamlı rehberle etkili mücadele yöntemlerini öğrenin.",
      content: `Hamam böcekleri, evlerde en yaygın görülen ve mücadele edilmesi en zor haşerelerden biridir. Hızla çoğalmaları ve dirençli yapıları nedeniyle sistematik bir yaklaşım gerektirir.

## Hamam Böceği Tanıma

### Fiziksel Özellikler
- 12-15 mm uzunluğunda
- Açık kahverengi renkte
- Yassı ve oval vücut yapısı
- Uzun antenler
- Hızlı hareket kabiliyeti

### Yaşam Döngüsü
- Yumurta: 30-40 gün
- Nimf: 6-7 kez gömlek değiştirir
- Erişkin: 6-12 ay yaşar
- Üreme: Dişi 4-8 yumurta kapsülü bırakır

## Etkili Mücadele Stratejileri

### 1. Gel Yem Uygulamaları
En etkili yöntemlerden biri gel yem uygulamasıdır:
- Çatlak ve yarıklara uygulayın
- Su kaynakları yakınına yerleştirin
- Düzenli olarak yenileyin
- Çocuk ve pet güvenliğine dikkat edin

### 2. Sprey İlaçlama
- Gizlenme alanlarına odaklanın
- Düzenli aralıklarla tekrarlayın
- Havalandırma sağlayın
- Koruyucu ekipman kullanın

### 3. Tuzak Sistemleri
- Yapışkan tuzaklar
- Yem tuzakları
- Feromon tuzakları
- Monitoring için kullanın

## Önleyici Tedbirler

### Hijyen ve Temizlik
- Günlük temizlik rutini
- Yemek artıklarını hemen temizleme
- Su sızıntılarını giderme
- Çöp yönetimi

### Yapısal İyileştirmeler
- Çatlak ve yarıkları kapatma
- Su boruları çevresini yalıtma
- Havalandırma iyileştirme
- Nem kontrolü

## Profesyonel Müdahale Ne Zaman Gerekli?

Aşağıdaki durumlarda profesyonel yardım alın:
- Problem 2-3 hafta içinde çözülmüyorsa
- Çok sayıda hamam böceği görüyorsanız
- Yumurta kapsülleri buluyorsanız
- Alerjik reaksiyonlar yaşıyorsanız

Profesyonel mücadele, uzun vadeli ve kalıcı çözüm için en güvenilir yöntemdir.`,
      date: "2024-01-05",
      category: "treatment",
      readTime: "8 dk",
      views: 3200,
      comments: 67,
      tags: ["hamam böceği", "mücadele", "gel yem", "profesyonel"]
    },
    {
      id: 4,
      title: "Kış Aylarında Kemirgen Kontrolü",
      excerpt: "Soğuk havalarda kemirgenler sıcak arayışında evlere sığınırlar. Kış aylarında etkili kemirgen kontrolü için yapmanız gerekenler.",
      content: `Kış ayları, kemirgenler için zor geçen bir dönemdir. Soğuk hava ve azalan gıda kaynakları nedeniyle, fareler ve sıçanlar sıcak barınak arayışında evlere yönelirler.

## Kış Aylarında Kemirgen Aktivitesi

### Neden Artış Gösterir?
- Dış ortamda gıda azlığı
- Soğuk havadan korunma ihtiyacı
- Üreme için uygun ortam arayışı
- Su kaynaklarının donması

### Risk Alanları
- Bodrum katları
- Çatı arasları
- Garaj ve depolar
- Mutfak ve kiler alanları

## Önleyici Tedbirler

### Giriş Noktalarını Kapatma
- Kapı altı boşlukları
- Pencere çerçevesi çatlakları
- Havalandırma delikleri
- Su borusu geçiş noktaları

### Gıda Kaynaklarını Koruma
- Tahılları kapalı kaplarda saklama
- Pet yemlerini güvenli yerlerde tutma
- Meyve ve sebzeleri buzdolabında saklama
- Çöpleri sıkı kapaklı kaplarda tutma

## Etkili Kontrol Yöntemleri

### Mekanik Tuzaklar
- Snap tuzaklar: Hızlı ve etkili
- Canlı tuzaklar: İnsancıl çözüm
- Çoklu tuzaklar: Yoğun infestasyon için
- Elektronik tuzaklar: Modern çözüm

### Yem İstasyonları
- Güvenli ve etkili
- Çocuk ve pet güvenli
- Hava koşullarına dayanıklı
- Düzenli kontrol gerektirir

### Doğal Kovucular
- Nane yağı
- Okaliptüs
- Kedi kokusu
- Ultrasonik cihazlar

## Sağlık Riskleri

Kemirgenler çeşitli hastalıkları taşıyabilir:
- Salmonella
- Hantavirus
- Leptospirosis
- Rat-bite fever

Bu nedenle etkili kontrol hayati önem taşır.

## Profesyonel Çözümler

Kemirgen problemi ciddi boyutlara ulaştığında:
- Kapsamlı inceleme
- Özelleştirilmiş program
- Düzenli monitoring
- Uzun vadeli koruma

Kış aylarında kemirgen kontrolü, proaktif yaklaşım gerektirir. Erken müdahale, büyük problemleri önler.`,
      date: "2023-12-28",
      category: "seasonal",
      readTime: "6 dk",
      views: 1800,
      comments: 34,
      tags: ["kemirgen", "kış", "fare", "önleme"]
    },
    {
      id: 5,
      title: "Ev Temizliğinde Haşere Önleme İpuçları",
      excerpt: "Düzenli temizlik, haşere problemlerini önlemenin en etkili yoludur. Temizlik rutininizi haşere önleme odaklı nasıl düzenleyeceğinizi öğrenin.",
      content: `Ev temizliği, haşere problemlerini önlemenin en temel ve etkili yoludur. Doğru temizlik teknikleri ve düzenli rutinler, haşerelerin yaşam alanınıza girişini büyük ölçüde engelleyebilir.

## Mutfak Temizliği

### Günlük Rutinler
- Yemek sonrası tezgahları temizleme
- Bulaşıkları hemen yıkama
- Ocak ve fırın temizliği
- Çöp kutusunu düzenli boşaltma

### Haftalık Temizlik
- Buzdolabı içi temizliği
- Dolap içlerini silme
- Zemin temizliği ve paspas
- Lavabo ve musluk temizliği

### Aylık Derin Temizlik
- Elektrikli cihazların arkası
- Dolap altları ve arkası
- Çekmece içleri
- Havalandırma ızgaraları

## Banyo Temizliği

### Nem Kontrolü
- Duş sonrası havalandırma
- Su birikintilerini temizleme
- Sızıntıları hemen giderme
- Düzenli havalandırma

### Hijyen Uygulamaları
- Günlük yüzey temizliği
- Haftalık derin temizlik
- Aylık dezenfeksiyon
- Çatlak ve yarık kontrolü

## Yatak Odası ve Oturma Alanları

### Düzenli Bakım
- Haftalık vakumlama
- Yatak çarşaflarını sık değiştirme
- Mobilya altlarını temizleme
- Toz alma işlemleri

### Depolama Alanları
- Gardıropları düzenli kontrol etme
- Kullanılmayan eşyaları temizleme
- Kapalı kutularda saklama
- Düzenli havalandırma

## Özel Temizlik İpuçları

### Doğal Temizlik Ürünleri
- Sirke: Güçlü temizlik ve koku giderme
- Karbonat: Leke çıkarma ve dezenfeksiyon
- Limon: Doğal asit ve ferahlatıcı
- Çay ağacı yağı: Antifungal özellik

### Haşere Kovucu Temizlik
- Nane yağı ekleyerek temizlik
- Lavanta suyu ile yüzey silme
- Okaliptüs yağı ile zemin temizliği
- Tarçın tozu ile dolap temizliği

## Temizlik Programı Oluşturma

### Günlük Görevler (15 dakika)
- Mutfak tezgahı temizliği
- Bulaşık yıkama
- Çöp boşaltma
- Genel düzen

### Haftalık Görevler (2 saat)
- Kapsamlı vakumlama
- Banyo temizliği
- Yatak çarşafı değişimi
- Cam temizliği

### Aylık Görevler (4 saat)
- Derin temizlik
- Dolap düzenleme
- Elektrikli cihaz temizliği
- Haşere kontrol noktaları

## Temizlik Ürünleri Seçimi

### Güvenli Ürünler
- Çevre dostu formüller
- Çocuk ve pet güvenli
- Alerjik reaksiyon riski düşük
- Etkili temizlik gücü

### Saklama Koşulları
- Çocukların ulaşamayacağı yerler
- Kuru ve serin ortam
- Orijinal ambalajında saklama
- Son kullanma tarihine dikkat

Düzenli ve doğru temizlik, haşere problemlerini %80 oranında önleyebilir. Tutarlı olmak, başarının anahtarıdır.`,
      date: "2023-12-20",
      category: "tips",
      readTime: "9 dk",
      views: 2800,
      comments: 52,
      tags: ["temizlik", "önleme", "hijyen", "ev bakımı"]
    },
    {
      id: 6,
      title: "Haşere Isırıkları ve İlk Yardım",
      excerpt: "Haşere ısırıkları ciddi sağlık problemlerine yol açabilir. Farklı haşere ısırıklarını tanıma ve ilk yardım uygulamaları hakkında bilgi edinin.",
      content: `Haşere ısırıkları, hafif rahatsızlıktan ciddi sağlık problemlerine kadar geniş bir yelpazede etki gösterebilir. Doğru tanı ve hızlı müdahale, komplikasyonları önlemek için kritik önem taşır.

## Yaygın Haşere Isırıkları

### Sivrisinek Isırıkları
**Belirtiler:**
- Kırmızı, kaşıntılı şişlik
- Merkezi nokta
- 24-48 saat içinde geçer

**İlk Yardım:**
- Soğuk kompres uygulama
- Kaşımaktan kaçınma
- Antihistaminik krem
- Oral antihistaminik

### Arı ve Eşek Arısı Sokmaları
**Belirtiler:**
- Ani şiddetli ağrı
- Kırmızılık ve şişlik
- İğne kalıntısı (arıda)
- Sistemik reaksiyon riski

**İlk Yardım:**
- İğneyi çıkarma (varsa)
- Soğuk uygulama
- Ağrı kesici
- Alerjik reaksiyon takibi

### Kene Isırıkları
**Belirtiler:**
- Cilde yapışık kene
- Kırmızı halka oluşumu
- Kaşıntı ve ağrı
- Hastalık bulaşma riski

**İlk Yardım:**
- Keneyi doğru teknikle çıkarma
- Antiseptik uygulama
- Bölgeyi takip etme
- Tıbbi yardım alma

## Ciddi Reaksiyonlar

### Anafilaktik Şok Belirtileri
- Nefes darlığı
- Hızlı nabız
- Yaygın kızarıklık
- Bilinç kaybı
- Mide bulantısı

**Acil Müdahale:**
- 112'yi arama
- EpiPen kullanımı (varsa)
- Hasta pozisyonu
- Vital bulguları takip

### Enfeksiyon Belirtileri
- Artan kırmızılık
- Sıcaklık artışı
- Irin oluşumu
- Ateş
- Lenf bezi şişmesi

## Haşere Türüne Göre Özel Yaklaşımlar

### Akrep Sokması
- Acil tıbbi müdahale
- Soğuk uygulama
- Hareket kısıtlama
- Antivenom gereksinimi

### Örümcek Isırığı
- Tür tanımlama
- Bölgeyi temizleme
- Soğuk kompres
- Tıbbi değerlendirme

### Pire Isırıkları
- Çoklu küçük kırmızı noktalar
- Yoğun kaşıntı
- Antihistaminik tedavi
- Çevre temizliği

## Önleyici Tedbirler

### Kişisel Koruma
- Repellent kullanımı
- Uygun giyim
- Açık alan dikkat
- Ev çevresi kontrol

### Çevre Düzenlemesi
- Su birikintilerini giderme
- Bahçe bakımı
- Çöp yönetimi
- Haşere kontrolü

## İlk Yardım Çantası

### Temel Malzemeler
- Antiseptik solüsyon
- Steril gazlı bez
- Bant ve flaster
- Soğuk kompres
- Antihistaminik krem
- Ağrı kesici
- Cımbız
- Termometre

### Özel Durumlar
- EpiPen (alerjisi olanlarda)
- Antihistaminik tablet
- Kortikosteroid krem
- Antibiyotik merhem

## Ne Zaman Doktora Başvurulmalı?

**Acil Durumlar:**
- Nefes darlığı
- Yaygın alerjik reaksiyon
- Bilinç değişikliği
- Şiddetli ağrı

**Tıbbi Değerlendirme:**
- Enfeksiyon belirtileri
- Hastalık bulaşma riski
- Kronik semptomlar
- Tekrarlayan reaksiyonlar

Haşere ısırıkları ciddi olabilir, ancak doğru bilgi ve hızlı müdahale ile komplikasyonlar önlenebilir.`,
      date: "2023-12-15",
      category: "health",
      readTime: "10 dk",
      views: 4200,
      comments: 89,
      tags: ["sağlık", "ilk yardım", "ısırık", "acil durum"]
    }
  ];

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredPost = blogPosts[0];
  const recentPosts = blogPosts.slice(1, 4);

  const toggleExpandPost = (postId: number) => {
    setExpandedPost(expandedPost === postId ? null : postId);
  };

  return (
    <div className="pt-8">
      {/* Page Header */}
      <section className="bg-gradient-to-br from-pest-green-50 to-pest-green-100 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            PestMentor Blog
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Zararlı mücadelesi, önleme yöntemleri ve sağlıklı yaşam hakkında 
            uzman görüşleri ve pratik bilgiler.
          </p>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-8 bg-white sticky top-24 z-40 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Blog yazılarında ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pest-green-500 focus:border-pest-green-500"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    selectedCategory === category.id
                      ? 'bg-pest-green-700 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-pest-green-100 hover:text-pest-green-700'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-pest-green-600 to-pest-green-700 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-8 lg:p-12 text-white">
              <div className="flex items-center space-x-4 mb-4">
                <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm font-medium">
                  Öne Çıkan
                </span>
                <span className="text-pest-green-100">{featuredPost.readTime} okuma</span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-4 leading-tight">
                {featuredPost.title}
              </h2>
              <p className="text-pest-green-100 mb-6 text-lg leading-relaxed">
                {featuredPost.excerpt}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">{new Date(featuredPost.date).toLocaleDateString('tr-TR')}</span>
                  </div>
                </div>
                <button 
                  onClick={() => toggleExpandPost(featuredPost.id)}
                  className="bg-white text-pest-green-700 px-6 py-2 rounded-lg hover:bg-gray-100 transition-colors font-medium flex items-center space-x-2"
                >
                  <span>{expandedPost === featuredPost.id ? 'Kısalt' : 'Devamını Oku'}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Expanded Featured Post Content */}
          {expandedPost === featuredPost.id && (
            <div className="mt-8 bg-white rounded-xl shadow-lg p-8">
              <div className="prose prose-lg max-w-none">
                <div dangerouslySetInnerHTML={{ __html: featuredPost.content.replace(/\n/g, '<br/>').replace(/##/g, '<h2>').replace(/<h2>/g, '<h2 class="text-2xl font-bold text-gray-800 mt-6 mb-4">').replace(/<\/h2>/g, '</h2>') }} />
              </div>
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex flex-wrap gap-2">
                  {featuredPost.tags.map((tag, index) => (
                    <span key={index} className="bg-pest-green-100 text-pest-green-700 px-3 py-1 rounded-full text-sm">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-16">
              <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Blog Yazısı Bulunamadı</h3>
              <p className="text-gray-500">Arama kriterlerinizi değiştirmeyi deneyin.</p>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <div className="grid gap-8">
                  {filteredPosts.map((post) => (
                    <article key={post.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                      <div className="p-6">
                        <div className="flex items-center space-x-4 mb-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            post.category === 'prevention' ? 'bg-green-100 text-green-700' :
                            post.category === 'treatment' ? 'bg-red-100 text-red-700' :
                            post.category === 'seasonal' ? 'bg-blue-100 text-blue-700' :
                            post.category === 'tips' ? 'bg-yellow-100 text-yellow-700' :
                            post.category === 'health' ? 'bg-purple-100 text-purple-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {categories.find(cat => cat.id === post.category)?.name}
                          </span>
                          <span className="text-gray-500 text-sm">{post.readTime}</span>
                        </div>
                        
                        <h3 className="text-xl font-bold text-gray-800 mb-3 hover:text-pest-green-700 transition-colors cursor-pointer">
                          {post.title}
                        </h3>
                        
                        <p className="text-gray-600 mb-4 leading-relaxed">
                          {post.excerpt}
                        </p>

                        {/* Expanded Content */}
                        {expandedPost === post.id && (
                          <div className="mb-6 prose prose-sm max-w-none">
                            <div dangerouslySetInnerHTML={{ 
                              __html: post.content
                                .replace(/\n/g, '<br/>')
                                .replace(/##/g, '<h2>')
                                .replace(/<h2>/g, '<h2 class="text-xl font-bold text-gray-800 mt-4 mb-3">')
                                .replace(/<\/h2>/g, '</h2>')
                                .replace(/###/g, '<h3>')
                                .replace(/<h3>/g, '<h3 class="text-lg font-semibold text-gray-800 mt-3 mb-2">')
                                .replace(/<\/h3>/g, '</h3>')
                                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                .replace(/- /g, '• ')
                            }} />
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span>{new Date(post.date).toLocaleDateString('tr-TR')}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Eye className="h-4 w-4" />
                              <span>{post.views}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MessageCircle className="h-4 w-4" />
                              <span>{post.comments}</span>
                            </div>
                          </div>
                        </div>

                        {/* Read More Button */}
                        <div className="flex items-center justify-between">
                          <button
                            onClick={() => toggleExpandPost(post.id)}
                            className="text-pest-green-700 hover:text-pest-green-800 font-medium flex items-center space-x-2 transition-colors"
                          >
                            <span>{expandedPost === post.id ? 'Kısalt' : 'Devamını Oku'}</span>
                            <ArrowRight className="h-4 w-4" />
                          </button>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mt-4">
                          {post.tags.map((tag, index) => (
                            <span key={index} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="space-y-8">
                  {/* Recent Posts */}
                  <div className="bg-white rounded-xl p-6 shadow-lg">
                    <h3 className="text-xl font-bold text-gray-800 mb-6">Son Yazılar</h3>
                    <div className="space-y-4">
                      {recentPosts.map((post) => (
                        <div key={post.id} className="group cursor-pointer" onClick={() => toggleExpandPost(post.id)}>
                          <h4 className="font-medium text-gray-800 group-hover:text-pest-green-700 transition-colors text-sm leading-tight mb-1">
                            {post.title}
                          </h4>
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(post.date).toLocaleDateString('tr-TR')}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Popular Tags */}
                  <div className="bg-white rounded-xl p-6 shadow-lg">
                    <h3 className="text-xl font-bold text-gray-800 mb-6">Popüler Etiketler</h3>
                    <div className="flex flex-wrap gap-2">
                      {Array.from(new Set(blogPosts.flatMap(post => post.tags))).slice(0, 15).map((tag, index) => (
                        <button 
                          key={index}
                          className="bg-gray-100 hover:bg-pest-green-100 text-gray-700 hover:text-pest-green-700 px-3 py-1 rounded-full text-sm transition-colors"
                        >
                          #{tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Newsletter */}
                  <div className="bg-gradient-to-br from-pest-green-600 to-pest-green-700 rounded-xl p-6 text-white">
                    <h3 className="text-xl font-bold mb-4">Blog Güncellemeleri</h3>
                    <p className="text-pest-green-100 mb-4 text-sm">
                      Yeni blog yazılarımızdan haberdar olmak için e-posta adresinizi bırakın.
                    </p>
                    <div className="space-y-3">
                      <input 
                        type="email" 
                        placeholder="E-posta adresiniz"
                        className="w-full px-4 py-2 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
                      />
                      <button className="w-full bg-white text-pest-green-700 py-2 rounded-lg hover:bg-gray-100 transition-colors font-medium">
                        Abone Ol
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-pest-green-700">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Haşere Probleminiz mi Var?
          </h2>
          <p className="text-xl text-pest-green-100 mb-8 max-w-2xl mx-auto">
            Blog yazılarımızda bulamadığınız sorular için uzman ekibimizle iletişime geçin.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/iletisim" 
              className="bg-white text-pest-green-700 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium shadow-lg"
            >
              Uzman Desteği
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

export default BlogPage;