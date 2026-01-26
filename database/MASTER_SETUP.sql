-- MASTER SETUP SCRIPT for Bugisu High School
-- Run this ONCE to fix everything.

-- 1. Create PROFILES (if not exists)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    full_name TEXT,
    role TEXT DEFAULT 'student'
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public profiles read" ON public.profiles;
DROP POLICY IF EXISTS "Users insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users update own profile" ON public.profiles;

CREATE POLICY "Public profiles read" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 2. Create SUBJECTS (if not exists)
CREATE TABLE IF NOT EXISTS public.subjects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT NOT NULL,
    category TEXT
);

-- Ensure Unique Name (Safe check)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'subjects_name_key') THEN
        ALTER TABLE public.subjects ADD CONSTRAINT subjects_name_key UNIQUE (name);
    END IF;
END $$;

ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;

-- Drop exist policies to avoid errors
DROP POLICY IF EXISTS "Public read subjects" ON public.subjects;
DROP POLICY IF EXISTS "Admins insert subjects" ON public.subjects;
DROP POLICY IF EXISTS "Admins update subjects" ON public.subjects;

CREATE POLICY "Public read subjects" ON public.subjects FOR SELECT USING (true);
CREATE POLICY "Admins insert subjects" ON public.subjects FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins update subjects" ON public.subjects FOR UPDATE USING (true);


-- 3. Create STUDENTS
CREATE TABLE IF NOT EXISTS public.students (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    student_name TEXT NOT NULL,
    student_reg_number TEXT NOT NULL UNIQUE,
    house TEXT,
    class_grade TEXT,
    parent_email TEXT,
    parent_phone TEXT,
    photo_url TEXT,
    valid_until DATE
);
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read students" ON public.students;
DROP POLICY IF EXISTS "Admins insert students" ON public.students;
DROP POLICY IF EXISTS "Admins update students" ON public.students;
DROP POLICY IF EXISTS "Admins delete students" ON public.students;

CREATE POLICY "Public read students" ON public.students FOR SELECT USING (true);
CREATE POLICY "Admins insert students" ON public.students FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins update students" ON public.students FOR UPDATE USING (true);
CREATE POLICY "Admins delete students" ON public.students FOR DELETE USING (true);


-- 4. Create GRADES
CREATE TABLE IF NOT EXISTS public.grades (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
    term TEXT NOT NULL,
    year INTEGER NOT NULL,
    marks INTEGER,
    grade TEXT,
    teacher_comment TEXT
);

-- Add Unique Constraint for Upsert (Safe check)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'grades_student_subject_term_year_key') THEN
        ALTER TABLE public.grades ADD CONSTRAINT grades_student_subject_term_year_key UNIQUE (student_id, subject_id, term, year);
    END IF;
END $$;

ALTER TABLE public.grades ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read grades" ON public.grades;
DROP POLICY IF EXISTS "Admins insert grades" ON public.grades;
DROP POLICY IF EXISTS "Admins update grades" ON public.grades;
DROP POLICY IF EXISTS "Admins delete grades" ON public.grades;

CREATE POLICY "Public read grades" ON public.grades FOR SELECT USING (true);
CREATE POLICY "Admins insert grades" ON public.grades FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins update grades" ON public.grades FOR UPDATE USING (true);
CREATE POLICY "Admins delete grades" ON public.grades FOR DELETE USING (true);


-- 5. Seed Comprehensive List of Ugandan Secondary School Subjects
INSERT INTO public.subjects (name, category) VALUES 
-- Sciences
('Mathematics', 'Science'), 
('Physics', 'Science'), 
('Chemistry', 'Science'), 
('Biology', 'Science'),
('Agriculture', 'Science'),
('Physical Education', 'Science'),

-- Arts & Humanities
('English Language', 'Languages'),
('English Literature', 'Languages'),
('History', 'Arts'), 
('Geography', 'Arts'),
('CRE (Christian Religious Education)', 'Arts'),
('IRE (Islamic Religious Education)', 'Arts'),
('Entrepreneurship', 'Arts'),
('Economics', 'Arts'),
('Fine Art', 'Arts'),

-- Languages
('Luganda', 'Languages'),
('Swahili', 'Languages'),
('French', 'Languages'),
('German', 'Languages'),
('Latin', 'Languages'),

-- Technical & Vocational
('ICT (Computer Studies)', 'Technical'),
('Technical Drawing', 'Technical'),
('Woodwork', 'Technical'),
('Metalwork', 'Technical'),
('Foods and Nutrition', 'Technical')

ON CONFLICT (name) DO NOTHING;
