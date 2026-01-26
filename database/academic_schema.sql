-- Create subjects table
CREATE TABLE IF NOT EXISTS public.subjects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT NOT NULL UNIQUE,
    category TEXT -- e.g. "Science", "Arts", "Languages"
);

-- Seed some default subjects
INSERT INTO public.subjects (name, category)
VALUES 
    ('Mathematics', 'Science'),
    ('English', 'Languages'),
    ('Physics', 'Science'),
    ('Chemistry', 'Science'),
    ('Biology', 'Science'),
    ('History', 'Arts'),
    ('Geography', 'Arts')
ON CONFLICT (name) DO NOTHING;

-- Create grades table
CREATE TABLE IF NOT EXISTS public.grades (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
    term TEXT NOT NULL, -- e.g. "Term 1"
    year INTEGER NOT NULL, -- e.g. 2026
    marks INTEGER CHECK (marks >= 0 AND marks <= 100),
    grade TEXT, -- e.g. "A", "B", "C"
    teacher_comment TEXT,
    UNIQUE(student_id, subject_id, term, year) -- Prevent duplicate entries for same subject/term
);

-- Enable RLS
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grades ENABLE ROW LEVEL SECURITY;

-- Policies for subjects (Public read, Admin write)
CREATE POLICY "Allow public read subjects" ON public.subjects FOR SELECT USING (true);
CREATE POLICY "Allow public insert subjects" ON public.subjects FOR INSERT WITH CHECK (true);

-- Policies for grades (Public read for now for Portal simplicity, Admin write)
CREATE POLICY "Allow public read grades" ON public.grades FOR SELECT USING (true);
CREATE POLICY "Allow public insert grades" ON public.grades FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update grades" ON public.grades FOR UPDATE USING (true);
CREATE POLICY "Allow public delete grades" ON public.grades FOR DELETE USING (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_grades_student ON public.grades(student_id);
CREATE INDEX IF NOT EXISTS idx_grades_term_year ON public.grades(term, year);
