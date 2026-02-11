-- Diagnostic Check
-- 1. Check Department Count
SELECT count(*) as department_count FROM public.departments;

-- 2. List Departments
SELECT * FROM public.departments;

-- 3. Check Teacher Count
SELECT count(*) as teacher_count FROM public.teachers;

-- 4. Check Teachers with their Departments
SELECT t.name, t.department_id, d.name as dept_name 
FROM public.teachers t 
LEFT JOIN public.departments d ON t.department_id = d.id;
