-- Enhanced Multimedia Features Database Schema
-- Run this in your Supabase SQL Editor

-- ============================================
-- 1. SITE SETTINGS (for homepage video)
-- ============================================
CREATE TABLE IF NOT EXISTS site_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key TEXT UNIQUE NOT NULL,
    promo_video_url TEXT,
    promo_video_thumbnail TEXT,
    value JSONB, -- For future flexible settings
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert default homepage video setting
INSERT INTO site_settings (key, promo_video_url, promo_video_thumbnail)
VALUES (
    'homepage_video',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://images.unsplash.com/photo-1544531696-2822a09966ce?auto=format&fit=crop&q=80&w=1000'
)
ON CONFLICT (key) DO NOTHING;

-- ============================================
-- 2. PHOTO GALLERIES
-- ============================================
CREATE TABLE IF NOT EXISTS galleries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    cover_image_url TEXT,
    category TEXT, -- Events, Sports, Academics, Campus Life, etc.
    event_date DATE,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS gallery_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    gallery_id UUID REFERENCES galleries(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    caption TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_galleries_category ON galleries(category);
CREATE INDEX IF NOT EXISTS idx_galleries_featured ON galleries(is_featured);
CREATE INDEX IF NOT EXISTS idx_gallery_images_gallery_id ON gallery_images(gallery_id);

-- ============================================
-- 3. STUDENT ACHIEVEMENTS
-- ============================================
CREATE TABLE IF NOT EXISTS achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_name TEXT NOT NULL,
    achievement_title TEXT NOT NULL,
    description TEXT,
    category TEXT, -- Academic, Sports, Arts, Leadership, etc.
    image_url TEXT,
    achievement_date DATE,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_achievements_featured ON achievements(is_featured);
CREATE INDEX IF NOT EXISTS idx_achievements_category ON achievements(category);

-- ============================================
-- 4. TEACHER VIDEOS (Optional for Phase 1)
-- ============================================
CREATE TABLE IF NOT EXISTS teacher_videos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    teacher_name TEXT NOT NULL,
    position TEXT,
    video_url TEXT NOT NULL,
    thumbnail_url TEXT,
    bio TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 5. ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE galleries ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_videos ENABLE ROW LEVEL SECURITY;

-- Public read access for all tables
CREATE POLICY "Public can view site settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Public can view galleries" ON galleries FOR SELECT USING (true);
CREATE POLICY "Public can view gallery images" ON gallery_images FOR SELECT USING (true);
CREATE POLICY "Public can view achievements" ON achievements FOR SELECT USING (true);
CREATE POLICY "Public can view teacher videos" ON teacher_videos FOR SELECT USING (true);

-- Admin full access (you'll need to create an admin role or use auth.uid())
-- For now, allowing authenticated users full access - adjust based on your auth setup
CREATE POLICY "Authenticated users can manage site settings" ON site_settings FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage galleries" ON galleries FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage gallery images" ON gallery_images FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage achievements" ON achievements FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage teacher videos" ON teacher_videos FOR ALL USING (auth.role() = 'authenticated');

-- ============================================
-- 6. STORAGE BUCKETS
-- ============================================
-- Run these in Supabase Storage section or via SQL:

-- Create storage bucket for galleries
INSERT INTO storage.buckets (id, name, public)
VALUES ('galleries', 'galleries', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage bucket for achievements
INSERT INTO storage.buckets (id, name, public)
VALUES ('achievements', 'achievements', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for galleries bucket
CREATE POLICY "Public can view gallery images" ON storage.objects FOR SELECT USING (bucket_id = 'galleries');
CREATE POLICY "Authenticated users can upload gallery images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'galleries' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update gallery images" ON storage.objects FOR UPDATE USING (bucket_id = 'galleries' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete gallery images" ON storage.objects FOR DELETE USING (bucket_id = 'galleries' AND auth.role() = 'authenticated');

-- Storage policies for achievements bucket
CREATE POLICY "Public can view achievement images" ON storage.objects FOR SELECT USING (bucket_id = 'achievements');
CREATE POLICY "Authenticated users can upload achievement images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'achievements' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update achievement images" ON storage.objects FOR UPDATE USING (bucket_id = 'achievements' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete achievement images" ON storage.objects FOR DELETE USING (bucket_id = 'achievements' AND auth.role() = 'authenticated');
