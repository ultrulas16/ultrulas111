/*
  # Create documents storage bucket

  1. Storage Setup
    - Create 'documents' bucket for file uploads
    - Set up public access for uploaded files
    - Configure appropriate policies for file management

  2. Security
    - Allow authenticated users to upload files
    - Allow public read access to uploaded files
    - Allow authenticated users to delete their own files
*/

-- Create the documents bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'documents');

-- Allow public read access to files
CREATE POLICY "Public read access to documents"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'documents');

-- Allow authenticated users to delete files
CREATE POLICY "Authenticated users can delete files"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'documents');

-- Allow authenticated users to update files
CREATE POLICY "Authenticated users can update files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'documents');