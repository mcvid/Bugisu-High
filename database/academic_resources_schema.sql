-- Create past_papers table
CREATE TABLE IF NOT EXISTS past_papers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  level TEXT NOT NULL, -- S1, S2, S3, S4, S5, S6
  year INTEGER,
  term INTEGER,
  paper_type TEXT, -- Exam, Test, Assignment
  file_url TEXT NOT NULL,
  downloads INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE past_papers ENABLE ROW LEVEL SECURITY;

-- Policies for past_papers
CREATE POLICY "Public read access for past papers" 
  ON past_papers FOR SELECT 
  TO public 
  USING (true);

CREATE POLICY "Admin full access for past papers" 
  ON past_papers FOR ALL 
  TO authenticated 
  USING (true)
  WITH CHECK (true);

-- Storage bucket for academic resources
INSERT INTO storage.buckets (id, name, public) 
VALUES ('academic_resources', 'academic_resources', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Public Access Academic" 
  ON storage.objects FOR SELECT 
  TO public 
  USING (bucket_id = 'academic_resources');

CREATE POLICY "Auth Upload Academic" 
  ON storage.objects FOR INSERT 
  TO authenticated 
  WITH CHECK (bucket_id = 'academic_resources');

CREATE POLICY "Auth Delete Academic" 
  ON storage.objects FOR DELETE 
  TO authenticated 
  USING (bucket_id = 'academic_resources');
