/*
  # Email Campaigns Module Schema

  1. New Tables
    - `email_templates` - Stores email templates
    - `email_campaigns` - Stores email campaigns
    - `smtp_settings` - Stores SMTP server settings
    - `recipient_groups` - Stores recipient groups
    - `campaign_analytics` - Stores campaign analytics data
  
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage data
*/

-- Create email_templates table
CREATE TABLE IF NOT EXISTS email_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  subject text NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create email_campaigns table
CREATE TABLE IF NOT EXISTS email_campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  subject text NOT NULL,
  content text NOT NULL,
  recipient_group text NOT NULL,
  status text NOT NULL CHECK (status IN ('draft', 'scheduled', 'sent', 'failed')),
  scheduled_at timestamptz,
  sent_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  recipient_count integer DEFAULT 0,
  open_count integer DEFAULT 0,
  click_count integer DEFAULT 0
);

-- Create smtp_settings table
CREATE TABLE IF NOT EXISTS smtp_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  host text NOT NULL,
  port integer NOT NULL,
  username text NOT NULL,
  password text NOT NULL,
  from_email text NOT NULL,
  from_name text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create recipient_groups table
CREATE TABLE IF NOT EXISTS recipient_groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create campaign_analytics table
CREATE TABLE IF NOT EXISTS campaign_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid REFERENCES email_campaigns(id) ON DELETE CASCADE,
  recipient_email text NOT NULL,
  opened boolean DEFAULT false,
  opened_at timestamptz,
  clicked boolean DEFAULT false,
  clicked_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE smtp_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipient_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_analytics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for email_templates
CREATE POLICY "Authenticated users can select email_templates"
  ON email_templates
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert email_templates"
  ON email_templates
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update email_templates"
  ON email_templates
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete email_templates"
  ON email_templates
  FOR DELETE
  TO authenticated
  USING (true);

-- Create RLS policies for email_campaigns
CREATE POLICY "Authenticated users can select email_campaigns"
  ON email_campaigns
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert email_campaigns"
  ON email_campaigns
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update email_campaigns"
  ON email_campaigns
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete email_campaigns"
  ON email_campaigns
  FOR DELETE
  TO authenticated
  USING (true);

-- Create RLS policies for smtp_settings
CREATE POLICY "Authenticated users can select smtp_settings"
  ON smtp_settings
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert smtp_settings"
  ON smtp_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update smtp_settings"
  ON smtp_settings
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete smtp_settings"
  ON smtp_settings
  FOR DELETE
  TO authenticated
  USING (true);

-- Create RLS policies for recipient_groups
CREATE POLICY "Authenticated users can select recipient_groups"
  ON recipient_groups
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert recipient_groups"
  ON recipient_groups
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update recipient_groups"
  ON recipient_groups
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete recipient_groups"
  ON recipient_groups
  FOR DELETE
  TO authenticated
  USING (true);

-- Create RLS policies for campaign_analytics
CREATE POLICY "Authenticated users can select campaign_analytics"
  ON campaign_analytics
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert campaign_analytics"
  ON campaign_analytics
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update campaign_analytics"
  ON campaign_analytics
  FOR UPDATE
  TO authenticated
  USING (true);

-- Create updated_at triggers
CREATE TRIGGER update_email_campaigns_updated_at
  BEFORE UPDATE ON email_campaigns
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_smtp_settings_updated_at
  BEFORE UPDATE ON smtp_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_recipient_groups_updated_at
  BEFORE UPDATE ON recipient_groups
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample recipient groups
INSERT INTO recipient_groups (name, description, count)
VALUES 
('Tüm Müşteriler', 'Sistemdeki tüm müşteriler', 1230),
('Aktif Müşteriler', 'Son 6 ayda hizmet alan müşteriler', 450),
('Potansiyel Müşteriler', 'Keşif talebi gönderen ancak henüz hizmet almayan müşteriler', 320),
('Kurumsal Müşteriler', 'Kurumsal müşteriler', 180);