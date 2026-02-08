-- MULTI-TENANCY MIGRATION
-- Migration to support multiple schools using a single database.

-- 1. Create the Schools table
CREATE TABLE IF NOT EXISTS public.schools (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    logo_url TEXT,
    primary_color TEXT DEFAULT '#4A5568',
    secondary_color TEXT DEFAULT '#718096',
    contact_email TEXT,
    contact_phone TEXT,
    address TEXT,
    active BOOLEAN DEFAULT true
);

-- 2. Seed the first school (Bugisu High School)
-- We use a fixed UUID for Bugisu so we can link existing data easily.
INSERT INTO public.schools (id, name, slug, logo_url, primary_color, secondary_color, contact_email, contact_phone, address)
VALUES (
    'b4e9e0e0-e0e0-4e0e-8e0e-e0e0e0e0e0e0', 
    'Bugisu High School', 
    'bugisu-high', 
    '/logo.png', 
    '#006400', 
    '#facc15', 
    'info@bugisuhighschool.com', 
    '+256 000 000 000', 
    'Bugisu High School, Mbale, Uganda'
)
ON CONFLICT (slug) DO NOTHING;

-- 3. Add school_id to all relevant tables
-- Core Content
ALTER TABLE public.news ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES public.schools(id) DEFAULT 'b4e9e0e0-e0e0-4e0e-8e0e-e0e0e0e0e0e0';
ALTER TABLE public.announcements ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES public.schools(id) DEFAULT 'b4e9e0e0-e0e0-4e0e-8e0e-e0e0e0e0e0e0';
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES public.schools(id) DEFAULT 'b4e9e0e0-e0e0-4e0e-8e0e-e0e0e0e0e0e0';
ALTER TABLE public.gallery ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES public.schools(id) DEFAULT 'b4e9e0e0-e0e0-4e0e-8e0e-e0e0e0e0e0e0';
ALTER TABLE public.hero_slides ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES public.schools(id) DEFAULT 'b4e9e0e0-e0e0-4e0e-8e0e-e0e0e0e0e0e0';
ALTER TABLE public.administration ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES public.schools(id) DEFAULT 'b4e9e0e0-e0e0-4e0e-8e0e-e0e0e0e0e0e0';

-- Academics
ALTER TABLE public.academic_levels ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES public.schools(id) DEFAULT 'b4e9e0e0-e0e0-4e0e-8e0e-e0e0e0e0e0e0';
ALTER TABLE public.departments ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES public.schools(id) DEFAULT 'b4e9e0e0-e0e0-4e0e-8e0e-e0e0e0e0e0e0';
ALTER TABLE public.subjects ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES public.schools(id) DEFAULT 'b4e9e0e0-e0e0-4e0e-8e0e-e0e0e0e0e0e0';
ALTER TABLE public.grades ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES public.schools(id) DEFAULT 'b4e9e0e0-e0e0-4e0e-8e0e-e0e0e0e0e0e0';

-- Admissions
ALTER TABLE public.admissions_settings ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES public.schools(id) DEFAULT 'b4e9e0e0-e0e0-4e0e-8e0e-e0e0e0e0e0e0';
ALTER TABLE public.admissions_steps ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES public.schools(id) DEFAULT 'b4e9e0e0-e0e0-4e0e-8e0e-e0e0e0e0e0e0';
ALTER TABLE public.admissions_requirements ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES public.schools(id) DEFAULT 'b4e9e0e0-e0e0-4e0e-8e0e-e0e0e0e0e0e0';
ALTER TABLE public.admissions_inquiries ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES public.schools(id) DEFAULT 'b4e9e0e0-e0e0-4e0e-8e0e-e0e0e0e0e0e0';
ALTER TABLE public.admissions_downloads ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES public.schools(id) DEFAULT 'b4e9e0e0-e0e0-4e0e-8e0e-e0e0e0e0e0e0';
ALTER TABLE public.admission_applications ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES public.schools(id) DEFAULT 'b4e9e0e0-e0e0-4e0e-8e0e-e0e0e0e0e0e0';

-- Contact
ALTER TABLE public.contact_settings ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES public.schools(id) DEFAULT 'b4e9e0e0-e0e0-4e0e-8e0e-e0e0e0e0e0e0';
ALTER TABLE public.contact_messages ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES public.schools(id) DEFAULT 'b4e9e0e0-e0e0-4e0e-8e0e-e0e0e0e0e0e0';

-- Students & Finance
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES public.schools(id) DEFAULT 'b4e9e0e0-e0e0-4e0e-8e0e-e0e0e0e0e0e0';
ALTER TABLE public.fees_structure ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES public.schools(id) DEFAULT 'b4e9e0e0-e0e0-4e0e-8e0e-e0e0e0e0e0e0';
ALTER TABLE public.fee_payments ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES public.schools(id) DEFAULT 'b4e9e0e0-e0e0-4e0e-8e0e-e0e0e0e0e0e0';
ALTER TABLE public.daily_visits ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES public.schools(id) DEFAULT 'b4e9e0e0-e0e0-4e0e-8e0e-e0e0e0e0e0e0';

-- Sports & Clubs
ALTER TABLE public.sports_teams ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES public.schools(id) DEFAULT 'b4e9e0e0-e0e0-4e0e-8e0e-e0e0e0e0e0e0';
ALTER TABLE public.clubs ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES public.schools(id) DEFAULT 'b4e9e0e0-e0e0-4e0e-8e0e-e0e0e0e0e0e0';
ALTER TABLE public.matches ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES public.schools(id) DEFAULT 'b4e9e0e0-e0e0-4e0e-8e0e-e0e0e0e0e0e0';

-- Other
ALTER TABLE public.site_alerts ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES public.schools(id) DEFAULT 'b4e9e0e0-e0e0-4e0e-8e0e-e0e0e0e0e0e0';
ALTER TABLE public.tour_stops ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES public.schools(id) DEFAULT 'b4e9e0e0-e0e0-4e0e-8e0e-e0e0e0e0e0e0';
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES public.schools(id) DEFAULT 'b4e9e0e0-e0e0-4e0e-8e0e-e0e0e0e0e0e0';

-- Profiles (Special case: Profiles can potentially belong to schools or be global admins)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES public.schools(id) DEFAULT 'b4e9e0e0-e0e0-4e0e-8e0e-e0e0e0e0e0e0';

-- 4. Enable RLS and update policies (Simplified for this migration)
-- This is a template for what we'll do for all tables.
-- Example:
-- DROP POLICY IF EXISTS "school_isolation" ON public.news;
-- CREATE POLICY "school_isolation" ON public.news FOR ALL USING (school_id = (SELECT current_setting('app.active_school_id')::UUID));

-- For now, we update the schools and policies manually or via subsequent steps.
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read active schools" ON public.schools FOR SELECT USING (active = true);
