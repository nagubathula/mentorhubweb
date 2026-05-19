-- Migration: Create platform_feedback table
-- Created on: 2026-05-19

CREATE TABLE IF NOT EXISTS platform_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT REFERENCES profiles(id) ON DELETE SET NULL,
    user_name TEXT,
    user_email TEXT,
    user_role TEXT, -- 'student' | 'mentor' | 'admin'
    message TEXT NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE platform_feedback ENABLE ROW LEVEL SECURITY;

-- Allow anonymous and authenticated inserts/selects for simplicity or open policies
DROP POLICY IF EXISTS "Allow public insert on platform_feedback" ON platform_feedback;
CREATE POLICY "Allow public insert on platform_feedback" ON platform_feedback FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public select on platform_feedback" ON platform_feedback;
CREATE POLICY "Allow public select on platform_feedback" ON platform_feedback FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public update on platform_feedback" ON platform_feedback;
CREATE POLICY "Allow public update on platform_feedback" ON platform_feedback FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow public delete on platform_feedback" ON platform_feedback;
CREATE POLICY "Allow public delete on platform_feedback" ON platform_feedback FOR DELETE USING (true);
