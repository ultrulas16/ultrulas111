/*
  # Add subscription fields to products table

  1. Changes
    - Add `is_subscription` column to products table (boolean)
    - Add `subscription_period` column to products table (text)
    - Add `subscription_details` column to products table (jsonb)
  
  2. Purpose
    - Support subscription-based products in the store
    - Allow tracking of subscription period (monthly, yearly, etc.)
    - Store additional subscription-related details in JSON format
*/

-- Add subscription fields to products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS is_subscription boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS subscription_period text CHECK (subscription_period IN ('monthly', 'quarterly', 'biannual', 'annual')),
ADD COLUMN IF NOT EXISTS subscription_details jsonb;

-- Create index for subscription products
CREATE INDEX IF NOT EXISTS idx_products_is_subscription ON products(is_subscription);

-- Insert sample subscription products for modules
INSERT INTO products (
  name, 
  description, 
  short_description, 
  category_id, 
  sku, 
  price, 
  stock_quantity, 
  is_active, 
  is_subscription, 
  subscription_period, 
  subscription_details,
  tax_rate
) VALUES 
-- Risk Assessment Module
(
  'Risk Değerlendirme Modülü - Yıllık Abonelik', 
  'Zararlı mücadelesi için profesyonel risk değerlendirme raporu oluşturma modülü yıllık aboneliği. Müşterilerinize sunabileceğiniz detaylı risk analizi ve öneriler. Aylık ödeme planı ile.', 
  'Risk değerlendirme raporu oluşturma modülü yıllık aboneliği', 
  (SELECT id FROM product_categories WHERE name = 'Ekipmanlar' LIMIT 1), 
  'SUB-RISK-ANNUAL', 
  99.90, 
  999, 
  true, 
  true, 
  'monthly', 
  '{"billingCycle": "monthly", "totalMonths": 12, "features": ["Kapsamlı risk değerlendirmesi", "Özelleştirilebilir raporlar", "Firma logosu ekleme", "JPEG formatında indirme", "Yazdırılabilir format", "Profesyonel görünüm"]}',
  10
),
-- Inspection Report Module
(
  'Denetim Raporu Modülü - Yıllık Abonelik', 
  'Periyodik denetimler için profesyonel raporlar oluşturma modülü yıllık aboneliği. Tespit edilen sorunlar ve önerilen çözümlerle kapsamlı denetim raporları. Aylık ödeme planı ile.', 
  'Denetim raporu oluşturma modülü yıllık aboneliği', 
  (SELECT id FROM product_categories WHERE name = 'Ekipmanlar' LIMIT 1), 
  'SUB-INSP-ANNUAL', 
  129.90, 
  999, 
  true, 
  true, 
  'monthly', 
  '{"billingCycle": "monthly", "totalMonths": 12, "features": ["Denetim bulguları", "Fotoğraf ekleme", "Düzeltici eylem önerileri", "Takip sistemi", "JPEG formatında indirme", "Müşteri bilgileri"]}',
  10
),
-- Compliance Check Module
(
  'Uygunluk Kontrol Modülü - Yıllık Abonelik', 
  'Tesislerinizin zararlı mücadele standartlarına uygunluğunu kontrol etme modülü yıllık aboneliği. BRC, IFS, HACCP ve diğer standartlar için uygunluk raporları. Aylık ödeme planı ile.', 
  'Uygunluk kontrol modülü yıllık aboneliği', 
  (SELECT id FROM product_categories WHERE name = 'Ekipmanlar' LIMIT 1), 
  'SUB-COMP-ANNUAL', 
  149.90, 
  999, 
  true, 
  true, 
  'monthly', 
  '{"billingCycle": "monthly", "totalMonths": 12, "features": ["Standart uygunluk kontrolleri", "Gap analizi", "Düzeltici eylem planları", "Audit hazırlık raporları", "Standart bazlı değerlendirme", "Uygunluk sertifikası"]}',
  10
),
-- Contract Module
(
  'Hizmet Sözleşmesi Modülü - Yıllık Abonelik', 
  'Müşterileriniz için profesyonel hizmet sözleşmeleri oluşturma modülü yıllık aboneliği. Özelleştirilebilir şablonlar ve kolay dışa aktarma seçenekleri. Aylık ödeme planı ile.', 
  'Hizmet sözleşmesi oluşturma modülü yıllık aboneliği', 
  (SELECT id FROM product_categories WHERE name = 'Ekipmanlar' LIMIT 1), 
  'SUB-CONT-ANNUAL', 
  89.90, 
  999, 
  true, 
  true, 
  'monthly', 
  '{"billingCycle": "monthly", "totalMonths": 12, "features": ["Özelleştirilebilir sözleşme şablonu", "Firma logosu ekleme", "JPEG formatında indirme", "PDF formatında indirme", "Profesyonel görünüm", "Yasal uyumluluk"]}',
  10
),
-- Layout Designer Module
(
  'Ekipman Krokisi Modülü - Yıllık Abonelik', 
  'Zararlı mücadele ekipmanlarının yerleşimini planlamak için sürükle-bırak arayüzü modülü yıllık aboneliği. Profesyonel krokiler oluşturun, kaydedin ve dışa aktarın. Aylık ödeme planı ile.', 
  'Ekipman krokisi oluşturma modülü yıllık aboneliği', 
  (SELECT id FROM product_categories WHERE name = 'Ekipmanlar' LIMIT 1), 
  'SUB-LAYOUT-ANNUAL', 
  119.90, 
  999, 
  true, 
  true, 
  'monthly', 
  '{"billingCycle": "monthly", "totalMonths": 12, "features": ["Sürükle-bırak arayüzü", "Çeşitli ekipman türleri", "Özelleştirilebilir etiketler", "Görsel dışa aktarma", "Kroki kaydetme ve yükleme", "Müşteri bilgileri"]}',
  10
),
-- Trend Analysis Module
(
  'Trend Analiz Modülü - Yıllık Abonelik', 
  'Zararlı mücadele ekipmanlarının aktivite verilerini takip etme ve trend analizleri oluşturma modülü yıllık aboneliği. Ziyaret tarihlerine göre ekipman aktivitelerini görselleştirin. Aylık ödeme planı ile.', 
  'Trend analizi oluşturma modülü yıllık aboneliği', 
  (SELECT id FROM product_categories WHERE name = 'Ekipmanlar' LIMIT 1), 
  'SUB-TREND-ANNUAL', 
  159.90, 
  999, 
  true, 
  true, 
  'monthly', 
  '{"billingCycle": "monthly", "totalMonths": 12, "features": ["Ziyaret takibi", "Ekipman aktivite kaydı", "Görsel grafikler", "Trend analizi", "PDF rapor çıktısı", "Veri karşılaştırma"]}',
  10
),
-- Visit Calendar Module
(
  'Ziyaret Takvimi Modülü - Yıllık Abonelik', 
  'Müşterileriniz için yıllık ilaçlama ziyaret takvimi oluşturma ve takip etme modülü yıllık aboneliği. Ziyaretleri planlayın, düzenleyin ve raporlayın. Aylık ödeme planı ile.', 
  'Ziyaret takvimi oluşturma modülü yıllık aboneliği', 
  (SELECT id FROM product_categories WHERE name = 'Ekipmanlar' LIMIT 1), 
  'SUB-CALENDAR-ANNUAL', 
  139.90, 
  999, 
  true, 
  true, 
  'monthly', 
  '{"billingCycle": "monthly", "totalMonths": 12, "features": ["Yıllık takvim görünümü", "Ziyaret planlama", "Teknisyen atama", "Durum takibi", "PDF çıktı alma", "Müşteri bazlı filtreleme"]}',
  10
),
-- Auto Trend Analysis Module
(
  'Otomatik Trend Analiz Modülü - Yıllık Abonelik', 
  'Ekipman sayıları ve ziyaret tarihlerini girerek otomatik olarak trend analiz raporu oluşturma modülü yıllık aboneliği. Sistem rastgele veriler üreterek gerçekçi bir rapor hazırlar. Aylık ödeme planı ile.', 
  'Otomatik trend analiz raporu oluşturma modülü yıllık aboneliği', 
  (SELECT id FROM product_categories WHERE name = 'Ekipmanlar' LIMIT 1), 
  'SUB-AUTO-TREND-ANNUAL', 
  179.90, 
  999, 
  true, 
  true, 
  'monthly', 
  '{"billingCycle": "monthly", "totalMonths": 12, "features": ["Otomatik veri üretimi", "Özelleştirilebilir ekipman türleri", "Çoklu ziyaret tarihi", "Görsel grafikler", "PDF ve JPEG çıktı", "Hızlı rapor oluşturma"]}',
  10
),
-- Training Presentation Module
(
  'Eğitim Sunumu Modülü - Yıllık Abonelik', 
  'Zararlı mücadelesi konusunda profesyonel eğitim sunumları hazırlama modülü yıllık aboneliği. BRC, AIB, HACCP ve ISO 22000 gibi standartlar için hazır şablonlar. Aylık ödeme planı ile.', 
  'Eğitim sunumu hazırlama modülü yıllık aboneliği', 
  (SELECT id FROM product_categories WHERE name = 'Ekipmanlar' LIMIT 1), 
  'SUB-PRES-ANNUAL', 
  109.90, 
  999, 
  true, 
  true, 
  'monthly', 
  '{"billingCycle": "monthly", "totalMonths": 12, "features": ["Hazır sunum şablonları", "Standart bazlı içerikler", "Firma logosu ekleme", "Tam ekran sunum modu", "PDF formatında indirme", "Sunum kaydetme"]}',
  10
),
-- Training Certificate Module
(
  'Eğitim Sertifikası Modülü - Yıllık Abonelik', 
  'Eğitim katılımcıları için profesyonel sertifikalar oluşturma modülü yıllık aboneliği. Otomatik numaralandırma, logo ekleme ve toplu sertifika oluşturma özellikleri. Aylık ödeme planı ile.', 
  'Eğitim sertifikası oluşturma modülü yıllık aboneliği', 
  (SELECT id FROM product_categories WHERE name = 'Ekipmanlar' LIMIT 1), 
  'SUB-CERT-ANNUAL', 
  99.90, 
  999, 
  true, 
  true, 
  'monthly', 
  '{"billingCycle": "monthly", "totalMonths": 12, "features": ["Otomatik numaralandırma", "Firma logosu ekleme", "Toplu sertifika oluşturma", "JPEG formatında indirme", "Sertifika kaydetme", "Profesyonel tasarım"]}',
  10
),
-- Quote Generator Module
(
  'Fiyat Teklifi Modülü - Yıllık Abonelik', 
  'Müşterileriniz için profesyonel fiyat teklifleri oluşturma modülü yıllık aboneliği. Özelleştirilebilir şablonlar, farklı KDV oranları ve logo ekleme özellikleri. Aylık ödeme planı ile.', 
  'Fiyat teklifi oluşturma modülü yıllık aboneliği', 
  (SELECT id FROM product_categories WHERE name = 'Ekipmanlar' LIMIT 1), 
  'SUB-QUOTE-ANNUAL', 
  119.90, 
  999, 
  true, 
  true, 
  'monthly', 
  '{"billingCycle": "monthly", "totalMonths": 12, "features": ["Özelleştirilebilir teklif şablonu", "Farklı KDV oranları", "Firma logosu ekleme", "PDF formatında indirme", "Hazır hizmet şablonları", "Profesyonel görünüm"]}',
  10
);