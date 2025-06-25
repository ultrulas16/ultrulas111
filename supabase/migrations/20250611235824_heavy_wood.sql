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
  updated_at timestamptz DEFAULT now(),
  logo_url text
);

-- Enable Row Level Security if not already enabled
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Anyone can insert quotes" ON quotes;
DROP POLICY IF EXISTS "Authenticated users can select quotes" ON quotes;
DROP POLICY IF EXISTS "Authenticated users can update quotes" ON quotes;
DROP POLICY IF EXISTS "Authenticated users can delete quotes" ON quotes;

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
    -- If there's an error, try creating the trigger anyway
    -- This is a fallback in case the IF EXISTS check fails
    BEGIN
      CREATE TRIGGER update_quotes_updated_at
        BEFORE UPDATE ON quotes
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    EXCEPTION
      WHEN OTHERS THEN
        -- Ignore errors here
    END;
END $$;

-- Create the quotes folder in the documents bucket
DO $$
BEGIN
  INSERT INTO storage.objects (bucket_id, name, owner, metadata)
  VALUES ('documents', 'quotes/.emptyFolderPlaceholder', auth.uid(), '{"contentType": "text/plain"}')
  ON CONFLICT (bucket_id, name) DO NOTHING;
EXCEPTION
  WHEN OTHERS THEN
    -- Ignore errors
END $$;

-- Create the quotes/logos folder in the documents bucket
DO $$
BEGIN
  INSERT INTO storage.objects (bucket_id, name, owner, metadata)
  VALUES ('documents', 'quotes/logos/.emptyFolderPlaceholder', auth.uid(), '{"contentType": "text/plain"}')
  ON CONFLICT (bucket_id, name) DO NOTHING;
EXCEPTION
  WHEN OTHERS THEN
    -- Ignore errors
END $$;