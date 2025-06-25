/*
  # Risk Assessments Table

  1. New Tables
    - `risk_assessments`
      - `id` (uuid, primary key)
      - `assessor_company` (text, not null)
      - `assessor_name` (text, not null)
      - `client_company` (text, not null)
      - `client_name` (text, not null)
      - `assessment_date` (date, not null)
      - `property_type` (text, not null)
      - `rodent_risk` (text, not null)
      - `insect_risk` (text, not null)
      - `bird_risk` (text, not null)
      - `other_risk` (text, not null)
      - `report_url` (text, not null)
      - `created_at` (timestamptz, default now())
  
  2. Security
    - Enable RLS on `risk_assessments` table
    - Add policy for anonymous users to create risk assessments
    - Add policy for authenticated users to read all risk assessments
*/

-- Risk değerlendirme tablosu oluştur
CREATE TABLE IF NOT EXISTS risk_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assessor_company text NOT NULL,
  assessor_name text NOT NULL,
  client_company text NOT NULL,
  client_name text NOT NULL,
  assessment_date date NOT NULL,
  property_type text NOT NULL,
  rodent_risk text NOT NULL,
  insect_risk text NOT NULL,
  bird_risk text NOT NULL,
  other_risk text NOT NULL,
  report_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- RLS etkinleştir
ALTER TABLE risk_assessments ENABLE ROW LEVEL SECURITY;

-- Herkes risk değerlendirmesi oluşturabilir (anonim dahil)
CREATE POLICY "Anyone can create risk assessments"
  ON risk_assessments
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Sadece authenticated kullanıcılar risk değerlendirmelerini okuyabilir
CREATE POLICY "Authenticated users can read all risk assessments"
  ON risk_assessments
  FOR SELECT
  TO authenticated
  USING (true);

-- İndeksler oluştur
CREATE INDEX IF NOT EXISTS idx_risk_assessments_assessor_company ON risk_assessments(assessor_company);
CREATE INDEX IF NOT EXISTS idx_risk_assessments_client_company ON risk_assessments(client_company);
CREATE INDEX IF NOT EXISTS idx_risk_assessments_created_at ON risk_assessments(created_at);