/*
  # Create job_applications table

  1. New Tables
    - `job_applications`
      - `id` (uuid, primary key)
      - `full_name` (text, not null)
      - `email` (text, not null)
      - `phone` (text, not null)
      - `city` (text, not null)
      - `education` (text, not null)
      - `experience` (text, not null)
      - `position` (text, not null)
      - `cover_letter` (text)
      - `resume_url` (text, not null)
      - `heard_from` (text)
      - `status` (text, default: 'new')
      - `notes` (text)
      - `created_at` (timestamptz, default: now())
      - `updated_at` (timestamptz, default: now())
  
  2. Security
    - Enable RLS on `job_applications` table
    - Add policies for anonymous users to insert applications
    - Add policies for authenticated users to manage applications
*/

-- Create job_applications table
CREATE TABLE IF NOT EXISTS job_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  city text NOT NULL,
  education text NOT NULL,
  experience text NOT NULL,
  position text NOT NULL,
  cover_letter text,
  resume_url text NOT NULL,
  heard_from text,
  status text DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'interview', 'hired', 'rejected')),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Anonymous users can insert job applications"
  ON job_applications
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Authenticated users can insert job applications"
  ON job_applications
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can select job applications"
  ON job_applications
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update job applications"
  ON job_applications
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete job applications"
  ON job_applications
  FOR DELETE
  TO authenticated
  USING (true);

-- Create updated_at trigger
CREATE TRIGGER update_job_applications_updated_at
  BEFORE UPDATE ON job_applications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_job_applications_status ON job_applications(status);
CREATE INDEX IF NOT EXISTS idx_job_applications_created_at ON job_applications(created_at);
CREATE INDEX IF NOT EXISTS idx_job_applications_position ON job_applications(position);

-- Add email validation constraint
ALTER TABLE job_applications 
ADD CONSTRAINT valid_job_email_format 
CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- Add phone validation constraint
ALTER TABLE job_applications 
ADD CONSTRAINT valid_job_phone_format 
CHECK (phone ~ '^[0-9\s\-\+\(\)]{10,20}$');

-- Create the resumes folder in the documents bucket
INSERT INTO storage.objects (bucket_id, name, owner, metadata)
VALUES ('documents', 'resumes/.emptyFolderPlaceholder', auth.uid(), '{"contentType": "text/plain"}')
ON CONFLICT (bucket_id, name) DO NOTHING;