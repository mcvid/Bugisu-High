BEGIN;
-- Temporarily disable triggers for this session (suppresses triggers)
SET LOCAL session_replication_role = replica;

DO $$
DECLARE
    r RECORD;
    tbl_count INT := 0;
BEGIN
    FOR r IN (
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public'
    ) LOOP
        tbl_count := tbl_count + 1;
        RAISE NOTICE 'Truncating table: %', r.tablename;
        EXECUTE format('TRUNCATE TABLE public.%I RESTART IDENTITY CASCADE;', r.tablename);
    END LOOP;

    IF tbl_count = 0 THEN
        RAISE NOTICE 'No tables found in public schema.';
    END IF;
END $$;

-- Re-seed essential data (adjust conflict targets to match your constraints)
-- Ensure fees_structure has UNIQUE(class_name)
INSERT INTO public.fees_structure (class_name, term_fee_amount) VALUES
('Senior 1', 650000),
('Senior 2', 650000),
('Senior 3', 700000),
('Senior 4', 750000),
('Senior 5', 800000),
('Senior 6', 850000)
ON CONFLICT (class_name) DO UPDATE SET term_fee_amount = EXCLUDED.term_fee_amount;

-- Ensure students has UNIQUE(student_reg_number) before using this conflict target
INSERT INTO public.students (student_name, student_reg_number, house, class_grade, parent_email, parent_phone, valid_until)
VALUES 
(
    'Test Customer', 
    'BHS/Test/001', 
    'Elgon House', 
    'Senior 1', 
    'parent@bugisuhighschool.com', 
    '0700000000', 
    '2026-12-31'
)
ON CONFLICT (student_reg_number) DO NOTHING;

COMMIT;