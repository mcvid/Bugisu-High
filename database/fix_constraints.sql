-- 1. Fix SUBJECTS uniqueness
-- Ensure names are unique. If duplicates exist, this might fail, needing cleanup first.
-- Here we try to add the constraint safely.
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'subjects_name_key') THEN
        ALTER TABLE public.subjects ADD CONSTRAINT subjects_name_key UNIQUE (name);
    END IF;
END $$;


-- 2. Fix GRADES uniqueness
-- We need to ensure one grade per student per subject per term per year.
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'grades_student_subject_term_year_key') THEN
        ALTER TABLE public.grades ADD CONSTRAINT grades_student_subject_term_year_key UNIQUE (student_id, subject_id, term, year);
    END IF;
END $$;
