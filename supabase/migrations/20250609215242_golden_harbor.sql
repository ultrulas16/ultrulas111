/*
  # Döküman Yönetim Sistemi

  1. Yeni Tablolar
    - `documents`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `category` (text)
      - `file_name` (text)
      - `file_url` (text)
      - `file_size` (bigint)
      - `file_type` (text)
      - `is_active` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Güvenlik
    - RLS etkinleştirildi
    - Public kullanıcılar sadece aktif dökümanları okuyabilir
    - Authenticated kullanıcılar tüm CRUD işlemlerini yapabilir
*/

-- Dökümanlar tablosu oluştur
CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  category text NOT NULL CHECK (category IN (
    'firma_belgeleri',
    'sertifikalar',
    'kalite_belgeleri',
    'msds',
    'ruhsatlar'
  )),
  file_name text NOT NULL,
  file_url text NOT NULL,
  file_size bigint,
  file_type text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- RLS etkinleştir
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Public kullanıcılar sadece aktif dökümanları okuyabilir
CREATE POLICY "Anyone can read active documents"
  ON documents
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- Authenticated kullanıcılar tüm dökümanları okuyabilir
CREATE POLICY "Authenticated users can read all documents"
  ON documents
  FOR SELECT
  TO authenticated
  USING (true);

-- Authenticated kullanıcılar döküman ekleyebilir
CREATE POLICY "Authenticated users can insert documents"
  ON documents
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Authenticated kullanıcılar döküman güncelleyebilir
CREATE POLICY "Authenticated users can update documents"
  ON documents
  FOR UPDATE
  TO authenticated
  USING (true);

-- Authenticated kullanıcılar döküman silebilir
CREATE POLICY "Authenticated users can delete documents"
  ON documents
  FOR DELETE
  TO authenticated
  USING (true);

-- Updated_at otomatik güncelleme trigger'ı
CREATE TRIGGER update_documents_updated_at
  BEFORE UPDATE ON documents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- İndeksler oluştur
CREATE INDEX IF NOT EXISTS idx_documents_category ON documents(category);
CREATE INDEX IF NOT EXISTS idx_documents_is_active ON documents(is_active);
CREATE INDEX IF NOT EXISTS idx_documents_created_at ON documents(created_at);