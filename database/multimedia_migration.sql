-- Clean Migration: Add Missing Multimedia Tables
-- Run this if you got policy errors from the main schema

-- ============================================
-- 1. Add missing columns to site_settings (if table exists)
-- ============================================
DO $$ 
BEGIN
    -- Add promo_video_url column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'site_settings' AND column_name = 'promo_video_url'
    ) THEN
        ALTER TABLE site_settings ADD COLUMN promo_video_url TEXT;
    END IF;

    -- Add promo_video_thumbnail column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'site_settings' AND column_name = 'promo_video_thumbnail'
    ) THEN
        ALTER TABLE site_settings ADD COLUMN promo_video_thumbnail TEXT;
    END IF;
END $$;

-- Insert default homepage video setting if not exists
INSERT INTO site_settings (key, promo_video_url, promo_video_thumbnail)
VALUES (
    'homepage_video',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://images.unsplash.com/photo-1544531696-2822a09966ce?auto=format&fit=crop&q=80&w=1000'
)
ON CONFLICT (key) DO NOTHING;

-- ============================================
-- 2. PHOTO GALLERIES (Create if not exists)
-- ============================================
CREATE TABLE IF NOT EXISTS galleries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    cover_image_url TEXT,
    category TEXT,
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

-- Create indexes if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_galleries_category') THEN
        CREATE INDEX idx_galleries_category ON galleries(category);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_galleries_featured') THEN
        CREATE INDEX idx_galleries_featured ON galleries(is_featured);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_gallery_images_gallery_id') THEN
        CREATE INDEX idx_gallery_images_gallery_id ON gallery_images(gallery_id);
    END IF;
END $$;

-- ============================================
-- 3. STUDENT ACHIEVEMENTS (Create if not exists)
-- ============================================
CREATE TABLE IF NOT EXISTS achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_name TEXT NOT NULL,
    achievement_title TEXT NOT NULL,
    description TEXT,
    category TEXT,
    image_url TEXT,
    achievement_date DATE,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_achievements_featured') THEN
        CREATE INDEX idx_achievements_featured ON achievements(is_featured);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_achievements_category') THEN
        CREATE INDEX idx_achievements_category ON achievements(category);
    END IF;
END $$;

-- ============================================
-- 4. TEACHER VIDEOS (Create if not exists)
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
-- 5. ROW LEVEL SECURITY
-- ============================================
-- Enable RLS on new tables
ALTER TABLE galleries ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_videos ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate them
DO $$
BEGIN
    -- Galleries policies
    DROP POLICY IF EXISTS "Public can view galleries" ON galleries;
    CREATE POLICY "Public can view galleries" ON galleries FOR SELECT USING (true);
    
    DROP POLICY IF EXISTS "Authenticated users can manage galleries" ON galleries;
    CREATE POLICY "Authenticated users can manage galleries" ON galleries FOR ALL USING (auth.role() = 'authenticated');

    -- Gallery images policies
    DROP POLICY IF EXISTS "Public can view gallery images" ON gallery_images;
    CREATE POLICY "Public can view gallery images" ON gallery_images FOR SELECT USING (true);
    
    DROP POLICY IF EXISTS "Authenticated users can manage gallery images" ON gallery_images;
    CREATE POLICY "Authenticated users can manage gallery images" ON gallery_images FOR ALL USING (auth.role() = 'authenticated');

    -- Achievements policies
    DROP POLICY IF EXISTS "Public can view achievements" ON achievements;
    CREATE POLICY "Public can view achievements" ON achievements FOR SELECT USING (true);
    
    DROP POLICY IF EXISTS "Authenticated users can manage achievements" ON achievements;
    CREATE POLICY "Authenticated users can manage achievements" ON achievements FOR ALL USING (auth.role() = 'authenticated');

    -- Teacher videos policies
    DROP POLICY IF EXISTS "Public can view teacher videos" ON teacher_videos;
    CREATE POLICY "Public can view teacher videos" ON teacher_videos FOR SELECT USING (true);
    
    DROP POLICY IF EXISTS "Authenticated users can manage teacher videos" ON teacher_videos;
    CREATE POLICY "Authenticated users can manage teacher videos" ON teacher_videos FOR ALL USING (auth.role() = 'authenticated');
END $$;

-- ============================================
-- Success message
-- ============================================
DO $$
BEGIN
    RAISE NOTICE 'Multimedia schema migration completed successfully!';
END $$;
