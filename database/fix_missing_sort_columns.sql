-- Fix Missing Sort Columns
-- This adds the columns causing the crash on the Departments page

-- 1. Add sort_order to departments
ALTER TABLE public.departments ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;

-- 2. Add hierarchy_order to teachers (just in case it's missing too)
ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS hierarchy_order INTEGER DEFAULT 0;

-- 3. Set some default values for existing rows so they aren't null
UPDATE public.departments SET sort_order = 0 WHERE sort_order IS NULL;
UPDATE public.teachers SET hierarchy_order = 0 WHERE hierarchy_order IS NULL;
