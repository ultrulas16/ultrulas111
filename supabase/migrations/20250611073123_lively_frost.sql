/*
  # Visit Calendar Module Schema

  1. New Tables
    - `visit_calendar_customers` - Stores customer information for visit calendar
    - `visit_calendar_visits` - Stores visit information for customers
  
  2. Security
    - Enable RLS on tables
    - Add policies for authenticated users to manage data
*/

-- Create visit_calendar_customers table
CREATE TABLE IF NOT EXISTS visit_calendar_customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  company_name text NOT NULL,
  address text,
  contact_person text,
  phone text,
  email text,
  contract_type text,
  visit_frequency text NOT NULL CHECK (visit_frequency IN (
    'monthly',
    'bimonthly',
    'quarterly',
    'semiannual',
    'annual',
    'custom'
  )),
  visit_count integer NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create visit_calendar_visits table
CREATE TABLE IF NOT EXISTS visit_calendar_visits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES visit_calendar_customers(id) ON DELETE CASCADE,
  date date NOT NULL,
  visit_type text NOT NULL,
  notes text,
  status text NOT NULL CHECK (status IN (
    'scheduled',
    'completed',
    'cancelled'
  )),
  technicians text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE visit_calendar_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE visit_calendar_visits ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for visit_calendar_customers
CREATE POLICY "Authenticated users can insert visit calendar customers"
  ON visit_calendar_customers
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can select visit calendar customers"
  ON visit_calendar_customers
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update visit calendar customers"
  ON visit_calendar_customers
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete visit calendar customers"
  ON visit_calendar_customers
  FOR DELETE
  TO authenticated
  USING (true);

-- Create RLS policies for visit_calendar_visits
CREATE POLICY "Authenticated users can insert visit calendar visits"
  ON visit_calendar_visits
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can select visit calendar visits"
  ON visit_calendar_visits
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update visit calendar visits"
  ON visit_calendar_visits
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete visit calendar visits"
  ON visit_calendar_visits
  FOR DELETE
  TO authenticated
  USING (true);

-- Create updated_at triggers
CREATE TRIGGER update_visit_calendar_customers_updated_at
  BEFORE UPDATE ON visit_calendar_customers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_visit_calendar_visits_updated_at
  BEFORE UPDATE ON visit_calendar_visits
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_visit_calendar_customers_company_name ON visit_calendar_customers(company_name);
CREATE INDEX IF NOT EXISTS idx_visit_calendar_customers_visit_frequency ON visit_calendar_customers(visit_frequency);
CREATE INDEX IF NOT EXISTS idx_visit_calendar_visits_customer_id ON visit_calendar_visits(customer_id);
CREATE INDEX IF NOT EXISTS idx_visit_calendar_visits_date ON visit_calendar_visits(date);
CREATE INDEX IF NOT EXISTS idx_visit_calendar_visits_status ON visit_calendar_visits(status);