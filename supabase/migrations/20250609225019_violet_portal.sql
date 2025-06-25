-- Create the documents bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', true)
ON CONFLICT (id) DO NOTHING;

-- Create the risk_assessments folder in the documents bucket
INSERT INTO storage.objects (bucket_id, name, owner, metadata)
VALUES ('documents', 'risk_assessments/.emptyFolderPlaceholder', auth.uid(), '{"contentType": "text/plain"}')
ON CONFLICT (bucket_id, name) DO NOTHING;

-- Allow authenticated users to upload files (only if policy doesn't exist)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND policyname = 'Authenticated users can upload files'
    ) THEN
        EXECUTE 'CREATE POLICY "Authenticated users can upload files"
                ON storage.objects
                FOR INSERT
                TO authenticated
                WITH CHECK (bucket_id = ''documents'')';
    END IF;
END $$;

-- Allow public read access to files (only if policy doesn't exist)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND policyname = 'Public read access to documents'
    ) THEN
        EXECUTE 'CREATE POLICY "Public read access to documents"
                ON storage.objects
                FOR SELECT
                TO public
                USING (bucket_id = ''documents'')';
    END IF;
END $$;

-- Allow authenticated users to delete files (only if policy doesn't exist)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND policyname = 'Authenticated users can delete files'
    ) THEN
        EXECUTE 'CREATE POLICY "Authenticated users can delete files"
                ON storage.objects
                FOR DELETE
                TO authenticated
                USING (bucket_id = ''documents'')';
    END IF;
END $$;

-- Allow authenticated users to update files (only if policy doesn't exist)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND policyname = 'Authenticated users can update files'
    ) THEN
        EXECUTE 'CREATE POLICY "Authenticated users can update files"
                ON storage.objects
                FOR UPDATE
                TO authenticated
                USING (bucket_id = ''documents'')';
    END IF;
END $$;

-- Allow anonymous users to upload files (only if policy doesn't exist)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND policyname = 'Anonymous users can upload files'
    ) THEN
        EXECUTE 'CREATE POLICY "Anonymous users can upload files"
                ON storage.objects
                FOR INSERT
                TO anon
                WITH CHECK (bucket_id = ''documents'')';
    END IF;
END $$;