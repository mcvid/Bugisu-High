-- Create a table for public profiles (linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    full_name TEXT,
    role TEXT DEFAULT 'student' CHECK (role IN ('admin', 'teacher', 'student', 'parent'))
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies for Profiles
CREATE POLICY "Public profiles are viewable by everyone" 
    ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" 
    ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
    ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Trigger to create profile on signup (Optional but good practice)
-- OR REPLACE FUNCTION public.handle_new_user() 
-- RETURNS TRIGGER AS $$
-- BEGIN
--   INSERT INTO public.profiles (id, full_name, role)
--   VALUES (new.id, new.raw_user_meta_data->>'full_name', 'student');
--   RETURN new;
-- END;
-- $$ LANGUAGE plpgsql SECURITY DEFINER;
--
-- DO $$
-- BEGIN
--   IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created') THEN
--     CREATE TRIGGER on_auth_user_created
--     AFTER INSERT ON auth.users
--     FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
--   END IF;
-- END
-- $$;

-- SECURE ACADEMIC TABLES (Strict RLS)

-- 1. Subjects: Public Read, Admin Write
DROP POLICY IF EXISTS "Allow public insert subjects" ON public.subjects;
CREATE POLICY "Admins can insert subjects" 
    ON public.subjects FOR INSERT 
    WITH CHECK (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

DROP POLICY IF EXISTS "Allow public update subjects" ON public.subjects; -- If it exists
CREATE POLICY "Admins can update subjects"
    ON public.subjects FOR UPDATE
    USING (
         EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

DROP POLICY IF EXISTS "Allow public delete subjects" ON public.subjects; -- If it exists
CREATE POLICY "Admins can delete subjects"
    ON public.subjects FOR DELETE
    USING (
         EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- 2. Grades: Public Read, Admin/Teacher Write
-- (Note: In a real app, students might only read their OWN grades. 
-- For now we keep public read for simplicity of the Portal demo without Auth)

DROP POLICY IF EXISTS "Allow public insert grades" ON public.grades;
CREATE POLICY "Admins can insert grades" 
    ON public.grades FOR INSERT 
    WITH CHECK (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'teacher'))
    );

DROP POLICY IF EXISTS "Allow public update grades" ON public.grades;
CREATE POLICY "Admins can update grades"
    ON public.grades FOR UPDATE
    USING (
         EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'teacher'))
    );

DROP POLICY IF EXISTS "Allow public delete grades" ON public.grades;
CREATE POLICY "Admins can delete grades"
    ON public.grades FOR DELETE
    USING (
         EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'teacher'))
    );

-- 3. Students: Public Read, Admin Write
DROP POLICY IF EXISTS "Allow public insert to students" ON public.students;
CREATE POLICY "Admins can insert students" 
    ON public.students FOR INSERT 
    WITH CHECK (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

DROP POLICY IF EXISTS "Allow public update to students" ON public.students;
CREATE POLICY "Admins can update students"
    ON public.students FOR UPDATE
    USING (
         EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

DROP POLICY IF EXISTS "Allow public delete from students" ON public.students;
CREATE POLICY "Admins can delete students"
    ON public.students FOR DELETE
    USING (
         EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );
