/*
  # Create page_visits table for visitor analytics

  1. New Tables
    - `page_visits` - Stores website visitor data
      - `id` (uuid, primary key)
      - `page_url` (text, not null)
      - `referrer` (text)
      - `user_agent` (text)
      - `ip_address` (text)
      - `country` (text)
      - `city` (text)
      - `device_type` (text)
      - `browser` (text)
      - `visit_duration` (integer)
      - `created_at` (timestamptz, default: now())
  
  2. Security
    - Enable RLS on `page_visits` table
    - Add policies for anonymous users to insert visits
    - Add policies for authenticated users to read all visits
*/

-- Create page_visits table
CREATE TABLE IF NOT EXISTS page_visits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_url text NOT NULL,
  referrer text,
  user_agent text,
  ip_address text,
  country text,
  city text,
  device_type text,
  browser text,
  visit_duration integer,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE page_visits ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Allow anonymous users to insert visits
CREATE POLICY "Anonymous users can insert page visits"
  ON page_visits
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow authenticated users to insert visits
CREATE POLICY "Authenticated users can insert page visits"
  ON page_visits
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow authenticated users to read all visits
CREATE POLICY "Authenticated users can read page visits"
  ON page_visits
  FOR SELECT
  TO authenticated
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_page_visits_page_url ON page_visits(page_url);
CREATE INDEX IF NOT EXISTS idx_page_visits_created_at ON page_visits(created_at);
CREATE INDEX IF NOT EXISTS idx_page_visits_country ON page_visits(country);
CREATE INDEX IF NOT EXISTS idx_page_visits_device_type ON page_visits(device_type);
CREATE INDEX IF NOT EXISTS idx_page_visits_browser ON page_visits(browser);