/*
  # Add pest_types column to visit_calendar_visits table

  1. Changes
    - Add pest_types column to visit_calendar_visits table
  
  2. Purpose
    - Store the types of pests being treated during each visit
    - Support filtering and reporting by pest type
*/

-- Add pest_types column to visit_calendar_visits table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'visit_calendar_visits' AND column_name = 'pest_types'
  ) THEN
    ALTER TABLE visit_calendar_visits ADD COLUMN pest_types text[];
  END IF;
END $$;