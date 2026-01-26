-- Create Site Alerts Table for high-priority navbar notifications
CREATE TABLE IF NOT EXISTS public.site_alerts (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    message TEXT NOT NULL,
    target_date TIMESTAMP WITH TIME ZONE,
    target_label TEXT DEFAULT 'Countdown:',
    is_active BOOLEAN DEFAULT false,
    type TEXT DEFAULT 'info' CHECK (type IN ('info', 'urgent', 'event', 'success')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS Policies
ALTER TABLE public.site_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON public.site_alerts
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON public.site_alerts
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users only" ON public.site_alerts
    FOR UPDATE USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users only" ON public.site_alerts
    FOR DELETE USING (auth.role() = 'authenticated');
