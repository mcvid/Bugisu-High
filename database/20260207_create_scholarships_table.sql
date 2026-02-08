-- Create scholarships table
CREATE TABLE IF NOT EXISTS scholarships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES schools(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    eligibility TEXT,
    amount DECIMAL(10, 2),
    coverage_type VARCHAR(50) DEFAULT 'partial', -- 'full', 'partial', 'specific'
    coverage_details TEXT,
    academic_year VARCHAR(20) NOT NULL, -- '2026/2027', '2027/2028', etc.
    deadline DATE,
    requirements TEXT[],
    application_link VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE scholarships ENABLE ROW LEVEL SECURITY;

-- Public can view active scholarships
CREATE POLICY "Public can view active scholarships"
    ON scholarships FOR SELECT
    USING (is_active = true);

-- Authenticated users can view all scholarships
CREATE POLICY "Authenticated users can view all scholarships"
    ON scholarships FOR SELECT
    TO authenticated
    USING (true);

-- Admin can insert scholarships
CREATE POLICY "Admin can insert scholarships"
    ON scholarships FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Admin can update scholarships
CREATE POLICY "Admin can update scholarships"
    ON scholarships FOR UPDATE
    TO authenticated
    USING (true);

-- Admin can delete scholarships
CREATE POLICY "Admin can delete scholarships"
    ON scholarships FOR DELETE
    TO authenticated
    USING (true);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_scholarships_academic_year ON scholarships(academic_year);
CREATE INDEX IF NOT EXISTS idx_scholarships_is_active ON scholarships(is_active);
CREATE INDEX IF NOT EXISTS idx_scholarships_school_id ON scholarships(school_id);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_scholarships_updated_at
    BEFORE UPDATE ON scholarships
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
