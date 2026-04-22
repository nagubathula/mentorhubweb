-- Migration: Initial Schema
-- Creates the core profiles table used for both students and mentors

CREATE TABLE IF NOT EXISTS profiles (
  id text PRIMARY KEY,
  name text,
  email text,
  role text CHECK (role IN ('STUDENT', 'MENTOR', 'ADMIN')),
  expertise text,
  preferences jsonb,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public inserts" ON profiles;
DROP POLICY IF EXISTS "Allow public select" ON profiles;
DROP POLICY IF EXISTS "Allow public updates" ON profiles;

CREATE POLICY "Allow public inserts" ON profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select" ON profiles FOR SELECT USING (true);
CREATE POLICY "Allow public updates" ON profiles FOR UPDATE USING (true);
