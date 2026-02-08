-- Create scholarship_applications table
CREATE TABLE IF NOT EXISTS scholarship_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    scholarship_id UUID REFERENCES scholarships(id),
    category VARCHAR(50) NOT NULL, -- 'Sports', 'Academics', 'Other'
    student_name VARCHAR(255) NOT NULL,
    date_of_birth DATE,
    gender VARCHAR(20),
    email VARCHAR(255),
    phone VARCHAR(50) NOT NULL,
    previous_school VARCHAR(255),
    data JSONB NOT NULL DEFAULT '{}'::jsonb, -- dynamic fields (aggregates, sports info, etc.)
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE scholarship_applications ENABLE ROW LEVEL SECURITY;

-- Public can insert scholarship applications
CREATE POLICY "Public can insert scholarship applications"
    ON scholarship_applications FOR INSERT
    WITH CHECK (true);

-- Authenticated users (admin) can view all applications
CREATE POLICY "Authenticated users can view all applications"
    ON scholarship_applications FOR SELECT
    TO authenticated
    USING (true);

-- Admin can update applications
CREATE POLICY "Admin can update applications"
    ON scholarship_applications FOR UPDATE
    TO authenticated
    USING (true);

-- Admin can delete applications
CREATE POLICY "Admin can delete applications"
    ON scholarship_applications FOR DELETE
    TO authenticated
    USING (true);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_scholarship_apps_scholarship_id ON scholarship_applications(scholarship_id);
CREATE INDEX IF NOT EXISTS idx_scholarship_apps_status ON scholarship_applications(status);

-- Add updated_at trigger
CREATE TRIGGER update_scholarship_applications_updated_at
    BEFORE UPDATE ON scholarship_applications
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
