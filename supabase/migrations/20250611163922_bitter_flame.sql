/*
  # Create system_settings table for application settings

  1. New Tables
    - `system_settings` - Stores application settings
      - `id` (uuid, primary key)
      - `key` (text, unique, not null) - Setting key
      - `value` (text, not null) - Setting value
      - `description` (text) - Setting description
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
  
  2. Security
    - Enable RLS on `system_settings` table
    - Add policies for authenticated users to manage settings
  
  3. Initial Data
    - Add initial modules_password setting
*/

-- Create system_settings table
CREATE TABLE IF NOT EXISTS system_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Authenticated users can select system settings"
  ON system_settings
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert system settings"
  ON system_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update system settings"
  ON system_settings
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete system settings"
  ON system_settings
  FOR DELETE
  TO authenticated
  USING (true);

-- Create updated_at trigger
CREATE TRIGGER update_system_settings_updated_at
  BEFORE UPDATE ON system_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert initial modules password
INSERT INTO system_settings (key, value, description)
VALUES ('modules_password', 'pestmentor2025', 'Password for accessing modules page')
ON CONFLICT (key) DO NOTHING;