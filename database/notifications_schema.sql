-- Notifications Schema for Bugisu High School
-- Supports targeted notifications for parents, students, staff, or all users.

CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'announcement', -- 'info', 'emergency', 'result', 'announcement'
    target_role TEXT NOT NULL DEFAULT 'all', -- 'all', 'parent', 'student', 'staff'
    is_active BOOLEAN DEFAULT true,
    action_link TEXT -- Optional link for the user to follow
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Allow public read active notifications" 
ON public.notifications FOR SELECT 
USING (is_active = true);

-- Sample Data
INSERT INTO public.notifications (title, content, type, target_role)
VALUES 
    ('Welcome to the New Portal', 'Enjoy our modern dashboard and mobile-friendly features!', 'info', 'all'),
    ('Term 1 Results Released', 'Grade reports for Term 1 2026 are now available for viewing.', 'result', 'all'),
    ('Emergency Closure', 'School will be closed on Friday due to weather conditions.', 'emergency', 'all');
