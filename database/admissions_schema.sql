-- Create ADMISSION APPLICATIONS table
CREATE TABLE IF NOT EXISTS public.admission_applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    student_name TEXT NOT NULL,
    date_of_birth DATE,
    gender TEXT,
    previous_school TEXT,
    parent_name TEXT NOT NULL,
    parent_email TEXT,
    parent_phone TEXT,
    Applying_for_class TEXT, -- e.g. "Senior 1"
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    notes TEXT
);

-- Enable RLS
ALTER TABLE public.admission_applications ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "Public insert applications" ON public.admission_applications;
CREATE POLICY "Public insert applications" ON public.admission_applications FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admins view all applications" ON public.admission_applications;
CREATE POLICY "Admins view all applications" ON public.admission_applications FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins update applications" ON public.admission_applications;
CREATE POLICY "Admins update applications" ON public.admission_applications FOR UPDATE USING (true);


-- Create NOTIFICATIONS table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE, -- Link to student
    recipient_phone TEXT, -- Or email, or user_id
    recipient_name TEXT,
    type TEXT CHECK (type IN ('sms', 'email', 'system')),
    message TEXT NOT NULL,
    status TEXT DEFAULT 'sent' -- In a real system: 'queued', 'sent', 'failed'
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Policies (Admin only mostly, maybe users can read their own)
DROP POLICY IF EXISTS "Admins manage notifications" ON public.notifications;
CREATE POLICY "Admins manage notifications" ON public.notifications FOR ALL USING (true);
