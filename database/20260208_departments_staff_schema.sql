-- 1. Create departments table
CREATE TABLE IF NOT EXISTS public.departments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enhance subjects table
ALTER TABLE public.subjects ADD COLUMN IF NOT EXISTS department_id UUID REFERENCES public.departments(id);

-- 3. Enhance teachers table
ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS role TEXT;
ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS qualification TEXT;
ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS department_id UUID REFERENCES public.departments(id);
ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS primary_subject_id UUID REFERENCES public.subjects(id);
ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS hierarchy_order INTEGER DEFAULT 0;

-- 4. Create teacher_subjects join table
CREATE TABLE IF NOT EXISTS public.teacher_subjects (
    teacher_id UUID REFERENCES public.teachers(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'teacher', -- 'hod', 'teacher'
    PRIMARY KEY (teacher_id, subject_id)
);

-- 5. Enable RLS
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_subjects ENABLE ROW LEVEL SECURITY;

-- 6. Set public read policies
CREATE POLICY "Allow public read departments" ON public.departments FOR SELECT USING (true);
CREATE POLICY "Allow public read teacher_subjects" ON public.teacher_subjects FOR SELECT USING (true);

-- 7. Seed some initial data
INSERT INTO public.departments (name, slug, sort_order) VALUES
('Science', 'science', 1),
('Mathematics & ICT', 'math-ict', 2),
('Humanities', 'humanities', 3),
('Languages', 'languages', 4),
('Vocational & Arts', 'vocational-arts', 5)
ON CONFLICT (slug) DO NOTHING;

-- Update existing subjects with department links (example)
UPDATE public.subjects SET department_id = (SELECT id FROM public.departments WHERE slug = 'science') WHERE name IN ('Physics', 'Chemistry', 'Biology');
UPDATE public.subjects SET department_id = (SELECT id FROM public.departments WHERE slug = 'math-ict') WHERE name = 'Mathematics';
UPDATE public.subjects SET department_id = (SELECT id FROM public.departments WHERE slug = 'languages') WHERE name = 'English';
UPDATE public.subjects SET department_id = (SELECT id FROM public.departments WHERE slug = 'humanities') WHERE name IN ('History', 'Geography');
