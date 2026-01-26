-- Report Card V2 Schema
-- Supports attendance, behavior, and competency-based assessment

-- Table for general report metadata (Attendance, Remarks, Conduct)
CREATE TABLE IF NOT EXISTS public.report_metadata (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    term TEXT NOT NULL, -- e.g. "Term 1"
    year INTEGER NOT NULL, -- e.g. 2026
    attendance_present INTEGER DEFAULT 0,
    attendance_total INTEGER DEFAULT 90,
    conduct_rating TEXT, -- e.g. "Excellent", "Good", "Satisfactory", "Needs Improvement"
    responsibility_rating TEXT,
    punctuality_rating TEXT,
    teacher_remark TEXT,
    headteacher_remark TEXT,
    next_term_recommendation TEXT,
    is_locked BOOLEAN DEFAULT false, -- For admin lock feature
    UNIQUE(student_id, term, year)
);

-- Table for skill-based / CBC competencies
CREATE TABLE IF NOT EXISTS public.competencies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    term TEXT NOT NULL,
    year INTEGER NOT NULL,
    skill_name TEXT NOT NULL, -- e.g. "Communication", "Critical Thinking", "Collaboration"
    achievement_level TEXT NOT NULL, -- "Exceeds Expectations", "Meets Expectations", "Approaching Expectations", "Needs Support"
    UNIQUE(student_id, term, year, skill_name)
);

-- Enable RLS
ALTER TABLE public.report_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competencies ENABLE ROW LEVEL SECURITY;

-- Policies (Public read for Portal, Admin write)
CREATE POLICY "Allow public read report_metadata" ON public.report_metadata FOR SELECT USING (true);
CREATE POLICY "Allow public insert report_metadata" ON public.report_metadata FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update report_metadata" ON public.report_metadata FOR UPDATE USING (true);

CREATE POLICY "Allow public read competencies" ON public.competencies FOR SELECT USING (true);
CREATE POLICY "Allow public insert competencies" ON public.competencies FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update competencies" ON public.competencies FOR UPDATE USING (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_report_meta_student ON public.report_metadata(student_id);
CREATE INDEX IF NOT EXISTS idx_competencies_student ON public.competencies(student_id);
