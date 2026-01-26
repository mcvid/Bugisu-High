-- SAMPLE_BATCH_REPORT_IMPORT.sql
-- This script demonstrates how to import all needed data for a student's report card at once.

-- 1. IDENTIFY THE STUDENT (e.g., Sarah Nandutu)
DO $$
DECLARE
    v_student_id UUID;
    v_math_id UUID;
    v_eng_id UUID;
    v_bio_id UUID;
    v_term TEXT := 'Term 1';
    v_year INTEGER := 2026;
BEGIN
    -- Get ID for student based on Reg Number
    SELECT id INTO v_student_id FROM public.students WHERE student_reg_number = 'BHS/2026/0442';

    -- Get Subject IDs
    SELECT id INTO v_math_id FROM public.subjects WHERE name = 'Mathematics';
    SELECT id INTO v_eng_id FROM public.subjects WHERE name = 'English';
    SELECT id INTO v_bio_id FROM public.subjects WHERE name = 'Biology';

    -- 2. IMPORT GRADES
    INSERT INTO public.grades (student_id, subject_id, term, year, marks, grade, teacher_comment)
    VALUES 
        (v_student_id, v_math_id, v_term, v_year, 85, 'A', 'Excellent logical reasoning.'),
        (v_student_id, v_eng_id,  v_term, v_year, 78, 'B', 'Strong creative writing skills.'),
        (v_student_id, v_bio_id,  v_term, v_year, 92, 'A', 'Superb understanding of genetics.')
    ON CONFLICT (student_id, subject_id, term, year) DO UPDATE 
    SET marks = EXCLUDED.marks, grade = EXCLUDED.grade, teacher_comment = EXCLUDED.teacher_comment;

    -- 3. IMPORT METADATA (Attendance, Conduct, Remarks)
    INSERT INTO public.report_metadata (
        student_id, term, year, 
        attendance_present, attendance_total, 
        conduct_rating, responsibility_rating, punctuality_rating,
        teacher_remark, headteacher_remark
    )
    VALUES (
        v_student_id, v_term, v_year,
        88, 90,
        'Excellent', 'Highly Responsible', 'Very Good',
        'A dedicated and brilliant student. Keep up the high standards.',
        'Outstanding performance across all domains.'
    )
    ON CONFLICT (student_id, term, year) DO UPDATE 
    SET attendance_present = EXCLUDED.attendance_present, 
        conduct_rating = EXCLUDED.conduct_rating,
        teacher_remark = EXCLUDED.teacher_remark;

    -- 4. IMPORT COMPETENCIES (Skills)
    INSERT INTO public.competencies (student_id, term, year, skill_name, achievement_level)
    VALUES 
        (v_student_id, v_term, v_year, 'Communication', 'Exceeds Expectations'),
        (v_student_id, v_term, v_year, 'Critical Thinking', 'Exceeds Expectations'),
        (v_student_id, v_term, v_year, 'Collaboration', 'Meets Expectations'),
        (v_student_id, v_term, v_year, 'Creativity', 'Approaching Expectations')
    ON CONFLICT (student_id, term, year, skill_name) DO UPDATE 
    SET achievement_level = EXCLUDED.achievement_level;

    RAISE NOTICE 'Complete report for student % imported successfully.', v_student_id;

END $$;
