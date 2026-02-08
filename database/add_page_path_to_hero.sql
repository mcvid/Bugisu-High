-- Add page_path column to support different pages
-- Default value is '/' for the homepage
ALTER TABLE public.hero_slides ADD COLUMN IF NOT EXISTS page_path TEXT DEFAULT '/';

-- Create an index for faster lookups by page
CREATE INDEX IF NOT EXISTS idx_hero_slides_page_path ON public.hero_slides(page_path);

-- Update existing slides to belong to homepage if they don't have a path
UPDATE public.hero_slides SET page_path = '/' WHERE page_path IS NULL;
