-- Database Indexes for Performance Optimization
-- Run these in your Supabase SQL Editor

-- 1. Indexing News for fast filtering and searching
CREATE INDEX IF NOT EXISTS idx_news_published_at ON news (published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_is_published ON news (is_published) WHERE is_published = true;
-- GIN index for fuzzy title search
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX IF NOT EXISTS idx_news_title_trgm ON news USING gin (title gin_trgm_ops);

-- 2. Indexing Events for date sorting
CREATE INDEX IF NOT EXISTS idx_events_date ON events (event_date);

-- 3. Indexing Teachers for name lookups
CREATE INDEX IF NOT EXISTS idx_teachers_name ON teachers (name);

-- 4. Indexing Admin for role/name lookups
CREATE INDEX IF NOT EXISTS idx_administration_name ON administration (name);

-- 5. Indexing Chat Sessions for performance tracking
CREATE INDEX IF NOT EXISTS idx_chat_sessions_updated ON chat_sessions (updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session ON chat_messages (session_id);

-- 6. Indexing Content for Search Index (if using tables for pages)
-- Example: CREATE INDEX idx_pages_keywords ON pages USING GIN (keywords);
