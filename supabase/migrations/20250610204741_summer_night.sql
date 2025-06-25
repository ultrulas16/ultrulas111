/*
  # Create visit_equipment_data table for Trend Analysis Module

  1. New Tables
    - `visit_equipment_data` - Stores equipment inspection data for trend analysis
      - `id` (uuid, primary key)
      - `trend_analysis_report_id` (uuid, foreign key)
      - `visit_date` (timestamptz, not null)
      - `equipment_id` (uuid)
      - `equipment_type` (text, not null)
      - `equipment_location` (text, not null)
      - `activity_level` (text, not null)
      - `rodent_count` (integer)
      - `cockroach_count` (integer)
      - `ant_count` (integer)
      - `other_pest_count` (integer)
      - `notes` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
  
  2. Security
    - Enable RLS on `visit_equipment_data` table
    - Add policies for authenticated users to manage data
*/

-- Create visit_equipment_data table
CREATE TABLE IF NOT EXISTS visit_equipment_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trend_analysis_report_id uuid REFERENCES trend_analysis_reports(id) ON DELETE CASCADE,
  visit_date timestamptz NOT NULL,
  equipment_id uuid,
  equipment_type text NOT NULL,
  equipment_location text NOT NULL,
  activity_level text NOT NULL CHECK (activity_level IN ('Aktivite Var', 'Aktivite Yok')),
  rodent_count integer,
  cockroach_count integer,
  ant_count integer,
  other_pest_count integer,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE visit_equipment_data ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Authenticated users can insert visit equipment data"
  ON visit_equipment_data
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can select visit equipment data"
  ON visit_equipment_data
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update visit equipment data"
  ON visit_equipment_data
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete visit equipment data"
  ON visit_equipment_data
  FOR DELETE
  TO authenticated
  USING (true);

-- Create updated_at trigger
CREATE TRIGGER update_visit_equipment_data_updated_at
  BEFORE UPDATE ON visit_equipment_data
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_visit_equipment_data_report_id ON visit_equipment_data(trend_analysis_report_id);
CREATE INDEX IF NOT EXISTS idx_visit_equipment_data_visit_date ON visit_equipment_data(visit_date);
CREATE INDEX IF NOT EXISTS idx_visit_equipment_data_equipment_type ON visit_equipment_data(equipment_type);
CREATE INDEX IF NOT EXISTS idx_visit_equipment_data_activity_level ON visit_equipment_data(activity_level);

-- Add comments to table and columns for better documentation
COMMENT ON TABLE visit_equipment_data IS 'Stores equipment inspection data for trend analysis reports';
COMMENT ON COLUMN visit_equipment_data.trend_analysis_report_id IS 'Reference to the parent trend analysis report';
COMMENT ON COLUMN visit_equipment_data.visit_date IS 'Date when the equipment was inspected';
COMMENT ON COLUMN visit_equipment_data.equipment_type IS 'Type of equipment (e.g., Kemirgen Yemli Monitör, Canlı Yakalama Monitörü)';
COMMENT ON COLUMN visit_equipment_data.equipment_location IS 'Location of the equipment within the facility';
COMMENT ON COLUMN visit_equipment_data.activity_level IS 'Whether pest activity was detected (Aktivite Var or Aktivite Yok)';
COMMENT ON COLUMN visit_equipment_data.rodent_count IS 'Number of rodents detected (for rodent monitors)';
COMMENT ON COLUMN visit_equipment_data.cockroach_count IS 'Number of cockroaches detected (for live capture monitors)';
COMMENT ON COLUMN visit_equipment_data.ant_count IS 'Number of ants detected (for live capture monitors)';
COMMENT ON COLUMN visit_equipment_data.other_pest_count IS 'Number of other pests detected';