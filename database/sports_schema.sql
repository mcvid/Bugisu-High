-- Sports Teams Table
CREATE TABLE IF NOT EXISTS sports_teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL, -- e.g. "School Football Team", "Girls' Netball"
    sport TEXT NOT NULL, -- e.g. Football, Netball, Volleyball
    description TEXT,
    coach_name TEXT,
    image_url TEXT, -- Team photo
    created_at TIMESTAMP DEFAULT NOW()
);

-- Team Members Table
CREATE TABLE IF NOT EXISTS team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID REFERENCES sports_teams(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    position TEXT, -- e.g. Goalkeeper, Striker, Captain
    jersey_number TEXT,
    photo_url TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Matches Table
CREATE TABLE IF NOT EXISTS matches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID REFERENCES sports_teams(id) ON DELETE CASCADE,
    opponent TEXT NOT NULL, -- e.g. "Mbale High School"
    match_date TIMESTAMP WITH TIME ZONE,
    location TEXT, -- e.g. "Home", "Away", "National Stadium"
    home_score INTEGER,
    away_score INTEGER,
    status TEXT DEFAULT 'scheduled', -- scheduled, completed, cancelled, live
    highlights_url TEXT, -- Link to video highlight
    created_at TIMESTAMP DEFAULT NOW()
);

-- Clubs Table
CREATE TABLE IF NOT EXISTS clubs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL, -- e.g. "Debating Club", "Science Club"
    description TEXT,
    meeting_day TEXT, -- e.g. "Every Wednesday 4PM"
    patron_name TEXT,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE sports_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE clubs ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public read sports" ON sports_teams FOR SELECT TO public USING (true);
CREATE POLICY "Admin write sports" ON sports_teams FOR ALL TO authenticated USING (true);

CREATE POLICY "Public read members" ON team_members FOR SELECT TO public USING (true);
CREATE POLICY "Admin write members" ON team_members FOR ALL TO authenticated USING (true);

CREATE POLICY "Public read matches" ON matches FOR SELECT TO public USING (true);
CREATE POLICY "Admin write matches" ON matches FOR ALL TO authenticated USING (true);

CREATE POLICY "Public read clubs" ON clubs FOR SELECT TO public USING (true);
CREATE POLICY "Admin write clubs" ON clubs FOR ALL TO authenticated USING (true);

-- Storage bucket for sports and clubs
INSERT INTO storage.buckets (id, name, public) 
VALUES ('sports_clubs', 'sports_clubs', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Public Access Sports" 
  ON storage.objects FOR SELECT 
  TO public 
  USING (bucket_id = 'sports_clubs');

CREATE POLICY "Auth Upload Sports" 
  ON storage.objects FOR INSERT 
  TO authenticated 
  WITH CHECK (bucket_id = 'sports_clubs');

CREATE POLICY "Auth Delete Sports" 
  ON storage.objects FOR DELETE 
  TO authenticated 
  USING (bucket_id = 'sports_clubs');
