/*
  # Create inspection_reports table

  1. New Tables
    - `inspection_reports`
      - `id` (uuid, primary key)
      - `inspector_company` (text, not null)
      - `inspector_name` (text, not null)
      - `client_company` (text, not null)
      - `client_name` (text, not null)
      - `inspection_date` (date, not null)
      - `property_type` (text, not null)
      - `findings` (jsonb, not null)
      - `recommendations` (text[], not null)
      - `next_inspection_date` (date, not null)
      - `overall_status` (text, not null)
      - `report_url` (text, not null)
      - `created_at` (timestamptz, default now())
  
  2. Security
    - Enable RLS on `inspection_reports` table
    - Add policies for authenticated users to manage inspection reports
    - Add policies for anonymous users to insert inspection reports
*/

-- Create inspection_reports table
CREATE TABLE IF NOT EXISTS inspection_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  inspector_company text NOT NULL,
  inspector_name text NOT NULL,
  client_company text NOT NULL,
  client_name text NOT NULL,
  inspection_date date NOT NULL,
  property_type text NOT NULL,
  findings jsonb NOT NULL,
  recommendations text[] NOT NULL,
  next_inspection_date date NOT NULL,
  overall_status text NOT NULL,
  report_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE inspection_reports ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Authenticated users can insert inspection reports"
  ON inspection_reports
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can select inspection reports"
  ON inspection_reports
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update inspection reports"
  ON inspection_reports
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete inspection reports"
  ON inspection_reports
  FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Anonymous users can insert inspection reports"
  ON inspection_reports
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Create the inspection_reports folder in the documents bucket
INSERT INTO storage.objects (bucket_id, name, owner, metadata)
VALUES ('documents', 'inspection_reports/.emptyFolderPlaceholder', auth.uid(), '{"contentType": "text/plain"}')
ON CONFLICT (bucket_id, name) DO NOTHING;

-- Create the inspection_photos folder in the documents bucket
INSERT INTO storage.objects (bucket_id, name, owner, metadata)
VALUES ('documents', 'inspection_photos/.emptyFolderPlaceholder', auth.uid(), '{"contentType": "text/plain"}')
ON CONFLICT (bucket_id, name) DO NOTHING;