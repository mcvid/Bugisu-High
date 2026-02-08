-- Add video_url column to hero_slides
ALTER TABLE public.hero_slides ADD COLUMN IF NOT EXISTS video_url TEXT;

-- Update existing policy to ensure authenticated users can manage it (already handled by 'all' policy but explicitly stating for safety)
-- Policies for hero_slides already exist in supabase_schema.sql as "all" for authenticated.
