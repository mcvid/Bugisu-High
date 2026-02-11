-- Check Active Policies
SELECT schemaname, tablename, policyname, cmd, roles, qual, with_check 
FROM pg_policies 
WHERE tablename IN ('departments', 'teachers', 'teacher_subjects');
