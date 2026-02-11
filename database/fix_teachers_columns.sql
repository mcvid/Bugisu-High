-- Fix Missing Columns in Teachers Table
-- This ensures all fields required by TeachersManager.jsx are present

-- 1. Ensure departments table exists (dependency)
CREATE TABLE IF NOT EXISTS public.departments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Add columns to teachers table safely
ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS title TEXT DEFAULT 'Mr.';
ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'teacher';
ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS qualification TEXT;
ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS phone TEXT;

-- Foreign Keys
ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS department_id UUID REFERENCES public.departments(id);
ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS primary_subject_id UUID REFERENCES public.subjects(id);
ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS hierarchy_order INTEGER DEFAULT 0;

-- 3. Ensure teacher_subjects join table exists
CREATE TABLE IF NOT EXISTS public.teacher_subjects (
    teacher_id UUID REFERENCES public.teachers(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'teacher',
    PRIMARY KEY (teacher_id, subject_id)
);

-- 4. Enable RLS
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_subjects ENABLE ROW LEVEL SECURITY;

-- 5. Policies (Idempotent)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read departments') THEN
        CREATE POLICY "Allow public read departments" ON public.departments FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read teacher_subjects') THEN
        CREATE POLICY "Allow public read teacher_subjects" ON public.teacher_subjects FOR SELECT USING (true);
    END IF;
END
$$;
