/*
  # Fix quotes table migration to avoid policy conflicts

  1. Changes
    - Create quotes table if it doesn't exist
    - Add logo_url column
    - Set up RLS policies only if they don't exist
    - Create storage folders for quotes
  
  2. Purpose
    - Avoid policy conflicts by checking if they already exist
    - Ensure all necessary structure is in place for quotes module
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
  logo_url text,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'accepted', 'rejected', 'expired')),
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;

-- Make created_by column nullable to support anonymous users
ALTER TABLE quotes ALTER COLUMN created_by DROP NOT NULL;

-- Check if policies already exist before creating them
DO $$
BEGIN
    -- Check and create "Anyone can insert quotes" policy
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'quotes' 
        AND policyname = 'Anyone can insert quotes'
    ) THEN
        CREATE POLICY "Anyone can insert quotes"
          ON quotes
          FOR INSERT
          TO anon, authenticated
          WITH CHECK (true);
    END IF;

    -- Check and create "Authenticated users can select quotes" policy
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'quotes' 
        AND policyname = 'Authenticated users can select quotes'
    ) THEN
        CREATE POLICY "Authenticated users can select quotes"
          ON quotes
          FOR SELECT
          TO authenticated
          USING (true);
    END IF;

    -- Check and create "Authenticated users can update quotes" policy
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'quotes' 
        AND policyname = 'Authenticated users can update quotes'
    ) THEN
        CREATE POLICY "Authenticated users can update quotes"
          ON quotes
          FOR UPDATE
          TO authenticated
          USING (true);
    END IF;

    -- Check and create "Authenticated users can delete quotes" policy
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'quotes' 
        AND policyname = 'Authenticated users can delete quotes'
    ) THEN
        CREATE POLICY "Authenticated users can delete quotes"
          ON quotes
          FOR DELETE
          TO authenticated
          USING (true);
    END IF;
END $$;

-- Create updated_at trigger if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_quotes_updated_at'
  ) THEN
    CREATE TRIGGER update_quotes_updated_at
      BEFORE UPDATE ON quotes
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    NULL; -- Ignore errors
END $$;

-- Create the quotes folder in the documents bucket
DO $$
BEGIN
  INSERT INTO storage.objects (bucket_id, name, owner, metadata)
  VALUES ('documents', 'quotes/.emptyFolderPlaceholder', auth.uid(), '{"contentType": "text/plain"}')
  ON CONFLICT (bucket_id, name) DO NOTHING;
EXCEPTION
  WHEN OTHERS THEN
    NULL; -- Ignore errors
END $$;

-- Create the quotes/logos folder in the documents bucket
DO $$
BEGIN
  INSERT INTO storage.objects (bucket_id, name, owner, metadata)
  VALUES ('documents', 'quotes/logos/.emptyFolderPlaceholder', auth.uid(), '{"contentType": "text/plain"}')
  ON CONFLICT (bucket_id, name) DO NOTHING;
EXCEPTION
  WHEN OTHERS THEN
    NULL; -- Ignore errors
END $$;