/*
  # Add logo_url column to visit_calendar_customers table

  1. Changes
    - Add `logo_url` column to `visit_calendar_customers` table
    - Column will store the URL of uploaded company logos
    - Column is nullable since existing customers may not have logos

  2. Security
    - No changes to RLS policies needed as existing policies cover all columns
*/

-- Add logo_url column to visit_calendar_customers table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'visit_calendar_customers' AND column_name = 'logo_url'
  ) THEN
    ALTER TABLE visit_calendar_customers ADD COLUMN logo_url text;
  END IF;
END $$;