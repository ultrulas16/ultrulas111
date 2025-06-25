/*
  # Keşif Talepleri Tablosu

  1. Yeni Tablo
    - `discovery_requests`
      - `id` (uuid, primary key)
      - `name` (text, müşteri adı)
      - `email` (text, e-posta)
      - `phone` (text, telefon)
      - `service_type` (text, hizmet türü)
      - `property_type` (text, mekan türü)
      - `message` (text, mesaj)
      - `preferred_time` (text, tercih edilen zaman)
      - `status` (text, talep durumu)
      - `priority` (text, öncelik seviyesi)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Güvenlik
    - RLS etkin
    - Sadece authenticated kullanıcılar okuyabilir
    - Herkes talep oluşturabilir (anonim)
*/

-- Keşif talepleri tablosu oluştur
CREATE TABLE IF NOT EXISTS discovery_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text,
  phone text NOT NULL,
  service_type text,
  property_type text,
  message text NOT NULL,
  preferred_time text,
  status text DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'scheduled', 'completed', 'cancelled')),
  priority text DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  city text,
  district text,
  address text,
  company_name text,
  source text DEFAULT 'website',
  notes text,
  assigned_to uuid,
  scheduled_date timestamptz,
  completed_date timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- RLS etkinleştir
ALTER TABLE discovery_requests ENABLE ROW LEVEL SECURITY;

-- Herkes talep oluşturabilir (anonim dahil)
CREATE POLICY "Anyone can create discovery requests"
  ON discovery_requests
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Sadece authenticated kullanıcılar talepleri okuyabilir
CREATE POLICY "Authenticated users can read discovery requests"
  ON discovery_requests
  FOR SELECT
  TO authenticated
  USING (true);

-- Sadece authenticated kullanıcılar talepleri güncelleyebilir
CREATE POLICY "Authenticated users can update discovery requests"
  ON discovery_requests
  FOR UPDATE
  TO authenticated
  USING (true);

-- Updated_at otomatik güncelleme fonksiyonu
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Updated_at trigger'ı ekle
CREATE TRIGGER update_discovery_requests_updated_at
  BEFORE UPDATE ON discovery_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- İndeksler oluştur
CREATE INDEX IF NOT EXISTS idx_discovery_requests_status ON discovery_requests(status);
CREATE INDEX IF NOT EXISTS idx_discovery_requests_priority ON discovery_requests(priority);
CREATE INDEX IF NOT EXISTS idx_discovery_requests_created_at ON discovery_requests(created_at);
CREATE INDEX IF NOT EXISTS idx_discovery_requests_city ON discovery_requests(city);
CREATE INDEX IF NOT EXISTS idx_discovery_requests_service_type ON discovery_requests(service_type);