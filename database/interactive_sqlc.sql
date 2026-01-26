-- Interactive Features Schema
-- Run this in Supabase SQL Editor

-- ============================================
-- LIVE CHAT SCHEMA
-- ============================================

-- Chat sessions table
CREATE TABLE IF NOT EXISTS chat_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_name TEXT,
    user_email TEXT,
    status TEXT DEFAULT 'active', -- active, closed, archived
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat messages table
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
    sender_type TEXT NOT NULL, -- 'user' or 'admin'
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security for Chat
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Policies for chat_sessions
-- Anyone can create a session (for new visitors)
CREATE POLICY "Public can create chat sessions" 
ON chat_sessions FOR INSERT 
WITH CHECK (true);

-- Users can only see their own session (via local storage ID match - simplified for now to public insert/select for anon)
-- Ideally we'd use a cookie/token, but for simplicity we'll allow public select for now or restrict to ID match if possible.
-- For this Phase, we'll allow public to select to simplify the widget polling, 
-- but in production you'd want strictly cookie-based auth.
CREATE POLICY "Public can view chat sessions" 
ON chat_sessions FOR SELECT 
USING (true); 

-- Admins can view/update all
CREATE POLICY "Admins can manage all chat sessions" 
ON chat_sessions FOR ALL 
USING (auth.role() = 'authenticated');

-- Policies for chat_messages
CREATE POLICY "Public can insert messages" 
ON chat_messages FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Public can view messages" 
ON chat_messages FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage all messages" 
ON chat_messages FOR ALL 
USING (auth.role() = 'authenticated');


-- ============================================
-- ONLINE ADMISSIONS SCHEMA
-- ============================================

-- Applications table
CREATE TABLE IF NOT EXISTS admission_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    -- Student Details
    student_name TEXT NOT NULL,
    date_of_birth DATE,
    gender TEXT,
    religion TEXT,
    nationality TEXT,
    
    -- Academic Details
    program TEXT NOT NULL, -- O-Level, A-Level
    entry_class TEXT NOT NULL, -- S1, S5
    previous_school TEXT,
    ple_aggregates INTEGER, -- For S1
    uce_aggregates INTEGER, -- For S5
    
    -- Parent/Guardian Details
    parent_name TEXT NOT NULL,
    parent_phone TEXT NOT NULL,
    parent_email TEXT,
    parent_occupation TEXT,
    
    -- Documents (Supabase Storage URLs)
    photo_url TEXT,
    result_slip_url TEXT,
    
    -- Meta
    status TEXT DEFAULT 'pending', -- pending, under_review, accepted, rejected
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE admission_applications ENABLE ROW LEVEL SECURITY;

-- Public can insert (submit application)
CREATE POLICY "Public can submit applications" 
ON admission_applications FOR INSERT 
WITH CHECK (true);

-- Only admins can view/update/delete
CREATE POLICY "Admins can manage applications" 
ON admission_applications FOR ALL 
USING (auth.role() = 'authenticated');

-- ============================================
-- STORAGE BUCKETS FOR APPLICATIONS
-- ============================================
-- Create bucket for application documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('applications', 'applications', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
DROP POLICY IF EXISTS "Public can upload application files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can manage application files" ON storage.objects;

CREATE POLICY "Public can upload application files" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'applications');

CREATE POLICY "Admins can manage application files" 
ON storage.objects FOR ALL 
USING (bucket_id = 'applications' AND auth.role() = 'authenticated');

-- ============================================
-- FEEDBACK / Q&A SCHEMA
-- ============================================

CREATE TABLE IF NOT EXISTS feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT,
    email TEXT,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'general', -- general, q_and_a, complaint
    status TEXT DEFAULT 'new',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can submit feedback" 
ON feedback FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can manage feedback" 
ON feedback FOR ALL 
USING (auth.role() = 'authenticated');

-- Success Message
DO $$
BEGIN
    RAISE NOTICE 'Interactive features schema created successfully!';
END $$;
