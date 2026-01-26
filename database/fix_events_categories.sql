-- Full Events Table Setup and Category Standardisation
-- Run this in your Supabase SQL Editor if you get "relation events does not exist" 
-- or category check constraint errors.

-- 1. Create the events table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.events (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    event_date TIMESTAMP WITH TIME ZONE NOT NULL,
    location TEXT,
    category TEXT NOT NULL DEFAULT 'General',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Standardise Categories via Check Constraint
-- Drop if exists to clean up old versions
ALTER TABLE IF EXISTS public.events DROP CONSTRAINT IF EXISTS events_category_check;

-- Add the new, comprehensive constraint
ALTER TABLE public.events ADD CONSTRAINT events_category_check 
CHECK (category IN (
    'General', 
    'Academics', 
    'Term Dates', 
    'Holiday', 
    'Exam', 
    'Sports', 
    'Other'
));

-- 3. Ensure Row Level Security (RLS)
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- 4. Set up Policies
DROP POLICY IF EXISTS "Public can read events" ON public.events;
CREATE POLICY "Public can read events" ON public.events FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated can manage events" ON public.events;
CREATE POLICY "Authenticated can manage events" ON public.events FOR ALL TO authenticated USING (true);

-- 5. Add useful index for performance
CREATE INDEX IF NOT EXISTS idx_events_date_opt ON public.events (event_date);
