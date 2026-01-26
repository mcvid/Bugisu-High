-- Add category column if it doesn't exist
ALTER TABLE public.subjects ADD COLUMN IF NOT EXISTS category TEXT;

-- Update existing subjects with a default category if null
UPDATE public.subjects SET category = 'General' WHERE category IS NULL;
