-- Migration: Gratitude Wall
-- Stores monetary contributions and gratitude messages from donors

CREATE TABLE IF NOT EXISTS gratitude_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id text REFERENCES profiles(id) ON DELETE SET NULL,
  display_name text,
  is_anonymous boolean DEFAULT false,
  amount numeric(10, 2) DEFAULT 0,
  message_content text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE gratitude_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public to view gratitude messages" ON gratitude_messages
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to post" ON gratitude_messages
  FOR INSERT WITH CHECK (true);
