-- Update get_student_balance to only count successful payments
CREATE OR REPLACE FUNCTION public.get_student_balance(student_uuid UUID)
RETURNS DECIMAL AS $$
DECLARE
    total_owed DECIMAL := 0;
    total_paid DECIMAL := 0;
    student_class TEXT;
BEGIN
    -- Get student's class
    SELECT class_grade INTO student_class FROM public.students WHERE id = student_uuid;
    
    -- Get fee for that class
    SELECT COALESCE(term_fee_amount, 0) INTO total_owed 
    FROM public.fees_structure 
    WHERE class_name = student_class;

    -- Get total paid (ONLY verified/completed)
    -- We include NULL status to support legacy data which might not have status column backfilled yet
    SELECT COALESCE(SUM(amount_paid), 0) INTO total_paid 
    FROM public.fee_payments 
    WHERE student_id = student_uuid
    AND (status = 'completed' OR status = 'verified' OR status IS NULL);

    RETURN (total_owed - total_paid);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
