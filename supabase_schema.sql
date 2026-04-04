-- Supabase Schema Setup
-- Paste this into your Supabase SQL Editor to create the necessary tables.

CREATE TABLE IF NOT EXISTS profiles (
  id text PRIMARY KEY,
  name text,
  email text,
  role text CHECK (role IN ('STUDENT', 'MENTOR')),
  expertise text,
  preferences jsonb,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Turn on row level security for the `profiles` table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Allow public inserts and selects for the prototype phase
CREATE POLICY "Allow public inserts" ON profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select" ON profiles FOR SELECT USING (true);
CREATE POLICY "Allow public updates" ON profiles FOR UPDATE USING (true);
