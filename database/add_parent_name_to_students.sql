-- Add parent_name column to students table
ALTER TABLE IF EXISTS public.students 
ADD COLUMN IF NOT EXISTS parent_name TEXT;

-- Update existing students if they have corresponding applications (best effort)
UPDATE public.students s
SET parent_name = a.parent_name
FROM public.admission_applications a
WHERE s.parent_email = a.parent_email 
  AND s.parent_name IS NULL;
