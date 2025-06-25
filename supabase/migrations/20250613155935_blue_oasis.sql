/*
  # Create survey tables

  1. New Tables
    - `surveys` - Stores survey definitions
      - `id` (uuid, primary key)
      - `title` (text, not null)
      - `description` (text)
      - `questions` (jsonb, not null)
      - `is_active` (boolean, default true)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())
    
    - `survey_responses` - Stores survey responses
      - `id` (uuid, primary key)
      - `survey_id` (uuid, references surveys)
      - `customer_name` (text, not null)
      - `customer_email` (text, not null)
      - `customer_phone` (text, not null)
      - `customer_company` (text)
      - `answers` (jsonb, not null)
      - `created_at` (timestamptz, default now())
  
  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage surveys
    - Add policies for anonymous users to submit responses
*/

-- Create surveys table
CREATE TABLE IF NOT EXISTS surveys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  questions jsonb NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create survey_responses table
CREATE TABLE IF NOT EXISTS survey_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  survey_id uuid REFERENCES surveys(id) ON DELETE CASCADE,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text NOT NULL,
  customer_company text,
  answers jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for surveys
CREATE POLICY "Authenticated users can select surveys"
  ON surveys
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert surveys"
  ON surveys
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update surveys"
  ON surveys
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete surveys"
  ON surveys
  FOR DELETE
  TO authenticated
  USING (true);

-- Create RLS policies for survey_responses
CREATE POLICY "Authenticated users can select survey_responses"
  ON survey_responses
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert survey_responses"
  ON survey_responses
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Anonymous users can insert survey_responses"
  ON survey_responses
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Create updated_at trigger for surveys
CREATE TRIGGER update_surveys_updated_at
  BEFORE UPDATE ON surveys
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_surveys_is_active ON surveys(is_active);
CREATE INDEX IF NOT EXISTS idx_survey_responses_survey_id ON survey_responses(survey_id);
CREATE INDEX IF NOT EXISTS idx_survey_responses_created_at ON survey_responses(created_at);

-- Insert sample survey
INSERT INTO surveys (title, description, questions, is_active)
VALUES (
  'Müşteri Memnuniyet Anketi',
  'Hizmetlerimizden memnuniyetinizi ölçmek ve daha iyi hizmet sunabilmek için görüşlerinizi paylaşın.',
  '[
    {
      "id": "q1",
      "text": "Hizmetlerimizden genel olarak ne kadar memnun kaldınız?",
      "type": "rating",
      "required": true
    },
    {
      "id": "q2",
      "text": "Hangi hizmetimizi aldınız?",
      "type": "multiple_choice",
      "options": ["Böcek İlaçlama", "Kemirgen Kontrolü", "Dezenfeksiyon", "Kuş Kontrolü", "Fumigasyon", "Diğer"],
      "required": true
    },
    {
      "id": "q3",
      "text": "Personelimizin profesyonelliğini nasıl değerlendirirsiniz?",
      "type": "rating",
      "required": true
    },
    {
      "id": "q4",
      "text": "Hizmet sonrası problem yaşadınız mı?",
      "type": "multiple_choice",
      "options": ["Evet", "Hayır"],
      "required": true
    },
    {
      "id": "q5",
      "text": "Hizmetlerimizi nasıl duydunuz?",
      "type": "multiple_choice",
      "options": ["İnternet Araması", "Sosyal Medya", "Arkadaş Tavsiyesi", "Reklam", "Diğer"],
      "required": false
    },
    {
      "id": "q6",
      "text": "Hizmetlerimizi iyileştirmek için önerileriniz nelerdir?",
      "type": "text",
      "required": false
    }
  ]'::jsonb,
  true
);