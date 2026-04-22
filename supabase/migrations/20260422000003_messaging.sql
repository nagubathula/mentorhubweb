-- Migration: Messaging
-- Direct messages between users and admin inbox

CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user_id text REFERENCES profiles(id) ON DELETE SET NULL,
  to_user_id text REFERENCES profiles(id) ON DELETE SET NULL,
  sender_name text,
  subject text,
  body text NOT NULL,
  is_read boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can see their own messages" ON messages
  FOR SELECT USING (from_user_id = auth.uid()::text OR to_user_id = auth.uid()::text);

CREATE POLICY "Users can send messages" ON messages
  FOR INSERT WITH CHECK (from_user_id = auth.uid()::text);

CREATE POLICY "Recipients can mark as read" ON messages
  FOR UPDATE USING (to_user_id = auth.uid()::text);
