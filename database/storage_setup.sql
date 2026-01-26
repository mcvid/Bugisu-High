-- Storage Buckets Setup for Multimedia
-- Run this in Supabase SQL Editor AFTER running multimedia_migration.sql

-- ============================================
-- CREATE STORAGE BUCKETS
-- ============================================

-- Create videos bucket for uploaded video files
INSERT INTO storage.buckets (id, name, public)
VALUES ('videos', 'videos', true)
ON CONFLICT (id) DO NOTHING;

-- galleries bucket already created in main migration
-- Just ensure it exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('galleries', 'galleries', true)
ON CONFLICT (id) DO NOTHING;

-- achievements bucket already created in main migration
INSERT INTO storage.buckets (id, name, public)
VALUES ('achievements', 'achievements', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- STORAGE POLICIES FOR VIDEOS BUCKET
-- ============================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public can view videos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload videos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update videos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete videos" ON storage.objects;

-- Public read access for videos
CREATE POLICY "Public can view videos" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'videos');

-- Authenticated users can upload videos
CREATE POLICY "Authenticated users can upload videos" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'videos' AND auth.role() = 'authenticated');

-- Authenticated users can update videos
CREATE POLICY "Authenticated users can update videos" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'videos' AND auth.role() = 'authenticated');

-- Authenticated users can delete videos
CREATE POLICY "Authenticated users can delete videos" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'videos' AND auth.role() = 'authenticated');

-- ============================================
-- Success message
-- ============================================
DO $$
BEGIN
    RAISE NOTICE 'Storage buckets and policies created successfully!';
END $$;
