/*
  # Create documents storage bucket and policies

  1. New Storage
    - Creates 'documents' bucket if it doesn't exist
    - Creates placeholder for risk_assessments folder
  
  2. Security
    - Adds policies for authenticated and anonymous users
    - Configures appropriate access permissions for the bucket
*/

-- Create the documents bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', true)
ON CONFLICT (id) DO NOTHING;

-- Create the risk_assessments folder in the documents bucket
INSERT INTO storage.objects (bucket_id, name, owner, metadata)
VALUES ('documents', 'risk_assessments/.emptyFolderPlaceholder', auth.uid(), '{"contentType": "text/plain"}')
ON CONFLICT (bucket_id, name) DO NOTHING;

-- Check if policies already exist before creating them
DO $$
BEGIN
    -- Allow authenticated users to upload files
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE policyname = 'Authenticated users can upload files' 
        AND tablename = 'objects' 
        AND schemaname = 'storage'
    ) THEN
        CREATE POLICY "Authenticated users can upload files"
        ON storage.objects
        FOR INSERT
        TO authenticated
        WITH CHECK (bucket_id = 'documents');
    END IF;

    -- Allow public read access to files
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE policyname = 'Public read access to documents' 
        AND tablename = 'objects' 
        AND schemaname = 'storage'
    ) THEN
        CREATE POLICY "Public read access to documents"
        ON storage.objects
        FOR SELECT
        TO public
        USING (bucket_id = 'documents');
    END IF;

    -- Allow authenticated users to delete files
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE policyname = 'Authenticated users can delete files' 
        AND tablename = 'objects' 
        AND schemaname = 'storage'
    ) THEN
        CREATE POLICY "Authenticated users can delete files"
        ON storage.objects
        FOR DELETE
        TO authenticated
        USING (bucket_id = 'documents');
    END IF;

    -- Allow authenticated users to update files
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE policyname = 'Authenticated users can update files' 
        AND tablename = 'objects' 
        AND schemaname = 'storage'
    ) THEN
        CREATE POLICY "Authenticated users can update files"
        ON storage.objects
        FOR UPDATE
        TO authenticated
        USING (bucket_id = 'documents');
    END IF;

    -- Allow anonymous users to upload files (for public forms)
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE policyname = 'Anonymous users can upload files' 
        AND tablename = 'objects' 
        AND schemaname = 'storage'
    ) THEN
        CREATE POLICY "Anonymous users can upload files"
        ON storage.objects
        FOR INSERT
        TO anon
        WITH CHECK (bucket_id = 'documents');
    END IF;
END
$$;