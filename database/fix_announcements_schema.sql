-- Fix: Ensure the announcements table has all required columns and correct constraints
-- This script safely adds missing columns if they don't exist.

DO $$ 
BEGIN 
    -- 1. Check priority column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' AND table_name = 'announcements' AND column_name = 'priority') THEN
        ALTER TABLE public.announcements ADD COLUMN priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent'));
    END IF;

    -- 2. Check target_audience column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' AND table_name = 'announcements' AND column_name = 'target_audience') THEN
        ALTER TABLE public.announcements ADD COLUMN target_audience TEXT DEFAULT 'all' CHECK (target_audience IN ('all', 'parents', 'students', 'staff', 'specific_class'));
    END IF;

    -- 3. Check target_classes column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' AND table_name = 'announcements' AND column_name = 'target_classes') THEN
        ALTER TABLE public.announcements ADD COLUMN target_classes TEXT[];
    END IF;

    -- 4. Check send_sms and send_push
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' AND table_name = 'announcements' AND column_name = 'send_sms') THEN
        ALTER TABLE public.announcements ADD COLUMN send_sms BOOLEAN DEFAULT false;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' AND table_name = 'announcements' AND column_name = 'send_push') THEN
        ALTER TABLE public.announcements ADD COLUMN send_push BOOLEAN DEFAULT true;
    END IF;

    -- 5. Check expires_at
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' AND table_name = 'announcements' AND column_name = 'expires_at') THEN
        ALTER TABLE public.announcements ADD COLUMN expires_at TIMESTAMP WITH TIME ZONE;
    END IF;

    -- 6. Check status column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' AND table_name = 'announcements' AND column_name = 'status') THEN
        ALTER TABLE public.announcements ADD COLUMN status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published', 'expired'));
    END IF;

END $$;

-- Ensure RLS is enabled and policies are correct
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- Re-create policies if needed (using DROP/CREATE for safety)
DROP POLICY IF EXISTS "Public read published announcements" ON public.announcements;
CREATE POLICY "Public read published announcements" ON public.announcements 
    FOR SELECT USING (status = 'published');

DROP POLICY IF EXISTS "Admins manage announcements" ON public.announcements;
CREATE POLICY "Admins manage announcements" ON public.announcements 
    FOR ALL USING (true); -- In production, use auth.role() = 'admin' or similar
