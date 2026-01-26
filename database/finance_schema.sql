-- 1. Fees Structure (The "Debt" creator)
CREATE TABLE IF NOT EXISTS public.fees_structure (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    class_name TEXT NOT NULL UNIQUE, -- e.g. "Senior 1"
    term_fee_amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
    academic_year INTEGER NOT NULL DEFAULT 2026
);

-- 2. Fee Payments (The "Credit" recorder)
CREATE TABLE IF NOT EXISTS public.fee_payments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    amount_paid DECIMAL(12, 2) NOT NULL,
    payment_method TEXT DEFAULT 'cash', -- cash, bank, mobile_money
    payment_date TIMESTAMP DEFAULT NOW(),
    receipt_no SERIAL, -- Auto-incrementing receipt number
    captured_by UUID REFERENCES public.profiles(id), -- If using auth
    remarks TEXT
);

-- Enable RLS
ALTER TABLE public.fees_structure ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fee_payments ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public read fees structure" ON public.fees_structure FOR SELECT USING (true);
CREATE POLICY "Admins manage fees structure" ON public.fees_structure FOR ALL USING (true); -- Simplified

CREATE POLICY "Public read own payments" ON public.fee_payments FOR SELECT USING (true); -- Ideally restrict to own ID
CREATE POLICY "Admins manage payments" ON public.fee_payments FOR ALL USING (true);


-- 3. THE ENGINE: Calculate Balance Function (RPC)
-- This function calculates (Total Fees Owed) - (Total Paid)
CREATE OR REPLACE FUNCTION public.get_student_balance(student_uuid UUID)
RETURNS DECIMAL AS $$
DECLARE
    total_owed DECIMAL := 0;
    total_paid DECIMAL := 0;
    student_class TEXT;
BEGIN
    -- Get student's class
    SELECT class_grade INTO student_class FROM public.students WHERE id = student_uuid;
    
    -- Get fee for that class (assuming current year/term logic is handled by structure or simplified here)
    -- For MVP, we sum ALL fee structures matching the class (or just the latest)
    -- Ideally, you'd link students to Term/Year, but let's assume 1 active fee per class for now.
    SELECT COALESCE(term_fee_amount, 0) INTO total_owed 
    FROM public.fees_structure 
    WHERE class_name = student_class;

    -- Get total paid
    SELECT COALESCE(SUM(amount_paid), 0) INTO total_paid 
    FROM public.fee_payments 
    WHERE student_id = student_uuid;

    RETURN (total_owed - total_paid);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 4. THE HARD LOCK: RLS Policy on Grades
-- "Only allow viewing grades if balance <= 0"
-- NOTE: This is a strict policy. Be careful.
-- To enable this, uncomment the lines below. 
-- For now, we leave it commented so you can test freely, but the logic is here.


DROP POLICY IF EXISTS "Block grades if owing" ON public.grades;
CREATE POLICY "Block grades if owing" ON public.grades
FOR SELECT
USING (
    public.get_student_balance(student_id) <= 0
);

-- Seed Default Fees
INSERT INTO public.fees_structure (class_name, term_fee_amount) VALUES
('Senior 1', 650000),
('Senior 2', 650000),
('Senior 3', 700000),
('Senior 4', 750000),
('Senior 5', 800000),
('Senior 6', 850000)
ON CONFLICT (class_name) DO UPDATE SET term_fee_amount = EXCLUDED.term_fee_amount;
