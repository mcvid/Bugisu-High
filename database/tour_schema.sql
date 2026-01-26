-- Create Tours storage bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('campus_tours', 'campus_tours', true)
ON CONFLICT (id) DO NOTHING;

-- Policy to allow public access to tour images
CREATE POLICY "Public Access Tour Images"
ON storage.objects FOR SELECT
USING ( bucket_id = 'campus_tours' );

-- Policy to allow authenticated uploads/deletes
CREATE POLICY "Auth Upload Tour Images"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'campus_tours' AND auth.role() = 'authenticated' );

CREATE POLICY "Auth Delete Tour Images"
ON storage.objects FOR DELETE
USING ( bucket_id = 'campus_tours' AND auth.role() = 'authenticated' );

-- Create tour_stops table
CREATE TABLE IF NOT EXISTS tour_stops (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT NOT NULL,
    thumbnail_url TEXT,
    initial_yaw NUMERIC DEFAULT 0,
    initial_pitch NUMERIC DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tour_hotspots table
CREATE TABLE IF NOT EXISTS tour_hotspots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    stop_id UUID REFERENCES tour_stops(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('info', 'navigation')),
    target_stop_id UUID REFERENCES tour_stops(id) ON DELETE SET NULL, -- For navigation type
    pitch NUMERIC NOT NULL,
    yaw NUMERIC NOT NULL,
    label TEXT,
    content TEXT, -- For info type
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE tour_stops ENABLE ROW LEVEL SECURITY;
ALTER TABLE tour_hotspots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Stops" ON tour_stops FOR SELECT USING (true);
CREATE POLICY "Admin All Stops" ON tour_stops FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Public Read Hotspots" ON tour_hotspots FOR SELECT USING (true);
CREATE POLICY "Admin All Hotspots" ON tour_hotspots FOR ALL USING (auth.role() = 'authenticated');
