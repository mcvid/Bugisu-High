-- Create table to track daily visits
CREATE TABLE IF NOT EXISTS public.daily_visits (
    visit_date DATE PRIMARY KEY DEFAULT CURRENT_DATE,
    visit_count INTEGER DEFAULT 1
);

-- Enable RLS
ALTER TABLE public.daily_visits ENABLE ROW LEVEL SECURITY;

-- Allow public read access (for admin) and public write access (for tracking)
-- In a stricter app, tracking would be done via an RPC function with security definer
CREATE POLICY "Allow public select on daily_visits"
    ON public.daily_visits FOR SELECT
    USING (true);

CREATE POLICY "Allow public insert/update on daily_visits"
    ON public.daily_visits FOR ALL
    USING (true)
    WITH CHECK (true);

-- Function to increment visit count safely
CREATE OR REPLACE FUNCTION increment_visit_count()
RETURNS void AS $$
BEGIN
    INSERT INTO public.daily_visits (visit_date, visit_count)
    VALUES (CURRENT_DATE, 1)
    ON CONFLICT (visit_date)
    DO UPDATE SET visit_count = daily_visits.visit_count + 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
