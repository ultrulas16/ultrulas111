/*
  # Create recipients table for email campaigns

  1. New Tables
    - `recipients` - Stores email recipients
      - `id` (uuid, primary key)
      - `group_id` (uuid, references recipient_groups)
      - `name` (text, not null)
      - `email` (text, not null)
      - `phone` (text)
      - `company` (text)
      - `created_at` (timestamptz, default: now())
  
  2. Security
    - Enable RLS on `recipients` table
    - Add policies for authenticated users to manage recipients
*/

-- Create recipients table
CREATE TABLE IF NOT EXISTS recipients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid REFERENCES recipient_groups(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  company text,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE recipients ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Authenticated users can select recipients"
  ON recipients
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert recipients"
  ON recipients
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update recipients"
  ON recipients
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete recipients"
  ON recipients
  FOR DELETE
  TO authenticated
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_recipients_group_id ON recipients(group_id);
CREATE INDEX IF NOT EXISTS idx_recipients_email ON recipients(email);

-- Add email validation constraint
ALTER TABLE recipients 
ADD CONSTRAINT valid_recipient_email_format 
CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');