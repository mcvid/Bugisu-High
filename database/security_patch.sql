-- SECURITY PATCH FOR RLS POLICIES

-- 1. ADMISSION APPLICATIONS
DROP POLICY IF EXISTS "Admins view all applications" ON public.admission_applications;
CREATE POLICY "Admins view all applications" ON public.admission_applications 
FOR SELECT TO authenticated USING (true);

-- 2. STUDENTS
-- Restrict public read to authenticated users by default
DROP POLICY IF EXISTS "Allow public read access to students" ON public.students;
CREATE POLICY "Admins view all students" ON public.students 
FOR SELECT TO authenticated USING (true);

-- 3. FEE PAYMENTS
DROP POLICY IF EXISTS "Public read own payments" ON public.fee_payments;
CREATE POLICY "Admins manage all payments" ON public.fee_payments 
FOR SELECT TO authenticated USING (true);

-- 4. CONTACT MESSAGES (Just in case)
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admin handle contact_messages" ON public.contact_messages;
CREATE POLICY "Admin handle contact_messages" ON public.contact_messages 
FOR ALL TO authenticated USING (true);
