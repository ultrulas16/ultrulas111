import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bug, Search, AlertTriangle, Shield, Target, Eye, Zap, ArrowLeft, Phone, Mail, Thermometer, Droplets, Home, Building, Leaf, ArrowRight, Clock } from 'lucide-react';

const PestLibraryPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'Tümü', icon: Bug },
    { id: 'insects', name: 'Böcekler', icon: Bug },
    { id: 'rodents', name: 'Kemirgenler', icon: Target },
    { id: 'flying', name: 'Uçan Böcekler', icon: Eye },
    { id: 'crawling', name: 'Sürünen Böcekler', icon: Shield },
    { id: 'parasites', name: 'Parazitler', icon: Droplets },
    { id: 'arachnids', name: 'Örümcekgiller', icon: Bug }
  ];

  const pests = [
    {
      id: 1,
      name: "Hamam Böceği",
      scientificName: "Blattella germanica",
      category: "crawling",
      dangerLevel: "high",
      description: "Evlerde en yaygın görülen haşere türlerinden biridir. Hızla çoğalır ve hastalık taşıyabilir.",
      characteristics: [
        "12-15 mm uzunluğunda",
        "Açık kahverengi renkte",
        "Hızlı hareket eder",
        "Gece aktiftir",
        "Nemli ortamları sever",
        "Çok hızlı ürer"
      ],
      habitat: [
        "Mutfak dolapları",
        "Banyo alanları",
        "Elektrikli cihazların arkası",
        "Sıcak ve nemli yerler",
        "Çatlak ve yarıklar",
        "Su boruları çevresi"
      ],
      damages: [
        "Gıda kontaminasyonu",
        "Hastalık bulaştırma riski",
        "Alerjik reaksiyonlar",
        "Kötü koku yayma",
        "Hijyen problemleri",
        "Astım tetikleyici"
      ],
      prevention: [
        "Temizlik ve hijyen",
        "Gıdaları kapalı saklama",
        "Su sızıntılarını giderme",
        "Çatlakları kapatma",
        "Düzenli temizlik",
        "Nem kontrolü"
      ],
      treatment: [
        "Gel yem uygulamaları",
        "Sprey ilaçlama",
        "Tuzak sistemleri",
        "Yuva tespiti ve imhası",
        "Profesyonel müdahale",
        "Düzenli takip"
      ],
      season: "Yıl boyu aktif",
      reproduction: "Hızlı üreme - 30-40 gün"
    },
    {
      id: 2,
      name: "Karınca",
      scientificName: "Formicidae",
      category: "crawling",
      dangerLevel: "medium",
      description: "Koloniler halinde yaşayan sosyal böceklerdir. Gıda arayışında evlere girerler.",
      characteristics: [
        "2-15 mm arası boyut",
        "Siyah, kahverengi veya kırmızı",
        "Güçlü çene yapısı",
        "Feromon ile iletişim",
        "Sosyal yaşam",
        "Güçlü koku alma duyusu"
      ],
      habitat: [
        "Bahçe toprakları",
        "Duvar çatlakları",
        "Ağaç kökleri",
        "Mutfak alanları",
        "Nemli yerler",
        "Gıda kaynakları yakını"
      ],
      damages: [
        "Gıda kontaminasyonu",
        "Yapısal hasar",
        "Bahçe zararları",
        "Hijyen problemleri",
        "Isırık riski",
        "Elektrik sistemlerine zarar"
      ],
      prevention: [
        "Gıda artıklarını temizleme",
        "Giriş noktalarını kapatma",
        "Bahçe bakımı",
        "Nem kontrolü",
        "Düzenli temizlik",
        "Doğal kovucular"
      ],
      treatment: [
        "Yem istasyonları",
        "Koloni takibi",
        "Sprey uygulamaları",
        "Doğal kovucular",
        "Profesyonel mücadele",
        "Giriş noktası kapatma"
      ],
      season: "İlkbahar-Sonbahar",
      reproduction: "Mevsimsel üreme"
    },
    {
      id: 3,
      name: "Fare",
      scientificName: "Mus musculus",
      category: "rodents",
      dangerLevel: "high",
      description: "Küçük kemirgen türüdür. Hızla çoğalır ve ciddi sağlık riskleri oluşturabilir.",
      characteristics: [
        "6-10 cm vücut uzunluğu",
        "Gri-kahverengi renk",
        "Büyük kulaklar",
        "Uzun kuyruk",
        "Keskin dişler",
        "Çok hızlı hareket"
      ],
      habitat: [
        "Duvar boşlukları",
        "Tavan arası",
        "Bodrum katları",
        "Depo alanları",
        "Sıcak yerler",
        "Gıda kaynaklarına yakın"
      ],
      damages: [
        "Gıda kontaminasyonu",
        "Hastalık bulaştırma",
        "Kablo kemirme",
        "Yangın riski",
        "Yapısal hasar",
        "Ekonomik kayıp"
      ],
      prevention: [
        "Gıdaları güvenli saklama",
        "Giriş noktalarını kapatma",
        "Temizlik ve düzen",
        "Çöp yönetimi",
        "Düzenli kontrol",
        "Çelik tel kullanımı"
      ],
      treatment: [
        "Yem istasyonları",
        "Mekanik tuzaklar",
        "Rodentisit uygulaması",
        "Giriş noktası kapatma",
        "Profesyonel program",
        "Sürekli monitoring"
      ],
      season: "Yıl boyu aktif",
      reproduction: "Çok hızlı - 19-21 gün"
    },
    {
      id: 4,
      name: "Sivrisinek",
      scientificName: "Culicidae",
      category: "flying",
      dangerLevel: "high",
      description: "Kan emici böceklerdir. Hastalık taşıma potansiyeli yüksektir.",
      characteristics: [
        "3-6 mm uzunluğunda",
        "İnce uzun bacaklar",
        "Uzun hortum",
        "Şeffaf kanatlar",
        "Dişi kan emer",
        "Yüksek frekanslı ses"
      ],
      habitat: [
        "Durgun sular",
        "Su birikintileri",
        "Saksı tabakları",
        "Çiçek vazolarında",
        "Nemli alanlar",
        "Yağmur suyu birikimleri"
      ],
      damages: [
        "Hastalık bulaştırma",
        "Kaşıntılı ısırıklar",
        "Alerjik reaksiyonlar",
        "Uyku bozukluğu",
        "Rahatsızlık verme",
        "Viral enfeksiyonlar"
      ],
      prevention: [
        "Su birikintilerini giderme",
        "Pencere sinekliği",
        "Repellent kullanımı",
        "Bahçe bakımı",
        "Temiz çevre",
        "Havalandırma"
      ],
      treatment: [
        "Larvacide uygulaması",
        "Adulticide sprey",
        "Üreme alanı kontrolü",
        "Biyolojik kontrol",
        "Entegre mücadele",
        "Elektronik kovucular"
      ],
      season: "İlkbahar-Sonbahar",
      reproduction: "Su ortamında"
    },
    {
      id: 5,
      name: "Karasinek",
      scientificName: "Musca domestica",
      category: "flying",
      dangerLevel: "medium",
      description: "Evlerde yaygın görülen uçan böcektir. Hastalık taşıma riski vardır.",
      characteristics: [
        "6-7 mm uzunluğunda",
        "Koyu gri renkte",
        "Kırmızı gözler",
        "Hızlı uçar",
        "Organik maddeleri sever",
        "Çok hızlı ürer"
      ],
      habitat: [
        "Çöp alanları",
        "Mutfak",
        "Yemek alanları",
        "Hayvan barınakları",
        "Organik atıklar",
        "Nemli ortamlar"
      ],
      damages: [
        "Gıda kontaminasyonu",
        "Hastalık bulaştırma",
        "Hijyen problemleri",
        "Rahatsızlık verme",
        "Bakteriyel enfeksiyon",
        "Viral bulaşım"
      ],
      prevention: [
        "Çöp yönetimi",
        "Gıda koruma",
        "Temizlik",
        "Pencere sinekliği",
        "Organik atık kontrolü",
        "Hızlı atık bertarafı"
      ],
      treatment: [
        "UV tuzaklar",
        "Yem tuzakları",
        "Sprey uygulaması",
        "Üreme alanı kontrolü",
        "Hijyen iyileştirme",
        "Elektrikli kovucular"
      ],
      season: "Sıcak mevsimler",
      reproduction: "Organik maddelerde"
    },
    {
      id: 6,
      name: "Kene",
      scientificName: "Ixodidae",
      category: "parasites",
      dangerLevel: "high",
      description: "Kan emici parazitlerdir. Ciddi hastalıklar bulaştırabilirler.",
      characteristics: [
        "1-10 mm boyut",
        "Oval şekil",
        "8 bacaklı",
        "Kan emerken şişer",
        "Sert kabuklu",
        "Yavaş hareket"
      ],
      habitat: [
        "Çimenlik alanlar",
        "Orman kenarları",
        "Evcil hayvan alanları",
        "Nemli yerler",
        "Bitki örtüsü",
        "Yüksek otlar"
      ],
      damages: [
        "Hastalık bulaştırma",
        "Lyme hastalığı",
        "Kırım-Kongo ateşi",
        "Alerjik reaksiyonlar",
        "Enfeksiyon riski",
        "Kan kaybı"
      ],
      prevention: [
        "Koruyucu giysi",
        "Repellent kullanımı",
        "Evcil hayvan kontrolü",
        "Çim bakımı",
        "Vücut kontrolü",
        "Açık alan dikkat"
      ],
      treatment: [
        "Acaricide uygulaması",
        "Çevre ilaçlaması",
        "Pet tedavisi",
        "Habitat modifikasyonu",
        "Profesyonel mücadele",
        "Düzenli kontrol"
      ],
      season: "İlkbahar-Sonbahar",
      reproduction: "Konakçı üzerinde"
    },
    {
      id: 7,
      name: "Tahta Kurusu",
      scientificName: "Cimex lectularius",
      category: "parasites",
      dangerLevel: "high",
      description: "Yatak ve mobilyalarda yaşayan kan emici böceklerdir.",
      characteristics: [
        "4-5 mm uzunluğunda",
        "Kahverengi-kırmızımsı",
        "Yassı vücut",
        "Gece aktif",
        "Kan kokusu çeker",
        "Çok dirençli"
      ],
      habitat: [
        "Yatak çerçeveleri",
        "Mobilya çatlakları",
        "Halı kenarları",
        "Duvar kağıdı arkası",
        "Elektrik prizleri",
        "Koltuk takımları"
      ],
      damages: [
        "Kaşıntılı ısırıklar",
        "Uyku bozukluğu",
        "Alerjik reaksiyonlar",
        "Stres ve anksiyete",
        "Cilt enfeksiyonları",
        "Psikolojik etki"
      ],
      prevention: [
        "Düzenli yatak kontrolü",
        "Temiz çarşaflar",
        "Mobilya incelemesi",
        "Seyahat dikkat",
        "İkinci el mobilya kontrolü",
        "Erken tespit"
      ],
      treatment: [
        "Buhar uygulaması",
        "Özel ilaçlama",
        "Sıcaklık tedavisi",
        "Vakumlama",
        "Profesyonel müdahale",
        "Uzun vadeli takip"
      ],
      season: "Yıl boyu aktif",
      reproduction: "Gizli yerlerde"
    },
    {
      id: 8,
      name: "Güve",
      scientificName: "Tineidae",
      category: "flying",
      dangerLevel: "low",
      description: "Tekstil ve gıda ürünlerine zarar veren küçük böceklerdir.",
      characteristics: [
        "6-24 mm kanat açıklığı",
        "Gri-kahverengi renk",
        "Tüylü kanatlar",
        "Gece aktif",
        "Işığa çekilir",
        "Yavaş uçar"
      ],
      habitat: [
        "Gardıroplar",
        "Kilerde",
        "Halı altları",
        "Yün ürünler",
        "Tahıl depoları",
        "Karanlık yerler"
      ],
      damages: [
        "Tekstil hasarı",
        "Gıda kontaminasyonu",
        "Delik açma",
        "Ekonomik kayıp",
        "Depolama problemleri",
        "Kalite kaybı"
      ],
      prevention: [
        "Düzenli temizlik",
        "Havalandırma",
        "Lavanta kullanımı",
        "Sıkı ambalajlama",
        "Düzenli kontrol",
        "Nem kontrolü"
      ],
      treatment: [
        "Feromon tuzaklar",
        "Soğuk tedavi",
        "Fumigasyon",
        "Doğal kovucular",
        "Profesyonel ilaçlama",
        "Çevre düzenlemesi"
      ],
      season: "Yıl boyu",
      reproduction: "Tekstil/gıda üzerinde"
    },
    {
      id: 9,
      name: "Sıçan",
      scientificName: "Rattus rattus",
      category: "rodents",
      dangerLevel: "high",
      description: "Büyük kemirgen türüdür. Ciddi hastalık taşıma riski ve yapısal hasar oluşturur.",
      characteristics: [
        "15-25 cm vücut uzunluğu",
        "Koyu gri-siyah renk",
        "Büyük kulaklar",
        "Uzun kuyruk",
        "Güçlü dişler",
        "İyi tırmanıcı"
      ],
      habitat: [
        "Çatı arasları",
        "Kanalizasyon sistemleri",
        "Bodrum katları",
        "Depo alanları",
        "Bahçe alanları",
        "Su kaynaklarına yakın"
      ],
      damages: [
        "Ciddi hastalık bulaştırma",
        "Yapısal hasar",
        "Elektrik kablolarını kemirme",
        "Gıda kontaminasyonu",
        "Yangın riski",
        "Büyük ekonomik kayıp"
      ],
      prevention: [
        "Güçlü giriş engelleri",
        "Çelik tel kullanımı",
        "Gıda güvenliği",
        "Su kaynaklarını koruma",
        "Düzenli denetim",
        "Çevre temizliği"
      ],
      treatment: [
        "Güçlü rodentisitler",
        "Çoklu tuzak sistemleri",
        "Giriş noktası kapatma",
        "Profesyonel program",
        "Sürekli monitoring",
        "Habitat modifikasyonu"
      ],
      season: "Yıl boyu aktif",
      reproduction: "Hızlı üreme - 21-23 gün"
    },
    {
      id: 10,
      name: "Arı",
      scientificName: "Apis mellifera",
      category: "flying",
      dangerLevel: "medium",
      description: "Faydalı böcek olmakla birlikte, yanlış yerde yuva yaparsa problem oluşturabilir.",
      characteristics: [
        "12-15 mm uzunluğunda",
        "Sarı-siyah çizgili",
        "Tüylü vücut",
        "Güçlü kanatlar",
        "İğneli",
        "Sosyal yaşam"
      ],
      habitat: [
        "Ağaç kovukları",
        "Çatı arasları",
        "Duvar boşlukları",
        "Bahçe alanları",
        "Balkon köşeleri",
        "Korunaklı yerler"
      ],
      damages: [
        "Sokma riski",
        "Alerjik reaksiyonlar",
        "Yapısal problemler",
        "Bal sızıntısı",
        "Koku problemi",
        "Diğer böcekleri çekme"
      ],
      prevention: [
        "Erken tespit",
        "Giriş noktalarını kapatma",
        "Düzenli kontrol",
        "Çiçek düzenlemesi",
        "Uzman danışmanlık",
        "Koruyucu önlemler"
      ],
      treatment: [
        "Güvenli uzaklaştırma",
        "Arıcı ile işbirliği",
        "Yuva temizliği",
        "Giriş noktası kapatma",
        "Doğal kovucular",
        "Profesyonel müdahale"
      ],
      season: "İlkbahar-Sonbahar",
      reproduction: "Koloni büyümesi"
    },
    {
      id: 11,
      name: "Eşek Arısı",
      scientificName: "Vespa crabro",
      category: "flying",
      dangerLevel: "high",
      description: "Büyük ve agresif böceklerdir. Sokmaları çok acı verici ve tehlikeli olabilir.",
      characteristics: [
        "25-35 mm uzunluğunda",
        "Sarı-kahverengi renk",
        "Büyük kafa",
        "Güçlü çeneler",
        "Agresif davranış",
        "Güçlü uçuş"
      ],
      habitat: [
        "Ağaç kovukları",
        "Çatı arasları",
        "Toprak altı",
        "Duvar boşlukları",
        "Bahçe kulübeleri",
        "Korunaklı alanlar"
      ],
      damages: [
        "Çok acı verici sokma",
        "Ciddi alerjik reaksiyonlar",
        "Anafilaktik şok riski",
        "Agresif saldırı",
        "Diğer böcekleri avlama",
        "Korku ve panik"
      ],
      prevention: [
        "Erken tespit",
        "Gıda kaynaklarını koruma",
        "Yuva alanlarını kontrol",
        "Koruyucu giysi",
        "Dikkatli hareket",
        "Uzman yardımı"
      ],
      treatment: [
        "Profesyonel müdahale",
        "Özel koruyucu ekipman",
        "Gece uygulaması",
        "Yuva imhası",
        "Güvenlik önlemleri",
        "Takip kontrolü"
      ],
      season: "İlkbahar-Sonbahar",
      reproduction: "Yıllık koloni"
    },
    {
      id: 12,
      name: "Pire",
      scientificName: "Siphonaptera",
      category: "parasites",
      dangerLevel: "medium",
      description: "Evcil hayvanlarda ve insanlarda yaşayan kan emici parazitlerdir.",
      characteristics: [
        "1-3 mm uzunluğunda",
        "Kahverengi-siyah renk",
        "Yassı vücut",
        "Güçlü arka bacaklar",
        "Yüksek zıplama",
        "Kan emici"
      ],
      habitat: [
        "Evcil hayvan tüyleri",
        "Halı ve kumaşlar",
        "Yatak takımları",
        "Koltuk takımları",
        "Sıcak ve nemli yerler",
        "Organik artıklar"
      ],
      damages: [
        "Kaşıntılı ısırıklar",
        "Alerjik reaksiyonlar",
        "Hastalık bulaştırma",
        "Rahatsızlık verme",
        "Cilt enfeksiyonları",
        "Pet sağlık problemleri"
      ],
      prevention: [
        "Evcil hayvan bakımı",
        "Düzenli temizlik",
        "Vakumlama",
        "Çamaşır yıkama",
        "Pire tasması",
        "Veteriner kontrolü"
      ],
      treatment: [
        "Pet tedavisi",
        "Çevre ilaçlaması",
        "Vakumlama",
        "Yıkama ve kurutma",
        "Sprey uygulaması",
        "Düzenli takip"
      ],
      season: "Yıl boyu",
      reproduction: "Pet üzerinde"
    },
    {
      id: 13,
      name: "Örümcek",
      scientificName: "Araneae",
      category: "arachnids",
      dangerLevel: "low",
      description: "Çoğu zararsız olmakla birlikte, bazı türleri zehirli olabilir.",
      characteristics: [
        "2-30 mm boyut aralığı",
        "8 bacaklı",
        "İpek ağ örer",
        "Avcı böcek",
        "Çok çeşitli türler",
        "Gece aktif"
      ],
      habitat: [
        "Köşe ve çatlaklar",
        "Bahçe alanları",
        "Bodrum katları",
        "Çatı arasları",
        "Mobilya arkası",
        "Karanlık yerler"
      ],
      damages: [
        "Isırık riski",
        "Alerjik reaksiyonlar",
        "Ağ oluşturma",
        "Görsel rahatsızlık",
        "Korku yaratma",
        "Zehirli tür riski"
      ],
      prevention: [
        "Düzenli temizlik",
        "Ağ temizliği",
        "Çatlak kapatma",
        "Nem kontrolü",
        "Düzenli kontrol",
        "Doğal kovucular"
      ],
      treatment: [
        "Ağ temizliği",
        "Sprey uygulaması",
        "Habitat düzenlemesi",
        "Giriş noktası kapatma",
        "Doğal kovucular",
        "Profesyonel müdahale"
      ],
      season: "Yıl boyu",
      reproduction: "Yumurta keseleri"
    },
    {
      id: 14,
      name: "Akrep",
      scientificName: "Scorpiones",
      category: "arachnids",
      dangerLevel: "high",
      description: "Zehirli kuyruğu olan arachnid türüdür. Sokması tehlikeli olabilir.",
      characteristics: [
        "5-20 cm uzunluğunda",
        "8 bacaklı",
        "Zehirli kuyruk",
        "Güçlü kıskaçlar",
        "Gece aktif",
        "Sert kabuklu"
      ],
      habitat: [
        "Taş altları",
        "Kuru alanlar",
        "Çatlak ve yarıklar",
        "Bahçe alanları",
        "Duvar diplerinde",
        "Karanlık köşeler"
      ],
      damages: [
        "Zehirli sokma",
        "Ciddi ağrı",
        "Alerjik reaksiyonlar",
        "Nefes darlığı",
        "Kas krampları",
        "Acil tıbbi müdahale"
      ],
      prevention: [
        "Ayakkabı kontrolü",
        "Yatak kontrolü",
        "Çatlak kapatma",
        "Bahçe temizliği",
        "Dikkatli hareket",
        "Koruyucu giysi"
      ],
      treatment: [
        "Profesyonel müdahale",
        "Habitat modifikasyonu",
        "Çevre ilaçlaması",
        "Giriş engelleme",
        "Düzenli kontrol",
        "Güvenlik önlemleri"
      ],
      season: "Sıcak mevsimler",
      reproduction: "Canlı doğum"
    },
    {
      id: 15,
      name: "Termit",
      scientificName: "Isoptera",
      category: "insects",
      dangerLevel: "high",
      description: "Ahşap yapılara ciddi zarar veren sosyal böceklerdir.",
      characteristics: [
        "4-15 mm uzunluğunda",
        "Beyaz-sarımsı renk",
        "Yumuşak vücut",
        "Sosyal koloni",
        "Ahşap yiyen",
        "Gizli yaşam"
      ],
      habitat: [
        "Ahşap yapılar",
        "Toprak altı",
        "Nemli alanlar",
        "Ağaç kökleri",
        "Yapı temelleri",
        "Karanlık yerler"
      ],
      damages: [
        "Yapısal hasar",
        "Ahşap çürütme",
        "Ekonomik kayıp",
        "Bina güvenliği riski",
        "Mobilya hasarı",
        "Uzun vadeli zarar"
      ],
      prevention: [
        "Nem kontrolü",
        "Ahşap koruma",
        "Toprak işlemi",
        "Düzenli denetim",
        "Havalandırma",
        "Erken tespit"
      ],
      treatment: [
        "Toprak ilaçlaması",
        "Ahşap enjeksiyonu",
        "Yem istasyonları",
        "Fumigasyon",
        "Profesyonel program",
        "Uzun vadeli takip"
      ],
      season: "Yıl boyu",
      reproduction: "Koloni büyümesi"
    },
    {
      id: 16,
      name: "Bit",
      scientificName: "Phthiraptera",
      category: "parasites",
      dangerLevel: "medium",
      description: "İnsan ve hayvan saçlarında yaşayan kan emici parazitlerdir.",
      characteristics: [
        "1-3 mm uzunluğunda",
        "Gri-kahverengi renk",
        "Yassı vücut",
        "Güçlü pençeler",
        "Saça yapışır",
        "Hızlı üreme"
      ],
      habitat: [
        "İnsan saçları",
        "Hayvan tüyleri",
        "Yatak takımları",
        "Şapka ve bereler",
        "Kişisel eşyalar",
        "Sıcak ortamlar"
      ],
      damages: [
        "Şiddetli kaşıntı",
        "Cilt tahrişi",
        "Enfeksiyon riski",
        "Sosyal problem",
        "Uyku bozukluğu",
        "Stres yaratma"
      ],
      prevention: [
        "Kişisel hijyen",
        "Eşya paylaşmama",
        "Düzenli saç kontrolü",
        "Temiz yatak takımı",
        "Okul kontrolü",
        "Erken tespit"
      ],
      treatment: [
        "Özel şampunlar",
        "İnce tarak kullanımı",
        "Çamaşır yıkama",
        "Çevre temizliği",
        "Tekrarlı uygulama",
        "Aile tedavisi"
      ],
      season: "Yıl boyu",
      reproduction: "Saç üzerinde"
    },
    {
      id: 17,
      name: "Karafatma",
      scientificName: "Blatta orientalis",
      category: "crawling",
      dangerLevel: "high",
      description: "Büyük hamam böceği türüdür. Nemli ve karanlık yerleri tercih eder.",
      characteristics: [
        "20-25 mm uzunluğunda",
        "Koyu kahverengi-siyah",
        "Parlak vücut",
        "Yavaş hareket",
        "Nemli ortam sever",
        "Güçlü koku"
      ],
      habitat: [
        "Bodrum katları",
        "Kanalizasyon",
        "Su boruları çevresi",
        "Nemli köşeler",
        "Çöp alanları",
        "Karanlık yerler"
      ],
      damages: [
        "Hastalık bulaştırma",
        "Gıda kontaminasyonu",
        "Kötü koku yayma",
        "Alerjik reaksiyonlar",
        "Hijyen problemleri",
        "Bakteriyel enfeksiyon"
      ],
      prevention: [
        "Nem kontrolü",
        "Su sızıntı tamiri",
        "Çatlak kapatma",
        "Temizlik ve hijyen",
        "Çöp yönetimi",
        "Havalandırma"
      ],
      treatment: [
        "Gel yem uygulaması",
        "Sprey ilaçlama",
        "Tuzak sistemleri",
        "Habitat düzenlemesi",
        "Profesyonel müdahale",
        "Sürekli takip"
      ],
      season: "Yıl boyu",
      reproduction: "Nemli ortamlarda"
    },
    {
      id: 18,
      name: "Gümüş Balığı",
      scientificName: "Lepisma saccharina",
      category: "insects",
      dangerLevel: "low",
      description: "Kağıt ve nişasta bazlı malzemeleri yiyen gümüş renkli böcektir.",
      characteristics: [
        "12-19 mm uzunluğunda",
        "Gümüş-gri renk",
        "Balık şeklinde vücut",
        "3 uzun kuyruk",
        "Hızlı hareket",
        "Pullu yüzey"
      ],
      habitat: [
        "Nemli alanlar",
        "Banyo ve mutfak",
        "Kütüphane rafları",
        "Karton kutular",
        "Eski kağıtlar",
        "Karanlık köşeler"
      ],
      damages: [
        "Kağıt hasarı",
        "Kitap yeme",
        "Fotoğraf hasarı",
        "Kumaş delik açma",
        "Duvar kağıdı hasarı",
        "Arşiv zararı"
      ],
      prevention: [
        "Nem kontrolü",
        "Havalandırma",
        "Kağıt koruma",
        "Düzenli temizlik",
        "Çatlak kapatma",
        "Dehumidifier kullanımı"
      ],
      treatment: [
        "Nem azaltma",
        "Sprey uygulaması",
        "Tuzak kullanımı",
        "Habitat düzenlemesi",
        "Doğal kovucular",
        "Profesyonel müdahale"
      ],
      season: "Yıl boyu",
      reproduction: "Nemli ortamlarda"
    },
    {
      id: 19,
      name: "Kulağakaçan",
      scientificName: "Dermaptera",
      category: "insects",
      dangerLevel: "low",
      description: "Kuyruğunda maşa benzeri organ bulunan zararsız böcektir.",
      characteristics: [
        "10-15 mm uzunluğunda",
        "Kahverengi renk",
        "Kuyruğunda maşa",
        "Yassı vücut",
        "Gece aktif",
        "Hızlı hareket"
      ],
      habitat: [
        "Nemli toprak",
        "Yaprak altları",
        "Taş altları",
        "Çiçek saksıları",
        "Bahçe alanları",
        "Karanlık yerler"
      ],
      damages: [
        "Bitki hasarı",
        "Çiçek yeme",
        "Meyve hasarı",
        "Görsel rahatsızlık",
        "Bahçe zararı",
        "Minimal zarar"
      ],
      prevention: [
        "Bahçe temizliği",
        "Nem kontrolü",
        "Yaprak temizliği",
        "Düzenli bakım",
        "Doğal düşmanlar",
        "Çevre düzenlemesi"
      ],
      treatment: [
        "Bahçe ilaçlaması",
        "Doğal kovucular",
        "Habitat düzenlemesi",
        "Tuzak kullanımı",
        "Biyolojik kontrol",
        "Minimal müdahale"
      ],
      season: "İlkbahar-Sonbahar",
      reproduction: "Toprak altında"
    },
    {
      id: 20,
      name: "Çan Böceği",
      scientificName: "Gryllidae",
      category: "insects",
      dangerLevel: "low",
      description: "Ses çıkaran böcektir. Genellikle zararsız ancak rahatsız edici olabilir.",
      characteristics: [
        "15-25 mm uzunluğunda",
        "Siyah-kahverengi renk",
        "Güçlü arka bacaklar",
        "Ses çıkarır",
        "Gece aktif",
        "Zıplama yetisi"
      ],
      habitat: [
        "Bahçe alanları",
        "Çimenlik alanlar",
        "Taş altları",
        "Nemli toprak",
        "Bitki kökleri",
        "Karanlık yerler"
      ],
      damages: [
        "Gürültü problemi",
        "Uyku bozma",
        "Bitki kökü hasarı",
        "Rahatsızlık verme",
        "Minimal zarar",
        "Ses kirliliği"
      ],
      prevention: [
        "Bahçe bakımı",
        "Nem kontrolü",
        "Çim kesimi",
        "Taş temizliği",
        "Doğal düşmanlar",
        "Çevre düzenlemesi"
      ],
      treatment: [
        "Ses engelleme",
        "Habitat düzenlemesi",
        "Doğal kovucular",
        "Bahçe ilaçlaması",
        "Biyolojik kontrol",
        "Minimal müdahale"
      ],
      season: "Yaz ayları",
      reproduction: "Toprak içinde"
    }
  ];

  const filteredPests = pests.filter(pest => {
    const matchesSearch = pest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pest.scientificName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || pest.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getDangerColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-orange-600 bg-orange-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getDangerText = (level: string) => {
    switch (level) {
      case 'high': return 'Yüksek Risk';
      case 'medium': return 'Orta Risk';
      case 'low': return 'Düşük Risk';
      default: return 'Bilinmiyor';
    }
  };

  return (
    <div className="pt-8">
      {/* Page Header */}
      <section className="bg-gradient-to-br from-pest-green-50 to-pest-green-100 py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-6">
            <Bug className="h-12 w-12 text-pest-green-700 mr-4" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
              Haşere Kütüphanesi
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Yaygın haşere türleri hakkında detaylı bilgiler, tanıma rehberi ve 
            etkili mücadele yöntemleri. Haşereleri tanıyın, doğru müdahale edin.
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
                placeholder="Haşere adı ile arayın..."
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
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    selectedCategory === category.id
                      ? 'bg-pest-green-700 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-pest-green-100 hover:text-pest-green-700'
                  }`}
                >
                  <category.icon className="h-4 w-4" />
                  <span>{category.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pest Grid */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          {filteredPests.length === 0 ? (
            <div className="text-center py-16">
              <Bug className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Haşere Bulunamadı</h3>
              <p className="text-gray-500">Arama kriterlerinizi değiştirmeyi deneyin.</p>
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-8">
              {filteredPests.map((pest) => (
                <div key={pest.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                  {/* Header */}
                  <div className="bg-gradient-to-r from-pest-green-600 to-pest-green-700 p-6 text-white relative">
                    <div className="absolute top-4 right-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium bg-white ${getDangerColor(pest.dangerLevel).replace('bg-', 'text-').replace('-100', '-600')}`}>
                        {getDangerText(pest.dangerLevel)}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{pest.name}</h3>
                    <p className="text-pest-green-100 italic">{pest.scientificName}</p>
                  </div>

                  {/* Content */}
                  <div className="p-8">
                    <p className="text-gray-600 leading-relaxed mb-6">{pest.description}</p>

                    {/* Quick Info */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-pest-green-600" />
                        <span className="text-sm text-gray-600">{pest.season}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Target className="h-4 w-4 text-pest-green-600" />
                        <span className="text-sm text-gray-600">{pest.reproduction}</span>
                      </div>
                    </div>

                    {/* Detailed Sections */}
                    <div className="space-y-6">
                      {/* Characteristics */}
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                          <Eye className="h-4 w-4 text-pest-green-600 mr-2" />
                          Özellikler
                        </h4>
                        <ul className="grid grid-cols-1 gap-1">
                          {pest.characteristics.slice(0, 3).map((char, index) => (
                            <li key={index} className="text-sm text-gray-600 flex items-center">
                              <div className="w-1.5 h-1.5 bg-pest-green-600 rounded-full mr-2"></div>
                              {char}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Habitat */}
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                          <Home className="h-4 w-4 text-pest-green-600 mr-2" />
                          Yaşam Alanları
                        </h4>
                        <ul className="grid grid-cols-1 gap-1">
                          {pest.habitat.slice(0, 3).map((habitat, index) => (
                            <li key={index} className="text-sm text-gray-600 flex items-center">
                              <div className="w-1.5 h-1.5 bg-pest-green-600 rounded-full mr-2"></div>
                              {habitat}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Damages */}
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                          <AlertTriangle className="h-4 w-4 text-red-600 mr-2" />
                          Zararları
                        </h4>
                        <ul className="grid grid-cols-1 gap-1">
                          {pest.damages.slice(0, 3).map((damage, index) => (
                            <li key={index} className="text-sm text-gray-600 flex items-center">
                              <div className="w-1.5 h-1.5 bg-red-600 rounded-full mr-2"></div>
                              {damage}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Prevention */}
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                          <Shield className="h-4 w-4 text-green-600 mr-2" />
                          Korunma Yöntemleri
                        </h4>
                        <ul className="grid grid-cols-1 gap-1">
                          {pest.prevention.slice(0, 3).map((prevention, index) => (
                            <li key={index} className="text-sm text-gray-600 flex items-center">
                              <div className="w-1.5 h-1.5 bg-green-600 rounded-full mr-2"></div>
                              {prevention}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Treatment */}
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                          <Target className="h-4 w-4 text-pest-green-600 mr-2" />
                          Mücadele Yöntemleri
                        </h4>
                        <ul className="grid grid-cols-1 gap-1">
                          {pest.treatment.slice(0, 3).map((treatment, index) => (
                            <li key={index} className="text-sm text-gray-600 flex items-center">
                              <div className="w-1.5 h-1.5 bg-pest-green-600 rounded-full mr-2"></div>
                              {treatment}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <p className="text-sm text-gray-600 mb-3">
                        Bu haşere ile karşılaştınız mı? Profesyonel yardım alın.
                      </p>
                      <Link 
                        to="/iletisim"
                        className="inline-flex items-center text-pest-green-600 hover:text-pest-green-700 font-medium"
                      >
                        <span>Keşif Talebi</span>
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Tips Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Genel Korunma İpuçları</h2>
            <p className="text-xl text-gray-600">
              Haşere problemlerini önlemek için temel önlemler
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center bg-gray-50 rounded-xl p-6">
              <Home className="h-12 w-12 text-pest-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Temizlik</h3>
              <p className="text-gray-600 text-sm">
                Düzenli temizlik ve hijyen haşerelerin en büyük düşmanıdır.
              </p>
            </div>

            <div className="text-center bg-gray-50 rounded-xl p-6">
              <Droplets className="h-12 w-12 text-pest-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Nem Kontrolü</h3>
              <p className="text-gray-600 text-sm">
                Su sızıntılarını giderin ve nem seviyesini kontrol altında tutun.
              </p>
            </div>

            <div className="text-center bg-gray-50 rounded-xl p-6">
              <Shield className="h-12 w-12 text-pest-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Giriş Engelleme</h3>
              <p className="text-gray-600 text-sm">
                Çatlak ve yarıkları kapatarak haşerelerin girişini engelleyin.
              </p>
            </div>

            <div className="text-center bg-gray-50 rounded-xl p-6">
              <Eye className="h-12 w-12 text-pest-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Erken Tespit</h3>
              <p className="text-gray-600 text-sm">
                Düzenli kontroller ile problemleri erken aşamada tespit edin.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-pest-green-700">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Haşere Probleminiz mi Var?
          </h2>
          <p className="text-xl text-pest-green-100 mb-8 max-w-2xl mx-auto">
            Hangi haşere türü olursa olsun, uzman ekibimizle etkili çözümler sunuyoruz.
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

export default PestLibraryPage;