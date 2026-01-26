-- CLASS-SUBJECT MAPPING
-- Defines which subjects are offered for each class level

-- Junction table: Links classes to subjects they study
CREATE TABLE IF NOT EXISTS public.class_subjects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    class_name TEXT NOT NULL, -- e.g., "Senior 1", "Senior 5"
    subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
    is_compulsory BOOLEAN DEFAULT false, -- Compulsory vs Elective
    UNIQUE(class_name, subject_id)
);

-- Enable RLS
ALTER TABLE public.class_subjects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read class subjects" ON public.class_subjects FOR SELECT USING (true);
CREATE POLICY "Admins manage class subjects" ON public.class_subjects FOR ALL USING (true);

-- =========================================
-- SEED DATA: Ugandan Curriculum Structure
-- =========================================

-- Helper to insert class-subject mappings
-- First, let's get subject IDs (these should exist from your subjects table)

-- O-LEVEL SUBJECTS (S.1 - S.4)
-- Compulsory Subjects for all O-Level
INSERT INTO public.class_subjects (class_name, subject_id, is_compulsory)
SELECT 'Senior 1', id, true FROM public.subjects WHERE name IN ('English', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Geography', 'History', 'Religious Education', 'Kiswahili')
ON CONFLICT (class_name, subject_id) DO NOTHING;

INSERT INTO public.class_subjects (class_name, subject_id, is_compulsory)
SELECT 'Senior 2', id, true FROM public.subjects WHERE name IN ('English', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Geography', 'History', 'Religious Education', 'Kiswahili')
ON CONFLICT (class_name, subject_id) DO NOTHING;

INSERT INTO public.class_subjects (class_name, subject_id, is_compulsory)
SELECT 'Senior 3', id, true FROM public.subjects WHERE name IN ('English', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Geography', 'History', 'Religious Education', 'Kiswahili')
ON CONFLICT (class_name, subject_id) DO NOTHING;

INSERT INTO public.class_subjects (class_name, subject_id, is_compulsory)
SELECT 'Senior 4', id, true FROM public.subjects WHERE name IN ('English', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Geography', 'History', 'Religious Education', 'Kiswahili')
ON CONFLICT (class_name, subject_id) DO NOTHING;

-- O-Level Electives (S.1 - S.4)
INSERT INTO public.class_subjects (class_name, subject_id, is_compulsory)
SELECT 'Senior 1', id, false FROM public.subjects WHERE name IN ('Agriculture', 'Commerce', 'Computer Studies', 'Fine Art', 'Music', 'French', 'Luganda', 'Physical Education', 'Technical Drawing')
ON CONFLICT (class_name, subject_id) DO NOTHING;

INSERT INTO public.class_subjects (class_name, subject_id, is_compulsory)
SELECT 'Senior 2', id, false FROM public.subjects WHERE name IN ('Agriculture', 'Commerce', 'Computer Studies', 'Fine Art', 'Music', 'French', 'Luganda', 'Physical Education', 'Technical Drawing')
ON CONFLICT (class_name, subject_id) DO NOTHING;

INSERT INTO public.class_subjects (class_name, subject_id, is_compulsory)
SELECT 'Senior 3', id, false FROM public.subjects WHERE name IN ('Agriculture', 'Commerce', 'Computer Studies', 'Fine Art', 'Music', 'French', 'Luganda', 'Physical Education', 'Technical Drawing')
ON CONFLICT (class_name, subject_id) DO NOTHING;

INSERT INTO public.class_subjects (class_name, subject_id, is_compulsory)
SELECT 'Senior 4', id, false FROM public.subjects WHERE name IN ('Agriculture', 'Commerce', 'Computer Studies', 'Fine Art', 'Music', 'French', 'Luganda', 'Physical Education', 'Technical Drawing')
ON CONFLICT (class_name, subject_id) DO NOTHING;

-- A-LEVEL SUBJECTS (S.5 - S.6)
-- Science Combination (PCB/PCM)
INSERT INTO public.class_subjects (class_name, subject_id, is_compulsory)
SELECT 'Senior 5', id, true FROM public.subjects WHERE name IN ('General Paper', 'Physics', 'Chemistry', 'Biology', 'Mathematics', 'Computer Science', 'Sub-Math', 'Economics')
ON CONFLICT (class_name, subject_id) DO NOTHING;

INSERT INTO public.class_subjects (class_name, subject_id, is_compulsory)
SELECT 'Senior 6', id, true FROM public.subjects WHERE name IN ('General Paper', 'Physics', 'Chemistry', 'Biology', 'Mathematics', 'Computer Science', 'Sub-Math', 'Economics')
ON CONFLICT (class_name, subject_id) DO NOTHING;

-- Arts/Humanities for A-Level
INSERT INTO public.class_subjects (class_name, subject_id, is_compulsory)
SELECT 'Senior 5', id, false FROM public.subjects WHERE name IN ('History', 'Geography', 'Economics', 'Divinity', 'Literature', 'Entrepreneurship', 'Art', 'Music')
ON CONFLICT (class_name, subject_id) DO NOTHING;

INSERT INTO public.class_subjects (class_name, subject_id, is_compulsory)
SELECT 'Senior 6', id, false FROM public.subjects WHERE name IN ('History', 'Geography', 'Economics', 'Divinity', 'Literature', 'Entrepreneurship', 'Art', 'Music')
ON CONFLICT (class_name, subject_id) DO NOTHING;

-- =========================================
-- HELPER FUNCTION: Get subjects for a class
-- =========================================
CREATE OR REPLACE FUNCTION public.get_class_subjects(class_name_param TEXT)
RETURNS TABLE (
    subject_id UUID,
    subject_name TEXT,
    category TEXT,
    is_compulsory BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        s.id,
        s.name,
        s.category,
        cs.is_compulsory
    FROM public.class_subjects cs
    JOIN public.subjects s ON s.id = cs.subject_id
    WHERE cs.class_name = class_name_param
    ORDER BY cs.is_compulsory DESC, s.name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
