/*
  # İletişim Mesajları Tablosu

  1. Yeni Tablo
    - `contact_messages`
      - `id` (uuid, primary key)
      - `name` (text, zorunlu)
      - `email` (text, zorunlu)
      - `phone` (text, opsiyonel)
      - `subject` (text, opsiyonel)
      - `message` (text, zorunlu)
      - `company_name` (text, opsiyonel)
      - `website` (text, opsiyonel)
      - `contact_reason` (text, opsiyonel)
      - `preferred_contact_method` (text, opsiyonel)
      - `status` (text, varsayılan: 'new')
      - `priority` (text, varsayılan: 'normal')
      - `source` (text, varsayılan: 'website')
      - `ip_address` (text, opsiyonel)
      - `user_agent` (text, opsiyonel)
      - `assigned_to` (uuid, opsiyonel)
      - `response_sent` (boolean, varsayılan: false)
      - `response_date` (timestamptz, opsiyonel)
      - `notes` (text, opsiyonel)
      - `created_at` (timestamptz, varsayılan: now())
      - `updated_at` (timestamptz, varsayılan: now())

  2. Güvenlik
    - RLS etkin
    - Herkes mesaj gönderebilir (anonim dahil)
    - Sadece authenticated kullanıcılar mesajları okuyabilir
    - Sadece authenticated kullanıcılar mesajları güncelleyebilir

  3. İndeksler
    - Durum, öncelik, tarih, iletişim nedeni için indeksler
*/

-- İletişim mesajları tablosu oluştur
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  subject text,
  message text NOT NULL,
  company_name text,
  website text,
  contact_reason text CHECK (contact_reason IN (
    'general_inquiry',
    'service_request', 
    'quote_request',
    'complaint',
    'partnership',
    'career',
    'technical_support',
    'billing',
    'other'
  )),
  preferred_contact_method text CHECK (preferred_contact_method IN (
    'email',
    'phone',
    'whatsapp',
    'no_preference'
  )) DEFAULT 'email',
  status text DEFAULT 'new' CHECK (status IN (
    'new',
    'read',
    'in_progress', 
    'responded',
    'resolved',
    'closed',
    'spam'
  )),
  priority text DEFAULT 'normal' CHECK (priority IN (
    'low',
    'normal', 
    'high',
    'urgent'
  )),
  source text DEFAULT 'website' CHECK (source IN (
    'website',
    'mobile_app',
    'social_media',
    'email',
    'phone',
    'referral',
    'other'
  )),
  ip_address text,
  user_agent text,
  assigned_to uuid,
  response_sent boolean DEFAULT false,
  response_date timestamptz,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- RLS etkinleştir
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Herkes mesaj gönderebilir (anonim dahil)
CREATE POLICY "Anyone can create contact messages"
  ON contact_messages
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Sadece authenticated kullanıcılar mesajları okuyabilir
CREATE POLICY "Authenticated users can read contact messages"
  ON contact_messages
  FOR SELECT
  TO authenticated
  USING (true);

-- Sadece authenticated kullanıcılar mesajları güncelleyebilir
CREATE POLICY "Authenticated users can update contact messages"
  ON contact_messages
  FOR UPDATE
  TO authenticated
  USING (true);

-- Updated_at otomatik güncelleme trigger'ı (eğer yoksa)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_proc WHERE proname = 'update_updated_at_column'
  ) THEN
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $func$
    BEGIN
      NEW.updated_at = now();
      RETURN NEW;
    END;
    $func$ language 'plpgsql';
  END IF;
END $$;

-- Updated_at trigger'ı ekle
CREATE TRIGGER update_contact_messages_updated_at
  BEFORE UPDATE ON contact_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- İndeksler oluştur
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_priority ON contact_messages(priority);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_contact_messages_contact_reason ON contact_messages(contact_reason);
CREATE INDEX IF NOT EXISTS idx_contact_messages_email ON contact_messages(email);
CREATE INDEX IF NOT EXISTS idx_contact_messages_assigned_to ON contact_messages(assigned_to);
CREATE INDEX IF NOT EXISTS idx_contact_messages_response_sent ON contact_messages(response_sent);

-- E-posta doğrulama için basit check constraint
ALTER TABLE contact_messages 
ADD CONSTRAINT valid_email_format 
CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- Telefon numarası temizleme için basit check (opsiyonel)
ALTER TABLE contact_messages 
ADD CONSTRAINT valid_phone_format 
CHECK (phone IS NULL OR phone ~ '^[\+]?[0-9\s\-\(\)]{10,20}$');