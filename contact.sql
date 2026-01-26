-- 10. CONTACT TABLES

-- Contact Settings (School Address, Phones, Emails, Hours)
CREATE TABLE IF NOT EXISTS public.contact_settings (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  address text NOT NULL,
  phone_main text NOT NULL,
  phone_admissions text,
  email_general text NOT NULL,
  email_admissions text,
  office_hours text NOT NULL,
  map_embed_url text, -- For Google Maps iframe
  updated_at timestamptz DEFAULT now()
);

-- Contact Messages (Inquiries from the form)
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  subject text,
  message text NOT NULL,
  status text DEFAULT 'Unread', -- Unread, Read, Replied, Archived
  created_at timestamptz DEFAULT now()
);

-- RLS Policies for Contact
ALTER TABLE public.contact_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Drop existing to prevent errors
DROP POLICY IF EXISTS "Public can read contact_settings" ON public.contact_settings;
DROP POLICY IF EXISTS "Public can insert contact_messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Admin handle contact_settings" ON public.contact_settings;
DROP POLICY IF EXISTS "Admin handle contact_messages" ON public.contact_messages;

-- Public Access
CREATE POLICY "Public can read contact_settings" ON public.contact_settings FOR SELECT USING (true);
CREATE POLICY "Public can insert contact_messages" ON public.contact_messages FOR INSERT WITH CHECK (true);

-- Admin Access
CREATE POLICY "Admin handle contact_settings" ON public.contact_settings FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin handle contact_messages" ON public.contact_messages FOR ALL TO authenticated USING (true);

-- Initial seed for contact settings if none exist
INSERT INTO public.contact_settings (address, phone_main, email_general, office_hours, map_embed_url)
SELECT 
    'Bugisu High School, Mbale, Uganda', 
    '+256 000 000 000', 
    'info@bugisuhighschool.com', 
    'Mon - Fri: 8:00 AM - 5:00 PM',
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.097062909087!2d34.17268087521489!3d1.0894636989000828!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1778b63874ea2aa9%3A0x8da182477d64c8fa!2sBugisu%20High%20School!5e0!3m2!1sen!2sug!4v1768122083514!5m2!1sen!2sug'
WHERE NOT EXISTS (SELECT 1 FROM public.contact_settings);
