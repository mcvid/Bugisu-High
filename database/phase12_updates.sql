-- Create newsletter_subscriptions table
CREATE TABLE IF NOT EXISTS public.newsletter_subscriptions (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for newsletter_subscriptions
ALTER TABLE public.newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable insert for all users" ON public.newsletter_subscriptions
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable read for authenticated users only" ON public.newsletter_subscriptions
    FOR SELECT USING (auth.role() = 'authenticated');

-- Add reference_no to admission_applications
-- We use a simple random 8-character string or numeric code
-- For this implementation, let's use a function to generate one if not provided

ALTER TABLE public.admission_applications 
ADD COLUMN IF NOT EXISTS reference_no TEXT UNIQUE;

-- Function to generate a random reference number (simple version)
CREATE OR REPLACE FUNCTION generate_reference_no() RETURNS TEXT AS $$
DECLARE
    chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    result TEXT := '';
    i INTEGER := 0;
BEGIN
    FOR i IN 1..8 LOOP
        result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
    END LOOP;
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Update existing applications with a reference number
UPDATE public.admission_applications 
SET reference_no = generate_reference_no() 
WHERE reference_no IS NULL;
