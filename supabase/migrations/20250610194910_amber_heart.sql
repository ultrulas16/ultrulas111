/*
  # Create trend_analysis_reports table

  1. New Tables
    - `trend_analysis_reports` - Stores generated trend analysis reports
      - `id` (uuid, primary key)
      - `company_name` (text)
      - `customer_name` (text)
      - `report_url` (text)
      - `report_date` (timestamp)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
  
  2. Security
    - Enable RLS on `trend_analysis_reports` table
    - Add policies for authenticated users to manage reports
*/

-- Create trend_analysis_reports table
CREATE TABLE IF NOT EXISTS trend_analysis_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name text NOT NULL,
  customer_name text NOT NULL,
  report_url text NOT NULL,
  report_date timestamp with time zone NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE trend_analysis_reports ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Authenticated users can insert trend analysis reports"
  ON trend_analysis_reports
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can select trend analysis reports"
  ON trend_analysis_reports
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update trend analysis reports"
  ON trend_analysis_reports
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete trend analysis reports"
  ON trend_analysis_reports
  FOR DELETE
  TO authenticated
  USING (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_trend_analysis_reports_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER update_trend_analysis_reports_updated_at
BEFORE UPDATE ON trend_analysis_reports
FOR EACH ROW
EXECUTE FUNCTION update_trend_analysis_reports_updated_at();

-- Create the trend_analysis folder in the documents bucket
INSERT INTO storage.objects (bucket_id, name, owner, metadata)
VALUES ('documents', 'trend_analysis/.emptyFolderPlaceholder', auth.uid(), '{"contentType": "text/plain"}')
ON CONFLICT (bucket_id, name) DO NOTHING;