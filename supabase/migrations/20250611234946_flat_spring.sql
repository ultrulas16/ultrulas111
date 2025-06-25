/*
  # Create quotes table and set up RLS policies

  1. New Tables
    - `quotes` - Stores price quotes
      - `id` (uuid, primary key)
      - `quote_number` (text, not null)
      - `client_name` (text, not null)
      - `client_email` (text)
      - `client_phone` (text, not null)
      - `client_address` (text)
      - `company_name` (text)
      - `quote_date` (date, not null)
      - `valid_until` (date, not null)
      - `items` (jsonb, not null) - Array of quote items with services
      - `subtotal` (numeric, not null)
      - `tax_amount` (numeric, not null)
      - `total_amount` (numeric, not null)
      - `notes` (text)
      - `terms` (text)
      - `status` (text, default: 'draft')
      - `created_by` (uuid) - Reference to auth.users
      - `created_at` (timestamptz, default: now())
      - `updated_at` (timestamptz, default: now())
  
  2. Security
    - Enable RLS on `quotes` table
    - Add policies for authenticated and anonymous users
*/

-- Create quotes table if it doesn't exist
CREATE TABLE IF NOT EXISTS quotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_number text NOT NULL,
  client_name text NOT NULL,
  client_email text,
  client_phone text NOT NULL,
  client_address text,
  company_name text,
  quote_date date NOT NULL,
  valid_until date NOT NULL,
  items jsonb NOT NULL,
  subtotal numeric(10,2) NOT NULL,
  tax_amount numeric(10,2) NOT NULL,
  total_amount numeric(10,2) NOT NULL,
  notes text,
  terms text,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'accepted', 'rejected', 'expired')),
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Anyone can insert quotes"
  ON quotes
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can select quotes"
  ON quotes
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update quotes"
  ON quotes
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete quotes"
  ON quotes
  FOR DELETE
  TO authenticated
  USING (true);

-- Make created_by column nullable to support anonymous users
ALTER TABLE quotes ALTER COLUMN created_by DROP NOT NULL;

-- Create updated_at trigger
CREATE TRIGGER update_quotes_updated_at
  BEFORE UPDATE ON quotes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create sequence for quote numbers if it doesn't exist
CREATE SEQUENCE IF NOT EXISTS quote_number_seq START 1;

-- Create function to generate quote numbers
CREATE OR REPLACE FUNCTION generate_quote_number()
RETURNS text AS $$
BEGIN
  RETURN 'TEK-' || TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || '-' || LPAD(nextval('quote_number_seq')::text, 3, '0');
END;
$$ LANGUAGE plpgsql;