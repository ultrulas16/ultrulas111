/*
  # Add pest_types column to visit_calendar_visits table

  1. Changes
    - Add `pest_types` column to `visit_calendar_visits` table as text array
    - This column will store the types of pests being monitored/treated during visits

  2. Security
    - No RLS changes needed as existing policies will cover the new column
*/

-- Add pest_types column to visit_calendar_visits table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'visit_calendar_visits' AND column_name = 'pest_types'
  ) THEN
    ALTER TABLE visit_calendar_visits ADD COLUMN pest_types text[];
  END IF;
END $$;