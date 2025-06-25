/*
  # Create compliance_checks table

  1. New Tables
    - `compliance_checks`
      - `id` (uuid, primary key)
      - `assessor_company` (text)
      - `assessor_name` (text)
      - `client_company` (text)
      - `client_name` (text)
      - `assessment_date` (date)
      - `property_type` (text)
      - `standard` (text)
      - `compliance_items` (jsonb)
      - `notes` (text)
      - `score` (integer)
      - `report_url` (text)
      - `created_at` (timestamptz)
  2. Security
    - Enable RLS on `compliance_checks` table
    - Add policies for authenticated and anonymous users
*/

-- Create compliance_checks table
CREATE TABLE IF NOT EXISTS compliance_checks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assessor_company text NOT NULL,
  assessor_name text NOT NULL,
  client_company text NOT NULL,
  client_name text NOT NULL,
  assessment_date date NOT NULL,
  property_type text NOT NULL,
  standard text NOT NULL,
  compliance_items jsonb NOT NULL,
  notes text,
  score integer NOT NULL,
  report_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE compliance_checks ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Authenticated users can insert compliance checks"
  ON compliance_checks
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can select compliance checks"
  ON compliance_checks
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update compliance checks"
  ON compliance_checks
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete compliance checks"
  ON compliance_checks
  FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Anonymous users can insert compliance checks"
  ON compliance_checks
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Create the compliance_checks folder in the documents bucket
INSERT INTO storage.objects (bucket_id, name, owner, metadata)
VALUES ('documents', 'compliance_checks/.emptyFolderPlaceholder', auth.uid(), '{"contentType": "text/plain"}')
ON CONFLICT (bucket_id, name) DO NOTHING;