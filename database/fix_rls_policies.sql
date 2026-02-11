-- Fix RLS Policies (Updated to handle existing policies)

-- 1. Enable RLS (Ensure it's on)
ALTER TABLE public.teacher_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;

-- 2. Drop ALL policies to avoid "policy already exists" errors
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.teacher_subjects;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON public.teacher_subjects;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON public.teacher_subjects;
DROP POLICY IF EXISTS "Allow public read teacher_subjects" ON public.teacher_subjects; -- Drop before recreate

DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.departments;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON public.departments;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON public.departments;
DROP POLICY IF EXISTS "Allow public read departments" ON public.departments; -- Drop before recreate


-- 3. Re-Create permissions for Authenticated Users (Admins)

-- TEACHER_SUBJECTS
CREATE POLICY "Enable insert for authenticated users only" ON public.teacher_subjects
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users only" ON public.teacher_subjects
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users only" ON public.teacher_subjects
    FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow public read teacher_subjects" ON public.teacher_subjects FOR SELECT USING (true);


-- DEPARTMENTS
CREATE POLICY "Enable insert for authenticated users only" ON public.departments
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users only" ON public.departments
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users only" ON public.departments
    FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow public read departments" ON public.departments FOR SELECT USING (true);
