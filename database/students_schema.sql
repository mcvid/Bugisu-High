-- Create students table for Digital ID verification
CREATE TABLE IF NOT EXISTS public.students (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    student_name TEXT NOT NULL,
    student_reg_number TEXT NOT NULL UNIQUE,
    house TEXT NOT NULL,
    class_grade TEXT NOT NULL,
    blood_group TEXT,
    date_of_birth DATE,
    parent_name TEXT,
    parent_email TEXT,
    parent_phone TEXT,
    photo_url TEXT,
    valid_until DATE
);

-- Enable RLS
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

-- Allow public read access (for this demo/MVP, strictly limiting by query in app logic)
-- In a real production app with sensitive data, we'd use strict RLS policies dealing with auth users.
-- For this "input email to see ID" flow, we'll allow public select but the client must filter.
DROP POLICY IF EXISTS "Allow public read access to students" ON public.students;
CREATE POLICY "Allow public read access to students"
    ON public.students FOR SELECT
    USING (true);

-- Indexes for fast lookup by parent contact
CREATE INDEX IF NOT EXISTS idx_students_parent_email ON public.students(parent_email);
CREATE INDEX IF NOT EXISTS idx_students_parent_phone ON public.students(parent_phone);

-- Seed Data using the mock student details we verified earlier
INSERT INTO public.students (student_name, student_reg_number, house, class_grade, blood_group, parent_email, parent_phone, valid_until, photo_url)
VALUES 
(
    'Nandutu Sarah', 
    'BHS/2026/0442', 
    'Elgon House', 
    'Senior 4', 
    'B+', 
    'parent@example.com', 
    '0700000000', 
    '2026-12-31',
    '/Users/hello/.gemini/antigravity/brain/e2932b5d-20fd-4cee-9de2-490d95bc8a8e/student_portrait_id_1769337703899.png'
)
ON CONFLICT (student_reg_number) DO UPDATE 
SET 
    parent_email = EXCLUDED.parent_email,
    parent_phone = EXCLUDED.parent_phone,
    photo_url = EXCLUDED.photo_url;
