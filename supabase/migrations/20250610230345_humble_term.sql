/*
  # Add logo_url column to trend_analysis_reports table

  1. Changes
    - Add logo_url column to trend_analysis_reports table
  
  2. Purpose
    - Store the URL of the company logo for trend analysis reports
*/

-- Add logo_url column to trend_analysis_reports table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'trend_analysis_reports' AND column_name = 'logo_url'
  ) THEN
    ALTER TABLE trend_analysis_reports ADD COLUMN logo_url text;
  END IF;
END $$;

-- Create the logos folder in the trend_analysis directory
INSERT INTO storage.objects (bucket_id, name, owner, metadata)
VALUES ('documents', 'trend_analysis/logos/.emptyFolderPlaceholder', auth.uid(), '{"contentType": "text/plain"}')
ON CONFLICT (bucket_id, name) DO NOTHING;