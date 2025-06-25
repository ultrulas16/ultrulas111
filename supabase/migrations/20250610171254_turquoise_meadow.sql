/*
  # Create layouts storage bucket

  1. Storage Setup
    - Create 'layouts' bucket for storing equipment layout images
    - Configure bucket to be publicly accessible
    - Set up RLS policies for bucket access

  2. Security
    - Allow authenticated users to upload images
    - Allow public read access to images
    - Prevent unauthorized deletions
*/

-- Create the layouts bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('layouts', 'layouts', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload files to the layouts bucket
CREATE POLICY "Authenticated users can upload layout images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'layouts');

-- Allow public read access to layout images
CREATE POLICY "Public can view layout images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'layouts');

-- Allow authenticated users to update their uploaded files
CREATE POLICY "Authenticated users can update layout images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'layouts');

-- Allow authenticated users to delete layout images
CREATE POLICY "Authenticated users can delete layout images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'layouts');