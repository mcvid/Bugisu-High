-- =====================================================
-- NOTIFICATIONS & MESSAGING SYSTEM SCHEMA
-- =====================================================

-- 1. ANNOUNCEMENTS TABLE
CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_by UUID, -- Admin who created (will link to profiles later)
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    target_audience TEXT DEFAULT 'all' CHECK (target_audience IN ('all', 'parents', 'students', 'staff', 'specific_class')),
    target_classes TEXT[], -- Array of class names if specific_class
    scheduled_for TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published', 'expired')),
    send_sms BOOLEAN DEFAULT false,
    send_push BOOLEAN DEFAULT true,
    attachments JSONB
);

-- 2. MESSAGES TABLE (Parent-Teacher Communication)
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    sender_type TEXT NOT NULL CHECK (sender_type IN ('parent', 'teacher', 'admin')),
    sender_name TEXT NOT NULL, -- For display
    sender_contact TEXT, -- Phone or email
    recipient_type TEXT NOT NULL CHECK (recipient_type IN ('parent', 'teacher', 'admin')),
    recipient_name TEXT NOT NULL,
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    subject TEXT NOT NULL,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP WITH TIME ZONE,
    thread_id UUID, -- Group related messages
    attachments JSONB
);

-- 3. LEAVE REQUESTS TABLE
CREATE TABLE IF NOT EXISTS public.leave_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
    parent_name TEXT NOT NULL,
    parent_contact TEXT NOT NULL,
    leave_type TEXT CHECK (leave_type IN ('sick', 'family_emergency', 'appointment', 'other')),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT NOT NULL,
    supporting_document_url TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    reviewed_by TEXT, -- Admin name
    reviewed_at TIMESTAMP WITH TIME ZONE,
    admin_notes TEXT
);

-- 4. EXTEND NOTIFICATIONS TABLE
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS notification_type TEXT 
    DEFAULT 'system' CHECK (notification_type IN ('sms', 'email', 'push', 'system'));
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'normal';
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS is_read BOOLEAN DEFAULT false;
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS read_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS category TEXT 
    CHECK (category IN ('fees', 'exams', 'results', 'attendance', 'announcements', 'general'));
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS data JSONB;

-- 5. NOTIFICATION PREFERENCES TABLE
CREATE TABLE IF NOT EXISTS public.notification_preferences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    parent_contact TEXT UNIQUE NOT NULL, -- Phone or email
    sms_enabled BOOLEAN DEFAULT true,
    push_enabled BOOLEAN DEFAULT true,
    email_enabled BOOLEAN DEFAULT true,
    categories JSONB DEFAULT '{"fees": true, "exams": true, "results": true, "attendance": true, "announcements": true}'::jsonb
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_announcements_status ON public.announcements(status);
CREATE INDEX IF NOT EXISTS idx_announcements_target ON public.announcements(target_audience);
CREATE INDEX IF NOT EXISTS idx_announcements_scheduled ON public.announcements(scheduled_for) WHERE status = 'scheduled';

CREATE INDEX IF NOT EXISTS idx_messages_student ON public.messages(student_id);
CREATE INDEX IF NOT EXISTS idx_messages_thread ON public.messages(thread_id);
CREATE INDEX IF NOT EXISTS idx_messages_unread ON public.messages(is_read) WHERE is_read = false;

CREATE INDEX IF NOT EXISTS idx_leave_requests_student ON public.leave_requests(student_id);
CREATE INDEX IF NOT EXISTS idx_leave_requests_status ON public.leave_requests(status);
CREATE INDEX IF NOT EXISTS idx_leave_requests_dates ON public.leave_requests(start_date, end_date);

CREATE INDEX IF NOT EXISTS idx_notifications_student ON public.notifications(student_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON public.notifications(is_read) WHERE is_read = false;
CREATE INDEX IF NOT EXISTS idx_notifications_category ON public.notifications(category);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

-- Announcements: Published announcements are public, drafts only for admins
CREATE POLICY "Public read published announcements" ON public.announcements 
    FOR SELECT USING (status = 'published');
CREATE POLICY "Admins manage announcements" ON public.announcements 
    FOR ALL USING (true); -- In production, check auth.role()

-- Messages: Users see only their own messages
CREATE POLICY "Users read own messages" ON public.messages 
    FOR SELECT USING (true); -- Filter in app logic based on contact
CREATE POLICY "Users send messages" ON public.messages 
    FOR INSERT WITH CHECK (true);

-- Leave Requests: Parents see only their requests, admins see all
CREATE POLICY "Parents view own leave requests" ON public.leave_requests 
    FOR SELECT USING (true); -- Filter in app
CREATE POLICY "Parents create leave requests" ON public.leave_requests 
    FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins manage leave requests" ON public.leave_requests 
    FOR UPDATE USING (true);

-- Notification Preferences: Users manage their own preferences
CREATE POLICY "Users manage own preferences" ON public.notification_preferences 
    FOR ALL USING (true);

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

-- Function: Get unread notification count for a student
CREATE OR REPLACE FUNCTION public.get_unread_count(student_uuid UUID)
RETURNS INTEGER AS $$
BEGIN
    RETURN (
        SELECT COUNT(*)
        FROM public.notifications
        WHERE student_id = student_uuid 
        AND is_read = false
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Mark announcement as published and create notifications
CREATE OR REPLACE FUNCTION public.publish_announcement(announcement_uuid UUID)
RETURNS VOID AS $$
DECLARE
    announcement_record RECORD;
    student_record RECORD;
BEGIN
    -- Get announcement details
    SELECT * INTO announcement_record FROM public.announcements WHERE id = announcement_uuid;
    
    -- Update status
    UPDATE public.announcements SET status = 'published' WHERE id = announcement_uuid;
    
    -- Create notifications for target audience
    IF announcement_record.target_audience = 'all' OR announcement_record.target_audience = 'parents' THEN
        -- Create notification for each student (parents will see via student link)
        FOR student_record IN SELECT id, parent_phone FROM public.students LOOP
            INSERT INTO public.notifications (
                student_id,
                recipient_phone,
                type,
                notification_type,
                priority,
                category,
                message,
                data
            ) VALUES (
                student_record.id,
                student_record.parent_phone,
                'system',
                CASE WHEN announcement_record.send_sms THEN 'sms' ELSE 'push' END,
                announcement_record.priority,
                'announcements',
                announcement_record.title || ': ' || LEFT(announcement_record.content, 100),
                jsonb_build_object('announcement_id', announcement_uuid, 'title', announcement_record.title)
            );
        END LOOP;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Auto-expire old announcements
CREATE OR REPLACE FUNCTION public.expire_old_announcements()
RETURNS VOID AS $$
BEGIN
    UPDATE public.announcements
    SET status = 'expired'
    WHERE status = 'published'
    AND expires_at < NOW();
END;
$$ LANGUAGE plpgsql;
