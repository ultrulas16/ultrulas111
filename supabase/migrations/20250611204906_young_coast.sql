/*
  # Create franchise_applications table

  1. New Tables
    - `franchise_applications` - Stores franchise/dealership applications
      - `id` (uuid, primary key)
      - `full_name` (text, not null)
      - `email` (text, not null)
      - `phone` (text, not null)
      - `city` (text, not null)
      - `district` (text)
      - `address` (text)
      - `investment_budget` (text, not null)
      - `business_experience` (text)
      - `current_occupation` (text)
      - `why_interested` (text, not null)
      - `additional_info` (text)
      - `heard_from` (text)
      - `status` (text, default: 'new')
      - `notes` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
  
  2. Security
    - Enable RLS on `franchise_applications` table
    - Add policies for anonymous users to insert applications
    - Add policies for authenticated users to manage applications
*/

-- Create franchise_applications table
CREATE TABLE IF NOT EXISTS franchise_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  city text NOT NULL,
  district text,
  address text,
  investment_budget text NOT NULL,
  business_experience text,
  current_occupation text,
  why_interested text NOT NULL,
  additional_info text,
  heard_from text,
  status text DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'meeting', 'approved', 'rejected')),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE franchise_applications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Anonymous users can insert franchise applications"
  ON franchise_applications
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Authenticated users can insert franchise applications"
  ON franchise_applications
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can select franchise applications"
  ON franchise_applications
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update franchise applications"
  ON franchise_applications
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete franchise applications"
  ON franchise_applications
  FOR DELETE
  TO authenticated
  USING (true);

-- Create updated_at trigger
CREATE TRIGGER update_franchise_applications_updated_at
  BEFORE UPDATE ON franchise_applications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_franchise_applications_status ON franchise_applications(status);
CREATE INDEX IF NOT EXISTS idx_franchise_applications_created_at ON franchise_applications(created_at);
CREATE INDEX IF NOT EXISTS idx_franchise_applications_city ON franchise_applications(city);

-- Add email validation constraint
ALTER TABLE franchise_applications 
ADD CONSTRAINT valid_franchise_email_format 
CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- Add phone validation constraint
ALTER TABLE franchise_applications 
ADD CONSTRAINT valid_franchise_phone_format 
CHECK (phone ~ '^[0-9\s\-\+\(\)]{10,20}$');