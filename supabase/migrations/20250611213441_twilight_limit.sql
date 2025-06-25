/*
  # Create presentation_templates table

  1. New Tables
    - `presentation_templates` - Stores standard presentation templates
      - `id` (uuid, primary key)
      - `name` (text, not null) - Template name
      - `standard` (text, not null) - Standard type (BRC, AIB, HACCP, ISO22000, IPM)
      - `description` (text) - Template description
      - `slides` (jsonb, not null) - JSON data containing slide content
      - `thumbnail_url` (text) - URL to template thumbnail image
      - `is_active` (boolean, default true) - Whether template is active
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())
  
  2. Security
    - Enable RLS on `presentation_templates` table
    - Add policies for authenticated users to manage templates
    - Add policies for anonymous users to read active templates
*/

-- Create presentation_templates table
CREATE TABLE IF NOT EXISTS presentation_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  standard text NOT NULL CHECK (standard IN ('BRC', 'AIB', 'HACCP', 'ISO22000', 'IPM', 'GENERAL')),
  description text,
  slides jsonb NOT NULL,
  thumbnail_url text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE presentation_templates ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Anyone can read active presentation templates"
  ON presentation_templates
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Authenticated users can insert presentation templates"
  ON presentation_templates
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update presentation templates"
  ON presentation_templates
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete presentation templates"
  ON presentation_templates
  FOR DELETE
  TO authenticated
  USING (true);

-- Create updated_at trigger
CREATE TRIGGER update_presentation_templates_updated_at
  BEFORE UPDATE ON presentation_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create the presentation_templates folder in the documents bucket
INSERT INTO storage.objects (bucket_id, name, owner, metadata)
VALUES ('documents', 'presentation_templates/.emptyFolderPlaceholder', auth.uid(), '{"contentType": "text/plain"}')
ON CONFLICT (bucket_id, name) DO NOTHING;

-- Insert sample templates
INSERT INTO presentation_templates (name, standard, description, slides, is_active)
VALUES 
-- BRC Template
('BRC Zararlı Mücadelesi Eğitimi', 'BRC', 'BRC standardına uygun zararlı mücadelesi eğitim sunumu', 
  '[
    {
      "id": "slide-1",
      "type": "title",
      "content": {
        "title": "BRC Standardında Zararlı Mücadelesi",
        "subtitle": "Gıda Güvenliği için Kapsamlı Yaklaşım"
      },
      "background": "#ffffff"
    },
    {
      "id": "slide-2",
      "type": "content",
      "content": {
        "title": "BRC Standardı Nedir?",
        "bullets": [
          "British Retail Consortium tarafından geliştirilen gıda güvenliği standardı",
          "Dünya çapında kabul gören sertifikasyon sistemi",
          "Gıda güvenliği, kalite ve operasyonel kriterleri içerir",
          "Zararlı mücadelesi, standardın önemli bir bileşenidir"
        ]
      },
      "background": "#ffffff"
    },
    {
      "id": "slide-3",
      "type": "content",
      "content": {
        "title": "BRC Zararlı Mücadele Gereksinimleri",
        "bullets": [
          "Kapsamlı zararlı mücadele programı",
          "Risk değerlendirme ve haritalama",
          "Düzenli monitoring ve kayıt tutma",
          "Eğitimli personel ve yetkinlik kanıtları",
          "Dokümantasyon sistemi"
        ]
      },
      "background": "#ffffff"
    },
    {
      "id": "slide-4",
      "type": "two-column",
      "content": {
        "title": "BRC Madde 4.11: Zararlı Mücadelesi",
        "leftTitle": "Gereksinimler",
        "leftContent": [
          "Zararlı mücadele programının kurulması",
          "Yazılı prosedürlerin oluşturulması",
          "Düzenli monitoring yapılması",
          "Kayıtların tutulması"
        ],
        "rightTitle": "Uygulamalar",
        "rightContent": [
          "Tesis risk haritası",
          "Zararlı türleri tanımlaması",
          "Kontrol yöntemleri belirlenmesi",
          "Acil durum prosedürleri"
        ]
      },
      "background": "#ffffff"
    },
    {
      "id": "slide-5",
      "type": "content",
      "content": {
        "title": "BRC Audit Hazırlık Süreci",
        "bullets": [
          "Gap analizi ve mevcut durum değerlendirmesi",
          "BRC uyumlu zararlı mücadele sisteminin kurulması",
          "Dokümantasyon ve kayıt sisteminin oluşturulması",
          "Personel eğitimi ve yetkinlik değerlendirmesi",
          "İç audit ve düzeltici eylemler"
        ]
      },
      "background": "#ffffff"
    },
    {
      "id": "slide-6",
      "type": "content",
      "content": {
        "title": "BRC Uyumlu Zararlı Mücadelesinin Faydaları",
        "bullets": [
          "Uluslararası perakende zincirlerine satış imkanı",
          "Müşteri güveninin artırılması",
          "Risk yönetimi ve önleme sistemleri",
          "Sürekli iyileştirme kültürü",
          "Yasal uygunluk güvencesi",
          "Rekabet avantajı sağlama"
        ]
      },
      "background": "#ffffff"
    },
    {
      "id": "slide-7",
      "type": "thank-you",
      "content": {
        "title": "Teşekkürler",
        "subtitle": "Sorularınız?"
      },
      "background": "#ffffff"
    }
  ]'::jsonb, 
  true),

-- AIB Template
('AIB Zararlı Mücadelesi Eğitimi', 'AIB', 'AIB standardına uygun zararlı mücadelesi eğitim sunumu', 
  '[
    {
      "id": "slide-1",
      "type": "title",
      "content": {
        "title": "AIB Standardında Zararlı Mücadelesi",
        "subtitle": "Gıda Güvenliği için Kapsamlı Yaklaşım"
      },
      "background": "#ffffff"
    },
    {
      "id": "slide-2",
      "type": "content",
      "content": {
        "title": "AIB Standardı Nedir?",
        "bullets": [
          "American Institute of Baking tarafından geliştirilen gıda güvenliği standardı",
          "Gıda üretim tesisleri için kapsamlı denetim sistemi",
          "Beş kategoride değerlendirme yapılır",
          "Zararlı mücadelesi, standardın kritik bir bileşenidir"
        ]
      },
      "background": "#ffffff"
    },
    {
      "id": "slide-3",
      "type": "content",
      "content": {
        "title": "AIB Zararlı Mücadele Kategorileri",
        "bullets": [
          "Operasyonel Yöntemler",
          "Bakım için Tasarım",
          "Temizlik Uygulamaları",
          "Entegre Zararlı Yönetimi",
          "Personel Uygulamaları"
        ]
      },
      "background": "#ffffff"
    },
    {
      "id": "slide-4",
      "type": "two-column",
      "content": {
        "title": "AIB Puanlama Sistemi",
        "leftTitle": "Puan Aralıkları",
        "leftContent": [
          "Superior (90-100): Mükemmel",
          "Excellent (80-89): Çok İyi",
          "Good (70-79): İyi",
          "Needs Improvement (<70): Geliştirilmeli"
        ],
        "rightTitle": "Değerlendirme Kriterleri",
        "rightContent": [
          "Gereksinimleri aşan performans",
          "Gereksinimleri tam olarak karşılayan performans",
          "Gereksinimleri büyük ölçüde karşılayan performans",
          "Gereksinimleri kısmen karşılayan performans"
        ]
      },
      "background": "#ffffff"
    },
    {
      "id": "slide-5",
      "type": "content",
      "content": {
        "title": "AIB Audit Hazırlık Süreci",
        "bullets": [
          "Ön değerlendirme ve gap analizi",
          "AIB gereksinimlerine uygun zararlı mücadele sisteminin geliştirilmesi",
          "Sistemin uygulanması ve personel eğitimlerinin verilmesi",
          "AIB kriterlerine göre iç audit yapılması ve iyileştirmeler",
          "AIB audit sırasında teknik destek ve danışmanlık hizmeti"
        ]
      },
      "background": "#ffffff"
    },
    {
      "id": "slide-6",
      "type": "content",
      "content": {
        "title": "AIB Uyumlu Zararlı Mücadelesinin Faydaları",
        "bullets": [
          "AIB sertifikasyonu için gerekli zararlı mücadele sistemi",
          "Gıda güvenliği standartlarında yüksek performans",
          "Müşteri güveninin artırılması",
          "Uluslararası kabul görmüş sertifikasyon",
          "Risk yönetimi ve önleme sistemleri",
          "Sürekli iyileştirme kültürü"
        ]
      },
      "background": "#ffffff"
    },
    {
      "id": "slide-7",
      "type": "thank-you",
      "content": {
        "title": "Teşekkürler",
        "subtitle": "Sorularınız?"
      },
      "background": "#ffffff"
    }
  ]'::jsonb, 
  true),

-- HACCP Template
('HACCP Zararlı Mücadelesi Eğitimi', 'HACCP', 'HACCP sistemine uygun zararlı mücadelesi eğitim sunumu', 
  '[
    {
      "id": "slide-1",
      "type": "title",
      "content": {
        "title": "HACCP Sisteminde Zararlı Mücadelesi",
        "subtitle": "Gıda Güvenliği için Sistematik Yaklaşım"
      },
      "background": "#ffffff"
    },
    {
      "id": "slide-2",
      "type": "content",
      "content": {
        "title": "HACCP Nedir?",
        "bullets": [
          "Hazard Analysis and Critical Control Points (Tehlike Analizi ve Kritik Kontrol Noktaları)",
          "Gıda güvenliği için sistematik ve önleyici yaklaşım",
          "Tehlikeleri belirler, kritik kontrol noktalarını tanımlar",
          "Zararlı mücadelesi, HACCP sisteminin önemli bir parçasıdır"
        ]
      },
      "background": "#ffffff"
    },
    {
      "id": "slide-3",
      "type": "content",
      "content": {
        "title": "HACCP''nin 7 İlkesi",
        "bullets": [
          "1. Tehlike Analizi",
          "2. Kritik Kontrol Noktaları (CCP)",
          "3. Kritik Limitler",
          "4. Monitoring Sistemi",
          "5. Düzeltici Eylemler",
          "6. Doğrulama",
          "7. Kayıt Tutma"
        ]
      },
      "background": "#ffffff"
    },
    {
      "id": "slide-4",
      "type": "two-column",
      "content": {
        "title": "Zararlı Mücadelesinde HACCP Uygulaması",
        "leftTitle": "Tehlike Analizi",
        "leftContent": [
          "Biyolojik tehlikeler (zararlılar)",
          "Kimyasal tehlikeler (ilaçlar)",
          "Fiziksel tehlikeler (kontaminasyon)",
          "Risk değerlendirme matrisi"
        ],
        "rightTitle": "Kritik Kontrol Noktaları",
        "rightContent": [
          "İlaçlama öncesi hazırlık",
          "İlaç uygulama süreci",
          "Uygulama sonrası kontrol",
          "Monitoring noktaları"
        ]
      },
      "background": "#ffffff"
    },
    {
      "id": "slide-5",
      "type": "content",
      "content": {
        "title": "Kritik Limitler ve Monitoring",
        "bullets": [
          "İlaç konsantrasyonları için kritik limitler",
          "Uygulama süreleri ve bekleme süreleri",
          "Sıcaklık ve nem değerleri",
          "Düzenli kontrol programları",
          "Kayıt tutma sistemleri",
          "Trend analizi"
        ]
      },
      "background": "#ffffff"
    },
    {
      "id": "slide-6",
      "type": "content",
      "content": {
        "title": "HACCP Uyumlu Zararlı Mücadelesinin Faydaları",
        "bullets": [
          "HACCP sistemine entegre zararlı mücadele",
          "Gıda güvenliği risklerinin minimize edilmesi",
          "Yasal gereksinimlere tam uygunluk",
          "Sistematik risk yönetimi",
          "Sürekli iyileştirme kültürü",
          "Müşteri güveninin artırılması"
        ]
      },
      "background": "#ffffff"
    },
    {
      "id": "slide-7",
      "type": "thank-you",
      "content": {
        "title": "Teşekkürler",
        "subtitle": "Sorularınız?"
      },
      "background": "#ffffff"
    }
  ]'::jsonb, 
  true),

-- ISO 22000 Template
('ISO 22000 Zararlı Mücadelesi Eğitimi', 'ISO22000', 'ISO 22000 standardına uygun zararlı mücadelesi eğitim sunumu', 
  '[
    {
      "id": "slide-1",
      "type": "title",
      "content": {
        "title": "ISO 22000 Standardında Zararlı Mücadelesi",
        "subtitle": "Gıda Güvenliği Yönetim Sistemi Entegrasyonu"
      },
      "background": "#ffffff"
    },
    {
      "id": "slide-2",
      "type": "content",
      "content": {
        "title": "ISO 22000 Nedir?",
        "bullets": [
          "Gıda güvenliği yönetim sistemi için uluslararası standart",
          "HACCP prensiplerini ve ISO 9001 yönetim sistemini birleştirir",
          "Gıda zincirindeki tüm kuruluşlar için uygulanabilir",
          "Zararlı mücadelesi, standardın önemli bir bileşenidir"
        ]
      },
      "background": "#ffffff"
    },
    {
      "id": "slide-3",
      "type": "content",
      "content": {
        "title": "ISO 22000 Standart Yapısı",
        "bullets": [
          "4. Organizasyonun Bağlamı",
          "5. Liderlik",
          "6. Planlama",
          "7. Destek",
          "8. Operasyon",
          "9. Performans Değerlendirmesi",
          "10. İyileştirme"
        ]
      },
      "background": "#ffffff"
    },
    {
      "id": "slide-4",
      "type": "two-column",
      "content": {
        "title": "Zararlı Mücadelesinin ISO 22000''e Entegrasyonu",
        "leftTitle": "Operasyonel Ön Koşul Programları",
        "leftContent": [
          "Zararlı mücadele politikası",
          "Risk değerlendirme prosedürleri",
          "Monitoring ve kayıt sistemleri",
          "Düzeltici eylem prosedürleri"
        ],
        "rightTitle": "HACCP Entegrasyonu",
        "rightContent": [
          "Tehlike analizi sürecine dahil edilme",
          "CCP belirleme sürecinde değerlendirme",
          "Monitoring sistemlerine entegrasyon",
          "Doğrulama faaliyetlerine dahil edilme"
        ]
      },
      "background": "#ffffff"
    },
    {
      "id": "slide-5",
      "type": "content",
      "content": {
        "title": "ISO 22000 Uygulama Süreci",
        "bullets": [
          "Gap analizi ve mevcut durum değerlendirmesi",
          "ISO 22000 uyumlu gıda güvenliği yönetim sisteminin tasarlanması",
          "Politika, prosedür ve talimatların hazırlanması",
          "Personel eğitimi ve sistemin uygulamaya konulması",
          "Sistemin etkinliğinin iç audit ile değerlendirilmesi",
          "Bağımsız kuruluş tarafından sertifikasyon auditinin yapılması"
        ]
      },
      "background": "#ffffff"
    },
    {
      "id": "slide-6",
      "type": "content",
      "content": {
        "title": "ISO 22000 Uyumlu Zararlı Mücadelesinin Faydaları",
        "bullets": [
          "ISO 22000 sertifikasyonu için gerekli zararlı mücadele sistemi",
          "Uluslararası kabul görmüş gıda güvenliği standardı",
          "Müşteri güveninin artırılması",
          "Risk yönetimi ve önleme sistemleri",
          "Sürekli iyileştirme kültürü",
          "Yasal gereksinimlere uygunluk"
        ]
      },
      "background": "#ffffff"
    },
    {
      "id": "slide-7",
      "type": "thank-you",
      "content": {
        "title": "Teşekkürler",
        "subtitle": "Sorularınız?"
      },
      "background": "#ffffff"
    }
  ]'::jsonb, 
  true),

-- IPM Template
('IPM Eğitim Sunumu', 'IPM', 'Entegre Zararlı Yönetimi (IPM) eğitim sunumu', 
  '[
    {
      "id": "slide-1",
      "type": "title",
      "content": {
        "title": "Entegre Zararlı Yönetimi (IPM)",
        "subtitle": "Sürdürülebilir ve Etkili Zararlı Kontrolü"
      },
      "background": "#ffffff"
    },
    {
      "id": "slide-2",
      "type": "content",
      "content": {
        "title": "IPM Nedir?",
        "bullets": [
          "Entegre Zararlı Yönetimi (IPM), zararlı kontrolünde çevre dostu, ekonomik ve sürdürülebilir bir yaklaşımdır",
          "Zararlıların biyolojisi ve ekolojisi hakkındaki bilgileri kullanır",
          "Çoklu kontrol yöntemlerini entegre eder",
          "Zararlıların popülasyonunu kabul edilebilir seviyelerde tutmayı hedefler"
        ]
      },
      "background": "#ffffff"
    },
    {
      "id": "slide-3",
      "type": "content",
      "content": {
        "title": "IPM''nin Avantajları",
        "bullets": [
          "Çevre Dostu: Minimum kimyasal kullanımı ile çevre ve insan sağlığını korur",
          "Hedef Odaklı: Sadece zararlı türlere odaklanarak faydalı organizmaları korur",
          "Uzun Vadeli: Sürdürülebilir çözümler ile kalıcı koruma sağlar",
          "Maliyet Etkin: Uzun vadede daha ekonomik ve verimli sonuçlar sunar"
        ]
      },
      "background": "#ffffff"
    },
    {
      "id": "slide-4",
      "type": "two-column",
      "content": {
        "title": "IPM Uygulama Süreci",
        "leftTitle": "Analiz ve Planlama",
        "leftContent": [
          "İnceleme ve Tanı",
          "Strateji Geliştirme",
          "Önleyici Tedbirler",
          "Monitoring Sistemi"
        ],
        "rightTitle": "Uygulama ve Takip",
        "rightContent": [
          "Müdahale Programı",
          "Değerlendirme ve İyileştirme",
          "Sürekli İzleme",
          "Periyodik Gözden Geçirme"
        ]
      },
      "background": "#ffffff"
    },
    {
      "id": "slide-5",
      "type": "content",
      "content": {
        "title": "IPM Bileşenleri",
        "bullets": [
          "Kültürel Kontrol: Çevre düzenlemesi, hijyen iyileştirmeleri",
          "Fiziksel Kontrol: Bariyerler, tuzaklar, sıcaklık uygulamaları",
          "Biyolojik Kontrol: Doğal düşmanlar, biyolojik ajanlar",
          "Kimyasal Kontrol: Seçici pestisitler, minimum dozaj",
          "Monitoring: Sürekli izleme ve değerlendirme"
        ]
      },
      "background": "#ffffff"
    },
    {
      "id": "slide-6",
      "type": "content",
      "content": {
        "title": "Uygulama Alanları",
        "bullets": [
          "Gıda üretim tesisleri",
          "İlaç ve kozmetik fabrikaları",
          "Hastane ve sağlık kuruluşları",
          "Otel ve turizm tesisleri",
          "Eğitim kurumları",
          "Ofis ve ticari binalar",
          "Depo ve lojistik merkezleri"
        ]
      },
      "background": "#ffffff"
    },
    {
      "id": "slide-7",
      "type": "thank-you",
      "content": {
        "title": "Teşekkürler",
        "subtitle": "Sorularınız?"
      },
      "background": "#ffffff"
    }
  ]'::jsonb, 
  true),

-- General Template
('Genel Zararlı Mücadelesi Eğitimi', 'GENERAL', 'Genel zararlı mücadelesi eğitim sunumu', 
  '[
    {
      "id": "slide-1",
      "type": "title",
      "content": {
        "title": "Zararlı Mücadelesi Eğitimi",
        "subtitle": "Temel Bilgiler ve Uygulamalar"
      },
      "background": "#ffffff"
    },
    {
      "id": "slide-2",
      "type": "content",
      "content": {
        "title": "Zararlı Türleri",
        "bullets": [
          "Kemirgenler: Fare, sıçan",
          "Böcekler: Hamam böceği, karınca, bit, pire",
          "Uçan Böcekler: Sivrisinek, karasinek, güve",
          "Arachnidler: Örümcek, akrep, kene",
          "Kuşlar: Güvercin, martı, serçe"
        ]
      },
      "background": "#ffffff"
    },
    {
      "id": "slide-3",
      "type": "content",
      "content": {
        "title": "Zararlıların Etkileri",
        "bullets": [
          "Sağlık Riskleri: Hastalık bulaştırma, alerjik reaksiyonlar",
          "Ekonomik Zararlar: Ürün ve malzeme hasarı, itibar kaybı",
          "Yasal Sorunlar: Mevzuata uyumsuzluk, cezalar",
          "Müşteri Memnuniyetsizliği: Şikayetler, müşteri kaybı",
          "Operasyonel Aksamalar: Üretim durması, verimlilik kaybı"
        ]
      },
      "background": "#ffffff"
    },
    {
      "id": "slide-4",
      "type": "two-column",
      "content": {
        "title": "Zararlı Mücadele Yöntemleri",
        "leftTitle": "Önleyici Yöntemler",
        "leftContent": [
          "Hijyen ve sanitasyon",
          "Yapısal iyileştirmeler",
          "Giriş noktalarının kapatılması",
          "Düzenli denetimler"
        ],
        "rightTitle": "Müdahale Yöntemleri",
        "rightContent": [
          "Mekanik kontrol",
          "Fiziksel kontrol",
          "Biyolojik kontrol",
          "Kimyasal kontrol"
        ]
      },
      "background": "#ffffff"
    },
    {
      "id": "slide-5",
      "type": "content",
      "content": {
        "title": "Zararlı Mücadele Programı",
        "bullets": [
          "Risk değerlendirmesi ve haritalama",
          "Monitoring sistemleri ve tuzaklar",
          "Düzenli kontrol ve denetimler",
          "Kayıt tutma ve dokümantasyon",
          "Personel eğitimi ve bilinçlendirme",
          "Sürekli iyileştirme"
        ]
      },
      "background": "#ffffff"
    },
    {
      "id": "slide-6",
      "type": "content",
      "content": {
        "title": "Güvenli Uygulama İlkeleri",
        "bullets": [
          "Doğru ürün seçimi ve dozaj",
          "Kişisel koruyucu ekipman kullanımı",
          "Uygulama sonrası güvenlik önlemleri",
          "Çevre ve insan sağlığını koruma",
          "Acil durum prosedürleri",
          "Yasal mevzuata uygunluk"
        ]
      },
      "background": "#ffffff"
    },
    {
      "id": "slide-7",
      "type": "thank-you",
      "content": {
        "title": "Teşekkürler",
        "subtitle": "Sorularınız?"
      },
      "background": "#ffffff"
    }
  ]'::jsonb, 
  true);