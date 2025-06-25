/*
  # Create equipment_layouts table

  1. New Tables
    - `equipment_layouts`
      - `id` (uuid, primary key)
      - `name` (text, required) - Name of the layout/sketch
      - `client_company_name` (text, required) - Client company name
      - `client_address` (text, optional) - Client address
      - `layout_json` (jsonb, optional) - JSON data containing equipment positions and settings
      - `exported_image_url` (text, optional) - URL to the exported layout image
      - `created_at` (timestamp) - Creation timestamp
      - `updated_at` (timestamp) - Last update timestamp

  2. Security
    - Enable RLS on `equipment_layouts` table
    - Add policy for authenticated users to manage their layouts
    - Add policy for authenticated users to read all layouts

  3. Storage
    - Assumes 'layouts' storage bucket exists for storing layout images
*/

CREATE TABLE IF NOT EXISTS equipment_layouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  client_company_name text NOT NULL,
  client_address text,
  layout_json jsonb,
  exported_image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE equipment_layouts ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read all equipment layouts
CREATE POLICY "Authenticated users can read equipment layouts"
  ON equipment_layouts
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated users to insert equipment layouts
CREATE POLICY "Authenticated users can insert equipment layouts"
  ON equipment_layouts
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow authenticated users to update equipment layouts
CREATE POLICY "Authenticated users can update equipment layouts"
  ON equipment_layouts
  FOR UPDATE
  TO authenticated
  USING (true);

-- Allow authenticated users to delete equipment layouts
CREATE POLICY "Authenticated users can delete equipment layouts"
  ON equipment_layouts
  FOR DELETE
  TO authenticated
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_equipment_layouts_created_at ON equipment_layouts(created_at);
CREATE INDEX IF NOT EXISTS idx_equipment_layouts_client_company ON equipment_layouts(client_company_name);

-- Create trigger to automatically update the updated_at column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.triggers 
    WHERE trigger_name = 'update_equipment_layouts_updated_at'
  ) THEN
    CREATE TRIGGER update_equipment_layouts_updated_at
      BEFORE UPDATE ON equipment_layouts
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;